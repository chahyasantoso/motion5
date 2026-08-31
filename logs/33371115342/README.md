# CI log archive: 33371115342

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-39-plugin-require-edit
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33371115342
- Captured: 2026-08-31T08:04:38Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-31T08:04:03.4290923Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-31T08:04:03.4291246Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-31T08:04:03.4328827Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-31T08:04:03.4329106Z env:
quality (node 24)	Run npm test	2026-08-31T08:04:03.4329307Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-31T08:04:03.4329522Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-31T08:04:03.5342028Z 
quality (node 24)	Run npm test	2026-08-31T08:04:03.5342742Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-31T08:04:03.5343244Z > vitest run
quality (node 24)	Run npm test	2026-08-31T08:04:03.5343415Z 
quality (node 24)	Run npm test	2026-08-31T08:04:03.8403510Z 
quality (node 24)	Run npm test	2026-08-31T08:04:03.8407973Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:03.8408750Z 
quality (node 24)	Run npm test	2026-08-31T08:04:04.1947725Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.3088276Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.4859361Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.6613233Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.7319519Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-31T08:04:04.7322493Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T08:04:04.7332989Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T08:04:04.7333934Z 
quality (node 24)	Run npm test	2026-08-31T08:04:04.7391566Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T08:04:04.7392539Z 
quality (node 24)	Run npm test	2026-08-31T08:04:04.7392974Z act(() => {
quality (node 24)	Run npm test	2026-08-31T08:04:04.7393814Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T08:04:04.7394677Z });
quality (node 24)	Run npm test	2026-08-31T08:04:04.7395359Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T08:04:04.7395987Z 
quality (node 24)	Run npm test	2026-08-31T08:04:04.7397265Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T08:04:04.7398467Z 
quality (node 24)	Run npm test	2026-08-31T08:04:04.7692696Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 108^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.8216580Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m | ^[[22m^[[31m8 failed^[[39m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.8218574Z ^[[31m     ^[[31m×^[[31m RA-39 binds one new slot, rewrites only that section, and rebuilds once^[[39m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.8223420Z ^[[31m     ^[[31m×^[[31m RA-40 redirects a bound slot rather than adding a second binding for it^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.8225720Z ^[[31m     ^[[31m×^[[31m RA-41 removes the last slot without leaving an empty section behind^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.8251684Z ^[[31m     ^[[31m×^[[31m RA-42 addresses one entry of a dict-valued slot by the key it was authored under^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.8261544Z ^[[31m     ^[[31m×^[[31m RA-43 refuses a plugin this node authors no group for, and originates nothing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.8262798Z ^[[31m     ^[[31m×^[[31m RA-44 commits nothing when the edit changes nothing^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.8264524Z ^[[31m     ^[[31m×^[[31m RA-45 leaves everything where it was when the candidate graph refuses^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.8266802Z ^[[31m     ^[[31m×^[[31m RA-46 lets the registry refuse a slot it never declared, at the seam a commit reaches^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:04.9172139Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.0399539Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.0799917Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.2036482Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.2874731Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.3072030Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.5223401Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.6011539Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.7182420Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 46^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.7732617Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.8588306Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:05.9630337Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.0073857Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.1189594Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.2334841Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.2373675Z ^[[31m     ^[[31m×^[[31m SH-1 refuses on every member of the enumerated public handle surface^[[39m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.2396836Z      ^[[32m✓^[[39m SH-2 keeps the current message verbatim and carries its stable rule id^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.2398457Z      ^[[32m✓^[[39m SH-3 stays a TypeError, so every existing narrowing keeps matching^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.2400234Z      ^[[32m✓^[[39m SH-4 answers `live` on both sides of every invalidation and never throws doing it^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.2401711Z      ^[[32m✓^[[39m SH-5 lets expected cleanup guard on `live` instead of on try/catch^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.2402897Z      ^[[32m✓^[[39m SH-6 leaves the live path exactly as it was^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.2404166Z      ^[[32m✓^[[39m SH-7 keeps one token comparison and no branch inside the handle factory^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.2406492Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.4476910Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.4774689Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 161^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.4899788Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.6858357Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.7206468Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.8149303Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:06.9491538Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.0569327Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.1778929Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 52^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.2036171Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependents.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.3297315Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.4272986Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.4572782Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.5692112Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.6896047Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.7271966Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.7851151Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.9076417Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:07.9311954Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.0062019Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.1602768Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.1671939Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.2266956Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.4265644Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.4492484Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.4613258Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.6817165Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.6922434Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.7042025Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.9055020Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.9235844Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:08.9603671Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:09.1189739Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:09.1483291Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:09.1897718Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:09.3972381Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:09.4356085Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:09.6585060Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:09.6736081Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:09.8892361Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:09.9252811Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:10.1642208Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:10.2522787Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:10.5082352Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:10.6083650Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:10.8137626Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 44^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:10.8252880Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:11.1174971Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:11.1267957Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:11.3656393Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:11.4782439Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:11.6442657Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:11.6994347Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:11.9022828Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:11.9949556Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.1748051Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.2492484Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.4034149Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3086^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.4036319Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3083^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.4622473Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.4746904Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.6691867Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.6934622Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.7545081Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.9442303Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:12.9522301Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.0036322Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.1482933Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.2313134Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.2685328Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.3952366Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.4677348Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.4790651Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.6018150Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.7247991Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.8012565Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:13.9641189Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:14.0736979Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:14.2138867Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:14.3012501Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:14.5222306Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:14.5272748Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:14.7720980Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:14.7882159Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:15.0892374Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:15.0936112Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:15.3719100Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:15.3861871Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:15.6428878Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:15.6545744Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:15.8790643Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:15.8944166Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:16.1281795Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:16.1820771Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-31T08:04:16.1823536Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T08:04:16.1828729Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T08:04:16.1829731Z 
quality (node 24)	Run npm test	2026-08-31T08:04:16.1831181Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T08:04:16.1832075Z 
quality (node 24)	Run npm test	2026-08-31T08:04:16.1832456Z act(() => {
quality (node 24)	Run npm test	2026-08-31T08:04:16.1833151Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T08:04:16.1833921Z });
quality (node 24)	Run npm test	2026-08-31T08:04:16.1834549Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T08:04:16.1835100Z 
quality (node 24)	Run npm test	2026-08-31T08:04:16.1836431Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T08:04:16.1837724Z 
quality (node 24)	Run npm test	2026-08-31T08:04:16.1932616Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-31T08:04:16.1936513Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T08:04:16.1938147Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T08:04:16.1938889Z 
quality (node 24)	Run npm test	2026-08-31T08:04:16.1939730Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T08:04:16.1940936Z 
quality (node 24)	Run npm test	2026-08-31T08:04:16.1941582Z act(() => {
quality (node 24)	Run npm test	2026-08-31T08:04:16.1951741Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T08:04:16.1952512Z });
quality (node 24)	Run npm test	2026-08-31T08:04:16.1953146Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T08:04:16.1954494Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:16.1955612Z 
quality (node 24)	Run npm test	2026-08-31T08:04:16.1956927Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T08:04:16.1958573Z 
quality (node 24)	Run npm test	2026-08-31T08:04:16.3823423Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:16.4425323Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:16.7167004Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:16.7351883Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:16.9542774Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:16.9757362Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:17.1599928Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:17.1752411Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:17.3850372Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:17.4376544Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:17.6242659Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:17.7242471Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:17.9174796Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:17.9476554Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:18.1105265Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:18.1540735Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:18.3143542Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:18.4175144Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:18.5523118Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:18.6130302Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:18.7463360Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:18.8599935Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-31T08:04:18.8607446Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T08:04:18.8608948Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T08:04:18.8609710Z 
quality (node 24)	Run npm test	2026-08-31T08:04:18.8610818Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T08:04:18.8611748Z 
quality (node 24)	Run npm test	2026-08-31T08:04:18.8612106Z act(() => {
quality (node 24)	Run npm test	2026-08-31T08:04:18.8613163Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T08:04:18.8613799Z });
quality (node 24)	Run npm test	2026-08-31T08:04:18.8614329Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T08:04:18.8614764Z 
quality (node 24)	Run npm test	2026-08-31T08:04:18.8615936Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T08:04:18.8617086Z 
quality (node 24)	Run npm test	2026-08-31T08:04:18.8657065Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:18.9409856Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:19.0532627Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:19.1832231Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:19.2694127Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:19.3901445Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:19.4992429Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:19.6381168Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:19.7359021Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:19.9362266Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:19.9507328Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.1821080Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.1891792Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.3909818Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.4297198Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.4601683Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6811^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.4604083Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1837^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.4606738Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1851^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.5715434Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.6119162Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.6572304Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.8002253Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.8066087Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.8549162Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:20.9706048Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.0128216Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.0730318Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.1482673Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.2464822Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.3197434Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.3771192Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.4981169Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.5452427Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.5620328Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6524124Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6578100Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6578958Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 9 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6579474Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6583673Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-39 binds one new slot, rewrites only that section, and rebuilds once
quality (node 24)	Run npm test	2026-08-31T08:04:21.6591232Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6592905Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6657011Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6658848Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6660638Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6661704Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6662899Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6664433Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6665786Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m190:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6666504Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6666981Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6667372Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6669716Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-40 redirects a bound slot rather than adding a second binding for it
quality (node 24)	Run npm test	2026-08-31T08:04:21.6672902Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6674682Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6676603Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6678649Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6684989Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6686153Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6687280Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6688416Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6689771Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m218:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6690913Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6691417Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6691792Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6694062Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-41 removes the last slot without leaving an empty section behind
quality (node 24)	Run npm test	2026-08-31T08:04:21.6696717Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6698448Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6700564Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6702251Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6703690Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6704670Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6705329Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6705908Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6707074Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m235:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6707811Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6708289Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6708671Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6711238Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-42 addresses one entry of a dict-valued slot by the key it was authored under
quality (node 24)	Run npm test	2026-08-31T08:04:21.6713826Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6715473Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6717657Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6719331Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6720993Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6721955Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6723062Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6724100Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6725343Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m255:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6726026Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6726466Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6727100Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6729285Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-43 refuses a plugin this node authors no group for, and originates nothing
quality (node 24)	Run npm test	2026-08-31T08:04:21.6732179Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6733926Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6735740Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6737227Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6738567Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6739649Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6741046Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6742148Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6743415Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m281:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6744023Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6744433Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6744765Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6750501Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-44 commits nothing when the edit changes nothing
quality (node 24)	Run npm test	2026-08-31T08:04:21.6753038Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6754767Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6756704Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6758413Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6759967Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6761423Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6762633Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6763779Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6765123Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m301:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6766152Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6766627Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6767001Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6769247Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-45 leaves everything where it was when the candidate graph refuses
quality (node 24)	Run npm test	2026-08-31T08:04:21.6773528Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6775283Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6780587Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6782364Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6784249Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6785358Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6786565Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6787750Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6789072Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m322:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6789825Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6790599Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6791005Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6793516Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-46 lets the registry refuse a slot it never declared, at the seam a commit reaches
quality (node 24)	Run npm test	2026-08-31T08:04:21.6796624Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6798460Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6800621Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6802426Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6803978Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6805057Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6806278Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6807444Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6808797Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m346:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6809558Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6810339Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6810762Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6813075Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-1 refuses on every member of the enumerated public handle surface
quality (node 24)	Run npm test	2026-08-31T08:04:21.6815922Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'addObserve', 'definition', …(8) ] to deeply equal [ 'addObserve', 'definition', …(10) ]^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6816763Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6816995Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6817430Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6817652Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6817897Z ^[[33m@@ -4,11 +4,9 @@^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6818352Z ^[[2m    "id",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6818755Z ^[[2m    "live",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6819255Z ^[[2m    "overrideValues",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6820305Z ^[[2m    "remove",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6820812Z ^[[2m    "removeObserve",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6821360Z ^[[32m-   "removeRequire",^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6821848Z ^[[2m    "replace",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6822310Z ^[[2m    "requires",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6822818Z ^[[32m-   "setRequire",^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6823312Z ^[[2m    "setValues",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6823723Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6823921Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6824731Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m136:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6826408Z     ^[[90m134|^[[39m     ^[[35mconst^[[39m surface ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m.^[[39m^[[34msort^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6827861Z     ^[[90m135|^[[39m     const declared = [...NON_REFUSING, ...Object.keys(MEMBER_ARGUMENTS…
quality (node 24)	Run npm test	2026-08-31T08:04:21.6829228Z     ^[[90m136|^[[39m     ^[[34mexpect^[[39m(surface)^[[33m.^[[39m^[[34mtoEqual^[[39m(declared)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6830804Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6831416Z     ^[[90m137|^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6832322Z     ^[[90m138|^[[39m     // Collected rather than asserted one by one, so a red run names e…
quality (node 24)	Run npm test	2026-08-31T08:04:21.6832928Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6833403Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/9]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6833774Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6833804Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6834648Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m167 passed^[[39m^[[22m^[[90m (169)^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6836217Z ^[[2m      Tests ^[[22m ^[[1m^[[31m9 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m821 passed^[[39m^[[22m^[[90m (830)^[[39m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6837239Z ^[[2m   Start at ^[[22m 08:04:03
quality (node 24)	Run npm test	2026-08-31T08:04:21.6838528Z ^[[2m   Duration ^[[22m 17.79s^[[2m (transform 2.34s, setup 1.05s, import 9.17s, tests 13.33s, environment 28ms)^[[22m
quality (node 24)	Run npm test	2026-08-31T08:04:21.6839253Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6839267Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6870411Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:190:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:04:21.6883667Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6888022Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:218:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:04:21.6890833Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6894895Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:235:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:04:21.6897327Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6901530Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:255:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:04:21.6904073Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6908008Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:281:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:04:21.6909815Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6913838Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:301:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:04:21.6916243Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6920240Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:322:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:04:21.6922897Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6926676Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:346:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:04:21.6929187Z 
quality (node 24)	Run npm test	2026-08-31T08:04:21.6934654Z ##[error]AssertionError: expected [ 'addObserve', 'definition', …(8) ] to deeply equal [ 'addObserve', 'definition', …(10) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	@@ -4,11 +4,9 @@
quality (node 24)	Run npm test	    "id",
quality (node 24)	Run npm test	    "live",
quality (node 24)	Run npm test	    "overrideValues",
quality (node 24)	Run npm test	    "remove",
quality (node 24)	Run npm test	    "removeObserve",
quality (node 24)	Run npm test	-   "removeRequire",
quality (node 24)	Run npm test	    "replace",
quality (node 24)	Run npm test	    "requires",
quality (node 24)	Run npm test	-   "setRequire",
quality (node 24)	Run npm test	    "setValues",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/stale-track-handle.test.ts:136:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:04:21.7317688Z ##[error]Process completed with exit code 1.
```
