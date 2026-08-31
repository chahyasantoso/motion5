# CI log archive: 33359538136

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-27-handle-base
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33359538136
- Captured: 2026-08-31T05:10:39Z

## Failed job output

```text
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-31T05:10:08.7584727Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T05:10:08.7585481Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T05:10:08.7631927Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T05:10:08.7632262Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T05:10:08.7632472Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T05:10:08.7632686Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T05:10:11.1227357Z ##[error]packages/core/src/runtime/project-runtime.ts(432,57): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T05:10:11.1244327Z ##[error]packages/core/src/runtime/project-runtime.ts(535,5): error TS2739: Type 'Readonly<{ id: string; readonly live: boolean; readonly track: TrackDefinition; remove: () => void; replace: (next: TrackDefinition) => void; addObserve: (observation: ObservationDefinition) => void; removeObserve: (observation: ObservationDefinition) => void; overrideValues: (next: Readonly<...>) => PatchBatch; set...' is missing the following properties from type 'TrackHandle': requires, definition
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T05:10:11.1592179Z ##[error]Process completed with exit code 2.
quality (node 24)	Run npm run typecheck	﻿2026-08-31T05:10:08.7525172Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:08.7525531Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:08.7564920Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:08.7565201Z env:
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:08.7565405Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:08.7565622Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:08.8614258Z 
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:08.8614905Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:08.8615385Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:08.8615609Z 
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6114006Z ##[error]packages/core/src/runtime/project-runtime.ts(432,57): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6125764Z ##[error]packages/core/src/runtime/project-runtime.ts(535,5): error TS2739: Type 'Readonly<{ id: string; readonly live: boolean; readonly track: TrackDefinition; remove: () => void; replace: (next: TrackDefinition) => void; addObserve: (observation: ObservationDefinition) => void; removeObserve: (observation: ObservationDefinition) => void; overrideValues: (next: Readonly<...>) => PatchBatch; set...' is missing the following properties from type 'TrackHandle': requires, definition
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6129695Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(102,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6131819Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(117,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6133757Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(131,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6135666Z ##[error]packages/core/test/integration/replace-track-transactionality.test.ts(147,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6137531Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(41,21): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6139709Z ##[error]packages/core/test/integration/unified-mutation-surface.test.ts(42,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6141688Z ##[error]packages/core/test/unit/runtime/live-value-animated.test.ts(90,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6143529Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(117,17): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6145319Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(181,18): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6147118Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(182,18): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6149149Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(209,16): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6151017Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(267,24): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6152807Z ##[error]packages/core/test/unit/runtime/live-value-updates.test.ts(277,16): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6154543Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(145,42): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6156280Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(162,34): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6157983Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(216,19): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6160564Z ##[error]packages/core/test/unit/runtime/stale-track-handle.test.ts(219,19): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6164154Z ##[error]packages/core/test/unit/runtime/structural-commit-path.test.ts(109,46): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6167157Z ##[error]packages/core/test/unit/runtime/structural-commit-path.test.ts(243,36): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6169957Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(107,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6171775Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(126,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6173574Z ##[error]packages/core/test/unit/runtime/track-staging.test.ts(142,35): error TS2339: Property 'track' does not exist on type 'TrackHandle'.
quality (node 24)	Run npm run typecheck	2026-08-31T05:10:12.6576618Z ##[error]Process completed with exit code 2.
```
