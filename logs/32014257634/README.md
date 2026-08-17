# CI log archive: 32014257634

- Workflow: CI
- Conclusion: failure
- Head branch: feat/trigger-drivers-t2
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32014257634
- Captured: 2026-08-17T09:15:46Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-17T09:15:25.9800897Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:25.9801248Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:25.9840252Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:25.9840525Z env:
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:25.9840729Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:25.9840948Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:26.0826105Z 
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:26.0827513Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:26.0828328Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:26.0828730Z 
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:28.8751625Z ##[error]packages/core/test/contract/trigger-factory.test.ts(28,86): error TS2322: Type '{ type: string; }' is not assignable to type 'TriggerDefinition | { readonly [key: string]: unknown; readonly type: "scroll" | "time" | "manual"; }'.
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:28.8763224Z   Types of property 'type' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:28.8764037Z     Type 'string' is not assignable to type '"scroll" | "time" | "manual"'.
quality (node 24)	Run npm run typecheck	2026-08-17T09:15:28.9120902Z ##[error]Process completed with exit code 2.
```
