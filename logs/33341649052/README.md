# CI log archive: 33341649052

- Workflow: CI
- Conclusion: failure
- Head branch: feat/pk-record-shaped-patch-keys
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33341649052
- Captured: 2026-08-30T23:23:09Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-30T23:22:47.1360578Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:47.1360928Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:47.1406471Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:47.1407042Z env:
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:47.1407266Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:47.1407479Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:47.2555752Z 
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:47.2556763Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:47.2557643Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:47.2558052Z 
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:51.4290417Z ##[error]packages/core/test/contract/adapters.test.ts(32,40): error TS2352: Conversion of type '{ duration(value?: number | undefined): number | GsapTimelineLike; progress(next?: number | undefined): number | GsapTimelineLike; to: () => GsapTimelineLike; kill: () => void; }' to type 'GsapTimelineLike' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:51.4720438Z   Property 'recent' is missing in type '{ duration(value?: number | undefined): number | GsapTimelineLike; progress(next?: number | undefined): number | GsapTimelineLike; to: () => GsapTimelineLike; kill: () => void; }' but required in type 'GsapTimelineLike'.
quality (node 24)	Run npm run typecheck	2026-08-30T23:22:51.4726054Z ##[error]Process completed with exit code 2.
boundaries (node 24)	Run npm run test:boundaries	﻿2026-08-30T23:22:50.7467691Z ##[group]Run npm run test:boundaries
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.7468236Z ^[[36;1mnpm run test:boundaries^[[0m
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.7517438Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.7517844Z env:
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.7518153Z   NODE_VERSION: 24
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.7518504Z ##[endgroup]
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.8585315Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.8586066Z > motion5@0.0.0 test:boundaries
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.8587209Z > node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.8587951Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.9103809Z packages/core/src/index.ts: public export AuthoredValues is not allow-listed
boundaries (node 24)	Run npm run test:boundaries	2026-08-30T23:22:50.9253431Z ##[error]Process completed with exit code 1.
integration (node 24)	Run npm run test:integration	﻿2026-08-30T23:22:48.4368337Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.4368700Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.4411783Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.4412071Z env:
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.4412283Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.4412511Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.5406800Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.5409700Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.5410387Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.5410722Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.8508128Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.8511748Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:48.8512580Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.3651337Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4008624Z  ^[[31m❯^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4013862Z      ^[[32m✓^[[39m LF-5 interpolates a bare array of stops^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4016482Z      ^[[32m✓^[[39m LF-6 publishes a bare static value and holds it at every progress^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4018225Z      ^[[32m✓^[[39m LF-7 keeps a static leaf out of the percent map and out of the compiled properties^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4019924Z ^[[31m     ^[[31m×^[[31m LF-8 contributes no tween for a static leaf^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4021393Z      ^[[32m✓^[[39m LF-9 refuses the retired object wrapper by name^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4022822Z      ^[[32m✓^[[39m LF-10 closes the static domain instead of leaving it open^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4024213Z      ^[[32m✓^[[39m LF-11 never reads either leaf form as a plugin group^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4034657Z      ^[[32m✓^[[39m LF-12 still refuses a migrated legacy group by name^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4036449Z      ^[[32m✓^[[39m LF-13 accepts both leaf forms inside a values section^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4038168Z      ^[[32m✓^[[39m LF-14 refuses a static leaf on a prepare-stage contributor's key^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4039507Z      ^[[32m✓^[[39m LF-15 declares the leaf as a union and deletes the wrapper interface^[[32m 0^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.4040767Z      ^[[32m✓^[[39m LF-16 leaves no authored schema in the repository on the retired form^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5417223Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5419647Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5420720Z An update to Root inside a test was not wrapped in act(...).
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5421140Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5421714Z When testing, code that causes React state updates should be wrapped into act(...):
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5422328Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5422505Z act(() => {
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5422932Z   /* fire events that update state */
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5423385Z });
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5423736Z /* assert on the output */
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5424079Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5425089Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5425951Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.5662634Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 113^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.6148730Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.6960693Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.8355174Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:49.8691694Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.1023184Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.1385515Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.1734767Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.3454231Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.3970020Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.4212314Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.6094990Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.6179959Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.6420418Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.8739013Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.8902133Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:50.9059288Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.1245299Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.1525763Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.1761367Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.3698629Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.3763118Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.4041285Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.6121065Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.6287205Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.6555565Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.8479343Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.8740668Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:51.8878851Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.0908263Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.1078489Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.1269770Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.3240808Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.3488104Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.3556585Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.5607137Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.5749140Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.5771744Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.7515871Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.8121867Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.8178863Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:52.9326773Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.0288982Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.0385070Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.1458442Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.2433646Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.3178113Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.3209346Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.4845960Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.4958228Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.5452866Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.6945337Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.7357483Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.7638276Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.9309258Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:53.9363609Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.0004630Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.0922041Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1240469Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1269923Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1270882Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1271408Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1274309Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/bare-authored-leaf.test.ts^[[2m > ^[[22mthe bare authored leaf^[[2m > ^[[22mLF-8 contributes no tween for a static leaf
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1280249Z ^[[31m^[[1mTypeError^[[22m: timeline.recent is not a function^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1281829Z ^[[36m ^[[2m❯^[[22m buildKey packages/core/src/adapters/interpolator/gsap.ts:^[[2m148:42^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1339915Z     ^[[90m146|^[[39m           ^[[35melse^[[39m ^[[35mif^[[39m (^[[33m!^[[39m(^[[32m"ease"^[[39m ^[[35min^[[39m tweenVars)) vars^[[33m.^[[39mease ^[[33m=^[[39m ^[[32m"none"^[[39m^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1341942Z     ^[[90m147|^[[39m           timeline^[[33m.^[[39m^[[34mto^[[39m(proxy^[[33m,^[[39m vars^[[33m,^[[39m previous^[[33m.^[[39mp ^[[33m*^[[39m duration)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1343611Z     ^[[90m148|^[[39m           ^[[35mconst^[[39m child ^[[33m=^[[39m ^[[34masTween^[[39m(timeline^[[33m.^[[39m^[[34mrecent^[[39m())^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1344867Z     ^[[90m   |^[[39m                                          ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1345308Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1345903Z     ^[[90m149|^[[39m           ^[[35mif^[[39m (child) handles^[[33m.^[[39m^[[34mpush^[[39m(child)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1354011Z     ^[[90m150|^[[39m         }
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1355070Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m60 passed^[[39m^[[22m^[[90m (61)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1356972Z ^[[90m ^[[2m❯^[[22m Object.create packages/core/src/adapters/interpolator/gsap.ts:^[[2m154:78^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1358542Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m253 passed^[[39m^[[22m^[[90m (254)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1360077Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/bare-authored-leaf.test.ts:^[[2m256:51^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1361135Z ^[[2m   Start at ^[[22m 23:22:48
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1361559Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1362367Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1362762Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1363619Z ^[[2m   Duration ^[[22m 5.25s^[[2m (transform 1.36s, setup 348ms, import 4.44s, tests 1.31s, environment 8ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1364310Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1374157Z 
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1404587Z ##[error]TypeError: timeline.recent is not a function
integration (node 24)	Run npm run test:integration	 ❯ buildKey packages/core/src/adapters/interpolator/gsap.ts:148:42
integration (node 24)	Run npm run test:integration	 ❯ Object.create packages/core/src/adapters/interpolator/gsap.ts:154:78
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/bare-authored-leaf.test.ts:256:51
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-30T23:22:54.1756749Z ##[error]Process completed with exit code 1.
```
