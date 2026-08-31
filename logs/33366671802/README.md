# CI log archive: 33366671802

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-33-motion-driver-edit
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33366671802
- Captured: 2026-08-31T07:03:32Z

## Failed job output

```text
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-31T07:03:11.6486947Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:03:11.6487393Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:03:11.6511051Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:03:11.6511339Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:03:11.6511543Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:03:11.6511753Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:03:13.9448527Z ##[error]packages/core/src/runtime/project-runtime.ts(677,5): error TS2739: Type 'Readonly<{ id: string; readonly live: boolean; readonly definition: MotionDefinition; readonly trackIds: readonly string[]; addTrack: (track: TrackDefinition) => TrackHandle; track: (trackId: string) => TrackHandle; tryTrack: (trackId: string) => TrackHandle | undefined; destroy: () => void; }>' is missing the following properties from type 'MotionHandle': setTrigger, setStagger
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-31T07:03:13.9689676Z ##[error]Process completed with exit code 2.
quality (node 24)	Run npm run typecheck	﻿2026-08-31T07:03:14.8210253Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:14.8210617Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:14.8251355Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:14.8251648Z env:
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:14.8251845Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:14.8252063Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:14.9289473Z 
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:14.9290250Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:14.9290909Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:14.9291228Z 
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:19.0506453Z ##[error]packages/core/src/runtime/project-runtime.ts(677,5): error TS2739: Type 'Readonly<{ id: string; readonly live: boolean; readonly definition: MotionDefinition; readonly trackIds: readonly string[]; addTrack: (track: TrackDefinition) => TrackHandle; track: (trackId: string) => TrackHandle; tryTrack: (trackId: string) => TrackHandle | undefined; destroy: () => void; }>' is missing the following properties from type 'MotionHandle': setTrigger, setStagger
quality (node 24)	Run npm run typecheck	2026-08-31T07:03:19.0971861Z ##[error]Process completed with exit code 2.
```
