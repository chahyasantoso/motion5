# CI log archive: 32159077671

- Workflow: CI
- Conclusion: failure
- Head branch: docs/user-guide
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32159077671
- Captured: 2026-08-18T16:13:40Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-18T16:13:16.7447199Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-18T16:13:16.7447572Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-18T16:13:16.7486161Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-18T16:13:16.7486424Z env:
quality (node 24)	Run npm run format:check	2026-08-18T16:13:16.7486612Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-18T16:13:16.7486881Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-18T16:13:16.8488484Z 
quality (node 24)	Run npm run format:check	2026-08-18T16:13:16.8489163Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-18T16:13:16.8489833Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-18T16:13:16.8490050Z 
quality (node 24)	Run npm run format:check	2026-08-18T16:13:16.9335486Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-18T16:13:18.3466715Z [^[[33mwarn^[[39m] docs/guide/rendering-patches.md
quality (node 24)	Run npm run format:check	2026-08-18T16:13:21.4736443Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-18T16:13:21.5228365Z ##[error]Process completed with exit code 1.
```
