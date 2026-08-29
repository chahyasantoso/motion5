# CI log archive: 33249505343

- Workflow: CI
- Conclusion: failure
- Head branch: fix/sh-stale-track-handle
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33249505343
- Captured: 2026-08-29T11:11:35Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-29T11:11:02.5363191Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-29T11:11:02.5363491Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-29T11:11:02.5401560Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-29T11:11:02.5401839Z env:
quality (node 24)	Run npm test	2026-08-29T11:11:02.5402036Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-29T11:11:02.5402246Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-29T11:11:02.6526787Z 
quality (node 24)	Run npm test	2026-08-29T11:11:02.6527417Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-29T11:11:02.6528005Z > vitest run
quality (node 24)	Run npm test	2026-08-29T11:11:02.6528205Z 
quality (node 24)	Run npm test	2026-08-29T11:11:03.0481672Z 
quality (node 24)	Run npm test	2026-08-29T11:11:03.0486404Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:03.0487375Z 
quality (node 24)	Run npm test	2026-08-29T11:11:03.5622274Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:03.5857891Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:03.7614680Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:03.9340382Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 68^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:03.9360205Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-29T11:11:03.9362838Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-29T11:11:03.9364429Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-29T11:11:03.9365109Z 
quality (node 24)	Run npm test	2026-08-29T11:11:03.9365973Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-29T11:11:03.9366746Z 
quality (node 24)	Run npm test	2026-08-29T11:11:03.9366937Z act(() => {
quality (node 24)	Run npm test	2026-08-29T11:11:03.9367797Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-29T11:11:03.9368364Z });
quality (node 24)	Run npm test	2026-08-29T11:11:03.9368732Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-29T11:11:03.9369090Z 
quality (node 24)	Run npm test	2026-08-29T11:11:03.9370178Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-29T11:11:03.9371225Z 
quality (node 24)	Run npm test	2026-08-29T11:11:03.9552021Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 131^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.0249097Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.1719341Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.2479855Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.2549114Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.4792418Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.4901271Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.4975608Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.7460157Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.8046267Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.8050833Z ^[[31m     ^[[31m×^[[31m SH-1 refuses on every member of the enumerated public handle surface^[[39m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.8052633Z ^[[31m     ^[[31m×^[[31m SH-2 keeps the current message verbatim and carries its stable rule id^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.8054065Z ^[[31m     ^[[31m×^[[31m SH-3 stays a TypeError, so every existing narrowing keeps matching^[[39m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.8055725Z ^[[31m     ^[[31m×^[[31m SH-4 answers `live` on both sides of every invalidation and never throws doing it^[[39m^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.8057840Z ^[[31m     ^[[31m×^[[31m SH-5 lets expected cleanup guard on `live` instead of on try/catch^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.8067708Z      ^[[32m✓^[[39m SH-6 leaves the live path exactly as it was^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.8069796Z ^[[31m     ^[[31m×^[[31m SH-7 keeps one token comparison and no branch inside the handle factory^[[39m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.8323055Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 135^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:04.9703638Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.0381724Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-slot-claim.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.0572617Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.1872623Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.2463810Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.4736353Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.4965919Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 45^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.5784954Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 51^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.7037466Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.7641716Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.8648189Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.9042092Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:05.9797654Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.0726411Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.1164689Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.2460675Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.2827047Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.4318960Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.5042876Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.5271710Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.6380729Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.7654051Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.7723695Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:06.8665931Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.0022595Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.0024567Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.0723163Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.2381496Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.2544997Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.2722762Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.4889560Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.5030522Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.7309213Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.7568371Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.9425766Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:07.9835871Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:08.1659508Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:08.3019604Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:08.4389307Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:08.6029310Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:08.7619500Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:08.9125584Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 43^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:08.9857430Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:09.2159104Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:09.2733580Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:09.4522821Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:09.5049527Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:09.6830941Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:09.8012352Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:09.9289763Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.0408924Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.2158013Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.2933956Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.3983764Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2951^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.3999285Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2947^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.4369624Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.5299678Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.6393298Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.7005068Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.7266954Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.8938741Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:10.9575531Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:11.0061196Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:11.1430731Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:11.1993496Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:11.2689921Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:11.4804693Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:11.4891146Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:11.7793907Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:11.8099489Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:12.0491753Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:12.0659191Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:12.3115957Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:12.3489963Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:12.5659502Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:12.6499809Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:12.8450829Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 38^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:12.8598223Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:13.0802693Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:13.1383570Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:13.3506704Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:13.4143000Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:13.6048204Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:13.6610352Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:13.8746909Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:13.9279967Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-29T11:11:13.9308651Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-29T11:11:13.9387921Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-29T11:11:13.9407714Z 
quality (node 24)	Run npm test	2026-08-29T11:11:13.9448163Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-29T11:11:13.9477672Z 
quality (node 24)	Run npm test	2026-08-29T11:11:13.9478861Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:13.9507749Z act(() => {
quality (node 24)	Run npm test	2026-08-29T11:11:13.9537751Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-29T11:11:13.9567689Z });
quality (node 24)	Run npm test	2026-08-29T11:11:13.9597768Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-29T11:11:13.9657596Z 
quality (node 24)	Run npm test	2026-08-29T11:11:13.9688718Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-29T11:11:13.9689730Z 
quality (node 24)	Run npm test	2026-08-29T11:11:13.9719501Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-29T11:11:13.9748614Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-29T11:11:13.9807956Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-29T11:11:13.9819215Z 
quality (node 24)	Run npm test	2026-08-29T11:11:13.9848272Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-29T11:11:13.9877671Z 
quality (node 24)	Run npm test	2026-08-29T11:11:13.9907680Z act(() => {
quality (node 24)	Run npm test	2026-08-29T11:11:13.9912139Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-29T11:11:13.9938016Z });
quality (node 24)	Run npm test	2026-08-29T11:11:13.9938930Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-29T11:11:13.9939541Z 
quality (node 24)	Run npm test	2026-08-29T11:11:13.9940914Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-29T11:11:13.9941852Z 
quality (node 24)	Run npm test	2026-08-29T11:11:14.1542117Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:14.1877430Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:14.3920365Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:14.4068087Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:14.6269240Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:14.6397532Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:14.8749214Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:14.9264343Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:15.0996899Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:15.2419288Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:15.3109374Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:15.5085155Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:15.5336062Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:15.7419495Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:15.8239434Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 47^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:15.9230338Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:16.0269102Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:16.1134800Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:16.2804145Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:16.3154099Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:16.4922446Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:16.5332213Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:16.7785717Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-29T11:11:16.7818916Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:16.7820661Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-29T11:11:16.7849738Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-29T11:11:16.7854757Z 
quality (node 24)	Run npm test	2026-08-29T11:11:16.7862361Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-29T11:11:16.7870971Z 
quality (node 24)	Run npm test	2026-08-29T11:11:16.7871188Z act(() => {
quality (node 24)	Run npm test	2026-08-29T11:11:16.7871647Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-29T11:11:16.7872118Z });
quality (node 24)	Run npm test	2026-08-29T11:11:16.7872542Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-29T11:11:16.7872794Z 
quality (node 24)	Run npm test	2026-08-29T11:11:16.7873808Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-29T11:11:16.7874759Z 
quality (node 24)	Run npm test	2026-08-29T11:11:16.7875826Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:16.9874058Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.0479834Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.2393280Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.3015216Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.4662467Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.5434652Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.7400879Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 6381^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.7404782Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1716^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.7407410Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1792^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.7451349Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.7689951Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.9597055Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.9678896Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:17.9727838Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.1580113Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.1888844Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.2228010Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.3550419Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.3770114Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.4318632Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.5439503Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.5721037Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.6342196Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.7656952Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.7754018Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.8661226Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:18.9669000Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.0156434Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.1026323Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.1739524Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.2633427Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3192179Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3312453Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3368461Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3369276Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 6 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3369902Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3375149Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-1 refuses on every member of the enumerated public handle surface
quality (node 24)	Run npm test	2026-08-29T11:11:19.3381434Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'addObserve', 'id', 'remove', …(3) ] to deeply equal [ 'addObserve', 'id', 'live', …(4) ]^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3382542Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3383084Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3383692Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3384407Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3384672Z ^[[2m  [^[[22m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3385147Z ^[[2m    "addObserve",^[[22m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3385664Z ^[[2m    "id",^[[22m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3386147Z ^[[32m-   "live",^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3386633Z ^[[2m    "remove",^[[22m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3387427Z ^[[2m    "removeObserve",^[[22m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3388006Z ^[[2m    "replace",^[[22m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3388504Z ^[[2m    "track",^[[22m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3388929Z ^[[2m  ]^[[22m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3389140Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3389991Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m128:21^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3443316Z     ^[[90m126|^[[39m     ^[[35mconst^[[39m surface ^[[33m=^[[39m ^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(handle)^[[33m.^[[39m^[[34msort^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3444946Z     ^[[90m127|^[[39m     const declared = [...NON_REFUSING, ...Object.keys(MEMBER_ARGUMENTS…
quality (node 24)	Run npm test	2026-08-29T11:11:19.3446276Z     ^[[90m128|^[[39m     ^[[34mexpect^[[39m(surface)^[[33m.^[[39m^[[34mtoEqual^[[39m(declared)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3448047Z     ^[[90m   |^[[39m                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3448665Z     ^[[90m129|^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3449572Z     ^[[90m130|^[[39m     // Collected rather than asserted one by one, so a red run names e…
quality (node 24)	Run npm test	2026-08-29T11:11:19.3450186Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3450703Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3465946Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3467619Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3473122Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m154 passed^[[39m^[[22m^[[90m (155)^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3481347Z ^[[2m      Tests ^[[22m ^[[1m^[[31m6 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m734 passed^[[39m^[[22m^[[90m (740)^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3484216Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-2 keeps the current message verbatim and carries its stable rule id
quality (node 24)	Run npm test	2026-08-29T11:11:19.3486835Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'stale-track-handle' // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3487897Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3488203Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3488672Z "stale-track-handle"
quality (node 24)	Run npm test	2026-08-29T11:11:19.3488930Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3489186Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3489593Z undefined
quality (node 24)	Run npm test	2026-08-29T11:11:19.3489801Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3490736Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m153:53^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3492176Z     ^[[90m151|^[[39m     ^[[90m// identity a caller branches on instead of matching that string.^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3493432Z     ^[[90m152|^[[39m     expect((thrown as Error).message).toBe(`Track "${NODE_ID}" is no l…
quality (node 24)	Run npm test	2026-08-29T11:11:19.3495209Z     ^[[90m153|^[[39m     ^[[34mexpect^[[39m((thrown ^[[35mas^[[39m { ruleId^[[33m?^[[39m^[[33m:^[[39m unknown })^[[33m.^[[39mruleId)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[33mRULE_ID^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3496673Z     ^[[90m   |^[[39m                                                     ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3498425Z     ^[[90m154|^[[39m     ^[[34mexpect^[[39m((thrown ^[[35mas^[[39m ^[[33mError^[[39m)^[[33m.^[[39mname)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[33mERROR_NAME^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3499503Z     ^[[90m155|^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3499741Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3500183Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3500553Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3502748Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-3 stays a TypeError, so every existing narrowing keeps matching
quality (node 24)	Run npm test	2026-08-29T11:11:19.3504892Z ^[[31m^[[1mError^[[22m: Expected the operation to throw.^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3506280Z ^[[36m ^[[2m❯^[[22m thrownBy packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m84:9^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3507742Z     ^[[90m 82|^[[39m     ^[[35mreturn^[[39m error^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3508770Z     ^[[90m 83|^[[39m   }
quality (node 24)	Run npm test	2026-08-29T11:11:19.3510004Z     ^[[90m 84|^[[39m   ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mError^[[39m(^[[32m"Expected the operation to throw."^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3511201Z     ^[[90m   |^[[39m         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3511783Z     ^[[90m 85|^[[39m }
quality (node 24)	Run npm test	2026-08-29T11:11:19.3512271Z     ^[[90m 86|^[[39m ^[[90m/**
quality (node 24)	Run npm test	2026-08-29T11:11:19.3513427Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m164:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3514158Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3514662Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3515058Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3517678Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-4 answers `live` on both sides of every invalidation and never throws doing it
quality (node 24)	Run npm test	2026-08-29T11:11:19.3520287Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be true // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3521267Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3521586Z ^[[32m- Expected:^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3522009Z true
quality (node 24)	Run npm test	2026-08-29T11:11:19.3522223Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3522502Z ^[[31m+ Received:^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3522917Z undefined
quality (node 24)	Run npm test	2026-08-29T11:11:19.3523123Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3524018Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m172:25^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3525408Z     ^[[90m170|^[[39m     ^[[35mconst^[[39m project ^[[33m=^[[39m ^[[34mruntime^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3526702Z     ^[[90m171|^[[39m     ^[[35mconst^[[39m handle ^[[33m=^[[39m ^[[34mhandleFor^[[39m(project)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3528470Z     ^[[90m172|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39mlive)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3529598Z     ^[[90m   |^[[39m                         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3530249Z     ^[[90m173|^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3531186Z     ^[[90m174|^[[39m     // A handle survives its own replacement, because replacement pres…
quality (node 24)	Run npm test	2026-08-29T11:11:19.3531892Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3532393Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3532783Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3534976Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-5 lets expected cleanup guard on `live` instead of on try/catch
quality (node 24)	Run npm test	2026-08-29T11:11:19.3537312Z ^[[31m^[[1mAssertionError^[[22m: expected +0 to be 1 // Object.is equality^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3537872Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3538121Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3538557Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3538783Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3538973Z ^[[32m- 1^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3539341Z ^[[31m+ 0^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3539542Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3540366Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m207:22^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3541358Z     ^[[90m205|^[[39m       ^[[34mcleanup^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3542235Z     ^[[90m206|^[[39m     })^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoThrow^[[39m()^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3543313Z     ^[[90m207|^[[39m     ^[[34mexpect^[[39m(removals)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3544207Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3545291Z     ^[[90m208|^[[39m     ^[[34mexpect^[[39m(handle^[[33m.^[[39mlive)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3546182Z     ^[[90m209|^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3546445Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3546905Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3547545Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3549792Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/stale-track-handle.test.ts^[[2m > ^[[22ma stale TrackHandle refuses uniformly, and `live` asks without throwing^[[2m > ^[[22mSH-7 keeps one token comparison and no branch inside the handle factory
quality (node 24)	Run npm test	2026-08-29T11:11:19.3552288Z ^[[31m^[[1mAssertionError^[[22m: expected [ 'token === token', …(4) ] to have a length of 1 but got 5^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3553280Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3553592Z ^[[32m- Expected^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3554077Z ^[[31m+ Received^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3554339Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3554540Z ^[[32m- 1^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3554977Z ^[[31m+ 5^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3555198Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3556075Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/stale-track-handle.test.ts:^[[2m239:50^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3557710Z     ^[[90m237|^[[39m     // copy of this comparison; a reintroduced silent return needs one…
quality (node 24)	Run npm test	2026-08-29T11:11:19.3559024Z     ^[[90m238|^[[39m     const comparisons = [...source.matchAll(/\btoken\b\s*(?:===|!==)\s…
quality (node 24)	Run npm test	2026-08-29T11:11:19.3560885Z     ^[[90m239|^[[39m     ^[[34mexpect^[[39m(comparisons^[[33m.^[[39m^[[34mmap^[[39m((match) ^[[33m=>^[[39m match[^[[34m0^[[39m]))^[[33m.^[[39m^[[34mtoHaveLength^[[39m(^[[34m1^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3562438Z     ^[[90m   |^[[39m                                                  ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3564014Z     ^[[90m240|^[[39m     ^[[34mexpect^[[39m(source)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"#liveEntry("^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3565674Z     ^[[90m241|^[[39m     ^[[34mexpect^[[39m(source)^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"StaleTrackHandleError"^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3566451Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3566909Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3567555Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3567885Z ^[[2m   Start at ^[[22m 11:11:03
quality (node 24)	Run npm test	2026-08-29T11:11:19.3569052Z ^[[2m   Duration ^[[22m 16.27s^[[2m (transform 2.33s, setup 1.13s, import 8.08s, tests 12.33s, environment 25ms)^[[22m
quality (node 24)	Run npm test	2026-08-29T11:11:19.3569722Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3569731Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3598109Z ##[error]AssertionError: expected [ 'addObserve', 'id', 'remove', …(3) ] to deeply equal [ 'addObserve', 'id', 'live', …(4) ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	  [
quality (node 24)	Run npm test	    "addObserve",
quality (node 24)	Run npm test	    "id",
quality (node 24)	Run npm test	-   "live",
quality (node 24)	Run npm test	    "remove",
quality (node 24)	Run npm test	    "removeObserve",
quality (node 24)	Run npm test	    "replace",
quality (node 24)	Run npm test	    "track",
quality (node 24)	Run npm test	  ]
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/stale-track-handle.test.ts:128:21
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-29T11:11:19.3610075Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3613776Z ##[error]AssertionError: expected undefined to be 'stale-track-handle' // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	"stale-track-handle"
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/stale-track-handle.test.ts:153:53
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-29T11:11:19.3615912Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3619468Z ##[error]Error: Expected the operation to throw.
quality (node 24)	Run npm test	 ❯ thrownBy packages/core/test/unit/runtime/stale-track-handle.test.ts:84:9
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/stale-track-handle.test.ts:164:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-29T11:11:19.3621724Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3624869Z ##[error]AssertionError: expected undefined to be true // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected:
quality (node 24)	Run npm test	true
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	+ Received:
quality (node 24)	Run npm test	undefined
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/stale-track-handle.test.ts:172:25
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-29T11:11:19.3626980Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3630086Z ##[error]AssertionError: expected +0 to be 1 // Object.is equality
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 1
quality (node 24)	Run npm test	+ 0
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/stale-track-handle.test.ts:207:22
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-29T11:11:19.3632133Z 
quality (node 24)	Run npm test	2026-08-29T11:11:19.3634191Z ##[error]AssertionError: expected [ 'token === token', …(4) ] to have a length of 1 but got 5
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- Expected
quality (node 24)	Run npm test	+ Received
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	- 1
quality (node 24)	Run npm test	+ 5
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/stale-track-handle.test.ts:239:50
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-29T11:11:19.4035818Z ##[error]Process completed with exit code 1.
```
