# CI log archive: 33392432659

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-62-schema-transaction
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33392432659
- Captured: 2026-08-31T12:35:05Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-31T12:34:45.6951371Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-31T12:34:45.6951725Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-31T12:34:45.6990860Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-31T12:34:45.6991139Z env:
quality (node 24)	Run npm run format:check	2026-08-31T12:34:45.6991345Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-31T12:34:45.6991558Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-31T12:34:45.8067346Z 
quality (node 24)	Run npm run format:check	2026-08-31T12:34:45.8068192Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-31T12:34:45.8068753Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-31T12:34:45.8068970Z 
quality (node 24)	Run npm run format:check	2026-08-31T12:34:45.8979659Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-31T12:34:52.3145418Z [^[[33mwarn^[[39m] packages/core/test/unit/runtime/schema-transaction.test.ts
quality (node 24)	Run npm run format:check	2026-08-31T12:34:52.6338951Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-31T12:34:52.6813858Z ##[error]Process completed with exit code 1.
```
