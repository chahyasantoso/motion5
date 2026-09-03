# CI log archive: 33708074664

- Workflow: CI
- Conclusion: failure
- Head branch: fix/ra-98-removal-seeds-dependents
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33708074664
- Captured: 2026-09-03T02:33:57Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-09-03T02:33:34.5484956Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:34.5485495Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:34.5537716Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:34.5538399Z env:
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:34.5538725Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:34.5539076Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:34.6569527Z 
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:34.6570256Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:34.6571010Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:34.6571449Z 
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:38.6155394Z ##[error]packages/core/test/unit/runtime/removal-flush-seed.test.ts(139,31): error TS2367: This comparison appears to be unintentional because the types '"hero/lower"' and '"hero/rig"' have no overlap.
quality (node 24)	Run npm run typecheck	2026-09-03T02:33:38.6581437Z ##[error]Process completed with exit code 2.
```
