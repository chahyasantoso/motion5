# CI log archive: 32615021801

- Workflow: CI
- Conclusion: failure
- Head branch: docs/issue-186-trd-traceability
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32615021801
- Captured: 2026-08-23T03:19:03Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-23T03:18:44.3938918Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-23T03:18:44.3939296Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-23T03:18:44.3960435Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-23T03:18:44.3960782Z env:
quality (node 24)	Run npm run format:check	2026-08-23T03:18:44.3961072Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-23T03:18:44.3961320Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-23T03:18:44.4727123Z 
quality (node 24)	Run npm run format:check	2026-08-23T03:18:44.4728958Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-23T03:18:44.4729430Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-23T03:18:44.4729706Z 
quality (node 24)	Run npm run format:check	2026-08-23T03:18:44.5604433Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-23T03:18:48.1967982Z [^[[33mwarn^[[39m] packages/core/test/unit/scripts/traceability-scan.test.ts
quality (node 24)	Run npm run format:check	2026-08-23T03:18:48.3124876Z [^[[33mwarn^[[39m] scripts/traceability-scan-fixtures.ts
quality (node 24)	Run npm run format:check	2026-08-23T03:18:48.3294944Z [^[[33mwarn^[[39m] Code style issues found in 2 files. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-23T03:18:48.3592843Z ##[error]Process completed with exit code 1.
```
