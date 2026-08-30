# CI log archive: 33305383668

- Workflow: manual
- Conclusion: manual
- Head branch: manual
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33305383668
- Captured: 2026-08-30T10:41:27Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-30T10:00:13.4484487Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:13.4484834Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:13.4526766Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:13.4527247Z env:
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:13.4527474Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:13.4527698Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:13.5612504Z 
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:13.5613022Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:13.5613657Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:13.5613986Z 
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:16.9591853Z ##[error]packages/core/test/unit/domain/dict-valued-requirements.test.ts(76,76): error TS2353: Object literal may only specify known properties, and 'dict' does not exist in type 'PluginRequirement'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:16.9602145Z ##[error]packages/core/test/unit/domain/dict-valued-requirements.test.ts(89,64): error TS2353: Object literal may only specify known properties, and 'dict' does not exist in type 'PluginRequirement'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:00:17.0084297Z ##[error]Process completed with exit code 2.
```
