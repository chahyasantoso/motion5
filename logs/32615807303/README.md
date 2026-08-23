# CI log archive: 32615807303

- Workflow: CI
- Conclusion: failure
- Head branch: docs/issue-186-trd-traceability
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32615807303
- Captured: 2026-08-23T03:37:50Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-23T03:37:31.7297913Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-23T03:37:31.7298267Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-23T03:37:31.7338917Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-23T03:37:31.7339210Z env:
quality (node 24)	Run npm run format:check	2026-08-23T03:37:31.7339432Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-23T03:37:31.7339663Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-23T03:37:31.8343975Z 
quality (node 24)	Run npm run format:check	2026-08-23T03:37:31.8344774Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-23T03:37:31.8345307Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-23T03:37:31.8345483Z 
quality (node 24)	Run npm run format:check	2026-08-23T03:37:31.9425095Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-23T03:37:32.4844542Z [^[[33mwarn^[[39m] docs/acceptance-map.json
quality (node 24)	Run npm run format:check	2026-08-23T03:37:34.8919936Z [^[[33mwarn^[[39m] package.json
quality (node 24)	Run npm run format:check	2026-08-23T03:37:36.9381274Z [^[[33mwarn^[[39m] scripts/acceptance-scan.mjs
quality (node 24)	Run npm run format:check	2026-08-23T03:37:37.0129286Z [^[[33mwarn^[[39m] Code style issues found in 3 files. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-23T03:37:37.0647749Z ##[error]Process completed with exit code 1.
```
