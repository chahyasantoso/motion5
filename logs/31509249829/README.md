# CI log archive: 31509249829

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31509249829
- Captured: 2026-08-11T15:51:35Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- performance (node 24, advisory): success
- quality (node 24): failure — failed steps: Format check (failure)
- integration (node 24): success
- boundaries (node 24): success

## Failed job output

```text
quality (node 24)	Format check	﻿2026-08-11T15:51:09.4791700Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T15:51:09.4792427Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T15:51:09.4831008Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T15:51:09.4831298Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T15:51:09.6101954Z 
quality (node 24)	Format check	2026-08-11T15:51:09.6102732Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T15:51:09.6103316Z > prettier . --check
quality (node 24)	Format check	2026-08-11T15:51:09.6103550Z 
quality (node 24)	Format check	2026-08-11T15:51:09.7006573Z Checking formatting...
quality (node 24)	Format check	2026-08-11T15:51:11.4155339Z [^[[33mwarn^[[39m] packages/core/test/unit/scripts/boundary-scan.test.ts
quality (node 24)	Format check	2026-08-11T15:51:11.6067943Z [^[[33mwarn^[[39m] scripts/boundary-scan.mjs
quality (node 24)	Format check	2026-08-11T15:51:11.6401451Z [^[[33mwarn^[[39m] Code style issues found in 2 files. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T15:51:11.6825993Z ##[error]Process completed with exit code 1.
```
