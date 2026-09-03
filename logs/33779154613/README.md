# CI log archive: 33779154613

- Workflow: CI
- Conclusion: failure
- Head branch: chore/262-one-spelling-for-dependants
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33779154613
- Captured: 2026-09-03T16:32:21Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-09-03T16:31:55.8119578Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:55.8120038Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:55.8158758Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:55.8159077Z env:
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:55.8159286Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:55.8159498Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:55.9325056Z 
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:55.9326599Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:55.9327855Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-09-03T16:31:55.9328608Z 
quality (node 24)	Run npm run typecheck	2026-09-03T16:32:00.5340070Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(72,25): error TS2339: Property 'dependents' does not exist on type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-09-03T16:32:00.5352922Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(114,23): error TS2339: Property 'dependents' does not exist on type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-09-03T16:32:00.5357324Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(122,5): error TS2561: Object literal may only specify known properties, but 'dependents' does not exist in type 'PublisherSnapshot'. Did you mean to write 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:32:00.5361986Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(130,38): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:32:00.5365782Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(135,30): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:32:00.5369513Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(148,74): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:32:00.5373037Z ##[error]packages/core/test/unit/graph/graph-dependents.test.ts(149,59): error TS2551: Property 'dependents' does not exist on type 'GraphIR'. Did you mean 'dependants'?
quality (node 24)	Run npm run typecheck	2026-09-03T16:32:00.5807629Z ##[error]Process completed with exit code 2.
```
