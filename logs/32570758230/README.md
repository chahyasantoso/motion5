# CI log archive: 32570758230

- Workflow: CI
- Conclusion: failure
- Head branch: chore/w4-mutation-check-167
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32570758230
- Captured: 2026-08-22T11:37:33Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-22T11:37:06.6268534Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:06.6268915Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:06.6310795Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:06.6311272Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:06.6311502Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:06.6311732Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:06.7416564Z 
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:06.7417228Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:06.7417803Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:06.7418014Z 
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:09.9420368Z ##[error]apps/react-demo/src/main.tsx(3,37): error TS2307: Cannot find module '@motion5/core/testing' or its corresponding type declarations.
quality (node 24)	Run npm run typecheck	2026-08-22T11:37:09.9835719Z ##[error]Process completed with exit code 2.
boundaries (node 24)	Run npm run test:boundaries	﻿2026-08-22T11:37:10.2086531Z ##[group]Run npm run test:boundaries
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.2086920Z ^[[36;1mnpm run test:boundaries^[[0m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.2127024Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.2127338Z env:
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.2127561Z   NODE_VERSION: 24
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.2127795Z ##[endgroup]
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.3284865Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.3285992Z > motion5@0.0.0 test:boundaries
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.3287149Z > node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.3287837Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.3885481Z pps/react-demo/src/main.tsx: testing entrypoint import
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T11:37:10.4052958Z ##[error]Process completed with exit code 1.
```
