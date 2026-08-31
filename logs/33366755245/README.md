# CI log archive: 33366755245

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-33-motion-driver-edit
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33366755245
- Captured: 2026-08-31T07:04:47Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-31T07:04:26.5787318Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:26.5787511Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:26.5817767Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:26.5817914Z env:
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:26.5818023Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:26.5818138Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:26.6531132Z 
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:26.6531675Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:26.6532042Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:26.6532214Z 
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:28.8563823Z ##[error]packages/core/src/runtime/project-runtime.ts(677,5): error TS2739: Type 'Readonly<{ id: string; readonly live: boolean; readonly definition: MotionDefinition; readonly trackIds: readonly string[]; addTrack: (track: TrackDefinition) => TrackHandle; track: (trackId: string) => TrackHandle; tryTrack: (trackId: string) => TrackHandle | undefined; destroy: () => void; }>' is missing the following properties from type 'MotionHandle': setTrigger, setStagger
quality (node 24)	Run npm run typecheck	2026-08-31T07:04:28.8942874Z ##[error]Process completed with exit code 2.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-31T07:04:28.6773913Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:04:28.6774625Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:04:28.6813705Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:04:28.6813990Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:04:28.6814197Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:04:28.6814413Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:04:31.0584373Z ##[error]packages/core/src/runtime/project-runtime.ts(677,5): error TS2739: Type 'Readonly<{ id: string; readonly live: boolean; readonly definition: MotionDefinition; readonly trackIds: readonly string[]; addTrack: (track: TrackDefinition) => TrackHandle; track: (trackId: string) => TrackHandle; tryTrack: (trackId: string) => TrackHandle | undefined; destroy: () => void; }>' is missing the following properties from type 'MotionHandle': setTrigger, setStagger
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:04:31.0932517Z ##[error]Process completed with exit code 2.
```
