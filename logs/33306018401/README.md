# CI log archive: 33306018401

- Workflow: CI
- Conclusion: failure
- Head branch: 220-dict-valued-requirement-slots
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33306018401
- Captured: 2026-08-30T10:15:45Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-30T10:15:30.2046572Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:30.2046903Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:30.2067533Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:30.2068048Z env:
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:30.2068297Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:30.2068548Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:30.2900965Z 
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:30.2902030Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:30.2902668Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:30.2903081Z 
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:33.0855725Z ##[error]packages/core/src/domain/plugins.ts(2,29): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:33.0862893Z ##[error]packages/core/src/graph/ir.ts(9,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:33.0864925Z ##[error]packages/core/src/plugins/ik.ts(1,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:33.0867015Z ##[error]packages/core/test/unit/domain/dict-valued-requirements.test.ts(76,76): error TS2353: Object literal may only specify known properties, and 'dict' does not exist in type 'PluginRequirement'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:33.0869021Z ##[error]packages/core/test/unit/domain/dict-valued-requirements.test.ts(89,64): error TS2353: Object literal may only specify known properties, and 'dict' does not exist in type 'PluginRequirement'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:15:33.1131015Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-30T10:15:19.4862723Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.4862936Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.4893588Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.4893891Z env:
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.4894010Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.4894125Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.5496903Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.5497485Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.5497918Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.5498129Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.7526736Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.7527961Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:19.7528291Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0763477Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0969308Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0970324Z ^[[31m     ^[[31m×^[[31m LF-5 interpolates a bare array of stops^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0970806Z ^[[31m     ^[[31m×^[[31m LF-6 publishes a bare static value and holds it at every progress^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0971273Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0971671Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0972009Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0972370Z      ^[[32m✓^[[39m LF-10 closes the static domain instead of leaving it open^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0972725Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0973071Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0973426Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0973828Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0974234Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.0974632Z      ^[[32m✓^[[39m LF-16 leaves no authored schema in the repository on the retired form^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.1495542Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m0 test^[[22m^[[2m)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2270886Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2717683Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2718859Z ^[[31m     ^[[31m×^[[31m Y-1 compiles the values section to leaves and the requires section to nothing^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2719646Z      ^[[32m✓^[[39m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2720328Z      ^[[32m✓^[[39m Y-3 reports an unknown section once and names both legal sections^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2721009Z      ^[[32m✓^[[39m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2721636Z      ^[[32m✓^[[39m Y-5 refuses a malformed or an empty values section^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2722341Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2722967Z      ^[[32m✓^[[39m Y-7 cites the section in a diagnostic about a leaf inside it^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2723654Z ^[[31m     ^[[31m×^[[31m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2724924Z      ^[[32m✓^[[39m Y-9 keeps the perspective warning for 3D content inside the values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2725609Z      ^[[32m✓^[[39m Y-10 refuses one compiled key authored under two groups' values sections^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2726625Z ^[[31m     ^[[31m×^[[31m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2727440Z      ^[[32m✓^[[39m Y-12 declares the group as two named sections and deletes the member union^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.2728182Z ^[[31m     ^[[31m×^[[31m Y-13 composes the walker rig's world frame through the values section^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.3218916Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.3546104Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.5245072Z  ^[[31m❯^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.5246767Z ^[[31m     ^[[31m×^[[31m FB-11 a five-bone chain tracks an animated goal with every length intact^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.5272455Z ^[[31m     ^[[31m×^[[31m FB-12 two goals off one spine are both reached, and the spine is solved once^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.5378449Z  ^[[31m❯^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.5388708Z ^[[31m     ^[[31m×^[[31m IK-13 full flush over six-node rig: forearm tip reaches target and hand follows^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.5389973Z ^[[31m     ^[[31m×^[[31m IK-15 animating target across ticks moves solved bones smoothly with correct revisions^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.5391341Z      ^[[32m✓^[[39m IK-16 DOM adapter skips a nested composite and writes nothing for a solver node^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.5392258Z ^[[31m     ^[[31m×^[[31m IK-17 handle.get for solver node returns solved rotations record^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.5640940Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.6756116Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.7163744Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.7167736Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.7168703Z ^[[31m     ^[[31m×^[[31m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.7169533Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.7170489Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.7171170Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.7171639Z ^[[31m     ^[[31m×^[[31m Q-12 refuses a binding to a slot the plugin never declared, at load^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.7204888Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.8099519Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.8660266Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.8747901Z  ^[[31m❯^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.8772248Z      ^[[32m✓^[[39m 1. Adoption produces ready patches and publishes through the ordinary graph path^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.8797055Z      ^[[32m✓^[[39m 2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.8807244Z      ^[[32m✓^[[39m 3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.8808432Z      ^[[32m✓^[[39m 4. PatchRegistry.dispose() clears all retained patches and rejects future publication^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.8809608Z ^[[31m     ^[[31m×^[[31m 5. Requirement-scoped replacement updates edge identity consistently with GraphIR^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.8810578Z      ^[[32m✓^[[39m 6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:20.9625230Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.0324936Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.0443998Z  ^[[31m❯^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.0445476Z ^[[31m     ^[[31m×^[[31m MG-12 the worked rig re-expressed with a goal dict solves to the same two numbers^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.0446769Z ^[[31m     ^[[31m×^[[31m MG-13 seeding the goal node alone re-solves the whole chain^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.1108096Z  ^[[31m❯^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.1127270Z ^[[31m     ^[[31m×^[[31m rejects destroying a source without changing graph state or the observation wire^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.1156881Z ^[[31m     ^[[31m×^[[31m leaves a rejected unknown-source adoption retryable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.1157843Z ^[[31m     ^[[31m×^[[31m leaves a rejected self-reference adoption retryable^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.1905381Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.1906491Z      ^[[32m✓^[[39m N-7 claims the natural bone key names and composes world space from them^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.1907214Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.1907636Z ^[[31m     ^[[31m×^[[31m N-9 refuses the flat spelling of a key both plugins claim^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.1908062Z ^[[31m     ^[[31m×^[[31m N-10 publishes grouped leaves under their unprefixed names^[[39m^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.1999025Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.2469007Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.3201147Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.3532944Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.3928730Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.4640528Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.5243121Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.5532153Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.5811878Z  ^[[31m❯^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.5813091Z ^[[31m     ^[[31m×^[[31m keeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts^[[39m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.5813877Z ^[[31m     ^[[31m×^[[31m publishes the same ready output regardless of mount order^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.5814571Z      ^[[32m✓^[[39m rejects an unknown cross-motion source at load instead of treating it as pending^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.6818335Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.7080676Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.7334224Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.8380905Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.8484562Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.8725343Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:21.9870729Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.0000511Z  ^[[31m❯^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.0027353Z ^[[31m     ^[[31m×^[[31m blocks the downstream closure while upstream is unmounted and recovers with a newer revision^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.0067379Z ^[[31m     ^[[31m×^[[31m keeps patch and subscription retention flat across 50 unmount/remount cycles^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.0078250Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.1217113Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.1362821Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.1479598Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.2494812Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.2615541Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.2669198Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.3745164Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.3936580Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.4191119Z  ^[[31m❯^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.4217524Z ^[[31m     ^[[31m×^[[31m J-8 composes an upstream value without it ever becoming an authored one^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.4873154Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.5384538Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.5418836Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.6091609Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.6804151Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.6857287Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.7208009Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.8169731Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.8216331Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.8649653Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9199142Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9310665Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9331684Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9332277Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Suites 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9332598Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9334350Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m [ packages/core/test/integration/phase7-walker-demo.test.ts ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9338039Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9338949Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9397509Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9398282Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9403927Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9404514Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9405012Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9409794Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9411144Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m248:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9411692Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9412025Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9412719Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9412733Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9413020Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 31 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9413255Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9414019Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-5 interpolates a bare array of stops
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9414791Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9415410Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9416185Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9416751Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9417292Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9417781Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9418286Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9419240Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9420232Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m133:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9421023Z ^[[90m ^[[2m❯^[[22m valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m163:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9421758Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m226:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9422091Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9422299Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9422490Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9423310Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-6 publishes a bare static value and holds it at every progress
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9424160Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9424788Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9425431Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9426235Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9426773Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9427253Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9427762Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9428704Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9429683Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m133:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9430465Z ^[[90m ^[[2m❯^[[22m valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m163:43^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9431196Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m231:12^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9431521Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9431726Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9431907Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9432878Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mkeeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9434127Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9434683Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9460891Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9461300Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9461769Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9462220Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9462765Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9463208Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9463698Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9464348Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9465038Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9465706Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9473992Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9474685Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m50:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9474967Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9475182Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9475356Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9476286Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mpublishes the same ready output regardless of mount order
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9477081Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9477650Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9478121Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9478458Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9479002Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9479454Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9479921Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9480307Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9480736Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9481311Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9481944Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9482592Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9483284Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9483938Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m72:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9484228Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9484438Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9484611Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9485514Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-11 a five-bone chain tracks an animated goal with every length intact
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9486488Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9487095Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9487727Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9488461Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9489098Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9489559Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9490043Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9491005Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9491943Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m24:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9492693Z ^[[90m ^[[2m❯^[[22m mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m154:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9493392Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m165:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9493699Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9493902Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9494078Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9494901Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-fabrik-chain.test.ts^[[2m > ^[[22miterative IK over a real rig (Slice D3)^[[2m > ^[[22mFB-12 two goals off one spine are both reached, and the spine is solved once
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9495813Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9496552Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9497181Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9497715Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9498239Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9498717Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9499206Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9500139Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9501059Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m24:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9501796Z ^[[90m ^[[2m❯^[[22m mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m154:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9502488Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-fabrik-chain.test.ts:^[[2m210:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9502779Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9502989Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9503164Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9504106Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-12 the worked rig re-expressed with a goal dict solves to the same two numbers
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9505065Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9505663Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9506405Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9506928Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9507452Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9507923Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9508407Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9509539Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9510658Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-multi-goal.test.ts:^[[2m100:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9511377Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m112:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9511680Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9511886Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9512065Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9512834Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-multi-goal.test.ts^[[2m > ^[[22mgoal-addressed IK integration (Slice D1)^[[2m > ^[[22mMG-13 seeding the goal node alone re-solves the whole chain
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9513628Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9514213Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9514774Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9515288Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9515782Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9516331Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9516799Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9517665Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9518525Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-multi-goal.test.ts:^[[2m100:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9519159Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-multi-goal.test.ts:^[[2m143:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9519434Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9519655Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9519824Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9520624Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-13 full flush over six-node rig: forearm tip reaches target and hand follows
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9521408Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9521969Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9522539Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9523022Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9523502Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9523938Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9524384Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9525247Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9526220Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-two-bone.test.ts:^[[2m88:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9526849Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m100:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9527120Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9527319Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9527488Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9528353Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-15 animating target across ticks moves solved bones smoothly with correct revisions
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9529386Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9530037Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9530607Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9531081Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9531534Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9531960Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9532462Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9533348Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9534259Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-two-bone.test.ts:^[[2m88:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9534931Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m189:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9535250Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9535453Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9535631Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9536549Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/ik-two-bone.test.ts^[[2m > ^[[22mTwo-bone IK Integration (Slice C3)^[[2m > ^[[22mIK-17 handle.get for solver node returns solved rotations record
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9537346Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9537989Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9538616Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9539153Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9539667Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9540140Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9540635Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9541563Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9542547Z ^[[90m ^[[2m❯^[[22m createEngine packages/core/test/integration/ik-two-bone.test.ts:^[[2m88:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9543215Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/ik-two-bone.test.ts:^[[2m255:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9543488Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9543696Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9543887Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9544887Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mrejects destroying a source without changing graph state or the observation wire
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9546021Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9546640Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9547280Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9547819Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9548345Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9548809Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9549303Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9550411Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9551527Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/mutation-transactionality.test.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9552336Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m87:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9552683Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9552890Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9553067Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9553916Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected unknown-source adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9554744Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9555382Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9556157Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9556690Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9557220Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9557711Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9558198Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9559109Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9560114Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/mutation-transactionality.test.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9560913Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m120:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9561291Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9561499Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9561688Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9562530Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/mutation-transactionality.test.ts^[[2m > ^[[22mruntime mutation transactionality (W2)^[[2m > ^[[22mleaves a rejected self-reference adoption retryable
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9563397Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9563997Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9564667Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9565225Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9565998Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9566464Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9567077Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9568020Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9568924Z ^[[90m ^[[2m❯^[[22m makeHandle packages/core/test/integration/mutation-transactionality.test.ts:^[[2m20:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9569662Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/mutation-transactionality.test.ts:^[[2m141:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9570006Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9570199Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9570363Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9571186Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9571997Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9572556Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9573144Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9573653Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9574153Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9574598Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9575075Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9597023Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9598123Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m59:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9598926Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m91:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9599275Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9599496Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9599689Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9600551Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-9 refuses the flat spelling of a key both plugins claim
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9601843Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-ambiguous-key/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9602342Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9602476Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9602704Z /plugin-ambiguous-key/
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9602850Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9602967Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9603276Z "(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9603491Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9603931Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m119:58^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9604570Z     ^[[90m117|^[[39m     // Not a winner decided by registration order, and not a silent ov…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9605147Z     ^[[90m118|^[[39m     // with both claimants named, so the author can see which group to…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9605720Z     ^[[90m119|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plug…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9606362Z     ^[[90m   |^[[39m                                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9606880Z     ^[[90m120|^[[39m     expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk"…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9607477Z     ^[[90m121|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9607632Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9607949Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9608131Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9609006Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-10 publishes grouped leaves under their unprefixed names
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9609890Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9610519Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9611145Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9611685Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9612210Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9612702Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9613197Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9614155Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9615155Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m59:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9616100Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m124:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9616436Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9616656Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9616843Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9617864Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts^[[2m > ^[[22mPhase 4: Dynamic Graph Lifecycle Hardening^[[2m > ^[[22m5. Requirement-scoped replacement updates edge identity consistently with GraphIR
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9618877Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9619428Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9619885Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9620175Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9620623Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9621087Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9621562Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9621940Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9622396Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9622989Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9623668Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9624332Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9625010Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9625729Z ^[[90m ^[[2m❯^[[22m new ProjectRuntime packages/core/src/runtime/project-runtime.ts:^[[2m146:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9626624Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts:^[[2m108:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9626958Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9627167Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9627350Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9628380Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-1 compiles the values section to leaves and the requires section to nothing
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9629511Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9630213Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9630826Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9631350Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9631857Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9632310Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9632784Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9633673Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9634638Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9635430Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m140:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9635754Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9636109Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9636267Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9637197Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-8 keeps a leaf named values legal inside the section, and resolvable
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9638122Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9638733Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9639425Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9639960Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9640477Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9640913Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9641393Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9642281Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9643239Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9644022Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m225:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9644382Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9644585Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9644752Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9645656Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-11 joins a bindings-only group to the composer chain and scopes its input
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9646680Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9647264Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9647848Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9648326Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9648803Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9649237Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9649874Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9650867Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9651807Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9652525Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m254:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9652789Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9653001Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9653169Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9654107Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-13 composes the walker rig's world frame through the values section
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9654672Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9655116Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9655755Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9656388Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9656915Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9657385Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9657866Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9658812Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9659833Z ^[[90m ^[[2m❯^[[22m registry packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m131:40^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9660652Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m273:36^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9660993Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9661201Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9661382Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9662357Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9663305Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9663890Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9664490Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9665005Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9665492Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9666083Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9666547Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9667408Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9668329Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9669063Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m96:36^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9669376Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9669718Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9669880Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9670780Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-8 leaves an omitted binding with no edge and lets the plugin own the unbound case
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9671837Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9672186Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9672540Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9672848Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9673247Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9673648Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9674125Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9675021Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9676101Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9676869Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m118:39^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9677184Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9677384Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9677550Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9678339Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9679457Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /observation-unknown-source/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9679754Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9679827Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9679972Z /observation-unknown-source/
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9680064Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9680135Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9680317Z "(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9680443Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9680684Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m139:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9680963Z     ^[[90m137|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9681132Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9681393Z     ^[[90m139|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9681681Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9681891Z     ^[[90m140|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9682038Z     ^[[90m141|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9682106Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9682234Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9682340Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9682867Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9683431Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9683902Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9684266Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9684573Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9684870Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9685271Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9685629Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9686334Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9687002Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9688405Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m152:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9688720Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9688950Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9689112Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9689979Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9690813Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9691360Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9691915Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9692387Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9692862Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9693283Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9693732Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9694552Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9695479Z ^[[90m ^[[2m❯^[[22m rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m81:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9696341Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m185:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9696647Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9696831Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9696990Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9697844Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-12 refuses a binding to a slot the plugin never declared, at load
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9699073Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw error matching /plugin-unknown-requirement/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9699532Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9699679Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9699910Z /plugin-unknown-requirement/
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9700047Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9700171Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9700477Z "(0 , __vite_ssr_import_1__.readGoalSlot) is not a function"
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9700689Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9701095Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m206:49^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9701600Z     ^[[90m204|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9701894Z     ^[[90m205|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9702312Z     ^[[90m206|^[[39m     expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknow…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9702774Z     ^[[90m   |^[[39m                                                 ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9703088Z     ^[[90m207|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9703336Z     ^[[90m208|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9703462Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9703658Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9703979Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9704877Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mblocks the downstream closure while upstream is unmounted and recovers with a newer revision
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9705810Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9706421Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9706839Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9707113Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9707530Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9708066Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9708580Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9708978Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9709526Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9710129Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9710790Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9711423Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9712068Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9712758Z ^[[90m ^[[2m❯^[[22m new ProjectRuntime packages/core/src/runtime/project-runtime.ts:^[[2m146:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9713461Z ^[[90m ^[[2m❯^[[22m createRuntime packages/core/test/integration/remount.test.ts:^[[2m29:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9714085Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m40:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9714345Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9714556Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9714725Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9715576Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/remount.test.ts^[[2m > ^[[22mP5-04 unmount/remount recovery^[[2m > ^[[22mkeeps patch and subscription retention flat across 50 unmount/remount cycles
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9716473Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9716997Z ^[[36m ^[[2m❯^[[22m goalBindingsOf packages/core/src/graph/ir.ts:^[[2m466:22^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9717430Z     ^[[90m464|^[[39m       ^[[35mcontinue^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9717721Z     ^[[90m465|^[[39m     }
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9718184Z     ^[[90m466|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m ^[[34mreadGoalSlot^[[39m(slot)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9718641Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9719098Z     ^[[90m467|^[[39m     if (authored !== undefined) dict.push({ slot, authored, sourceId: …
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9719473Z     ^[[90m468|^[[39m   }
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9719898Z ^[[90m ^[[2m❯^[[22m resolveSolvers packages/core/src/graph/ir.ts:^[[2m497:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9720480Z ^[[90m ^[[2m❯^[[22m finalizeGraph packages/core/src/graph/ir.ts:^[[2m928:25^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9721132Z ^[[90m ^[[2m❯^[[22m Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:^[[2m366:10^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9721786Z ^[[90m ^[[2m❯^[[22m new GraphBinding packages/core/src/graph/binding.ts:^[[2m56:53^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9722461Z ^[[90m ^[[2m❯^[[22m new GraphRuntime packages/core/src/runtime/graph-runtime.ts:^[[2m83:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9723166Z ^[[90m ^[[2m❯^[[22m new ProjectRuntime packages/core/src/runtime/project-runtime.ts:^[[2m146:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9723888Z ^[[90m ^[[2m❯^[[22m createRuntime packages/core/test/integration/remount.test.ts:^[[2m29:19^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9724533Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/remount.test.ts:^[[2m61:21^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9724806Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9725001Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9725312Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9726331Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/single-input-channel.test.ts^[[2m > ^[[22ma plugin requirement is the only input channel^[[2m > ^[[22mJ-8 composes an upstream value without it ever becoming an authored one
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9727364Z ^[[31m^[[1mTypeError^[[22m: readGoalSlot is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9727980Z ^[[36m ^[[2m❯^[[22m PluginRegistry.register packages/core/src/domain/plugins.ts:^[[2m480:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9728620Z     ^[[90m478|^[[39m     ^[[90m// authored dict would still expand past it. See issue #195.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9729160Z     ^[[90m479|^[[39m     ^[[35mfor^[[39m (^[[35mconst^[[39m slot ^[[35mof^[[39m slots) {
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9729689Z     ^[[90m480|^[[39m       if (slot !== PLUGIN_GOALS_SLOT && readGoalSlot(slot) === undefin…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9730140Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9730649Z     ^[[90m481|^[[39m       const detail = `requirement slot "${slot}" is reserved for autho…
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9731599Z     ^[[90m482|^[[39m       ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mTypeError^[[39m(^[[32m`Plugin "^[[39m^[[36m${^[[39mplugin^[[33m.^[[39mname^[[36m}^[[39m^[[32m" ^[[39m^[[36m${^[[39mdetail^[[36m}^[[39m^[[32m.`^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9732515Z ^[[90m ^[[2m❯^[[22m load packages/core/test/integration/single-input-channel.test.ts:^[[2m34:11^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9733241Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/single-input-channel.test.ts:^[[2m47:20^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9733554Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9733744Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/32]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9733930Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9733958Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9734383Z ^[[2m Test Files ^[[22m ^[[1m^[[31m13 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m47 passed^[[39m^[[22m^[[90m (60)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9735060Z ^[[2m      Tests ^[[22m ^[[1m^[[31m31 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m208 passed^[[39m^[[22m^[[90m (239)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9735525Z ^[[2m   Start at ^[[22m 10:15:19
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9736197Z ^[[2m   Duration ^[[22m 3.17s^[[2m (transform 925ms, setup 227ms, import 2.55s, tests 634ms, environment 4ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9736534Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9736540Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9757091Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/bare-authored-leaf.test.ts:133:40
integration (node 24)	Run npm run test:integration	 ❯ valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:163:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:226:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9764554Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9767387Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/bare-authored-leaf.test.ts:133:40
integration (node 24)	Run npm run test:integration	 ❯ valuesAt packages/core/test/integration/bare-authored-leaf.test.ts:163:43
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:231:12
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9769085Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9772195Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ goalBindingsOf packages/core/src/graph/ir.ts:466:22
integration (node 24)	Run npm run test:integration	 ❯ resolveSolvers packages/core/src/graph/ir.ts:497:27
integration (node 24)	Run npm run test:integration	 ❯ finalizeGraph packages/core/src/graph/ir.ts:928:25
integration (node 24)	Run npm run test:integration	 ❯ Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:366:10
integration (node 24)	Run npm run test:integration	 ❯ new GraphBinding packages/core/src/graph/binding.ts:56:53
integration (node 24)	Run npm run test:integration	 ❯ new GraphRuntime packages/core/src/runtime/graph-runtime.ts:83:21
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:50:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9774010Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9777170Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ goalBindingsOf packages/core/src/graph/ir.ts:466:22
integration (node 24)	Run npm run test:integration	 ❯ resolveSolvers packages/core/src/graph/ir.ts:497:27
integration (node 24)	Run npm run test:integration	 ❯ finalizeGraph packages/core/src/graph/ir.ts:928:25
integration (node 24)	Run npm run test:integration	 ❯ Object.buildGraphIR [as build] packages/core/src/graph/ir.ts:366:10
integration (node 24)	Run npm run test:integration	 ❯ new GraphBinding packages/core/src/graph/binding.ts:56:53
integration (node 24)	Run npm run test:integration	 ❯ new GraphRuntime packages/core/src/runtime/graph-runtime.ts:83:21
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:72:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9778873Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9781182Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:24:11
integration (node 24)	Run npm run test:integration	 ❯ mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:154:19
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-fabrik-chain.test.ts:165:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9782568Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9784852Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-fabrik-chain.test.ts:24:11
integration (node 24)	Run npm run test:integration	 ❯ mountAll packages/core/test/integration/ik-fabrik-chain.test.ts:154:19
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-fabrik-chain.test.ts:210:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9786294Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9788142Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-multi-goal.test.ts:100:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-multi-goal.test.ts:112:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9789278Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9791098Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-multi-goal.test.ts:100:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-multi-goal.test.ts:143:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9792268Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9794059Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-two-bone.test.ts:88:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:100:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9795203Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9797086Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-two-bone.test.ts:88:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:189:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9798234Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9800003Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ createEngine packages/core/test/integration/ik-two-bone.test.ts:88:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/ik-two-bone.test.ts:255:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9801154Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9803168Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/mutation-transactionality.test.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:87:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9804394Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9806473Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/mutation-transactionality.test.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:120:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9807826Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9809827Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ makeHandle packages/core/test/integration/mutation-transactionality.test.ts:20:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/mutation-transactionality.test.ts:141:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9811189Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9813123Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:59:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:91:37
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9814325Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9816675Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-ambiguous-key/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9818025Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9820073Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/per-plugin-key-ownership.test.ts:59:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:124:37
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9821367Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9824805Z ##[error]TypeError: readGoalSlot is not a function
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9826978Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9828360Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:248:11
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9829259Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9831119Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:140:40
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9832246Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9834083Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:225:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9835225Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9837376Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:254:22
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9838668Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9840554Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ registry packages/core/test/integration/plugin-group-values-section.test.ts:131:40
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:273:36
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9841918Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9843747Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:96:36
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9845044Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9847025Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:118:39
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9848373Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9850582Z ##[error]AssertionError: expected [Function] to throw error matching /observation-unknown-source/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9851846Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9853680Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:152:21
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9854802Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9856734Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ rigRegistry packages/core/test/integration/plugin-owned-requirements.test.ts:81:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:185:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9857861Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9860058Z ##[error]AssertionError: expected [Function] to throw error matching /plugin-unknown-requirement/ but got '(0 , __vite_ssr_import_1__.readGoalSl…'
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9861316Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9864925Z ##[error]TypeError: readGoalSlot is not a function
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9867019Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9870627Z ##[error]TypeError: readGoalSlot is not a function
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
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9872549Z 
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9874255Z ##[error]TypeError: readGoalSlot is not a function
integration (node 24)	Run npm run test:integration	 ❯ PluginRegistry.register packages/core/src/domain/plugins.ts:480:41
integration (node 24)	Run npm run test:integration	 ❯ load packages/core/test/integration/single-input-channel.test.ts:34:11
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/single-input-channel.test.ts:47:20
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T10:15:22.9958059Z ##[error]Process completed with exit code 1.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-30T10:15:26.2737035Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:15:26.2737631Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:15:26.2777758Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:15:26.2778045Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:15:26.2778229Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:15:26.2778408Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:15:28.1484395Z ##[error]packages/core/src/domain/plugins.ts(2,29): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:15:28.1496594Z ##[error]packages/core/src/graph/ir.ts(9,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:15:28.1499111Z ##[error]packages/core/src/plugins/ik.ts(1,10): error TS2305: Module '"../contract/solver-slots"' has no exported member 'readGoalSlot'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-30T10:15:28.1801840Z ##[error]Process completed with exit code 2.
```
