# CI log archive: 33133877610

- Workflow: CI
- Conclusion: failure
- Head branch: feat/d1-goals-reach-the-solve
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33133877610
- Captured: 2026-08-28T01:46:59Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-28T01:46:35.4638493Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:35.4638832Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:35.4681246Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:35.4681892Z env:
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:35.4682107Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:35.4682331Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:35.5798118Z 
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:35.5798976Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:35.5799586Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:35.5799888Z 
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:38.8583730Z ##[error]packages/core/test/unit/graph/solver-goals.test.ts(47,37): error TS2322: Type '{ requires: Readonly<Record<string, unknown>>; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:38.8592325Z   Types of property 'requires' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:38.8593558Z     Type 'Readonly<Record<string, unknown>>' is not assignable to type 'Readonly<Record<string, string | Readonly<Record<string, string>>>>'.
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:38.8594642Z       'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:38.8595537Z         Type 'unknown' is not assignable to type 'string | Readonly<Record<string, string>>'.
quality (node 24)	Run npm run typecheck	2026-08-28T01:46:38.9004306Z ##[error]Process completed with exit code 2.
```
