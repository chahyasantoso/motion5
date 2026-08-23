# CI log archive: 32615839219

- Workflow: CI
- Conclusion: failure
- Head branch: main
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32615839219
- Captured: 2026-08-23T03:38:33Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-23T03:38:15.2086942Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:15.2087301Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:15.2126830Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:15.2127114Z env:
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:15.2127346Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:15.2127584Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:15.3182656Z 
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:15.3183670Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:15.3184355Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:15.3184759Z 
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:18.5641687Z ##[error]packages/core/test/unit/scripts/traceability-scan.test.ts(9,8): error TS2307: Cannot find module '../../../../../scripts/traceability-scan.mjs' or its corresponding type declarations.
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:18.5653524Z ##[error]packages/core/test/unit/scripts/traceability-scan.test.ts(30,8): error TS2307: Cannot find module '../../../../../scripts/traceability-scan-fixtures' or its corresponding type declarations.
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:18.5656980Z ##[error]packages/core/test/unit/scripts/traceability-scan.test.ts(156,24): error TS7006: Parameter 'id' implicitly has an 'any' type.
quality (node 24)	Run npm run typecheck	2026-08-23T03:38:18.6020331Z ##[error]Process completed with exit code 2.
```
