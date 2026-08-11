# CI log archive: 31512682690

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31512682690
- Captured: 2026-08-11T16:30:36Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- performance (node 24, advisory): success
- integration (node 24): success
- boundaries (node 24): success
- quality (node 24): failure — failed steps: Typecheck (failure)

## Failed job output

```text
quality (node 24)	Typecheck	﻿2026-08-11T16:29:57.7570217Z ##[group]Run npm run typecheck
quality (node 24)	Typecheck	2026-08-11T16:29:57.7570526Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Typecheck	2026-08-11T16:29:57.7608225Z shell: /usr/bin/bash -e {0}
quality (node 24)	Typecheck	2026-08-11T16:29:57.7608453Z ##[endgroup]
quality (node 24)	Typecheck	2026-08-11T16:29:57.8408686Z 
quality (node 24)	Typecheck	2026-08-11T16:29:57.8409552Z > motion5@0.0.0 typecheck
quality (node 24)	Typecheck	2026-08-11T16:29:57.8409973Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Typecheck	2026-08-11T16:29:57.8410130Z 
quality (node 24)	Typecheck	2026-08-11T16:29:59.1266164Z ##[error]packages/core/test/unit/scripts/acceptance-scan.test.ts(5,32): error TS7016: Could not find a declaration file for module '../../../../../scripts/acceptance-scan.mjs'. '/home/runner/work/motion5/motion5/scripts/acceptance-scan.mjs' implicitly has an 'any' type.
quality (node 24)	Typecheck	2026-08-11T16:29:59.1509242Z ##[error]Process completed with exit code 2.
```
