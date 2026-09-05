# CI log archive: 33960991990

- Workflow: CI
- Conclusion: failure
- Head branch: fix/305-direct-write-boundary
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33960991990
- Captured: 2026-09-05T10:34:55Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-09-05T10:34:22.2956922Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-09-05T10:34:22.2957194Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-09-05T10:34:22.2979633Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-09-05T10:34:22.2979939Z env:
quality (node 24)	Run npm test	2026-09-05T10:34:22.2980151Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-09-05T10:34:22.2980363Z ##[endgroup]
quality (node 24)	Run npm test	2026-09-05T10:34:22.4000082Z 
quality (node 24)	Run npm test	2026-09-05T10:34:22.4000868Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-09-05T10:34:22.4001386Z > vitest run
quality (node 24)	Run npm test	2026-09-05T10:34:22.4001516Z 
quality (node 24)	Run npm test	2026-09-05T10:34:22.7163001Z 
quality (node 24)	Run npm test	2026-09-05T10:34:22.7164622Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:22.7165323Z 
quality (node 24)	Run npm test	2026-09-05T10:34:23.0559229Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:23.3222274Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:23.3389697Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m16 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:23.4678640Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-09-05T10:34:23.4681015Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:34:23.4696679Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:34:23.4726843Z 
quality (node 24)	Run npm test	2026-09-05T10:34:23.4742847Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:34:23.4743769Z 
quality (node 24)	Run npm test	2026-09-05T10:34:23.4744023Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:34:23.4744447Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:34:23.4744871Z });
quality (node 24)	Run npm test	2026-09-05T10:34:23.4745211Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:34:23.4745655Z 
quality (node 24)	Run npm test	2026-09-05T10:34:23.4746588Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:34:23.4747658Z 
quality (node 24)	Run npm test	2026-09-05T10:34:23.4947621Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 109^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:23.5951242Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/schema-transaction.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:23.6655848Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/keyframe-property-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 60^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:23.7086297Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:23.8731979Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:23.9566369Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-group-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0276091Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 83^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0296028Z      ^[[32m✓^[[39m LV-4 never reaches replace(), and a real replace() drops the mask^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0323310Z ^[[31m     ^[[31m×^[[31m LV-5 invalidates exactly once and returns that batch^[[39m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0325393Z      ^[[32m✓^[[39m LV-8 rewrites the retained definition and keeps topology and progress^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0327429Z      ^[[32m✓^[[39m LV-9 merges partially and preserves the observation the track declared^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0329325Z      ^[[32m✓^[[39m LV-10 invalidates the dependent, asserted on its patch rather than on a flag^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0331094Z      ^[[32m✓^[[39m PK-16 escalates through one stageTrack when the backend declines^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0333319Z      ^[[32m✓^[[39m PK-17 refuses a malformed stop list before anything mutates, on both entry points^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0335064Z      ^[[32m✓^[[39m PK-19 pins the two mutants no other case can see^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0336609Z      ^[[32m✓^[[39m LV-13 refuses both new members on a stale handle^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0338210Z      ^[[32m✓^[[39m LV-15 reports the disposal from the owner that decided it, and publishes nothing^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0347217Z      ^[[32m✓^[[39m LV-16 finishes the escalation against a live host before the release runs^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.0349095Z      ^[[32m✓^[[39m LV-17 defers the release past a recompile that built after its seam disposed^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.1827821Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.1935979Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.2720147Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.4454607Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/commit-write-cost.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.4457205Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.5060760Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/immediate-verb-refusal.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.6952647Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.7218100Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.9548009Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:24.9804101Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/recompile-predicate.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.1766622Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.2180380Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.3754746Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.4967732Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6080131Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/apply-ai-edit.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[33m 954^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6261180Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/read-budget-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6263549Z      ^[[32m✓^[[39m RB-1: passes a file at the budget and refuses the byte after it^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6265178Z      ^[[32m✓^[[39m RB-2: holds a waived file to its ceiling rather than to the budget^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6267136Z      ^[[32m✓^[[39m RB-3: names the ceiling a waived file crossed rather than the budget it is over^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6268786Z      ^[[32m✓^[[39m RB-4: reports a planted file over budget through the shipped scan^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6270294Z      ^[[32m✓^[[39m RB-5: reports a waiver naming a file the tree does not hold^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6272284Z      ^[[32m✓^[[39m RB-6: reports an empty scan rather than answering clean^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6274007Z ^[[31m     ^[[31m×^[[31m RB-7: leaves the shipped tree clean, with nothing left waived^[[39m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6275840Z      ^[[32m✓^[[39m RB-8: refuses a source over the sister doc trigger that has no document^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6277092Z      ^[[32m✓^[[39m RB-9: leaves a source under the trigger alone^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6278070Z      ^[[32m✓^[[39m RB-10: refuses a mirrored source that does not name its sister doc^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6278806Z      ^[[32m✓^[[39m RB-11: refuses a heading naming nothing the source declares^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6279813Z      ^[[32m✓^[[39m RB-12: refuses headings that break the declaration order^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6281421Z      ^[[32m✓^[[39m RB-13: refuses a private member or local type still carrying a docblock^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6282810Z      ^[[32m✓^[[39m RB-14: budgets the sister doc as well as the source^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6284048Z      ^[[32m✓^[[39m RB-15: reads only level two headings as member claims^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6285386Z      ^[[32m✓^[[39m RB-16: refuses a pending entry the tree no longer needs^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6286854Z      ^[[32m✓^[[39m RB-17: names what a module declares, not only what a class does^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.6288137Z      ^[[32m✓^[[39m RB-18: refuses a module declaration carrying a docblock, and keeps the exported one^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.8533474Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.8847712Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:25.9153509Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.0717106Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.1269631Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/snapshot-one-walk.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.2302357Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.2437812Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 120^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.3622703Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/declined-build-write-drop.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.4509321Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.4550400Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.5567724Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.7349992Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.7587483Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.7827743Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:26.9521711Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependants.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.0081198Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.0788716Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.1869451Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.2454969Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/removal-flush-seed.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.3012422Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.4195379Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.4588544Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.5638427Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.6529166Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.6616567Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.8006843Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.8315615Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:27.9126816Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/mount-flush-seed.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.0086423Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.0742178Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.1545718Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.2128738Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.3502298Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.3962275Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.4071033Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.5457744Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/source-region-anchors.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.5985881Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.6803375Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.7436261Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.8629390Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.8969903Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:28.9318016Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:29.0857994Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:29.0910500Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:29.1331227Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:29.3517560Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:29.3606489Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:29.5563248Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:29.6169944Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:29.7149185Z  ^[[32m✓^[[39m packages/core/test/unit/domain/authored-group-values-one-reader.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:29.8559921Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:29.9389519Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:30.1687586Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:30.1937631Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:30.4902991Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:30.5437676Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 54^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:30.7747629Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:30.8112490Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:31.0510207Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:31.0597580Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:31.2704797Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:31.3894212Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:31.4898036Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:31.6023323Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:31.6994743Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:31.9030025Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:31.9667743Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.1275320Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.1447037Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2880^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.1449330Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2877^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.2406301Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.3082240Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.4009887Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.4350217Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.5410118Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.6611713Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.6698812Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.7627790Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.8547676Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.8757732Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:32.9800585Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:33.0703995Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:33.1056054Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:33.1893477Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:33.2869190Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:33.4056224Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:33.4547870Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:33.6550045Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:33.6869098Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:33.8929779Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:33.9031956Z  ^[[32m✓^[[39m packages/core/test/contract/project-templates-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:34.1433463Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:34.2063314Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:34.3528194Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:34.4477688Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:34.5693396Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:34.7362940Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:34.8473848Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:35.0276172Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:35.0474484Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/session-status-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:35.2960706Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:35.3207641Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:35.5270011Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:35.5624439Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:35.7693477Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:35.8546449Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-09-05T10:34:35.8577011Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:34:35.8636502Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:34:35.8651041Z 
quality (node 24)	Run npm test	2026-09-05T10:34:35.8696656Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:34:35.8735876Z 
quality (node 24)	Run npm test	2026-09-05T10:34:35.8737420Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:35.8760637Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:34:35.8761833Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:34:35.8762746Z });
quality (node 24)	Run npm test	2026-09-05T10:34:35.8763418Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:34:35.8765834Z 
quality (node 24)	Run npm test	2026-09-05T10:34:35.8777500Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:34:35.8778753Z 
quality (node 24)	Run npm test	2026-09-05T10:34:35.8780756Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-09-05T10:34:35.8782670Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:34:35.8783821Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:34:35.8784355Z 
quality (node 24)	Run npm test	2026-09-05T10:34:35.8784982Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:34:35.8786092Z 
quality (node 24)	Run npm test	2026-09-05T10:34:35.8786334Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:34:35.8786841Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:34:35.8787367Z });
quality (node 24)	Run npm test	2026-09-05T10:34:35.8787802Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:34:35.8788148Z 
quality (node 24)	Run npm test	2026-09-05T10:34:35.8789145Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:34:35.8790112Z 
quality (node 24)	Run npm test	2026-09-05T10:34:35.9839188Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:36.0985103Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:36.2307907Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:36.3156134Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:36.4330537Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:36.5334228Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:36.6929404Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:36.7661835Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:36.8947606Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:37.0567666Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:37.1047761Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:37.2787929Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:37.3407814Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:37.5426188Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:37.5607779Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:37.7386880Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:37.7487515Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:37.9311556Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:37.9758663Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:38.1180220Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:38.1498110Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:38.3694351Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:38.4198241Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-09-05T10:34:38.4201285Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-09-05T10:34:38.4202486Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-09-05T10:34:38.4203025Z 
quality (node 24)	Run npm test	2026-09-05T10:34:38.4203930Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-09-05T10:34:38.4204507Z 
quality (node 24)	Run npm test	2026-09-05T10:34:38.4204654Z act(() => {
quality (node 24)	Run npm test	2026-09-05T10:34:38.4205021Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-09-05T10:34:38.4205610Z });
quality (node 24)	Run npm test	2026-09-05T10:34:38.4205954Z /* assert on the output */
quality (node 24)	Run npm test	2026-09-05T10:34:38.4206194Z 
quality (node 24)	Run npm test	2026-09-05T10:34:38.4207124Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-09-05T10:34:38.4207903Z 
quality (node 24)	Run npm test	2026-09-05T10:34:38.4305126Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:38.6223230Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:38.6489203Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:38.8440119Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:38.8790047Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.0486163Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.1018972Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.2506471Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.2895327Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6008^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.2897675Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1579^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.2899390Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1620^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.3361419Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.4610601Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.5369423Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.5378659Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.6641332Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.7001707Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.7506154Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.8195844Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.9242606Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.9517192Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:39.9950132Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.0922757Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.1496364Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.1861696Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.2591305Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.3470536Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.3547524Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.4626675Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.5615867Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.5928154Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.6701926Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.7777428Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.7832131Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8226373Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8276611Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8277831Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8278650Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8282597Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-value-updates.test.ts^[[2m > ^[[22mlive values reach the graph without replacing it^[[2m > ^[[22mLV-5 invalidates exactly once and returns that batch
quality (node 24)	Run npm test	2026-09-05T10:34:40.8289760Z ^[[31m^[[1mAssertionError^[[22m: expected '\n  #writeValues(nodeId: string, entr…' to contain 'this.#graph.invalidate([nodeId])'^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8290592Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8290890Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8291323Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8291548Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8292134Z ^[[32m- this.#^[[7mgraph.^[[27minvalidate(^[[7m[^[[27mnodeId^[[7m]^[[27m)^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8292760Z ^[[31m+^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8294100Z ^[[31m+   #writeValues(nodeId: string, entry: TrackEntry, values: AuthoredValues, rebase: boolean) {^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8295703Z ^[[31m+     this.#refuseInsideRecipe(rebase ? "setValues" : "overrideValues");^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8296645Z ^[[31m+     return this.#boundary(() => {^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8297557Z ^[[31m+       const { statics, animated } = splitAuthoredValues(values);^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8298933Z ^[[31m+       const involved = Object.keys(animated).length > 0 || Object.keys(entry.overlay).length > 0;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8300390Z ^[[31m+       const rewritten = rebase || involved ? withAuthoredValues(entry.track, values) : entry.track;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8301400Z ^[[31m+       if (involved) {^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8302423Z ^[[31m+         const validation = validateTrackDefinition(rewritten, `writeValues(${nodeId})`);^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8304232Z ^[[31m+         if (!validation.valid) throw new TypeError(describeDiagnostics(validation.diagnostics));^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8305166Z ^[[31m+       }^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8306229Z ^[[31m+       const mask = { ...authoredValues(entry.track), ...statics };^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8307573Z ^[[31m+       const written = this.#writeValuesHook(nodeId, mask, involved ? animated : undefined, rebase);^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8308603Z ^[[31m+       this.#tracks.set(nodeId, {^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8309202Z ^[[31m+         ...entry,^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8309925Z ^[[31m+         track: rebase ? rewritten : entry.track,^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8310648Z ^[[31m+         overlay: animated,^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8311312Z ^[[31m+         liveWrite: true,^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8311876Z ^[[31m+       });^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8312662Z ^[[31m+       if (written !== undefined && !written.patched) {^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8313607Z ^[[31m+         this.#stageTrack?.(rewritten, nodeId)?.commit();^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8314543Z ^[[31m+         this.#setProgress(nodeId, written.progress);^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8315187Z ^[[31m+       }^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8316295Z ^[[31m+ ^[[7m      return ^[[27mthis.#invalidate^[[7mOne^[[27m(nodeId)^[[7m;^[[27m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8317076Z ^[[31m+     });^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8317316Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8318231Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-value-updates.test.ts:^[[2m238:19^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8367914Z     ^[[90m236|^[[39m     // fifteen-member window containing `#apply` and `#invalidateOne`.…
quality (node 24)	Run npm test	2026-09-05T10:34:40.8369667Z     ^[[90m237|^[[39m     ^[[35mconst^[[39m write ^[[33m=^[[39m ^[[34mmember^[[39m(^[[34mcode^[[39m(^[[33mRUNTIME_SOURCE^[[39m)^[[33m,^[[39m ^[[32m"#writeValues("^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8371508Z     ^[[90m238|^[[39m     ^[[34mexpect^[[39m(write)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"this.#graph.invalidate([nodeId])"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8372644Z     ^[[90m   |^[[39m                   ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8373623Z     ^[[90m239|^[[39m     expect(write).toContain("this.#diagnostics.recordAll(batch.diagnos…
quality (node 24)	Run npm test	2026-09-05T10:34:40.8374645Z     ^[[90m240|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8375101Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8375659Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8376043Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8377545Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/read-budget-scan.test.ts^[[2m > ^[[22mread budget scan^[[2m > ^[[22mRB-7: leaves the shipped tree clean, with nothing left waived
quality (node 24)	Run npm test	2026-09-05T10:34:40.8379287Z ^[[31m^[[1mAssertionError^[[22m: expected [ Array(1) ] to deeply equal []^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8379805Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8380043Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8380502Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8380750Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8380940Z ^[[32m- []^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8381323Z ^[[31m+ [^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8382488Z ^[[31m+   "packages/core/src/runtime/project-runtime.md: #committing names nothing the source declares",^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8383457Z ^[[31m+ ]^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8383665Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8384793Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/read-budget-scan.test.ts:^[[2m142:26^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8404235Z     ^[[90m140|^[[39m   it("RB-7: leaves the shipped tree clean, with nothing left waived", …
quality (node 24)	Run npm test	2026-09-05T10:34:40.8405873Z     ^[[90m141|^[[39m     ^[[34mexpect^[[39m(^[[33mREAD_BUDGET_EXCEPTIONS^[[39m)^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8407508Z     ^[[90m142|^[[39m     ^[[34mexpect^[[39m(^[[35mawait^[[39m ^[[34mscan^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8408625Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8409324Z     ^[[90m143|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8410210Z     ^[[90m144|^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8410464Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8410823Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8411132Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8416265Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8419512Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m184 passed^[[39m^[[22m^[[90m (186)^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8429778Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m957 passed^[[39m^[[22m^[[90m (959)^[[39m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8431012Z ^[[2m   Start at ^[[22m 10:34:22
quality (node 24)	Run npm test	2026-09-05T10:34:40.8434039Z ^[[2m   Duration ^[[22m 18.09s^[[2m (transform 2.60s, setup 1.13s, import 10.00s, tests 13.46s, environment 25ms)^[[22m
quality (node 24)	Run npm test	2026-09-05T10:34:40.8435013Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8458009Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8493535Z ##[error]AssertionError: expected '\n  #writeValues(nodeId: string, entr…' to contain 'this.#graph.invalidate([nodeId])'
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- this.#graph.invalidate([nodeId])
quality (node 24)	Run npm test	+
quality (node 24)	Run npm test	+   #writeValues(nodeId: string, entry: TrackEntry, values: AuthoredValues, rebase: boolean) {
quality (node 24)	Run npm test	+     this.#refuseInsideRecipe(rebase ? "setValues" : "overrideValues");
quality (node 24)	Run npm test	+     return this.#boundary(() => {
quality (node 24)	Run npm test	+       const { statics, animated } = splitAuthoredValues(values);
quality (node 24)	Run npm test	+       const involved = Object.keys(animated).length > 0 || Object.keys(entry.overlay).length > 0;
quality (node 24)	Run npm test	+       const rewritten = rebase || involved ? withAuthoredValues(entry.track, values) : entry.track;
quality (node 24)	Run npm test	+       if (involved) {
quality (node 24)	Run npm test	+         const validation = validateTrackDefinition(rewritten, `writeValues(${nodeId})`);
quality (node 24)	Run npm test	+         if (!validation.valid) throw new TypeError(describeDiagnostics(validation.diagnostics));
quality (node 24)	Run npm test	+       }
quality (node 24)	Run npm test	+       const mask = { ...authoredValues(entry.track), ...statics };
quality (node 24)	Run npm test	+       const written = this.#writeValuesHook(nodeId, mask, involved ? animated : undefined, rebase);
quality (node 24)	Run npm test	+       this.#tracks.set(nodeId, {
quality (node 24)	Run npm test	+         ...entry,
quality (node 24)	Run npm test	+         track: rebase ? rewritten : entry.track,
quality (node 24)	Run npm test	+         overlay: animated,
quality (node 24)	Run npm test	+         liveWrite: true,
quality (node 24)	Run npm test	+       });
quality (node 24)	Run npm test	+       if (written !== undefined && !written.patched) {
quality (node 24)	Run npm test	+         this.#stageTrack?.(rewritten, nodeId)?.commit();
quality (node 24)	Run npm test	+         this.#setProgress(nodeId, written.progress);
quality (node 24)	Run npm test	+       }
quality (node 24)	Run npm test	+       return this.#invalidateOne(nodeId);
quality (node 24)	Run npm test	+     });
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-value-updates.test.ts:238:19
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-05T10:34:40.8506732Z 
quality (node 24)	Run npm test	2026-09-05T10:34:40.8510646Z ##[error]AssertionError: expected [ Array(1) ] to deeply equal []
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- []
quality (node 24)	Run npm test	+ [
quality (node 24)	Run npm test	+   "packages/core/src/runtime/project-runtime.md: #committing names nothing the source declares",
quality (node 24)	Run npm test	+ ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/read-budget-scan.test.ts:142:26
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-09-05T10:34:40.8856280Z ##[error]Process completed with exit code 1.
read-budget (node 24)	Run npm run test:read-budget	﻿2026-09-05T10:34:11.9056702Z ##[group]Run npm run test:read-budget
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:11.9057121Z ^[[36;1mnpm run test:read-budget^[[0m
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:11.9091785Z shell: /usr/bin/bash -e {0}
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:11.9092021Z env:
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:11.9092187Z   NODE_VERSION: 24
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:11.9092365Z ##[endgroup]
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:11.9875595Z 
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:11.9876351Z > motion5@0.0.0 test:read-budget
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:11.9877288Z > node scripts/read-budget-scan.mjs && vitest run packages/core/test/unit/scripts/read-budget-scan.test.ts
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:11.9877882Z 
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:12.0214773Z packages/core/src/runtime/project-runtime.md: #committing names nothing the source declares
read-budget (node 24)	Run npm run test:read-budget	2026-09-05T10:34:12.0318694Z ##[error]Process completed with exit code 1.
```
