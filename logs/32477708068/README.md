# CI log archive: 32477708068

- Workflow: CI
- Conclusion: failure
- Head branch: feat/issue-173-plugin-owned-requirements
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32477708068
- Captured: 2026-08-21T11:33:34Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-21T11:33:13.3973919Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:13.3974305Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:13.4013806Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:13.4014336Z env:
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:13.4014566Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:13.4014804Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:13.5036898Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:13.5037721Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:13.5038833Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:13.5039217Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:17.0635845Z ##[error]packages/core/test/integration/per-plugin-key-ownership.test.ts(85,31): error TS2554: Expected 3 arguments, but got 2.
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:17.0660408Z ##[error]packages/core/test/unit/domain/track.test.ts(75,7): error TS2741: Property 'requirements' is missing in type '{ plugins: readonly { name: string; compose: (values: Readonly<ImmutableRecord>, progress: number) => ImmutableRecord; }[]; diagnostics: readonly never[]; authoredKeyframes: Readonly<{}>; internalKeys: readonly never[]; outputSerializers: Readonly<...>; preparation: { ...; }; }' but required in type 'ResolvedPlugins'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:17.0670241Z ##[error]packages/core/test/unit/domain/track.test.ts(89,7): error TS2741: Property 'requirements' is missing in type '{ plugins: readonly { name: string; compose: (values: Readonly<ImmutableRecord>, progress: number) => ImmutableRecord; }[]; diagnostics: readonly never[]; authoredKeyframes: Readonly<{}>; internalKeys: readonly never[]; outputSerializers: Readonly<...>; preparation: { ...; }; }' but required in type 'ResolvedPlugins'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:33:17.1070024Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-21T11:33:14.7648367Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:14.7648701Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:14.7682164Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:14.7682403Z env:
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:14.7682587Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:14.7682770Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:14.8487288Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:14.8488082Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:14.8488655Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:14.8488935Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.0862919Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.0865584Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.0866214Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.4775747Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.4887067Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5717533Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5719546Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5720713Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5722543Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5723321Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5839559Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5878065Z      ^[[32m✓^[[39m 1. Load valid walker project through Engine with plugin registry^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5908580Z      ^[[32m✓^[[39m 2. Render walker nodes through createDomPatchAdapter^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5914851Z      ^[[32m✓^[[39m 3. Demonstrate time playback using single injected browser clock^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5928055Z      ^[[32m✓^[[39m 4. Demonstrate progress through TriggerPort and manual signals^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5929426Z      ^[[32m✓^[[39m 5. Render multiple tracks from one Motion in one published batch^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5930965Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5932455Z      ^[[32m✓^[[39m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5935207Z      ^[[32m✓^[[39m 8. Show blocked/pending/error diagnostics without crashing the app^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5936907Z      ^[[32m✓^[[39m 9. Use React usePatch hook at the React boundary^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.5938132Z      ^[[32m✓^[[39m 10. Automated end-to-end integration test passes clean^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.6774658Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.6994399Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.7593211Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.9133295Z  ^[[31m❯^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m4 failed^[[39m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.9134783Z ^[[31m     ^[[31m×^[[31m Q-7 derives the input edge from the binding and composes world space from it^[[39m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.9135561Z      ^[[32m✓^[[39m Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.9137249Z ^[[31m     ^[[31m×^[[31m Q-9 refuses a binding whose source is not a node in the graph^[[39m^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.9138230Z ^[[31m     ^[[31m×^[[31m Q-10 treats two slots bound to one source as two edges rather than a duplicate^[[39m^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.9139027Z ^[[31m     ^[[31m×^[[31m Q-11 keeps an upstream value out of the observer's authored value namespace^[[39m^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.9139693Z      ^[[32m✓^[[39m Q-12 refuses a binding to a slot the plugin never declared, at load^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.9161216Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:15.9532847Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.0885825Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.1268822Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.1896425Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.2803696Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.3143913Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.3761294Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 26^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.4809384Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.5187009Z  ^[[31m❯^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.5188635Z ^[[31m     ^[[31m×^[[31m N-7 claims the natural bone key names and composes world space from them^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.5193378Z ^[[31m     ^[[31m×^[[31m N-8 composes a rig from two plugins that both claim rotation^[[39m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.5194428Z      ^[[32m✓^[[39m N-9 refuses the flat spelling of a key both plugins claim^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.5195575Z      ^[[32m✓^[[39m N-10 publishes grouped leaves under their unprefixed names^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.5570844Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.6643803Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.7021489Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.7411584Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.8535846Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.8672156Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:16.9140679Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.0463972Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.0540184Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.0963088Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.2359415Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.2553851Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.2596893Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.4111724Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.4154192Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.4552540Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.5938600Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.5980979Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.6231879Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.7434910Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.7711619Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.8179445Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.8877179Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.9556103Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:17.9714095Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.1684256Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.1759693Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.2011134Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.3168862Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.3459843Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.3875122Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.4841597Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.5223348Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.5655212Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6037958Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6062004Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6062638Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 7 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6062957Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6065550Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-7 claims the natural bone key names and composes world space from them
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6069147Z ^[[31m^[[1mTypeError^[[22m: Cannot read properties of undefined (reading 'base')^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6070146Z ^[[36m ^[[2m❯^[[22m Object.compose packages/core/src/plugins/fk.ts:^[[2m75:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6094645Z     ^[[90m 73|^[[39m   outputs^[[33m:^[[39m [^[[32m"x"^[[39m^[[33m,^[[39m ^[[32m"y"^[[39m^[[33m,^[[39m ^[[32m"rotation"^[[39m]^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6095505Z     ^[[90m 74|^[[39m   compose^[[33m:^[[39m (values^[[33m,^[[39m progress^[[33m,^[[39m inputs) ^[[33m=>^[[39m {
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6096398Z     ^[[90m 75|^[[39m     ^[[35mconst^[[39m base ^[[33m=^[[39m ^[[34mreadBase^[[39m(inputs^[[33m.^[[39mbase)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6097220Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6098006Z     ^[[90m 76|^[[39m     ^[[35mconst^[[39m length ^[[33m=^[[39m ^[[34mreadNumber^[[39m(values^[[33m.^[[39mlength)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6098996Z     ^[[90m 77|^[[39m     ^[[35mconst^[[39m localRotation ^[[33m=^[[39m ^[[34mreadNumber^[[39m(values^[[33m.^[[39mrotation)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6100023Z ^[[90m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m85:31^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6100340Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6100639Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6100848Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6101610Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/per-plugin-key-ownership.test.ts^[[2m > ^[[22mper-plugin keyframe key ownership^[[2m > ^[[22mN-8 composes a rig from two plugins that both claim rotation
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6103226Z ^[[31m^[[1mAssertionError^[[22m: expected 35.35533905932737 to be close to 135.355, received difference is 99.99966094067261, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6104494Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/per-plugin-key-ownership.test.ts:^[[2m104:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6110098Z     ^[[90m102|^[[39m     ^[[90m// and then hold still.^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6111390Z     ^[[90m103|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6113069Z     ^[[90m104|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6114180Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6115460Z     ^[[90m105|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6116801Z     ^[[90m106|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6117290Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6117912Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6118555Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6120083Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6122150Z ^[[31m^[[1mAssertionError^[[22m: expected 35.35533905932737 to be close to 135.355, received difference is 99.99966094067261, but expected 0.005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6123530Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m293:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6137249Z     ^[[90m291|^[[39m     // Thigh (parentRot=0, own rotation=45): worldRot=45, x = 0 + 50*c…
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6138614Z     ^[[90m292|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6139947Z     ^[[90m293|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6140752Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6141658Z     ^[[90m294|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6142318Z     ^[[90m295|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6142455Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6142710Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6142939Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6144119Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-7 derives the input edge from the binding and composes world space from it
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6145838Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6147149Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m108:29^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6151002Z     ^[[90m106|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"walk/pelvis"^[[39m^[[33m,^[[39m ^[[34m0^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6152020Z     ^[[90m107|^[[39m     const thigh = batch.patches.find(({ nodeId }) => nodeId === "walk/…
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6153262Z     ^[[90m108|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6154033Z     ^[[90m   |^[[39m                             ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6154727Z     ^[[90m109|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m3^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6156220Z     ^[[90m110|^[[39m     ^[[34mexpect^[[39m(thigh^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6156835Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6157143Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6157491Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6158737Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-9 refuses a binding whose source is not a node in the graph
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6160023Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw an error^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6160383Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6160533Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6160762Z null
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6160910Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6161067Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6161334Z undefined
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6161471Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6161961Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m139:54^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6162403Z     ^[[90m137|^[[39m       }^[[33m,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6162667Z     ^[[90m138|^[[39m     }^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6163062Z     ^[[90m139|^[[39m     expect(() => load(rig(dangling), rigRegistry())).toThrow(/observat…
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6163498Z     ^[[90m   |^[[39m                                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6163810Z     ^[[90m140|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6164033Z     ^[[90m141|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6164137Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6164317Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6164481Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6165430Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-10 treats two slots bound to one source as two edges rather than a duplicate
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6167560Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be 'ready' // Object.is equality^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6167994Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6168163Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6168463Z "ready"
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6168602Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6168754Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6169012Z undefined
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6169169Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6169779Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m161:27^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6171015Z     ^[[90m159|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mseek^[[39m(^[[32m"walk/pelvis"^[[39m^[[33m,^[[39m ^[[34m1^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6171978Z     ^[[90m160|^[[39m     const patch = batch.patches.find(({ nodeId }) => nodeId === "walk/…
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6172889Z     ^[[90m161|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6173614Z     ^[[90m   |^[[39m                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6174487Z     ^[[90m162|^[[39m     ^[[34mexpect^[[39m(patch^[[33m?.^[[39mvalues^[[33m.^[[39mspan)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m400^[[39m^[[33m,^[[39m ^[[34m12^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6175073Z     ^[[90m163|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6175272Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6175464Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6175624Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6176428Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/plugin-owned-requirements.test.ts^[[2m > ^[[22mplugin-owned requirements end to end^[[2m > ^[[22mQ-11 keeps an upstream value out of the observer's authored value namespace
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6177700Z ^[[31m^[[1mAssertionError^[[22m: expected undefined to be close to 75, received difference is NaN, but expected 5e-13^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6178417Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/plugin-owned-requirements.test.ts:^[[2m190:55^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6179004Z     ^[[90m188|^[[39m     // Parent 30 plus local 45. This number is the separation proof: a…
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6179509Z     ^[[90m189|^[[39m     // replaced the bone's authored 45 with the upstream 30 and compos…
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6179990Z     ^[[90m190|^[[39m     expect(handle.get("walk/thigh")?.values.rotation).toBeCloseTo(75, …
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6180423Z     ^[[90m   |^[[39m                                                       ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6181088Z     ^[[90m191|^[[39m     handle^[[33m.^[[39m^[[34mdispose^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6181574Z     ^[[90m192|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6181777Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6182061Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6182300Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6182334Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6182884Z ^[[2m Test Files ^[[22m ^[[1m^[[31m3 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m49 passed^[[39m^[[22m^[[90m (52)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6183889Z ^[[2m      Tests ^[[22m ^[[1m^[[31m7 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m198 passed^[[39m^[[22m^[[90m (205)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6184512Z ^[[2m   Start at ^[[22m 11:33:15
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6185309Z ^[[2m   Duration ^[[22m 3.50s^[[2m (transform 964ms, setup 0ms, import 2.94s, tests 773ms, environment 5ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6185760Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6185775Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6204989Z ##[error]TypeError: Cannot read properties of undefined (reading 'base')
integration (node 24)	Run npm run test:integration	 ❯ Object.compose packages/core/src/plugins/fk.ts:75:34
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:85:31
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6211673Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6213552Z ##[error]AssertionError: expected 35.35533905932737 to be close to 135.355, received difference is 99.99966094067261, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/per-plugin-key-ownership.test.ts:104:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6214523Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6215878Z ##[error]AssertionError: expected 35.35533905932737 to be close to 135.355, received difference is 99.99966094067261, but expected 0.005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:293:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6217237Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6218752Z ##[error]AssertionError: expected undefined to be close to 35.355, received difference is NaN, but expected 0.0005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:108:29
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6219749Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6221017Z ##[error]AssertionError: expected [Function] to throw an error
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	null
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:139:54
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6222048Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6223829Z ##[error]AssertionError: expected undefined to be 'ready' // Object.is equality
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	"ready"
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:161:27
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6225201Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6227299Z ##[error]AssertionError: expected undefined to be close to 75, received difference is NaN, but expected 5e-13
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/plugin-owned-requirements.test.ts:190:55
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:33:18.6633067Z ##[error]Process completed with exit code 1.
```
