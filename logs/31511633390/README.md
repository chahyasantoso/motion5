# CI log archive: 31511633390

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31511633390
- Captured: 2026-08-11T16:18:48Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- quality (node 24): failure — failed steps: Format check (failure)
- boundaries (node 24): success
- integration (node 24): success
- performance (node 24, advisory): success

## Failed job output

```text
quality (node 24)	Format check	﻿2026-08-11T16:18:12.9757906Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T16:18:12.9758289Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T16:18:12.9782787Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T16:18:12.9783201Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T16:18:13.1198485Z 
quality (node 24)	Format check	2026-08-11T16:18:13.1199169Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T16:18:13.1199770Z > prettier . --check
quality (node 24)	Format check	2026-08-11T16:18:13.1199927Z 
quality (node 24)	Format check	2026-08-11T16:18:13.1946782Z Checking formatting...
quality (node 24)	Format check	2026-08-11T16:18:14.4869946Z [^[[33mwarn^[[39m] packages/core/test/unit/scripts/acceptance-scan.test.ts
quality (node 24)	Format check	2026-08-11T16:18:14.6413172Z [^[[33mwarn^[[39m] scripts/acceptance-scan.mjs
quality (node 24)	Format check	2026-08-11T16:18:14.6841226Z [^[[33mwarn^[[39m] Code style issues found in 2 files. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T16:18:14.7112709Z ##[error]Process completed with exit code 1.
```
