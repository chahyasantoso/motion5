# CI log archive: 32612813851

- Workflow: CI
- Conclusion: failure
- Head branch: feat/lf-bare-authored-leaf
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32612813851
- Captured: 2026-08-23T02:25:46Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-23T02:25:25.0979886Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:25.0980245Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:25.1021018Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:25.1021525Z env:
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:25.1021738Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:25.1021964Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:25.2043470Z 
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:25.2044595Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:25.2045266Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:25.2045591Z 
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:28.7320074Z ##[error]packages/core/test/contract/validation-owner.test.ts(119,18): error TS2532: Object is possibly 'undefined'.
quality (node 24)	Run npm run typecheck	2026-08-23T02:25:28.7727439Z ##[error]Process completed with exit code 2.
```
