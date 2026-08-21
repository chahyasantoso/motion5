# CI log archive: 32478322414

- Workflow: CI
- Conclusion: failure
- Head branch: feat/issue-173-plugin-owned-requirements
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32478322414
- Captured: 2026-08-21T11:41:32Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-21T11:41:12.1815931Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:12.1816133Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:12.1846771Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:12.1846920Z env:
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:12.1847028Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:12.1847143Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:12.2528293Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:12.2529072Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:12.2529431Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:12.2529551Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:14.3716701Z ##[error]packages/core/test/unit/domain/track.test.ts(75,7): error TS2741: Property 'requirements' is missing in type '{ plugins: readonly { name: string; compose: (values: Readonly<ImmutableRecord>, progress: number) => ImmutableRecord; }[]; diagnostics: readonly never[]; authoredKeyframes: Readonly<{}>; internalKeys: readonly never[]; outputSerializers: Readonly<...>; preparation: { ...; }; }' but required in type 'ResolvedPlugins'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:14.3725502Z ##[error]packages/core/test/unit/domain/track.test.ts(89,7): error TS2741: Property 'requirements' is missing in type '{ plugins: readonly { name: string; compose: (values: Readonly<ImmutableRecord>, progress: number) => ImmutableRecord; }[]; diagnostics: readonly never[]; authoredKeyframes: Readonly<{}>; internalKeys: readonly never[]; outputSerializers: Readonly<...>; preparation: { ...; }; }' but required in type 'ResolvedPlugins'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:41:14.4071694Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-21T11:41:10.9348510Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:10.9348927Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:10.9372517Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:10.9373050Z env:
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:10.9373400Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:10.9373720Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.0274728Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.0275529Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.0276336Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.0276627Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.2869335Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.2916106Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.2925980Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.7425449Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.7524607Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8432647Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8455785Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8485450Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8515931Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8541186Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8699187Z  ^[[31m❯^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 61^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8745515Z      ^[[32m✓^[[39m 1. Load valid walker project through Engine with plugin registry^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8769022Z      ^[[32m✓^[[39m 2. Render walker nodes through createDomPatchAdapter^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8794475Z      ^[[32m✓^[[39m 3. Demonstrate time playback using single injected browser clock^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8796048Z      ^[[32m✓^[[39m 4. Demonstrate progress through TriggerPort and manual signals^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8797373Z      ^[[32m✓^[[39m 5. Render multiple tracks from one Motion in one published batch^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8798853Z ^[[31m     ^[[31m×^[[31m 6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8800199Z      ^[[32m✓^[[39m 7. Mount, unmount, remount, and dispose without duplicate subscriptions^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8801435Z      ^[[32m✓^[[39m 8. Show blocked/pending/error diagnostics without crashing the app^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8802605Z      ^[[32m✓^[[39m 9. Use React usePatch hook at the React boundary^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.8805340Z      ^[[32m✓^[[39m 10. Automated end-to-end integration test passes clean^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.9821594Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:11.9896025Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 34^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.0944893Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.2175914Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.2326118Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.2885845Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.4264408Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.4609651Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.5172142Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.6481164Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.6754994Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.7328252Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 28^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.8614657Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.8999721Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:12.9349126Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.0379403Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.0681310Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.1192483Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.1984006Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.2684359Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.2963277Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.3966850Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.4316155Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.5030464Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.5810562Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.6235965Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.6645478Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.7581824Z  ^[[32m✓^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.8000339Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.8448830Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.9246237Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.9593683Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:13.9965342Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.0707687Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.1145810Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.1786966Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.2228091Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.2993737Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.3136805Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.4895015Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.5130589Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.5167439Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.6485831Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.6739870Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.7007158Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.7979261Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.8593520Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.8738403Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9110275Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9134268Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9135681Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9136102Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9138790Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9143828Z ^[[31m^[[1mAssertionError^[[22m: expected 35.35533905932737 to be close to 135.355, received difference is 99.99966094067261, but expected 0.005^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9145842Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/phase7-walker-demo.test.ts:^[[2m293:34^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9194255Z     ^[[90m291|^[[39m     // Thigh (parentRot=0, own rotation=45): worldRot=45, x = 0 + 50*c…
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9195589Z     ^[[90m292|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mx)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m35.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9197016Z     ^[[90m293|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39my)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m135.355^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9198058Z     ^[[90m   |^[[39m                                  ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9199372Z     ^[[90m294|^[[39m     ^[[34mexpect^[[39m(thighPatch^[[33m?.^[[39mvalues^[[33m.^[[39mrotation)^[[33m.^[[39m^[[34mtoBeCloseTo^[[39m(^[[34m45^[[39m^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9200370Z     ^[[90m295|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9200608Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9201013Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9201335Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9201354Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9208900Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m51 passed^[[39m^[[22m^[[90m (52)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9210035Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m204 passed^[[39m^[[22m^[[90m (205)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9210736Z ^[[2m   Start at ^[[22m 11:41:11
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9211658Z ^[[2m   Duration ^[[22m 3.60s^[[2m (transform 1.09s, setup 0ms, import 3.24s, tests 771ms, environment 5ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9212124Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9224697Z 
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9245543Z ##[error]AssertionError: expected 35.35533905932737 to be close to 135.355, received difference is 99.99966094067261, but expected 0.005
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/phase7-walker-demo.test.ts:293:34
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-21T11:41:14.9631837Z ##[error]Process completed with exit code 1.
```
