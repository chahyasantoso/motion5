# CI log archive: 31506748324

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31506748324
- Captured: 2026-08-11T15:24:03Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- quality (node 24): failure — failed steps: Format check (failure)
- performance (node 24, advisory): success
- boundaries (node 24): success
- integration (node 24): success

## Failed job output

```text
quality (node 24)	Format check	﻿2026-08-11T15:23:39.2212161Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T15:23:39.2212500Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T15:23:39.2262868Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T15:23:39.2263161Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T15:23:39.3282167Z 
quality (node 24)	Format check	2026-08-11T15:23:39.3282961Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T15:23:39.3283585Z > prettier . --check
quality (node 24)	Format check	2026-08-11T15:23:39.3283829Z 
quality (node 24)	Format check	2026-08-11T15:23:39.4425915Z Checking formatting...
quality (node 24)	Format check	2026-08-11T15:23:41.2556778Z [^[[33mwarn^[[39m] progress/STATUS.md
quality (node 24)	Format check	2026-08-11T15:23:41.3428337Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T15:23:41.3872377Z ##[error]Process completed with exit code 1.
```
