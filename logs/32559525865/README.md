# CI log archive: 32559525865

- Workflow: CI
- Conclusion: failure
- Head branch: feat/observes-output-only
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32559525865
- Captured: 2026-08-22T07:25:32Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-22T07:25:11.3260984Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:11.3261511Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:11.3313377Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:11.3313805Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:11.3314127Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:11.3314467Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:11.4368043Z 
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:11.4368806Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:11.4369478Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:11.4369795Z 
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8662104Z ##[error]packages/core/test/integration/cross-motion.test.ts(50,68): error TS2345: Argument of type '(node: { id: string; }) => (requirementInputs: RequirementInputs) => { values: Readonly<{ parentWorld: {} | null; self: string; }>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to parameter of type 'ComposeResolver'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8672765Z   Type '(requirementInputs: RequirementInputs) => { values: Readonly<{ parentWorld: {} | null; self: string; }>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to type '(inputs: Readonly<Record<string, unknown>>, requirementInputs: Readonly<Record<string, Readonly<ImmutableRecord>>>) => PublisherComposition'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8674430Z     Types of parameters 'requirementInputs' and 'inputs' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8675249Z       Type 'Readonly<Record<string, unknown>>' is not assignable to type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8675897Z         'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8676384Z           Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8679557Z ##[error]packages/core/test/integration/cross-motion.test.ts(72,74): error TS2345: Argument of type '(node: { id: string; }) => (requirementInputs: RequirementInputs) => { values: Readonly<{ parentWorld: {} | null; self: string; }>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to parameter of type 'ComposeResolver'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8682565Z   Type '(requirementInputs: RequirementInputs) => { values: Readonly<{ parentWorld: {} | null; self: string; }>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to type '(inputs: Readonly<Record<string, unknown>>, requirementInputs: Readonly<Record<string, Readonly<ImmutableRecord>>>) => PublisherComposition'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8684040Z     Types of parameters 'requirementInputs' and 'inputs' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8684810Z       Type 'Readonly<Record<string, unknown>>' is not assignable to type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8685436Z         'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8685945Z           Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8688854Z ##[error]packages/core/test/integration/cross-motion.test.ts(78,72): error TS2345: Argument of type '(node: { id: string; }) => (requirementInputs: RequirementInputs) => { values: Readonly<{ parentWorld: {} | null; self: string; }>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to parameter of type 'ComposeResolver'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8691782Z   Type '(requirementInputs: RequirementInputs) => { values: Readonly<{ parentWorld: {} | null; self: string; }>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to type '(inputs: Readonly<Record<string, unknown>>, requirementInputs: Readonly<Record<string, Readonly<ImmutableRecord>>>) => PublisherComposition'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8693240Z     Types of parameters 'requirementInputs' and 'inputs' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8693991Z       Type 'Readonly<Record<string, unknown>>' is not assignable to type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8694620Z         'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8695123Z           Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8698058Z ##[error]packages/core/test/integration/cross-motion.test.ts(106,65): error TS2345: Argument of type '(node: { id: string; }) => (requirementInputs: RequirementInputs) => { values: Readonly<{ parentWorld: {} | null; self: string; }>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to parameter of type 'ComposeResolver'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8701434Z   Type '(requirementInputs: RequirementInputs) => { values: Readonly<{ parentWorld: {} | null; self: string; }>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to type '(inputs: Readonly<Record<string, unknown>>, requirementInputs: Readonly<Record<string, Readonly<ImmutableRecord>>>) => PublisherComposition'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8702843Z     Types of parameters 'requirementInputs' and 'inputs' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8703603Z       Type 'Readonly<Record<string, unknown>>' is not assignable to type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8704232Z         'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8704700Z           Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8706627Z ##[error]packages/core/test/integration/p2-runtime-smells.test.ts(65,22): error TS2345: Argument of type 'Readonly<Record<string, unknown>>' is not assignable to parameter of type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8708398Z   'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8708869Z     Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8710687Z ##[error]packages/core/test/integration/p2-runtime-smells.test.ts(77,22): error TS2345: Argument of type 'Readonly<Record<string, unknown>>' is not assignable to parameter of type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8712260Z   'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8712723Z     Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8714516Z ##[error]packages/core/test/integration/partial-seed-inputs.test.ts(66,36): error TS2345: Argument of type 'Readonly<Record<string, unknown>>' is not assignable to parameter of type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8715944Z   'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8716398Z     Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8718431Z ##[error]packages/core/test/integration/partial-seed-inputs.test.ts(67,37): error TS2345: Argument of type 'Readonly<Record<string, unknown>>' is not assignable to parameter of type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8719912Z   'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8720355Z     Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8722214Z ##[error]packages/core/test/integration/publisher-output-merge-consistency.test.ts(47,24): error TS2345: Argument of type 'Readonly<Record<string, unknown>>' is not assignable to parameter of type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8723718Z   'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8724172Z     Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8726007Z ##[error]packages/core/test/integration/publisher-output-merge-consistency.test.ts(76,29): error TS2345: Argument of type 'Readonly<Record<string, unknown>>' is not assignable to parameter of type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8727848Z   'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8728314Z     Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8730785Z ##[error]packages/core/test/integration/remount.test.ts(31,5): error TS2322: Type '(node: { id: string; }) => (inputs: RequirementInputs) => { values: { node: string; inputs: Readonly<Record<string, Readonly<ImmutableRecord>>>; }; sourceProgress: number; sourceRevisions: {}; }' is not assignable to type 'ComposeResolver'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8733869Z   Type '(inputs: RequirementInputs) => { values: { node: string; inputs: Readonly<Record<string, Readonly<ImmutableRecord>>>; }; sourceProgress: number; sourceRevisions: {}; }' is not assignable to type '(inputs: Readonly<Record<string, unknown>>, requirementInputs: Readonly<Record<string, Readonly<ImmutableRecord>>>) => PublisherComposition'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8735488Z     Types of parameters 'inputs' and 'inputs' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8736206Z       Type 'Readonly<Record<string, unknown>>' is not assignable to type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8736831Z         'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8737594Z           Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8738962Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(17,7): error TS2322: Type 'true' is not assignable to type 'false'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8740733Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(18,7): error TS2322: Type 'true' is not assignable to type 'false'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8742407Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(19,7): error TS2322: Type 'true' is not assignable to type 'false'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8744041Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(27,7): error TS2322: Type 'true' is not assignable to type 'false'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8745696Z ##[error]packages/core/test/unit/graph/single-input-channel.test.ts(31,7): error TS2322: Type 'true' is not assignable to type 'false'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8748551Z ##[error]packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts(60,31): error TS2345: Argument of type 'Readonly<Record<string, unknown>>' is not assignable to parameter of type 'Readonly<Record<string, Readonly<ImmutableRecord>>>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8750123Z   'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.8750586Z     Type 'unknown' is not assignable to type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:25:14.9058488Z ##[error]Process completed with exit code 2.
integration (node 24)	Run npm run test:integration	﻿2026-08-22T07:25:09.0817109Z ##[group]Run npm run test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.0817477Z ^[[36;1mnpm run test:integration^[[0m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.0844625Z shell: /usr/bin/bash -e {0}
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.0844941Z env:
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.0845165Z   NODE_VERSION: 24
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.0845380Z ##[endgroup]
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.1771810Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.1772502Z > motion5@0.0.0 test:integration
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.1773190Z > vitest run packages/core/test/integration
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.1773560Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.4649341Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.4653297Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.4654264Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.9205123Z  ^[[32m✓^[[39m packages/core/test/integration/engine-teardown-ownership.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.9349103Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time-loop.test.ts ^[[2m(^[[22m^[[2m11 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:09.9453546Z  ^[[32m✓^[[39m packages/core/test/integration/t4-runtime-motion-parity.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 33^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.1666717Z  ^[[32m✓^[[39m packages/core/test/integration/rollback-error-precedence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.1981717Z  ^[[32m✓^[[39m packages/core/test/integration/phase0-red-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.2285073Z ^[[90mstderr^[[2m | packages/core/test/integration/phase7-walker-demo.test.ts^[[2m > ^[[22m^[[2mPhase 7: Walker Demo Integration Suite^[[2m > ^[[22m^[[2m9. Use React usePatch hook at the React boundary
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.2287459Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.2312327Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.2321208Z The current testing environment is not configured to support act(...)
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.2325753Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.2336669Z  ^[[32m✓^[[39m packages/core/test/integration/phase7-walker-demo.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 57^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.4202725Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.4400535Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-owned-requirements.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 36^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.4475965Z  ^[[32m✓^[[39m packages/core/test/integration/phase4-dynamic-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.6265490Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.6755915Z  ^[[32m✓^[[39m packages/core/test/integration/replace-track-transactionality.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.7162681Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-time.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 30^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.8440773Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.9289829Z  ^[[32m✓^[[39m packages/core/test/integration/phase3-trigger-port.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:10.9393565Z  ^[[32m✓^[[39m packages/core/test/integration/trigger-scroll.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.0876272Z  ^[[32m✓^[[39m packages/core/test/integration/mutation-transactionality.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 37^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.1608746Z  ^[[32m✓^[[39m packages/core/test/integration/option-c-track-resolution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.1744052Z  ^[[32m✓^[[39m packages/core/test/integration/per-plugin-key-ownership.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.3026532Z  ^[[31m❯^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.3028793Z      ^[[32m✓^[[39m preserves the last known good values when a node publishes error^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.3030594Z ^[[31m     ^[[31m×^[[31m derives source revisions from the upstream patches consumed in the flush^[[39m^[[32m 12^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.3032206Z      ^[[32m✓^[[39m reports a pending reference instead of silently composing with an input hole^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.3033779Z      ^[[32m✓^[[39m chooses the blocked upstream deterministically by edge key, not authored edge order^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.3035288Z      ^[[32m✓^[[39m rejects host objects from interpolator state at the renderer edge^[[32m 3^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.3036693Z      ^[[32m✓^[[39m kills a timeline exactly once when a Track is disposed repeatedly^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.3971037Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-lifecycle.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.4016193Z  ^[[32m✓^[[39m packages/core/test/integration/phase2-motion-scheduling.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.5222687Z  ^[[31m❯^[[39m packages/core/test/integration/observation-identity.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.5224955Z      ^[[32m✓^[[39m covers source spelling across an add and its matching remove^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.5226106Z      ^[[32m✓^[[39m deduplicates equivalent observations and preserves no-op sequence^[[32m 2^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.5227151Z      ^[[32m✓^[[39m rejects an invalid free-track observation with stable diagnostics^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.5228149Z      ^[[32m✓^[[39m V-7 refuses an authored target through addObserve on either role^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.5229208Z ^[[31m     ^[[31m×^[[31m J-7 refuses an authored role or projection through addObserve^[[39m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.6228277Z  ^[[31m❯^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.6230751Z ^[[31m     ^[[31m×^[[31m keeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts^[[39m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.6232664Z      ^[[32m✓^[[39m publishes the same ready output regardless of mount order^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.6234582Z      ^[[32m✓^[[39m rejects an unknown cross-motion source at load instead of treating it as pending^[[32m 1^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.6309639Z  ^[[32m✓^[[39m packages/core/test/integration/issue-114-motion-track-regressions.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 29^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.7321272Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.8507345Z  ^[[32m✓^[[39m packages/core/test/integration/replace-motion-track.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.8642805Z  ^[[32m✓^[[39m packages/core/test/integration/unified-mutation-surface.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:11.9457449Z  ^[[32m✓^[[39m packages/core/test/integration/adopted-track-immutability.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.0736069Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 22^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.0802950Z  ^[[32m✓^[[39m packages/core/test/integration/internal-key-strip.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.1606258Z  ^[[31m❯^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.1608896Z ^[[31m     ^[[31m×^[[31m a same-flush requirement consumer sees the source's merged value^[[39m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.1626583Z ^[[31m     ^[[31m×^[[31m a later flush resolves the source's merged value via registry fallback^[[39m^[[32m 5^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.2952943Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.2987184Z  ^[[32m✓^[[39m packages/core/test/integration/keyframe-groups.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.3765941Z  ^[[32m✓^[[39m packages/core/test/integration/handle-adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.5029655Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.5216923Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.5596485Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.6929311Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.7403847Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.7514617Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.9057098Z  ^[[31m❯^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.9060445Z ^[[31m     ^[[31m×^[[31m uses the last published value for an unseeded requirement source^[[39m^[[32m 11^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.9231829Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:12.9855116Z  ^[[32m✓^[[39m packages/core/test/integration/single-input-channel.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 31^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.1057190Z  ^[[32m✓^[[39m packages/core/test/integration/adopt-destroy-readopt.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 15^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.1104074Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.3415198Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.3477166Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.3653511Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.5270604Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.5396484Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.5665587Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7387511Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7397716Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7457966Z  ^[[32m✓^[[39m packages/core/test/integration/runtime-motion-trigger-validation.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7486033Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7486910Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 6 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7487394Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7491668Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/cross-motion.test.ts^[[2m > ^[[22mP5-01 cross-motion references^[[2m > ^[[22mkeeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7496542Z ^[[31m^[[1mAssertionError^[[22m: expected { Object (parentWorld, self) } to match object { parentWorld: 'base/root', …(1) }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7497358Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7497750Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7498069Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7498232Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7498348Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7498654Z ^[[32m-   "parentWorld": "base/root",^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7499036Z ^[[31m+   "parentWorld": null,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7499370Z ^[[2m    "self": "arm/child",^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7499637Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7499853Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7500262Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/cross-motion.test.ts:^[[2m64:32^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7531442Z     ^[[90m 62|^[[39m     ^[[34mexpect^[[39m(readyPatch)^[[33m.^[[39m^[[34mtoBeDefined^[[39m()^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7532979Z     ^[[90m 63|^[[39m     ^[[34mexpect^[[39m(readyPatch^[[33m?.^[[39mstatus)^[[33m.^[[39m^[[34mtoBe^[[39m(^[[32m"ready"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7534946Z     ^[[90m 64|^[[39m     expect(readyPatch?.values).toMatchObject({ parentWorld: "base/root…
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7536080Z     ^[[90m   |^[[39m                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7537685Z     ^[[90m 65|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(readyPatch))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7539956Z     ^[[90m 66|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34misFrozen^[[39m(readyPatch^[[33m?.^[[39mvalues))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mtrue^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7541020Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7541509Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7541911Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7543451Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/observation-identity.test.ts^[[2m > ^[[22mobservation identity^[[2m > ^[[22mJ-7 refuses an authored role or projection through addObserve
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7545500Z ^[[31m^[[1mAssertionError^[[22m: expected [Function] to throw an error^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7546033Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7546266Z ^[[32m- Expected:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7546650Z null
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7546838Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7547060Z ^[[31m+ Received:^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7547408Z undefined
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7547609Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7548390Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/observation-identity.test.ts:^[[2m105:48^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7549747Z     ^[[90m103|^[[39m     ^[[35mconst^[[39m handle ^[[33m=^[[39m ^[[34mmakeHandle^[[39m(^[[34mproject^[[39m())^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7551058Z     ^[[90m104|^[[39m     ^[[35mconst^[[39m child ^[[33m=^[[39m handle^[[33m.^[[39m^[[34mtrack^[[39m(^[[32m"hero/child"^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7552490Z     ^[[90m105|^[[39m     expect(() => child.addObserve(ROLE_INPUT)).toThrow(/observation-ro…
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7553562Z     ^[[90m   |^[[39m                                                ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7554719Z     ^[[90m106|^[[39m     expect(() => child.addObserve(ROLE_OUTPUT)).toThrow(/observation-r…
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7555942Z     ^[[90m107|^[[39m     expect(() => child.addObserve(PROJECTED)).toThrow(/observation-pro…
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7556527Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7556985Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7557364Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7559459Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/p2-runtime-smells.test.ts^[[2m > ^[[22mP2 runtime smell hardening^[[2m > ^[[22mderives source revisions from the upstream patches consumed in the flush
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7561622Z ^[[31m^[[1mAssertionError^[[22m: expected {} to deeply equal { x: 1 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7562171Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7562429Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7562916Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7563165Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7563363Z ^[[32m- {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7564174Z ^[[32m-   "x": 1,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7564638Z ^[[32m- }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7565031Z ^[[31m+ {}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7565244Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7566068Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/p2-runtime-smells.test.ts:^[[2m71:46^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7569139Z     ^[[90m 69|^[[39m     publisher.flush(snapshot([source, consumer]), ["source", "consumer…
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7570522Z     ^[[90m 70|^[[39m     expect(registry.get("consumer")?.sourceRevisions).toEqual({ source…
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7572672Z     ^[[90m 71|^[[39m     ^[[34mexpect^[[39m(registry^[[33m.^[[39m^[[35mget^[[39m(^[[32m"consumer"^[[39m)^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ x^[[33m:^[[39m ^[[34m1^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7574542Z     ^[[90m   |^[[39m                                              ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7575348Z     ^[[90m 72|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7576408Z     ^[[90m 73|^[[39m   it("reports a pending reference instead of silently composing with a…
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7577193Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7580002Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7580814Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7582763Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/partial-seed-inputs.test.ts^[[2m > ^[[22mGraphPublisher partial-seed requirement inputs^[[2m > ^[[22muses the last published value for an unseeded requirement source
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7585575Z ^[[31m^[[1mAssertionError^[[22m: expected { total: +0 } to deeply equal { total: 7 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7586369Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7586757Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7587412Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7587794Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7588117Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7588700Z ^[[32m-   "total": 7,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7589310Z ^[[31m+   "total": 0,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7589823Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7590145Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7591056Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/partial-seed-inputs.test.ts:^[[2m78:75^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7592899Z     ^[[90m 76|^[[39m     ^[[35mconst^[[39m batch ^[[33m=^[[39m publisher^[[33m.^[[39m^[[34mflush^[[39m(graph^[[33m,^[[39m [^[[32m"source-a"^[[39m]^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7594275Z     ^[[90m 77|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7595237Z     ^[[90m 78|^[[39m     expect(batch.patches.find(({ nodeId }) => nodeId === "sink")?.valu…
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7596416Z     ^[[90m   |^[[39m                                                                           ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7597278Z     ^[[90m 79|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7598047Z     ^[[90m 80|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7598423Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7598596Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7599084Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7599528Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7601596Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/publisher-output-merge-consistency.test.ts^[[2m > ^[[22mGraphPublisher: memo/registry consistency (recovery A1)^[[2m > ^[[22ma same-flush requirement consumer sees the source's merged value
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7604160Z ^[[31m^[[1mAssertionError^[[22m: expected {} to deeply equal { base: 1, overlay: 99 }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7605813Z ^[[2m Test Files ^[[22m ^[[1m^[[31m5 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m49 passed^[[39m^[[22m^[[90m (54)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7606548Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7607291Z ^[[2m      Tests ^[[22m ^[[1m^[[31m6 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m206 passed^[[39m^[[22m^[[90m (212)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7608302Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7609113Z ^[[2m   Start at ^[[22m 07:25:09
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7609984Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7611010Z ^[[2m   Duration ^[[22m 4.27s^[[2m (transform 1.15s, setup 0ms, import 3.56s, tests 1.04s, environment 7ms)^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7611861Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7611878Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7612281Z ^[[32m- {^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7612844Z ^[[32m-   "base": 1,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7613466Z ^[[32m-   "overlay": 99,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7614226Z ^[[32m- }^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7614746Z ^[[31m+ {}^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7615056Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7615694Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/publisher-output-merge-consistency.test.ts:^[[2m59:37^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7616322Z     ^[[90m 57|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7617188Z     ^[[90m 58|^[[39m     ^[[34mexpect^[[39m(sourceAPatch^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ base^[[33m:^[[39m ^[[34m1^[[39m^[[33m,^[[39m overlay^[[33m:^[[39m ^[[34m99^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7618420Z     ^[[90m 59|^[[39m     ^[[34mexpect^[[39m(downstreamPatch^[[33m?.^[[39mvalues)^[[33m.^[[39m^[[34mtoEqual^[[39m({ base^[[33m:^[[39m ^[[34m1^[[39m^[[33m,^[[39m overlay^[[33m:^[[39m ^[[34m99^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7619760Z     ^[[90m   |^[[39m                                     ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7620500Z     ^[[90m 60|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7621136Z     ^[[90m 61|^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7621481Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7622009Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7622490Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7624868Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/integration/publisher-output-merge-consistency.test.ts^[[2m > ^[[22mGraphPublisher: memo/registry consistency (recovery A1)^[[2m > ^[[22ma later flush resolves the source's merged value via registry fallback
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7627248Z ^[[31m^[[1mAssertionError^[[22m: expected { callCount: 2 } to match object { base: 1, overlay: 99 }
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7628367Z (1 matching property omitted from actual)^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7628845Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7629203Z ^[[32m- Expected^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7629761Z ^[[31m+ Received^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7630111Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7630417Z ^[[2m  {^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7630976Z ^[[32m-   "base": 1,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7631566Z ^[[32m-   "overlay": 99,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7632182Z ^[[31m+   "callCount": 2,^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7632741Z ^[[2m  }^[[22m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7633071Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7634245Z ^[[36m ^[[2m❯^[[22m packages/core/test/integration/publisher-output-merge-consistency.test.ts:^[[2m88:38^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7636391Z     ^[[90m 86|^[[39m     ^[[35mconst^[[39m batch2 ^[[33m=^[[39m publisher^[[33m.^[[39m^[[34mflush^[[39m(^[[34msnapshot^[[39m(nodes)^[[33m,^[[39m [^[[32m"downstream"^[[39m]^[[33m,^[[39m ^[[34m2^[[39m)^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7637307Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7667458Z ##[error]AssertionError: expected { Object (parentWorld, self) } to match object { parentWorld: 'base/root', …(1) }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "parentWorld": "base/root",
integration (node 24)	Run npm run test:integration	+   "parentWorld": null,
integration (node 24)	Run npm run test:integration	    "self": "arm/child",
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/cross-motion.test.ts:64:32
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7680295Z     ^[[90m 87|^[[39m     const downstreamPatch2 = batch2.patches.find((p) => p.nodeId === "…
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7680916Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7683816Z ##[error]AssertionError: expected [Function] to throw an error
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected:
integration (node 24)	Run npm run test:integration	null
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	+ Received:
integration (node 24)	Run npm run test:integration	undefined
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/observation-identity.test.ts:105:48
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7685598Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7687852Z ##[error]AssertionError: expected {} to deeply equal { x: 1 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- {
integration (node 24)	Run npm run test:integration	-   "x": 1,
integration (node 24)	Run npm run test:integration	- }
integration (node 24)	Run npm run test:integration	+ {}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/p2-runtime-smells.test.ts:71:46
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7689564Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7691707Z ##[error]AssertionError: expected { total: +0 } to deeply equal { total: 7 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "total": 7,
integration (node 24)	Run npm run test:integration	+   "total": 0,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/partial-seed-inputs.test.ts:78:75
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7693621Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7697297Z ##[error]AssertionError: expected {} to deeply equal { base: 1, overlay: 99 }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- {
integration (node 24)	Run npm run test:integration	-   "base": 1,
integration (node 24)	Run npm run test:integration	-   "overlay": 99,
integration (node 24)	Run npm run test:integration	- }
integration (node 24)	Run npm run test:integration	+ {}
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/publisher-output-merge-consistency.test.ts:59:37
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7699484Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7703290Z ##[error]AssertionError: expected { callCount: 2 } to match object { base: 1, overlay: 99 }
integration (node 24)	Run npm run test:integration	(1 matching property omitted from actual)
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	- Expected
integration (node 24)	Run npm run test:integration	+ Received
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	  {
integration (node 24)	Run npm run test:integration	-   "base": 1,
integration (node 24)	Run npm run test:integration	-   "overlay": 99,
integration (node 24)	Run npm run test:integration	+   "callCount": 2,
integration (node 24)	Run npm run test:integration	  }
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	 ❯ packages/core/test/integration/publisher-output-merge-consistency.test.ts:88:38
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7706714Z     ^[[90m 88|^[[39m     expect(downstreamPatch2?.values).toMatchObject({ base: 1, overlay:…
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7707681Z     ^[[90m   |^[[39m                                      ^[[31m^^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7708258Z     ^[[90m 89|^[[39m   })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7708791Z     ^[[90m 90|^[[39m })^[[33m;^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7709054Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7709481Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯^[[22m^[[39m
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7709855Z 
integration (node 24)	Run npm run test:integration	2026-08-22T07:25:13.7921505Z ##[error]Process completed with exit code 1.
```
