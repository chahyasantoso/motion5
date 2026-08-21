# CI log archive: 32486660512

- Workflow: CI
- Conclusion: failure
- Head branch: fix/issue-176-transactional-track-replacement
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32486660512
- Captured: 2026-08-21T13:25:00Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-21T13:24:36.6791403Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-21T13:24:36.6791749Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-21T13:24:36.6832418Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-21T13:24:36.6832691Z env:
quality (node 24)	Run npm run format:check	2026-08-21T13:24:36.6832896Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-21T13:24:36.6833123Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-21T13:24:36.7823758Z 
quality (node 24)	Run npm run format:check	2026-08-21T13:24:36.7824992Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-21T13:24:36.7826716Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-21T13:24:36.7827192Z 
quality (node 24)	Run npm run format:check	2026-08-21T13:24:36.8681209Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-21T13:24:40.1627083Z [^[[33mwarn^[[39m] packages/core/src/runtime/project-runtime.ts
quality (node 24)	Run npm run format:check	2026-08-21T13:24:41.3873359Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-21T13:24:41.4425703Z ##[error]Process completed with exit code 1.
```
