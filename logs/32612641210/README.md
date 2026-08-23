# CI log archive: 32612641210

- Workflow: CI
- Conclusion: failure
- Head branch: feat/lf-bare-authored-leaf
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32612641210
- Captured: 2026-08-23T02:21:34Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-23T02:21:12.2557166Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:12.2557520Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:12.2599827Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:12.2600331Z env:
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:12.2600557Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:12.2600784Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:12.3628858Z 
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:12.3629410Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:12.3630015Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:12.3630247Z 
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:15.3686169Z ##[error]packages/core/test/contract/validation-owner.test.ts(119,18): error TS2532: Object is possibly 'undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:15.3695771Z ##[error]packages/core/test/integration/engine-x3-contribution.test.ts(39,62): error TS2339: Property 'stops' does not exist on type '{ p: number; v: number; }[]'.
quality (node 24)	Run npm run typecheck	2026-08-23T02:21:15.4119339Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-23T02:21:11.5002425Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.5003196Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.5041694Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.5041966Z env:
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.5042171Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.5042384Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.6001207Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.6002129Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.6003240Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.6003681Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.9005913Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.9013436Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:11.9031467Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.3989104Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4009793Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4516080Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4524424Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4549849Z      ^[[32m✓^[[39m LF-6 publishes a bare static value and holds it at every progress^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4572717Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4574891Z      ^[[32m✓^[[39m LF-8 contributes no tween for a static leaf^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4576574Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4578526Z ^[[31m     ^[[31m×^[[31m LF-10 closes the static domain instead of leaving it open^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4580352Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4582015Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4586124Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4587850Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4589670Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.4591654Z ^[[31m     ^[[31m×^[[31m LF-16 leaves no authored schema in the repository on the retired form^[[39m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7276455Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7365242Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7367902Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7369366Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7370054Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7370962Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7371611Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7371816Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7372927Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7373562Z });
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7375261Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7394500Z      ^[[32m✓^[[39m Y-1 compiles the values section to leaves and the requires section to nothing^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7395886Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7397031Z      ^[[32m✓^[[39m Y-2 refuses the legacy leaf form by name rather than as a missing stops array^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7398503Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7399352Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7399904Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7400815Z      ^[[32m✓^[[39m Y-3 reports an unknown section once and names both legal sections^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7402069Z      ^[[32m✓^[[39m Y-4 reserves a top-level values under the rule id a top-level requires gets^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7403806Z      ^[[32m✓^[[39m Y-5 refuses a malformed or an empty values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7405321Z      ^[[32m✓^[[39m Y-6 leaves an empty object an accepted no-op property rather than a group^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7406965Z ^[[31m     ^[[31m×^[[31m Y-7 cites the section in a diagnostic about a leaf inside it^[[39m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7408510Z      ^[[32m✓^[[39m Y-8 keeps a leaf named values legal inside the section, and resolvable^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7410075Z      ^[[32m✓^[[39m Y-9 keeps the perspective warning for 3D content inside the values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7411603Z      ^[[32m✓^[[39m Y-10 refuses one compiled key authored under two groups' values sections^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7413391Z      ^[[32m✓^[[39m Y-11 joins a bindings-only group to the composer chain and scopes its input^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7415017Z      ^[[32m✓^[[39m Y-12 declares the group as two named sections and deletes the member union^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7416580Z      ^[[32m✓^[[39m Y-13 composes the walker rig's world frame through the values section^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.7428393Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:12.9615361Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.0114444Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.0117052Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.2193527Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.2680634Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.2731897Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.4342247Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.5000314Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.5530578Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.6817739Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.7675825Z  ^[[31m❯^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.7678138Z ^[[31m     ^[[31m×^[[31m passes contribution context and creates the prepared timeline at load^[[39m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.7679762Z      ^[[32m✓^[[39m selects one predicate contributor through Engine.load^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.7681544Z      ^[[32m✓^[[39m rejects malformed contributions during Engine.load^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.7683528Z      ^[[32m✓^[[39m rejects authored ease collisions before any timeline is created^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.7685237Z      ^[[32m✓^[[39m merges contributed keyframes into compiler diagnostics before timeline creation^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.8255248Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:13.9404763Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.0264158Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.0716061Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.1714974Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.2430721Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.3257782Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.4135100Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.4670431Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.5701115Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.6654724Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.7105120Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.8085403Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.8855251Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:14.9852993Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.0326600Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.1163142Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.2489985Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.2624255Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.3534845Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.4665385Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.4774453Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.5685007Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.6932746Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.7024842Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.7694603Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.8989483Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.9491535Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:15.9627949Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.1333306Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.1695009Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.1697597Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.3442413Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.4834780Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.5236986Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.5711619Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.6733730Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.7524369Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8032360Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8293631Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8328377Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8328975Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 4 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8329288Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8333462Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-10 closes the static domain instead of leaving it open
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8340903Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8341733Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8341983Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8342439Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8342892Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8343092Z ^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8343547Z ^[[32m-   "stops-shape",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8344225Z ^[[31m+   "keyframes-missing-values-section",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8344802Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8345000Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8345546Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m260:41^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8405542Z     ^[[90m258|^[[39m     expect(ruleIds({ x: Number.POSITIVE_INFINITY })).toEqual(["stops-s…
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8407416Z     ^[[90m259|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m () ^[[33m=>^[[39m ^[[34m1^[[39m }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8410223Z     ^[[90m260|^[[39m     ^[[34mexpect^[[39m(^[[34mruleIds^[[39m({ x^[[33m:^[[39m { hold^[[33m:^[[39m ^[[34m1^[[39m } }))^[[33m.^[[39m^[[34mtoEqual^[[39m([^[[32m"stops-shape"^[[39m])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8411692Z     ^[[90m   |^[[39m                                         ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8413036Z     ^[[90m261|^[[39m     // The shape error cites the property the author wrote, not a `.st…
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8414200Z     ^[[90m262|^[[39m     ^[[90m// exists anywhere in the document.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8414694Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8415207Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8415608Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8417377Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-16 leaves no authored schema in the repository on the retired form
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8419288Z ^[[31m^[[1mAssertionError^[[22m: expected [ …(3) ] to deeply equal []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8419838Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8420097Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8420585Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8420832Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8421034Z ^[[32m- []^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8421434Z ^[[31m+ [^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8422165Z ^[[31m+   "packages/core/src/contract/authored-leaf.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8423326Z ^[[31m+   "packages/core/src/contract/v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8424220Z ^[[31m+   "packages/core/src/contract/validate-v5.ts",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8424849Z ^[[31m+ ]^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8425068Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8425931Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m344:30^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8427302Z     ^[[90m342|^[[39m     // be red for a fixture that authors the retired form, but a fixtu…
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8428481Z     ^[[90m343|^[[39m     // and that is the one that reads as an accepted second shape late…
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8429902Z     ^[[90m344|^[[39m     ^[[34mexpect^[[39m(offenders^[[33m.^[[39m^[[34msort^[[39m())^[[33m.^[[39m^[[34mtoEqual^[[39m([])^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8431048Z     ^[[90m   |^[[39m                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8431718Z     ^[[90m345|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8432293Z     ^[[90m346|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8432814Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8433290Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8433670Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8435728Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/engine-x3-contribution.test.ts^[[2m > ^[[22mX-3 contribution through the product load path^[[2m > ^[[22mpasses contribution context and creates the prepared timeline at load
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8438153Z ^[[31m^[[1mAssertionError^[[22m: expected "vi.fn()" to be called with arguments: [ 'x', undefined, …(1) ]^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8438877Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8439032Z Received:
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8439237Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8439499Z ^[[1m  1st vi.fn() call:
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8439772Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8440004Z ^[[22m^[[2m  [^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8440451Z ^[[2m    "x",^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8440915Z ^[[32m-   undefined,^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8441340Z ^[[31m+   [^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8441730Z ^[[31m+     {^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8442182Z ^[[31m+       "p": 0,^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8442966Z ^[[31m+       "v": 1,^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8443517Z ^[[31m+     },^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8444008Z ^[[31m+     {^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8444502Z ^[[31m+       "p": 1,^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8445040Z ^[[31m+       "v": 2,^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8445564Z ^[[31m+     },^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8445993Z ^[[31m+   ],^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8446444Z ^[[2m    {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8446936Z ^[[2m      "duration": 2,^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8447537Z ^[[2m      "id": "hero/arm",^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8448034Z ^[[2m    },^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8448439Z ^[[2m  ]^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8448824Z ^[[31m^[[90m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8449029Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8449610Z Number of calls: ^[[1m1^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8450089Z ^[[31m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8451511Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/engine-x3-contribution.test.ts:^[[2m39:24^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8453556Z     ^[[90m 37|^[[39m       ^[[34mprojectWith^[[39m({ x^[[33m:^[[39m ^[[34mproperty^[[39m(^[[34m1^[[39m) }^[[33m,^[[39m ^[[34m2^[[39m) ^[[35mas^[[39m never^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8454697Z     ^[[90m 38|^[[39m     )^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8456295Z     ^[[90m 39|^[[39m     ^[[34mexpect^[[39m(contribute)^[[33m.^[[39m^[[34mtoHaveBeenCalledWith^[[39m(^[[32m"x"^[[39m^[[33m,^[[39m ^[[34mproperty^[[39m(^[[34m1^[[39m)^[[33m.^[[39mstops^[[33m,^[[39m {
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8457784Z     ^[[90m   |^[[39m                        ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8458601Z     ^[[90m 40|^[[39m       id^[[33m:^[[39m ^[[32m"hero/arm"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8459473Z     ^[[90m 41|^[[39m       duration^[[33m:^[[39m ^[[34m2^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8459928Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8460374Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8460769Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8463035Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-group-values-section.test.ts^[[2m > ^[[22man explicit values section inside plugin groups^[[2m > ^[[22mY-7 cites the section in a diagnostic about a leaf inside it
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8465518Z ^[[31m^[[1mAssertionError^[[22m: expected [ { …(4) }, { …(4) }, { …(4) } ] to deep equally contain ObjectContaining{…}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8466264Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8466524Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8466968Z ObjectContaining {
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8467525Z   "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8468184Z   "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8468661Z }
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8468839Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8469096Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8469475Z [
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8469843Z   {
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8470425Z     "message": "Stop p must be between 0 and 1.",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8471111Z     "path": "keyframes.fk.values.length[0].p",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8471742Z     "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8472259Z     "severity": "error",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8472859Z   },
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8473195Z   {
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8473671Z     "message": "Stop sequence does not define p=0.",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8474304Z     "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8474833Z     "ruleId": "stop-missing-start",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8475271Z     "severity": "warning",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8475659Z   },
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8475961Z   {
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8476455Z     "message": "Stop sequence does not define p=1.",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8477193Z     "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8477890Z     "ruleId": "stop-missing-end",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8478494Z     "severity": "warning",
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8478907Z   },
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8479243Z ]
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8479434Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8480521Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-group-values-section.test.ts:^[[2m207:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8481993Z     ^[[90m205|^[[39m   it("Y-7 cites the section in a diagnostic about a leaf inside it", (…
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8484133Z     ^[[90m206|^[[39m     ^[[35mconst^[[39m authored ^[[33m=^[[39m { fk^[[33m:^[[39m { values^[[33m:^[[39m { length^[[33m:^[[39m [{ p^[[33m:^[[39m ^[[34m2^[[39m^[[33m,^[[39m v^[[33m:^[[39m ^[[34m1^[[39m }] } } }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8485961Z     ^[[90m207|^[[39m     ^[[34mexpect^[[39m(^[[34mdiagnose^[[39m(authored))^[[33m.^[[39m^[[34mtoContainEqual^[[39m(
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8487094Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8488092Z     ^[[90m208|^[[39m       expect^[[33m.^[[39m^[[34mobjectContaining^[[39m({
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8489159Z     ^[[90m209|^[[39m         ruleId^[[33m:^[[39m ^[[32m"stop-position-range"^[[39m^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8489754Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8490210Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8490558Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8490599Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8495471Z ^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m54 passed^[[39m^[[22m^[[90m (57)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8497547Z ^[[2m      Tests ^[[22m ^[[1m^[[31m4 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m237 passed^[[39m^[[22m^[[90m (241)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8498674Z ^[[2m   Start at ^[[22m 02:21:11
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8500225Z ^[[2m   Duration ^[[22m 4.91s^[[2m (transform 1.19s, setup 405ms, import 3.77s, tests 1.24s, environment 9ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8501180Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8515626Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8544369Z ##[error]AssertionError: expected [ 'keyframes-missing-values-section' ] to deeply equal [ 'stops-shape' ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  [
integration (node 24)	Run npm run test:integration	-   "stops-shape",
integration (node 24)	Run npm run test:integration	+   "keyframes-missing-values-section",
integration (node 24)	Run npm run test:integration	  ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:260:41
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8553329Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8556360Z ##[error]AssertionError: expected [ …(3) ] to deeply equal []
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- []
integration (node 24)	Run npm run test:integration	+ [
integration (node 24)	Run npm run test:integration	+   "packages/core/src/contract/authored-leaf.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/src/contract/v5.ts",
integration (node 24)	Run npm run test:integration	+   "packages/core/src/contract/validate-v5.ts",
integration (node 24)	Run npm run test:integration	+ ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:344:30
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8557974Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8560651Z ##[error]AssertionError: expected "vi.fn()" to be called with arguments: [ 'x', undefined, …(1) ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	Received:
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  1st vi.fn() call:
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  [
integration (node 24)	Run npm run test:integration	    "x",
integration (node 24)	Run npm run test:integration	-   undefined,
integration (node 24)	Run npm run test:integration	+   [
integration (node 24)	Run npm run test:integration	+     {
integration (node 24)	Run npm run test:integration	+       "p": 0,
integration (node 24)	Run npm run test:integration	+       "v": 1,
integration (node 24)	Run npm run test:integration	+     },
integration (node 24)	Run npm run test:integration	+     {
integration (node 24)	Run npm run test:integration	+       "p": 1,
integration (node 24)	Run npm run test:integration	+       "v": 2,
integration (node 24)	Run npm run test:integration	+     },
integration (node 24)	Run npm run test:integration	+   ],
integration (node 24)	Run npm run test:integration	    {
integration (node 24)	Run npm run test:integration	      "duration": 2,
integration (node 24)	Run npm run test:integration	      "id": "hero/arm",
integration (node 24)	Run npm run test:integration	    },
integration (node 24)	Run npm run test:integration	  ]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	Number of calls: 1
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/engine-x3-contribution.test.ts:39:24
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8562203Z 
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8569999Z ##[error]AssertionError: expected [ { …(4) }, { …(4) }, { …(4) } ] to deep equally contain ObjectContaining{…}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	ObjectContaining {
integration (node 24)	Run npm run test:integration	  "path": "keyframes.fk.values.length.stops[0].p",
integration (node 24)	Run npm run test:integration	  "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	[
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Stop p must be between 0 and 1.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.fk.values.length[0].p",
integration (node 24)	Run npm run test:integration	    "ruleId": "stop-position-range",
integration (node 24)	Run npm run test:integration	    "severity": "error",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Stop sequence does not define p=0.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	    "ruleId": "stop-missing-start",
integration (node 24)	Run npm run test:integration	    "severity": "warning",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	    "message": "Stop sequence does not define p=1.",
integration (node 24)	Run npm run test:integration	    "path": "keyframes.fk.values.length",
integration (node 24)	Run npm run test:integration	    "ruleId": "stop-missing-end",
integration (node 24)	Run npm run test:integration	    "severity": "warning",
integration (node 24)	Run npm run test:integration	  },
integration (node 24)	Run npm run test:integration	]
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-group-values-section.test.ts:207:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-23T02:21:16.8917132Z ##[error]Process completed with exit code 1.
```
