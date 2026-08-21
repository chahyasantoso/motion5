# CI log archive: 32478785074

- Workflow: CI
- Conclusion: failure
- Head branch: feat/issue-173-plugin-owned-requirements
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32478785074
- Captured: 2026-08-21T11:47:32Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-21T11:47:14.4937724Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-21T11:47:14.4938117Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-21T11:47:14.4977345Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-21T11:47:14.4977606Z env:
quality (node 24)	Run npm run format:check	2026-08-21T11:47:14.4977809Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-21T11:47:14.4978023Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-21T11:47:14.6097465Z 
quality (node 24)	Run npm run format:check	2026-08-21T11:47:14.6098262Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-21T11:47:14.6098999Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-21T11:47:14.6099292Z 
quality (node 24)	Run npm run format:check	2026-08-21T11:47:14.7071749Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-21T11:47:15.6393929Z [^[[33mwarn^[[39m] docs/ADR-044-plugin-owned-input-requirements.md
quality (node 24)	Run npm run format:check	2026-08-21T11:47:19.4798604Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-21T11:47:19.5260605Z ##[error]Process completed with exit code 1.
```
