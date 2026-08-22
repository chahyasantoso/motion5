# CI log archive: 32560850035

- Workflow: CI
- Conclusion: failure
- Head branch: feat/observes-output-only
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32560850035
- Captured: 2026-08-22T07:54:49Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-22T07:54:24.2532897Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:24.2533234Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:24.2581779Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:24.2582071Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:24.2582530Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:24.2582754Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:24.3660363Z 
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:24.3661084Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:24.3661609Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:24.3661819Z 
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:27.4353237Z ##[error]packages/core/src/engine.ts(388,79): error TS2554: Expected 0-1 arguments, but got 2.
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:27.4366323Z ##[error]packages/core/src/engine.ts(398,9): error TS2322: Type '(node: { id: string; track: { duration?: number; keyframes?: Readonly<Record<string, unknown>>; }; }) => (inputs: Readonly<Record<string, unknown>>, requirementInputs: RequirementInputs) => { values: Readonly<ImmutableRecord>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to type 'ComposeResolver'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:27.4371401Z   Type '(inputs: Readonly<Record<string, unknown>>, requirementInputs: RequirementInputs) => { values: Readonly<ImmutableRecord>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to type '(requirementInputs: Readonly<Record<string, Readonly<ImmutableRecord>>>) => PublisherComposition'.
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:27.4373595Z     Target signature provides too few arguments. Expected 2 or more, but got 1.
quality (node 24)	Run npm run typecheck	2026-08-22T07:54:27.4787392Z ##[error]Process completed with exit code 2.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	﻿2026-08-22T07:54:26.4966645Z ##[group]Run npx tsc -p packages/core/tsconfig.build.json
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-22T07:54:26.4967152Z ^[[36;1mnpx tsc -p packages/core/tsconfig.build.json^[[0m
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-22T07:54:26.5005855Z shell: /usr/bin/bash -e {0}
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-22T07:54:26.5006486Z env:
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-22T07:54:26.5006698Z   NODE_VERSION: 24
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-22T07:54:26.5006911Z ##[endgroup]
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-22T07:54:28.7881805Z ##[error]packages/core/src/engine.ts(388,79): error TS2554: Expected 0-1 arguments, but got 2.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-22T07:54:28.7895867Z ##[error]packages/core/src/engine.ts(398,9): error TS2322: Type '(node: { id: string; track: { duration?: number; keyframes?: Readonly<Record<string, unknown>>; }; }) => (inputs: Readonly<Record<string, unknown>>, requirementInputs: RequirementInputs) => { values: Readonly<ImmutableRecord>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to type 'ComposeResolver'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-22T07:54:28.7899925Z   Type '(inputs: Readonly<Record<string, unknown>>, requirementInputs: RequirementInputs) => { values: Readonly<ImmutableRecord>; sourceProgress: number; sourceRevisions: {}; }' is not assignable to type '(requirementInputs: Readonly<Record<string, Readonly<ImmutableRecord>>>) => PublisherComposition'.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-22T07:54:28.7901415Z     Target signature provides too few arguments. Expected 2 or more, but got 1.
build (node 24)	Run npx tsc -p packages/core/tsconfig.build.json	2026-08-22T07:54:28.8297359Z ##[error]Process completed with exit code 2.
```
