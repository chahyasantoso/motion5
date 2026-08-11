# CI log archive: 31497302055

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31497302055
- Captured: 2026-08-11T13:40:05Z

## Failed job output

```text
quality (node 24)	Typecheck	﻿2026-08-11T13:39:39.1080753Z ##[group]Run npm run typecheck
quality (node 24)	Typecheck	2026-08-11T13:39:39.1081109Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Typecheck	2026-08-11T13:39:39.1127974Z shell: /usr/bin/bash -e {0}
quality (node 24)	Typecheck	2026-08-11T13:39:39.1128295Z ##[endgroup]
quality (node 24)	Typecheck	2026-08-11T13:39:39.2180425Z 
quality (node 24)	Typecheck	2026-08-11T13:39:39.2181183Z > motion5@0.0.0 typecheck
quality (node 24)	Typecheck	2026-08-11T13:39:39.2181826Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Typecheck	2026-08-11T13:39:39.2182128Z 
quality (node 24)	Typecheck	2026-08-11T13:39:40.6876174Z ##[error]packages/react/test/public-hook.test.ts(2,26): error TS2307: Cannot find module '../src/index' or its corresponding type declarations.
quality (node 24)	Typecheck	2026-08-11T13:39:40.7271098Z ##[error]Process completed with exit code 2.
```
