# CI log archive: 31508040471

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31508040471
- Captured: 2026-08-11T15:38:17Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- integration (node 24): success
- quality (node 24): failure — failed steps: Format check (failure)
- performance (node 24, advisory): success
- boundaries (node 24): success

## Failed job output

```text
quality (node 24)	Format check	﻿2026-08-11T15:37:45.8708011Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T15:37:45.8708366Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T15:37:45.8758592Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T15:37:45.8758885Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T15:37:45.9870409Z 
quality (node 24)	Format check	2026-08-11T15:37:45.9871056Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T15:37:45.9871574Z > prettier . --check
quality (node 24)	Format check	2026-08-11T15:37:45.9871745Z 
quality (node 24)	Format check	2026-08-11T15:37:46.0803519Z Checking formatting...
quality (node 24)	Format check	2026-08-11T15:37:47.8322245Z [^[[33mwarn^[[39m] progress/STATUS.md
quality (node 24)	Format check	2026-08-11T15:37:47.9084571Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T15:37:47.9531272Z ##[error]Process completed with exit code 1.
```
