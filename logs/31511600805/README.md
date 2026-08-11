# CI log archive: 31511600805

- Workflow: CI
- Conclusion: cancelled
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31511600805
- Captured: 2026-08-11T16:18:03Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- integration (node 24): success
- performance (node 24, advisory): success
- boundaries (node 24): cancelled — failed steps: Boundary scan and planted fixtures (failure)
- quality (node 24): failure — failed steps: Format check (failure)

## Failed job output

```text
quality (node 24)	Format check	﻿2026-08-11T16:17:33.0581777Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T16:17:33.0582173Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T16:17:33.0632361Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T16:17:33.0632661Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T16:17:33.1632752Z 
quality (node 24)	Format check	2026-08-11T16:17:33.1633764Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T16:17:33.1634415Z > prettier . --check
quality (node 24)	Format check	2026-08-11T16:17:33.1634670Z 
quality (node 24)	Format check	2026-08-11T16:17:33.2519915Z Checking formatting...
quality (node 24)	Format check	2026-08-11T16:17:34.8968793Z [^[[33mwarn^[[39m] packages/core/test/unit/scripts/boundary-scan.test.ts
quality (node 24)	Format check	2026-08-11T16:17:35.0792347Z [^[[33mwarn^[[39m] scripts/boundary-scan.mjs
quality (node 24)	Format check	2026-08-11T16:17:35.1194798Z [^[[33mwarn^[[39m] Code style issues found in 2 files. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T16:17:35.1718131Z ##[error]Process completed with exit code 1.
```
