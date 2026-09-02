# CI log archive: 33632288114

- Workflow: CI
- Conclusion: failure
- Head branch: fix/ra-79-immediate-verb-refusal
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33632288114
- Captured: 2026-09-02T12:52:05Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-09-02T12:51:40.3960348Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:40.3960858Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:40.4014146Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:40.4014788Z env:
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:40.4015125Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:40.4015485Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:40.5083768Z 
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:40.5084548Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:40.5085224Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:40.5085591Z 
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:44.4158907Z ##[error]packages/core/test/unit/runtime/immediate-verb-refusal.test.ts(355,88): error TS2339: Property 'tick' does not exist on type 'Patch'.
quality (node 24)	Run npm run typecheck	2026-09-02T12:51:44.4612056Z ##[error]Process completed with exit code 2.
```
