# CI log archive: 31509902434

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31509902434
- Captured: 2026-08-11T15:58:47Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- integration (node 24): success
- quality (node 24): failure — failed steps: Format check (failure)
- performance (node 24, advisory): success
- boundaries (node 24): success

## Failed job output

```text
quality (node 24)	Format check	﻿2026-08-11T15:58:22.0285597Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T15:58:22.0285973Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T15:58:22.0333437Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T15:58:22.0333731Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T15:58:22.1376955Z 
quality (node 24)	Format check	2026-08-11T15:58:22.1377695Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T15:58:22.1378205Z > prettier . --check
quality (node 24)	Format check	2026-08-11T15:58:22.2308249Z 
quality (node 24)	Format check	2026-08-11T15:58:22.2308679Z Checking formatting...
quality (node 24)	Format check	2026-08-11T15:58:23.9311365Z [^[[33mwarn^[[39m] packages/core/test/unit/scripts/boundary-scan.test.ts
quality (node 24)	Format check	2026-08-11T15:58:24.1287032Z [^[[33mwarn^[[39m] scripts/boundary-scan.mjs
quality (node 24)	Format check	2026-08-11T15:58:24.1546965Z [^[[33mwarn^[[39m] Code style issues found in 2 files. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T15:58:24.2019456Z ##[error]Process completed with exit code 1.
```
