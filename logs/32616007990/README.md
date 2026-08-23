# CI log archive: 32616007990

- Workflow: CI
- Conclusion: failure
- Head branch: main
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32616007990
- Captured: 2026-08-23T03:42:45Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-23T03:42:23.2825687Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:23.2826047Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:23.2866243Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:23.2866547Z env:
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:23.2867035Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:23.2867271Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:23.3981119Z 
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:23.3981911Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:23.3982716Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:23.3983124Z 
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:27.0654987Z ##[error]packages/core/test/unit/scripts/traceability-scan.test.ts(9,8): error TS2307: Cannot find module '../../../../../scripts/traceability-scan.mjs' or its corresponding type declarations.
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:27.0664020Z ##[error]packages/core/test/unit/scripts/traceability-scan.test.ts(30,8): error TS2307: Cannot find module '../../../../../scripts/traceability-scan-fixtures' or its corresponding type declarations.
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:27.0667424Z ##[error]packages/core/test/unit/scripts/traceability-scan.test.ts(156,24): error TS7006: Parameter 'id' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-23T03:42:27.1076735Z ##[error]Process completed with exit code 2.
```
