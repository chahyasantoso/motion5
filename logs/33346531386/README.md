# CI log archive: 33346531386

- Workflow: CI
- Conclusion: failure
- Head branch: feat/ra-02-structural-commit-seeds-a-flush
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33346531386
- Captured: 2026-08-31T01:06:29Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-08-31T01:06:11.7895833Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-08-31T01:06:11.7896258Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-08-31T01:06:11.7938966Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-08-31T01:06:11.7939287Z env:
quality (node 24)	Run npm run format:check	2026-08-31T01:06:11.7939529Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-08-31T01:06:11.7939806Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-08-31T01:06:11.8767357Z 
quality (node 24)	Run npm run format:check	2026-08-31T01:06:11.8768060Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-08-31T01:06:11.8768584Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-08-31T01:06:11.8768788Z 
quality (node 24)	Run npm run format:check	2026-08-31T01:06:11.9445092Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-08-31T01:06:16.3099015Z [^[[33mwarn^[[39m] packages/core/test/unit/runtime/structural-commit-flush.test.ts
quality (node 24)	Run npm run format:check	2026-08-31T01:06:16.5388298Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-08-31T01:06:16.5748257Z ##[error]Process completed with exit code 1.
```
