# CI log archive: 31510329337

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31510329337
- Captured: 2026-08-11T16:03:44Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- boundaries (node 24): success
- performance (node 24, advisory): success
- quality (node 24): failure — failed steps: Format check (failure)
- integration (node 24): success

## Failed job output

```text
quality (node 24)	Format check	﻿2026-08-11T16:03:18.3246799Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T16:03:18.3247157Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T16:03:18.3293447Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T16:03:18.3293768Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T16:03:18.4509354Z 
quality (node 24)	Format check	2026-08-11T16:03:18.4510077Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T16:03:18.4510692Z > prettier . --check
quality (node 24)	Format check	2026-08-11T16:03:18.4510885Z 
quality (node 24)	Format check	2026-08-11T16:03:18.6643936Z Checking formatting...
quality (node 24)	Format check	2026-08-11T16:03:20.2730785Z [^[[33mwarn^[[39m] packages/core/test/unit/scripts/boundary-scan.test.ts
quality (node 24)	Format check	2026-08-11T16:03:20.4722925Z [^[[33mwarn^[[39m] scripts/boundary-scan.mjs
quality (node 24)	Format check	2026-08-11T16:03:20.5055668Z [^[[33mwarn^[[39m] Code style issues found in 2 files. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T16:03:20.5524693Z ##[error]Process completed with exit code 1.
```
