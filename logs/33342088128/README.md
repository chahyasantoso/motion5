# CI log archive: 33342088128

- Workflow: CI
- Conclusion: failure
- Head branch: feat/pk-record-shaped-patch-keys
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33342088128
- Captured: 2026-08-30T23:33:27Z

## Failed job output

```text
quality (node 24)	Run npm test	﻿2026-08-30T23:32:58.9894425Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-30T23:32:58.9894661Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-30T23:32:58.9928934Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-30T23:32:58.9929160Z env:
quality (node 24)	Run npm test	2026-08-30T23:32:58.9929356Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-30T23:32:58.9929540Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-30T23:32:59.0846655Z 
quality (node 24)	Run npm test	2026-08-30T23:32:59.0847130Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-30T23:32:59.0847416Z > vitest run
quality (node 24)	Run npm test	2026-08-30T23:32:59.0847541Z 
quality (node 24)	Run npm test	2026-08-30T23:32:59.3322587Z 
quality (node 24)	Run npm test	2026-08-30T23:32:59.3344283Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-30T23:32:59.3352557Z 
quality (node 24)	Run npm test	2026-08-30T23:32:59.6056774Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/evidence-case-ids.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:32:59.7034174Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/pivot-offset-solve.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:32:59.8134498Z  ^[[32m✓^[[39m packages/core/test/unit/graph/resolve-solvers.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:32:59.9524231Z  ^[[32m✓^[[39m packages/core/test/integration/bare-authored-leaf.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 41^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:32:59.9947956Z  ^[[32m✓^[[39m packages/core/test/unit/domain/dict-valued-requirements.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.0100129Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
quality (node 24)	Run npm test	2026-08-30T23:33:00.0102223Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T23:33:00.0103208Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T23:33:00.0103677Z 
quality (node 24)	Run npm test	2026-08-30T23:33:00.0104250Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T23:33:00.0104801Z 
quality (node 24)	Run npm test	2026-08-30T23:33:00.0105032Z act(() => {
quality (node 24)	Run npm test	2026-08-30T23:33:00.0105514Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T23:33:00.0105965Z });
quality (node 24)	Run npm test	2026-08-30T23:33:00.0106361Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T23:33:00.0106713Z 
quality (node 24)	Run npm test	2026-08-30T23:33:00.0107549Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T23:33:00.0108303Z 
quality (node 24)	Run npm test	2026-08-30T23:33:00.0229903Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 74^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.1864509Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.1948805Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-solve.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.2225664Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.3764443Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goals.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.3862293Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-solver-members.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.4583032Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-group-values-section.test.ts ^[[2m(^[[22m^[[2m13 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.6413886Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/live-value-updates.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 39^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.6756763Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7115845Z  ^[[31m❯^[[39m packages/core/test/contract/gsap-patch-keys.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 42^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7144988Z ^[[31m     ^[[31m×^[[31m PK-1 rebuilds a key from a bare stop array and declines the retired wrapper^[[39m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7161536Z      ^[[32m✓^[[39m PK-2 creates no second timeline and never kills the whole one^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7177931Z      ^[[32m✓^[[39m PK-3 keeps the sibling's own child objects and rebuilds only the patched key's^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7180327Z      ^[[32m✓^[[39m PK-4 restores a key dropped from the overlay through the same call^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7182510Z      ^[[32m✓^[[39m PK-5 makes a rebased overlay the new base and leaves a plain one revertible^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7183982Z      ^[[32m✓^[[39m PK-6 declines an effective record that cannot compile, with every tween alive^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7185337Z      ^[[32m✓^[[39m PK-7 declines an ease collision a per-key compile could not have seen^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7186638Z      ^[[32m✓^[[39m PK-8 leaves the terminal padding tween alone and the total duration pinned^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7188800Z      ^[[32m✓^[[39m PK-9 reflects only the effective stops at the progress it was holding^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7190090Z      ^[[32m✓^[[39m PK-10 leaves the one-tween interpolator without the capability^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.7191414Z      ^[[32m✓^[[39m PK-11 is indistinguishable from a fresh create, on success and on failure^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.8356616Z  ^[[31m❯^[[39m packages/core/test/unit/domain/track-live-values.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.8368741Z      ^[[32m✓^[[39m LV-1 merges over the interpolated state and leaves the animating key alone^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.8370295Z      ^[[32m✓^[[39m LV-6 is sticky, is replaced wholesale, and an empty record is the clear^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.8371886Z      ^[[32m✓^[[39m LV-7 refuses four keys for one reason each, with no mutation and no publish^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.8373382Z ^[[31m     ^[[31m×^[[31m PK-15 refuses the animated half by name, classifying every key before it writes^[[39m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.8374846Z      ^[[32m✓^[[39m reports a decline rather than a refusal when the backend declares no capability^[[32m 0^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.8376299Z      ^[[32m✓^[[39m PK-18 declares the port capability and no longer declares the animated reason^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.8377955Z      ^[[32m✓^[[39m LV-14 kills the mutant that drops the overlay from `interpolated()`^[[32m 1^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.8848551Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:00.9091057Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/stale-track-handle.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.0343759Z  ^[[32m✓^[[39m packages/core/test/integration/authored-leaf-reader.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.0895814Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-pivot-offset.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.1189992Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m)^[[22m^[[32m 111^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.2089432Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-resolution.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.2698882Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solved-rotation-weight.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.3658995Z  ^[[32m✓^[[39m packages/core/test/integration/ik-fabrik-chain.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.4009984Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.5107512Z  ^[[32m✓^[[39m packages/core/test/integration/ik-two-bone.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.5774327Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.5847340Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-dispose-ownership.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.6894738Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/incremental-graph-builder-eviction.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.7411361Z  ^[[32m✓^[[39m packages/core/test/unit/graph/finalize-graph.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.8039242Z  ^[[32m✓^[[39m packages/core/test/contract/microtask-scheduler.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.8599650Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-track-mutation-atomicity.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.9185160Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m14 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:01.9877749Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-dispatch.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.0328775Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/ik-solve.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.1128731Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.1730086Z  ^[[32m✓^[[39m packages/core/test/unit/graph/incremental-cache.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.2564230Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.3125258Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.3213846Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solved-weight.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.4168048Z  ^[[32m✓^[[39m packages/core/test/unit/graph/single-input-channel.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.5052823Z  ^[[32m✓^[[39m packages/core/test/contract/trigger-factory.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.5223842Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.5805965Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-compose-from.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.6522753Z  ^[[32m✓^[[39m packages/core/test/unit/graph/arity-lift.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.7005067Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.7704030Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.8399969Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.8708764Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:02.9388861Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-pivot-offset.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:03.0452974Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-one-tween.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:03.1290166Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/track-staging.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:03.2519264Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:03.3193826Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:03.4190000Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:03.5124426Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:03.6733950Z  ^[[32m✓^[[39m packages/core/test/integration/ik-multi-goal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:03.7118324Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:03.8961308Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:03.9451067Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.1244148Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.1313587Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/time-loop-cycle.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.3466722Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.3654102Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.5582449Z  ^[[32m✓^[[39m packages/core/test/unit/graph/solver-goal-required.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.5984383Z  ^[[31m❯^[[39m packages/core/test/unit/runtime/live-value-animated.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m3 failed^[[39m^[[2m)^[[22m^[[32m 40^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.5991976Z ^[[31m     ^[[31m×^[[31m PK-12 moves an animated key end to end through setValues^[[39m^[[32m 31^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.5993617Z ^[[31m     ^[[31m×^[[31m PK-13 moves an animated key without moving the retained definition^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.5998958Z ^[[31m     ^[[31m×^[[31m PK-14 makes a setValues after an override sticky^[[39m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.7168383Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-target-removal.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.8089079Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:04.9484509Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.0063848Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.1253772Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.2402278Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.3013994Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/angle-blend.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.3854682Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2385^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.3876169Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2383^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.4657971Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fabrik-arity-one.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.4719914Z  ^[[32m✓^[[39m packages/core/test/integration/live-value-composition.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.5884423Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.6530413Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.6699123Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.7804165Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-equivalence.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.8239802Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.8832279Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:05.9537722Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.0357496Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.0431989Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.1217927Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.1992383Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion-progress-range.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.2894145Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.3556409Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/trigger-factory-no-fallback.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.4986406Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.5824283Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.6967446Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.7595679Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.9129377Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:06.9530070Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-gsap.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.1335515Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.2047641Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.3134796Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.3753104Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.5222205Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.5774637Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.7163085Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.7228829Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.8887048Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-order.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.9645885Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-30T23:33:07.9647706Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T23:33:07.9648526Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T23:33:07.9648869Z 
quality (node 24)	Run npm test	2026-08-30T23:33:07.9649300Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T23:33:07.9651032Z 
quality (node 24)	Run npm test	2026-08-30T23:33:07.9651194Z act(() => {
quality (node 24)	Run npm test	2026-08-30T23:33:07.9651532Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T23:33:07.9652082Z });
quality (node 24)	Run npm test	2026-08-30T23:33:07.9652377Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T23:33:07.9652582Z 
quality (node 24)	Run npm test	2026-08-30T23:33:07.9653376Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T23:33:07.9654066Z 
quality (node 24)	Run npm test	2026-08-30T23:33:07.9785852Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:07.9787889Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mH-4 hands a consumer the same stripped values the publisher retained
quality (node 24)	Run npm test	2026-08-30T23:33:07.9833599Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T23:33:07.9834866Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T23:33:07.9835393Z 
quality (node 24)	Run npm test	2026-08-30T23:33:07.9835905Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T23:33:07.9836216Z 
quality (node 24)	Run npm test	2026-08-30T23:33:07.9836305Z act(() => {
quality (node 24)	Run npm test	2026-08-30T23:33:07.9836523Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T23:33:07.9836791Z });
quality (node 24)	Run npm test	2026-08-30T23:33:07.9836991Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T23:33:07.9837129Z 
quality (node 24)	Run npm test	2026-08-30T23:33:07.9837935Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T23:33:07.9838352Z 
quality (node 24)	Run npm test	2026-08-30T23:33:08.0603973Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:08.2069335Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:08.2434087Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:08.3923982Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:08.4653515Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:08.5568850Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:08.6300728Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:08.7349108Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:08.8023968Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:08.8863927Z  ^[[32m✓^[[39m packages/core/test/unit/plugins/fk-solver-override.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.0160635Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.0623950Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.2529602Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.2572791Z  ^[[32m✓^[[39m packages/core/test/contract/graph-builder-incremental.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.4377116Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.4861611Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.5982254Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track-node-id.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.6733832Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.7885062Z  ^[[32m✓^[[39m packages/core/test/unit/domain/time-driver.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.8708757Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:09.9517284Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-separator.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.0168318Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.1084481Z  ^[[32m✓^[[39m packages/core/test/unit/graph/requirement-edge-construction.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.1974089Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-30T23:33:10.1975793Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-30T23:33:10.1976975Z An update to Root inside a test was not wrapped in act(...).
quality (node 24)	Run npm test	2026-08-30T23:33:10.1977270Z 
quality (node 24)	Run npm test	2026-08-30T23:33:10.1977675Z When testing, code that causes React state updates should be wrapped into act(...):
quality (node 24)	Run npm test	2026-08-30T23:33:10.1978109Z 
quality (node 24)	Run npm test	2026-08-30T23:33:10.1978219Z act(() => {
quality (node 24)	Run npm test	2026-08-30T23:33:10.1978550Z   /* fire events that update state */
quality (node 24)	Run npm test	2026-08-30T23:33:10.1978887Z });
quality (node 24)	Run npm test	2026-08-30T23:33:10.1979172Z /* assert on the output */
quality (node 24)	Run npm test	2026-08-30T23:33:10.1979378Z 
quality (node 24)	Run npm test	2026-08-30T23:33:10.1980095Z This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act
quality (node 24)	Run npm test	2026-08-30T23:33:10.1980728Z 
quality (node 24)	Run npm test	2026-08-30T23:33:10.1981487Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.2744340Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.3642225Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.4483988Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.5418116Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.6301556Z  ^[[32m✓^[[39m packages/react/test/patch-store-destroy.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.7063228Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.8212607Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:10.8985192Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.0493856Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.0592827Z  ^[[32m✓^[[39m packages/core/test/unit/engine/motion-entry-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.2273651Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.2461874Z  ^[[32m✓^[[39m packages/core/test/unit/graph/edge-key-canonical.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.2533806Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-port-types.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[33m 5065^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.2535330Z      ^[[33m^[[2m✓^[[22m^[[39m K-9 names all five port contracts from the entry declarations ^[[33m 1370^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.2553369Z      ^[[33m^[[2m✓^[[22m^[[39m K-10 still cannot name a runtime internal through the same entry ^[[33m 1388^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.3828562Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.4054801Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.4111312Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.5467350Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.5502504Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.5539356Z  ^[[32m✓^[[39m packages/core/test/unit/adapters/scroll-trigger-range.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.6959781Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.7083165Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.7085624Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.8531108Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.8610273Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:11.8934072Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.0247464Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.0468747Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.0764800Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.1884781Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.2228092Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.2408051Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 3^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3109227Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 2^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3154087Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3155135Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 5 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3155623Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3158891Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/contract/gsap-patch-keys.test.ts^[[2m > ^[[22ma record-shaped overlay patches a live timeline, or declines^[[2m > ^[[22mPK-1 rebuilds a key from a bare stop array and declines the retired wrapper
quality (node 24)	Run npm test	2026-08-30T23:33:12.3162542Z ^[[31m^[[1mAssertionError^[[22m: expected 45 to be close to 20, received difference is 25, but expected 5e-7^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3163835Z ^[[36m ^[[2m❯^[[22m packages/core/test/contract/gsap-patch-keys.test.ts:^[[2m134:45^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3215632Z     ^[[90m132|^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3216738Z     ^[[90m133|^[[39m     ^[[34mexpect^[[39m(^[[34mpatch^[[39m(timeline^[[33m,^[[39m { x^[[33m:^[[39m ^[[33mSLOWER_X^[[39m }))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3218444Z     ^[[90m134|^[[39m     ^[[34mexpect^[[39m(^[[34mreadNumber^[[39m(timeline^[[33m.^[[39mstate^[[33m,^[[39m ^[[32m"x"^[[39m))^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m20^[[39m^[[33m,^[[39m ^[[34m6^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3219558Z     ^[[90m   |^[[39m                                             ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3220012Z     ^[[90m135|^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3220649Z     ^[[90m136|^[[39m     // The wrapper compiles to no property for the key, which is a kin…
quality (node 24)	Run npm test	2026-08-30T23:33:12.3221059Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3221397Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3221680Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3223308Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-value-animated.test.ts^[[2m > ^[[22man animated live value is written on the timeline the track already has^[[2m > ^[[22mPK-12 moves an animated key end to end through setValues
quality (node 24)	Run npm test	2026-08-30T23:33:12.3225109Z ^[[31m^[[1mAssertionError^[[22m: expected 112.5 to be close to 90, received difference is 22.5, but expected 0.00005^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3226686Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-value-animated.test.ts:^[[2m103:43^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3231396Z     ^[[90m101|^[[39m     arm^[[33m.^[[39m^[[34msetValues^[[39m({ rotation^[[33m:^[[39m ^[[33mFASTER^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3236353Z     ^[[90m102|^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3237940Z     ^[[90m103|^[[39m     ^[[34mexpect^[[39m(^[[34mpublished^[[39m(handle^[[33m,^[[39m ^[[32m"rotation"^[[39m))^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m90^[[39m^[[33m,^[[39m ^[[34m4^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3240185Z     ^[[90m   |^[[39m                                           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3241379Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(^[[34mpublished^[[39m(handle^[[33m,^[[39m ^[[32m"x"^[[39m))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[34m200^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3242828Z     ^[[90m105|^[[39m     expect(retained(arm)).toEqual({ values: { x: 200, y: 300, rotation…
quality (node 24)	Run npm test	2026-08-30T23:33:12.3243735Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3244194Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3248936Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3250779Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-value-animated.test.ts^[[2m > ^[[22man animated live value is written on the timeline the track already has^[[2m > ^[[22mPK-13 moves an animated key without moving the retained definition
quality (node 24)	Run npm test	2026-08-30T23:33:12.3253038Z ^[[31m^[[1mAssertionError^[[22m: expected 112.5 to be close to 90, received difference is 22.5, but expected 0.00005^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3254393Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-value-animated.test.ts:^[[2m119:43^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3255604Z     ^[[90m117|^[[39m     arm^[[33m.^[[39m^[[34moverrideValues^[[39m({ rotation^[[33m:^[[39m ^[[33mFASTER^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3256441Z     ^[[90m118|^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3257639Z     ^[[90m119|^[[39m     ^[[34mexpect^[[39m(^[[34mpublished^[[39m(handle^[[33m,^[[39m ^[[32m"rotation"^[[39m))^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m90^[[39m^[[33m,^[[39m ^[[34m4^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3258816Z     ^[[90m   |^[[39m                                           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3259687Z     ^[[90m120|^[[39m     // The half plan v2 called impossible: an animated override, and `…
quality (node 24)	Run npm test	2026-08-30T23:33:12.3260607Z     ^[[90m121|^[[39m     // with the authored stops because the retained definition deliber…
quality (node 24)	Run npm test	2026-08-30T23:33:12.3261102Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3261502Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3262001Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3263527Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/runtime/live-value-animated.test.ts^[[2m > ^[[22man animated live value is written on the timeline the track already has^[[2m > ^[[22mPK-14 makes a setValues after an override sticky
quality (node 24)	Run npm test	2026-08-30T23:33:12.3265512Z ^[[31m^[[1mAssertionError^[[22m: expected 191.25 to be close to 135, received difference is 56.25, but expected 0.00005^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3267080Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/runtime/live-value-animated.test.ts:^[[2m142:43^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3271076Z     ^[[90m140|^[[39m     arm^[[33m.^[[39m^[[34moverrideValues^[[39m({ rotation^[[33m:^[[39m ^[[33mFASTER^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3272464Z     ^[[90m141|^[[39m     arm^[[33m.^[[39m^[[34msetValues^[[39m({ rotation^[[33m:^[[39m ^[[33mSTICKY^[[39m })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3273952Z     ^[[90m142|^[[39m     ^[[34mexpect^[[39m(^[[34mpublished^[[39m(handle^[[33m,^[[39m ^[[32m"rotation"^[[39m))^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135^[[39m^[[33m,^[[39m ^[[34m4^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3275014Z     ^[[90m   |^[[39m                                           ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3275591Z     ^[[90m143|^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3276311Z     ^[[90m144|^[[39m     // The revert goes back to what `setValues` wrote, not to what was…
quality (node 24)	Run npm test	2026-08-30T23:33:12.3276785Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3277172Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3277534Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3278936Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/domain/track-live-values.test.ts^[[2m > ^[[22ma live value masks the interpolated state, and nothing else^[[2m > ^[[22mPK-15 refuses the animated half by name, classifying every key before it writes
quality (node 24)	Run npm test	2026-08-30T23:33:12.3280142Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3280665Z ^[[31m^[[1mError^[[22m: Expected overlay key "rotation" to be refused.^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3281886Z ^[[36m ^[[2m❯^[[22m overlayRefusalFor packages/core/test/unit/domain/track-live-values.test.ts:^[[2m98:9^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3282810Z     ^[[90m 96|^[[39m     ^[[35mthrow^[[39m error^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3283343Z     ^[[90m 97|^[[39m   }
quality (node 24)	Run npm test	2026-08-30T23:33:12.3284613Z     ^[[90m 98|^[[39m   ^[[35mthrow^[[39m ^[[35mnew^[[39m ^[[33mError^[[39m(^[[32m`Expected overlay key "^[[39m^[[36m${^[[39mkey^[[36m}^[[39m^[[32m" to be refused.`^[[39m)^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3288769Z     ^[[90m   |^[[39m         ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3289307Z     ^[[90m 99|^[[39m }
quality (node 24)	Run npm test	2026-08-30T23:33:12.3290585Z     ^[[90m100|^[[39m /** Strips whole-line comments before a source assertion. A gate reads…
quality (node 24)	Run npm test	2026-08-30T23:33:12.3295003Z ^[[90m ^[[2m❯^[[22m packages/core/test/unit/domain/track-live-values.test.ts:^[[2m181:12^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3296755Z ^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m158 passed^[[39m^[[22m^[[90m (161)^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3298526Z ^[[2m      Tests ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m779 passed^[[39m^[[22m^[[90m (784)^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3298986Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3299319Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3299655Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3303879Z ^[[2m   Start at ^[[22m 23:32:59
quality (node 24)	Run npm test	2026-08-30T23:33:12.3305054Z ^[[2m   Duration ^[[22m 12.96s^[[2m (transform 1.87s, setup 838ms, import 6.69s, tests 9.78s, environment 17ms)^[[22m
quality (node 24)	Run npm test	2026-08-30T23:33:12.3305798Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3317330Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3337891Z ##[error]AssertionError: expected 45 to be close to 20, received difference is 25, but expected 5e-7
quality (node 24)	Run npm test	 ❯ packages/core/test/contract/gsap-patch-keys.test.ts:134:45
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T23:33:12.3346061Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3348483Z ##[error]AssertionError: expected 112.5 to be close to 90, received difference is 22.5, but expected 0.00005
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-value-animated.test.ts:103:43
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T23:33:12.3349618Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3350914Z ##[error]AssertionError: expected 112.5 to be close to 90, received difference is 22.5, but expected 0.00005
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-value-animated.test.ts:119:43
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T23:33:12.3351696Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3353135Z ##[error]AssertionError: expected 191.25 to be close to 135, received difference is 56.25, but expected 0.00005
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/runtime/live-value-animated.test.ts:142:43
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T23:33:12.3353958Z 
quality (node 24)	Run npm test	2026-08-30T23:33:12.3355364Z ##[error]Error: Expected overlay key "rotation" to be refused.
quality (node 24)	Run npm test	 ❯ overlayRefusalFor packages/core/test/unit/domain/track-live-values.test.ts:98:9
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/domain/track-live-values.test.ts:181:12
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-30T23:33:12.3862816Z ##[error]Process completed with exit code 1.
```
