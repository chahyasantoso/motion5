# CI log archive: 33233755190

- Workflow: CI
- Conclusion: failure
- Head branch: feat/pv-offset-aware-ik
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33233755190
- Captured: 2026-08-29T04:25:18Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-29T04:24:57.4011361Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-29T04:24:57.4011716Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-29T04:24:57.4053333Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-29T04:24:57.4053633Z env:
quality (node 24)	Run npm run typecheck	2026-08-29T04:24:57.4053862Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-29T04:24:57.4054083Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-29T04:24:57.5143265Z 
quality (node 24)	Run npm run typecheck	2026-08-29T04:24:57.5143799Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-29T04:24:57.5144402Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-29T04:24:57.5144690Z 
quality (node 24)	Run npm run typecheck	2026-08-29T04:25:00.8545454Z ##[error]packages/core/test/unit/plugins/pivot-offset-solve.test.ts(72,7): error TS2345: Argument of type 'Readonly<Record<string, unknown>>' is not assignable to parameter of type 'Readonly<ImmutableRecord>'.
quality (node 24)	Run npm run typecheck	2026-08-29T04:25:00.8553717Z   'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-29T04:25:00.8554248Z     Type 'unknown' is not assignable to type 'ImmutableValue'.
quality (node 24)	Run npm run typecheck	2026-08-29T04:25:00.8974199Z ##[error]Process completed with exit code 2.
```
