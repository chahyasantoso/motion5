# CI log archive: 32487395666

- Workflow: CI
- Conclusion: failure
- Head branch: fix/issue-176-transactional-track-replacement
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32487395666
- Captured: 2026-08-21T13:33:18Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-21T13:32:57.6052840Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-21T13:32:57.6053374Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-21T13:32:57.6104192Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-21T13:32:57.6104614Z env:
quality (node 24)	Run npm run format:check	2026-08-21T13:32:57.6104952Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-21T13:32:57.6105311Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-21T13:32:57.7181098Z 
quality (node 24)	Run npm run format:check	2026-08-21T13:32:57.7181808Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-21T13:32:57.7182395Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-21T13:32:57.7182660Z 
quality (node 24)	Run npm run format:check	2026-08-21T13:32:57.8201779Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-21T13:33:01.5566945Z [^[[33mwarn^[[39m] packages/core/src/runtime/project-runtime.ts
quality (node 24)	Run npm run format:check	2026-08-21T13:33:03.0265312Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-21T13:33:03.0677427Z ##[error]Process completed with exit code 1.
```
