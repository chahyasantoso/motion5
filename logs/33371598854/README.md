# CI log archive: 33371598854

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-39-plugin-require-edit
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33371598854
- Captured: 2026-08-31T08:10:48Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-31T08:10:16.2126511Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-31T08:10:16.2126805Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-31T08:10:16.2168869Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-31T08:10:16.2169180Z env:
quality (node 24)	Run npm test	2026-08-31T08:10:16.2169400Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-31T08:10:16.2169639Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-31T08:10:16.3322083Z 
quality (node 24)	Run npm test	2026-08-31T08:10:16.3322861Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-31T08:10:16.3323248Z > vitest run
quality (node 24)	Run npm test	2026-08-31T08:10:16.3323402Z 
quality (node 24)	Run npm test	2026-08-31T08:10:16.6430586Z 
quality (node 24)	Run npm test	2026-08-31T08:10:16.6434800Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:16.6435846Z 
quality (node 24)	Run npm test	2026-08-31T08:10:16.9652625Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.1307191Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.2633092Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.4814144Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/plugin-require-edit.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m | ^[[22m^[[31m9 failed^[[39m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.4816109Z ^[[31m     ^[[31m×^[[31m RA-39 binds one new slot, rewrites only that section, and rebuilds once^[[39m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.4817106Z ^[[31m     ^[[31m×^[[31m RA-40 redirects a bound slot rather than adding a second binding for it^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.4818030Z ^[[31m     ^[[31m×^[[31m RA-41 removes the last slot without leaving an empty section behind^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.4821685Z ^[[31m     ^[[31m×^[[31m RA-42 addresses one entry of a dict-valued slot by the key it was authored under^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.4823370Z ^[[31m     ^[[31m×^[[31m RA-43 refuses a plugin this node authors no group for, and originates nothing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.4825023Z ^[[31m     ^[[31m×^[[31m RA-44 commits nothing when the edit changes nothing^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.4826442Z ^[[31m     ^[[31m×^[[31m RA-45 leaves everything where it was when the candidate graph refuses^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.4828002Z ^[[31m     ^[[31m×^[[31m RA-46 lets the registry refuse a slot it never declared, at the seam a commit reaches^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.4829370Z ^[[31m     ^[[31m×^[[31m RA-47 refuses to cross a bound slot's shape, in both directions^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.6219097Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 59^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.6340758Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-31T08:10:17.6343084Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T08:10:17.6344299Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T08:10:17.6345554Z 
quality (node 24)	Run npm test	2026-08-31T08:10:17.6348317Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T08:10:17.6348878Z 
quality (node 24)	Run npm test	2026-08-31T08:10:17.6349028Z act(() => {
quality (node 24)	Run npm test	2026-08-31T08:10:17.6349400Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T08:10:17.6349777Z });
quality (node 24)	Run npm test	2026-08-31T08:10:17.6350109Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T08:10:17.6350352Z 
quality (node 24)	Run npm test	2026-08-31T08:10:17.6351333Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T08:10:17.6352150Z 
quality (node 24)	Run npm test	2026-08-31T08:10:17.6704348Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 115^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.7419808Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.9047081Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:17.9126477Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.0136256Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.1486807Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.1560387Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.3393357Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.5074663Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.5440146Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 58^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.5865113Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/handle-base.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.7458270Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.8107347Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.8502293Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:18.9907077Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/motion-driver-edit.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.0987023Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-path.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.1157780Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.1186385Z ^[[31m     ^[[31m×^[[31m SH-1 refuses on every member of the enumerated public handle surface^[[39m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.1187443Z      ^[[32m✓^[[39m SH-2 keeps the current message verbatim and carries its stable rule id^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.1188299Z      ^[[32m✓^[[39m SH-3 stays a TypeError, so every existing narrowing keeps matching^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.1189152Z      ^[[32m✓^[[39m SH-4 answers `live` on both sides of every invalidation and never throws doing it^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.1190014Z      ^[[32m✓^[[39m SH-5 lets expected cleanup guard on `live` instead of on try/catch^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.1191178Z      ^[[32m✓^[[39m SH-6 leaves the live path exactly as it was^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.1191914Z      ^[[32m✓^[[39m SH-7 keeps one token comparison and no branch inside the handle factory^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.3132944Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.3362706Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 151^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.3425436Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.5372176Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.5737262Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.6687085Z  ^[[32m✓^[[39m packages/core/test/integration/solver-member-cache.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 55^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.8119881Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.8743282Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 50^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:19.9870494Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.0285615Z  ^[[32m✓^[[39m packages/core/test/unit/graph/graph-dependents.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.1473301Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.2438570Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.2758259Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.3651129Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.5456511Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.5535476Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.6107118Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.7769096Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.7898283Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:20.8363607Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.0207469Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/structural-commit-flush.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.0379314Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.0913941Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.2728581Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.2917933Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.3038562Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.4858176Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.5461956Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.5571626Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.7578718Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.7667181Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.7882661Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.9700701Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:21.9989431Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:22.0416847Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:22.2467539Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:22.2834272Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:22.5077074Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:22.5341228Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:22.7387041Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:22.7641858Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:23.0252750Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:23.1270937Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 63^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:23.3306743Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:23.4512715Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:23.6331429Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:23.6827092Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:23.9687223Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:23.9776904Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:24.2174624Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-snapshot-memo.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:24.3212672Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 48^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:24.4482311Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:24.5879480Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:24.6677626Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:24.8985184Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:24.9167222Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.1472021Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.1976356Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.3123732Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 3134^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.3127527Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 3130^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.3713289Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.5069765Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.5363977Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.6345341Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.7946907Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.8027024Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.9122913Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:25.9755876Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:26.0853638Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:26.1262789Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:26.2627091Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:26.3068131Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:26.3590661Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:26.4806652Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:26.5916194Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:26.6892532Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:26.8560615Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:26.9537102Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:27.1112061Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:27.1959487Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:27.4338805Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:27.4507050Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:27.6698739Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:27.7195976Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:27.9918154Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:28.0413009Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:28.2913313Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:28.3327109Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:28.5649772Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:28.6127017Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:28.8146861Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:28.8526871Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:29.0838393Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:29.1342688Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-31T08:10:29.1345054Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T08:10:29.1346109Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T08:10:29.1346540Z 
quality (node 24)	Run npm test	2026-08-31T08:10:29.1347468Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T08:10:29.1348022Z 
quality (node 24)	Run npm test	2026-08-31T08:10:29.1348158Z act(() => {
quality (node 24)	Run npm test	2026-08-31T08:10:29.1348583Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T08:10:29.1375222Z });
quality (node 24)	Run npm test	2026-08-31T08:10:29.1375758Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T08:10:29.1376121Z 
quality (node 24)	Run npm test	2026-08-31T08:10:29.1377345Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T08:10:29.1379848Z 
quality (node 24)	Run npm test	2026-08-31T08:10:29.1485878Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-31T08:10:29.1489459Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T08:10:29.1507129Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:29.1508832Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T08:10:29.1509516Z 
quality (node 24)	Run npm test	2026-08-31T08:10:29.1510246Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T08:10:29.1510996Z 
quality (node 24)	Run npm test	2026-08-31T08:10:29.1511368Z act(() => {
quality (node 24)	Run npm test	2026-08-31T08:10:29.1511927Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T08:10:29.1512518Z });
quality (node 24)	Run npm test	2026-08-31T08:10:29.1513041Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T08:10:29.1513852Z 
quality (node 24)	Run npm test	2026-08-31T08:10:29.1515081Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T08:10:29.1516038Z 
quality (node 24)	Run npm test	2026-08-31T08:10:29.3481787Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:29.4220988Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:29.6090219Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:29.6251886Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:29.8222487Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:29.8985054Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:30.0401675Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:30.1210910Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:30.3286910Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:30.3503762Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:30.5779517Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:30.5979326Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:30.7955785Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:30.8877040Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:31.0218925Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:31.1245505Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:31.2364251Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:31.3669800Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:31.4211048Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:31.5793811Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:31.6362818Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:31.8187139Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-31T08:10:31.8206109Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-31T08:10:31.8216022Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:31.8242557Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-31T08:10:31.8255144Z 
quality (node 24)	Run npm test	2026-08-31T08:10:31.8255886Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-31T08:10:31.8256583Z 
quality (node 24)	Run npm test	2026-08-31T08:10:31.8256827Z act(() => {
quality (node 24)	Run npm test	2026-08-31T08:10:31.8257335Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-31T08:10:31.8257902Z });
quality (node 24)	Run npm test	2026-08-31T08:10:31.8258363Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-31T08:10:31.8258721Z 
quality (node 24)	Run npm test	2026-08-31T08:10:31.8259765Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-31T08:10:31.8260783Z 
quality (node 24)	Run npm test	2026-08-31T08:10:31.8288235Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.0722120Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.1040584Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.3270816Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.3416960Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.5677089Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.5749788Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.8585765Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.8977218Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.9781348Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6476^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.9783713Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1821^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:32.9785985Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1696^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.0629225Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.1329996Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.1733168Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.2449813Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.3490788Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.3870825Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.4326901Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.5469573Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.6247615Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.6517245Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.7416091Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.8285496Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.8366550Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:33.9284978Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.0260764Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.0856465Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.1658033Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.2807477Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.3347001Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.4128254Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.4541317Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5076428Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5189514Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5190834Z ^[[31m⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 10 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5193187Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5195223Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-39 binds one new slot, rewrites only that section, and rebuilds once
quality (node 24)	Run npm test	2026-08-31T08:10:34.5202831Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5205609Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5272307Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5274070Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5275707Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5277003Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5278948Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5280199Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5281849Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m190:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5282601Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5283018Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5283361Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5285725Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-40 redirects a bound slot rather than adding a second binding for it
quality (node 24)	Run npm test	2026-08-31T08:10:34.5288018Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5289523Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5291505Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5292959Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5294219Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5295277Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5296256Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5297219Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5298352Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m218:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5299002Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5299423Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5299757Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5301761Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-41 removes the last slot without leaving an empty section behind
quality (node 24)	Run npm test	2026-08-31T08:10:34.5303970Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5327266Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5329000Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5330372Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5331577Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5332517Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5333501Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5334621Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5335723Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m235:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5336333Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5336724Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5337056Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5339157Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-42 addresses one entry of a dict-valued slot by the key it was authored under
quality (node 24)	Run npm test	2026-08-31T08:10:34.5341403Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5342907Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5345209Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5346685Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5347957Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5348830Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5349804Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5350765Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5351835Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m255:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5352752Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5353167Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5353529Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5356346Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-43 refuses a plugin this node authors no group for, and originates nothing
quality (node 24)	Run npm test	2026-08-31T08:10:34.5358866Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5360366Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5361923Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5366264Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5367882Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5368777Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5370347Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5371308Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5372382Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m281:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5372989Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5373473Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5373798Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5375845Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-44 commits nothing when the edit changes nothing
quality (node 24)	Run npm test	2026-08-31T08:10:34.5378054Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5379572Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5381170Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5382663Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5383910Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5385009Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5386006Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5386994Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5388297Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m301:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5389286Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5389689Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5390023Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5392025Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-45 leaves everything where it was when the candidate graph refuses
quality (node 24)	Run npm test	2026-08-31T08:10:34.5394260Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5395936Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5397616Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5399420Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5400722Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5401594Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5402627Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5403523Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5404760Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m322:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5405381Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5405760Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5406089Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5408158Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-46 lets the registry refuse a slot it never declared, at the seam a commit reaches
quality (node 24)	Run npm test	2026-08-31T08:10:34.5410450Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5411563Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5412694Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5414134Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5415209Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5416056Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5416917Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5417513Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5418340Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m346:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5418720Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5418961Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5419177Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5420417Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/plugin-require-edit.test.ts^[[2m > ^[[22mone edge on an already-bound plugin, at the price the structural tier costs^[[2m > ^[[22mRA-47 refuses to cross a bound slot's shape, in both directions
quality (node 24)	Run npm test	2026-08-31T08:10:34.5421841Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5422971Z ^[[36m ^[[2m❯^[[22m declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m172:16^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5424592Z     ^[[90m170|^[[39m   ^[[35mconst^[[39m handle ^[[33m=^[[39m project^[[33m.^[[39m^[[34mtrack^[[39m(nodeId) ^[[35mas^[[39m ^[[33mEditableTrack^[[39m^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5426058Z     ^[[90m171|^[[39m   ^[[35mconst^[[39m keys ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5427211Z     ^[[90m172|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"setRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5428047Z     ^[[90m   |^[[39m                ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5428930Z     ^[[90m173|^[[39m   ^[[34mexpect^[[39m(keys)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"removeRequire"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5429515Z     ^[[90m174|^[[39m   ^[[35mreturn^[[39m handle^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5430463Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/plugin-require-edit.test.ts:^[[2m383:20^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5430856Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5431101Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5431304Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5432459Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-1 refuses on every member of the enumerated public handle surface
quality (node 24)	Run npm test	2026-08-31T08:10:34.5434967Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'addObserve', 'definition', …(8) ] to deeply equal [ 'addObserve', 'definition', …(10) ]^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5435478Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5435638Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5435913Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5436052Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5436204Z ^[[33m@@ -4,11 +4,9 @@^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5436491Z ^[[2m    "id",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5436746Z ^[[2m    "live",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5437043Z ^[[2m    "overrideValues",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5437350Z ^[[2m    "remove",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5437630Z ^[[2m    "removeObserve",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5437948Z ^[[32m-   "removeRequire",^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5438243Z ^[[2m    "replace",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5438514Z ^[[2m    "requires",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5438797Z ^[[32m-   "setRequire",^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5439098Z ^[[2m    "setValues",^[[22m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5439355Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5439482Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5439959Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m136:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5440926Z     ^[[90m134|^[[39m     ^[[35mconst^[[39m surface ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m.^[[39m^[[34msort^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5442248Z     ^[[90m135|^[[39m     const declared = [...NON_REFUSING, ...Object.keys(MEMBER_ARGUMENTS…
quality (node 24)	Run npm test	2026-08-31T08:10:34.5443365Z     ^[[90m136|^[[39m     ^[[34mexpect^[[39m(surface)^[[33m.^[[39m^[[34mtoEqual^[[39m(declared)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5444224Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5444857Z     ^[[90m137|^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5445335Z     ^[[90m138|^[[39m     // Collected rather than asserted one by one, so a red run names e…
quality (node 24)	Run npm test	2026-08-31T08:10:34.5445668Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5445916Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/10]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5446138Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5446184Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5446673Z ^[[2m Test Files ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m167 passed^[[39m^[[22m^[[90m (169)^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5447482Z ^[[2m      Tests ^[[22m ^[[1m^[[31m10 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m821 passed^[[39m^[[22m^[[90m (831)^[[39m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5447995Z ^[[2m   Start at ^[[22m 08:10:16
quality (node 24)	Run npm test	2026-08-31T08:10:34.5448670Z ^[[2m   Duration ^[[22m 17.85s^[[2m (transform 2.54s, setup 1.08s, import 9.81s, tests 12.97s, environment 23ms)^[[22m
quality (node 24)	Run npm test	2026-08-31T08:10:34.5449061Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5449067Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5473954Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:190:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:10:34.5484258Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5488543Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:218:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:10:34.5491549Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5495250Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:235:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:10:34.5497425Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5500953Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:255:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:10:34.5503129Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5506402Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:281:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:10:34.5508838Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5512110Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:301:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:10:34.5514135Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5517559Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:322:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:10:34.5519643Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5522885Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:346:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:10:34.5525169Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5528425Z ##[error]AssertionError: expected [ 'id', 'live', 'definition', …(7) ] to include 'setRequire'
quality (node 24)	Run npm test	 ❯ declaring packages/core/test/unit/runtime/plugin-require-edit.test.ts:172:16
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/plugin-require-edit.test.ts:383:20
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-31T08:10:34.5530537Z 
quality (node 24)	Run npm test	2026-08-31T08:10:34.5535360Z ##[error]AssertionError: expected [ 'addObserve', 'definition', …(8) ] to deeply equal [ 'addObserve', 'definition', …(10) ]
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
quality (node 24)	Run npm test	2026-08-31T08:10:34.5963114Z ##[error]Process completed with exit code 1.
```
