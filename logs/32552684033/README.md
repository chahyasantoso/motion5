# CI log archive: 32552684033

- Workflow: CI
- Conclusion: failure
- Head branch: refactor/issue-181-requirement-edge
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32552684033
- Captured: 2026-08-22T04:49:20Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-22T04:48:59.3797796Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-22T04:48:59.3798175Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-22T04:48:59.3835134Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-22T04:48:59.3835409Z env:
quality (node 24)	Run npm run format:check	2026-08-22T04:48:59.3835608Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-22T04:48:59.3836158Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-22T04:48:59.4823381Z 
quality (node 24)	Run npm run format:check	2026-08-22T04:48:59.4824144Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-22T04:48:59.4824798Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-22T04:48:59.4825074Z 
quality (node 24)	Run npm run format:check	2026-08-22T04:48:59.5714306Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-22T04:49:02.9052806Z [^[[33mwarn^[[39m] packages/core/src/graph/ir.ts
quality (node 24)	Run npm run format:check	2026-08-22T04:49:04.5697818Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-22T04:49:04.6141417Z ##[error]Process completed with exit code 1.
```
