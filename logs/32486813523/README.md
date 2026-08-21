# CI log archive: 32486813523

- Workflow: CI
- Conclusion: failure
- Head branch: fix/issue-176-transactional-track-replacement
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32486813523
- Captured: 2026-08-21T13:26:56Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-21T13:26:35.8960425Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-21T13:26:35.8960880Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-21T13:26:35.8985420Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-21T13:26:35.8985831Z env:
quality (node 24)	Run npm run format:check	2026-08-21T13:26:35.8987081Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-21T13:26:35.8987404Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-21T13:26:35.9886832Z 
quality (node 24)	Run npm run format:check	2026-08-21T13:26:35.9888134Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-21T13:26:35.9888790Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-21T13:26:35.9889096Z 
quality (node 24)	Run npm run format:check	2026-08-21T13:26:36.0869819Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-21T13:26:39.4156693Z [^[[33mwarn^[[39m] packages/core/src/runtime/project-runtime.ts
quality (node 24)	Run npm run format:check	2026-08-21T13:26:40.6349921Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-21T13:26:40.7064825Z ##[error]Process completed with exit code 1.
```
