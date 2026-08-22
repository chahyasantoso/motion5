# CI log archive: 32570446626

- Workflow: CI
- Conclusion: failure
- Head branch: feat/core-testing-entrypoint
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32570446626
- Captured: 2026-08-22T11:30:44Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-22T11:30:18.4694702Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:18.4695075Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:18.4715541Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:18.4715850Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:18.4716249Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:18.4716521Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:18.6376869Z 
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:18.6377358Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:18.6377865Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:18.6378057Z 
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:20.7748514Z ##[error]packages/core/test/unit/scripts/boundary-scan.test.ts(12,3): error TS2305: Module '"../../../../../scripts/boundary-scan.mjs"' has no exported member 'importsTestingEntrypoint'.
quality (node 24)	Run npm run typecheck	2026-08-22T11:30:20.7949714Z ##[error]Process completed with exit code 2.
```
