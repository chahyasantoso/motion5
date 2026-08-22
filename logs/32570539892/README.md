# CI log archive: 32570539892

- Workflow: CI
- Conclusion: failure
- Head branch: feat/core-testing-entrypoint
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32570539892
- Captured: 2026-08-22T11:32:42Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-22T11:32:22.4273542Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-22T11:32:22.4273887Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-22T11:32:22.4311567Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-22T11:32:22.4311825Z env:
quality (node 24)	Run npm run format:check	2026-08-22T11:32:22.4312021Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-22T11:32:22.4312232Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-22T11:32:22.5357833Z 
quality (node 24)	Run npm run format:check	2026-08-22T11:32:22.5358600Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-22T11:32:22.5359378Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-22T11:32:22.5359672Z 
quality (node 24)	Run npm run format:check	2026-08-22T11:32:22.6301109Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-22T11:32:23.7948262Z [^[[33mwarn^[[39m] docs/ADR-048-test-only-entrypoint-tier.md
quality (node 24)	Run npm run format:check	2026-08-22T11:32:27.8363983Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-22T11:32:27.8822456Z ##[error]Process completed with exit code 1.
```
