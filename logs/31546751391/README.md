# CI log archive: 31546751391

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31546751391
- Captured: 2026-08-11T23:31:20Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- performance (node 24, advisory): success
- integration (node 24): success
- boundaries (node 24): success
- quality (node 24): failure — failed steps: Format check (failure)

## Failed job output

```text
quality (node 24)	Format check	﻿2026-08-11T23:30:57.8137939Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T23:30:57.8138293Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T23:30:57.8178157Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T23:30:57.8178439Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T23:30:57.9280083Z 
quality (node 24)	Format check	2026-08-11T23:30:57.9280510Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T23:30:57.9281042Z > prettier . --check
quality (node 24)	Format check	2026-08-11T23:30:57.9281218Z 
quality (node 24)	Format check	2026-08-11T23:30:58.0144273Z Checking formatting...
quality (node 24)	Format check	2026-08-11T23:30:59.8146395Z [^[[33mwarn^[[39m] progress/D2.md
quality (node 24)	Format check	2026-08-11T23:30:59.9234137Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T23:30:59.9660979Z ##[error]Process completed with exit code 1.
```
