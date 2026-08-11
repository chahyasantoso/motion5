# CI log archive: 31497295831

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31497295831
- Captured: 2026-08-11T13:39:51Z

## Failed job output

```text
quality (node 24)	Typecheck	﻿2026-08-11T13:39:30.5310956Z ##[group]Run npm run typecheck
quality (node 24)	Typecheck	2026-08-11T13:39:30.5311461Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Typecheck	2026-08-11T13:39:30.5373443Z shell: /usr/bin/bash -e {0}
quality (node 24)	Typecheck	2026-08-11T13:39:30.5373869Z ##[endgroup]
quality (node 24)	Typecheck	2026-08-11T13:39:30.6468856Z 
quality (node 24)	Typecheck	2026-08-11T13:39:30.6477153Z > motion5@0.0.0 typecheck
quality (node 24)	Typecheck	2026-08-11T13:39:30.6478317Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Typecheck	2026-08-11T13:39:30.6479067Z 
quality (node 24)	Typecheck	2026-08-11T13:39:32.1856157Z ##[error]packages/react/test/public-hook.test.ts(2,26): error TS2307: Cannot find module '../src/index' or its corresponding type declarations.
quality (node 24)	Typecheck	2026-08-11T13:39:32.2117006Z ##[error]Process completed with exit code 2.
```
