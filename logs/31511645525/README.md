# CI log archive: 31511645525

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31511645525
- Captured: 2026-08-11T16:18:33Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- integration (node 24): success
- performance (node 24, advisory): success
- quality (node 24): failure — failed steps: Format check (failure)
- boundaries (node 24): failure — failed steps: Boundary scan and planted fixtures (failure)

## Failed job output

```text
quality (node 24)	Format check	﻿2026-08-11T16:18:05.7122216Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T16:18:05.7122589Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T16:18:05.7172509Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T16:18:05.7172795Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T16:18:05.8197801Z 
quality (node 24)	Format check	2026-08-11T16:18:05.8198684Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T16:18:05.8199218Z > prettier . --check
quality (node 24)	Format check	2026-08-11T16:18:05.8199392Z 
quality (node 24)	Format check	2026-08-11T16:18:05.9089422Z Checking formatting...
quality (node 24)	Format check	2026-08-11T16:18:07.5689465Z [^[[33mwarn^[[39m] packages/core/test/unit/scripts/boundary-scan.test.ts
quality (node 24)	Format check	2026-08-11T16:18:07.7554440Z [^[[33mwarn^[[39m] scripts/boundary-scan.mjs
quality (node 24)	Format check	2026-08-11T16:18:07.7865495Z [^[[33mwarn^[[39m] Code style issues found in 2 files. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T16:18:07.8395398Z ##[error]Process completed with exit code 1.
boundaries (node 24)	Boundary scan and planted fixtures	﻿2026-08-11T16:18:18.9451382Z ##[group]Run npm run test:boundaries
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:18:18.9451754Z ^[[36;1mnpm run test:boundaries^[[0m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:18:18.9497906Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:18:18.9498187Z ##[endgroup]
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:18:19.0545650Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:18:19.0546206Z > motion5@0.0.0 test:boundaries
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:18:19.0547426Z > node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:18:19.0548036Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:18:19.1196950Z ackages/react/src/index.ts: renderer or engine import
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:18:19.1198035Z ackages/react/src/patch-store.ts: renderer or engine import
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:18:19.1321360Z ##[error]Process completed with exit code 1.
```
