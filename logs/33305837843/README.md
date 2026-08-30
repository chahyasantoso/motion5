# CI log archive: 33305837843

- Workflow: CI
- Conclusion: failure
- Head branch: 220-dict-valued-requirement-slots
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33305837843
- Captured: 2026-08-30T10:11:15Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-30T10:10:53.7175623Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:53.7175965Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:53.7214720Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:53.7214990Z env:
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:53.7215406Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:53.7215620Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:53.8211715Z 
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:53.8212890Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:53.8213694Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:53.8214074Z 
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:57.3881143Z ##[error]packages/core/test/unit/domain/dict-valued-requirements.test.ts(76,76): error TS2353: Object literal may only specify known properties, and 'dict' does not exist in type 'PluginRequirement'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:57.3890191Z ##[error]packages/core/test/unit/domain/dict-valued-requirements.test.ts(89,64): error TS2353: Object literal may only specify known properties, and 'dict' does not exist in type 'PluginRequirement'.
quality (node 24)	Run npm run typecheck	2026-08-30T10:10:57.4354472Z ##[error]Process completed with exit code 2.
```
