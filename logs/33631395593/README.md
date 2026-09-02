# CI log archive: 33631395593

- Workflow: CI
- Conclusion: failure
- Head branch: fix/ra-79-immediate-verb-refusal
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33631395593
- Captured: 2026-09-02T12:42:41Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-09-02T12:42:20.6839246Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:20.6839613Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:20.6878813Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:20.6879100Z env:
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:20.6879304Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:20.6879516Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:20.7915474Z 
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:20.7916448Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:20.7917338Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:20.7917590Z 
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:25.0333530Z ##[error]packages/core/test/unit/runtime/immediate-verb-refusal.test.ts(355,88): error TS2339: Property 'tick' does not exist on type 'Patch'.
quality (node 24)	Run npm run typecheck	2026-09-02T12:42:25.0770028Z ##[error]Process completed with exit code 2.
```
