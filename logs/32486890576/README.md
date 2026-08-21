# CI log archive: 32486890576

- Workflow: CI
- Conclusion: failure
- Head branch: fix/issue-176-transactional-track-replacement
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32486890576
- Captured: 2026-08-21T13:27:40Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-21T13:27:15.5450089Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-21T13:27:15.5450469Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-21T13:27:15.5487526Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-21T13:27:15.5487786Z env:
quality (node 24)	Run npm run format:check	2026-08-21T13:27:15.5487986Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-21T13:27:15.5488198Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-21T13:27:15.6444372Z 
quality (node 24)	Run npm run format:check	2026-08-21T13:27:15.6445000Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-21T13:27:15.6445479Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-21T13:27:15.6445648Z 
quality (node 24)	Run npm run format:check	2026-08-21T13:27:15.7286630Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-21T13:27:19.4024044Z [^[[33mwarn^[[39m] packages/core/src/runtime/project-runtime.ts
quality (node 24)	Run npm run format:check	2026-08-21T13:27:20.9353667Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-21T13:27:20.9805393Z ##[error]Process completed with exit code 1.
```
