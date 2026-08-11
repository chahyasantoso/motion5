# CI log archive: 31512689003

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31512689003
- Captured: 2026-08-11T16:30:25Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- quality (node 24): failure — failed steps: Typecheck (failure)
- integration (node 24): success
- boundaries (node 24): success
- performance (node 24, advisory): success

## Failed job output

```text
quality (node 24)	Typecheck	﻿2026-08-11T16:30:01.9241255Z ##[group]Run npm run typecheck
quality (node 24)	Typecheck	2026-08-11T16:30:01.9241598Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Typecheck	2026-08-11T16:30:01.9285267Z shell: /usr/bin/bash -e {0}
quality (node 24)	Typecheck	2026-08-11T16:30:01.9285538Z ##[endgroup]
quality (node 24)	Typecheck	2026-08-11T16:30:02.0271320Z 
quality (node 24)	Typecheck	2026-08-11T16:30:02.0272086Z > motion5@0.0.0 typecheck
quality (node 24)	Typecheck	2026-08-11T16:30:02.0272721Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Typecheck	2026-08-11T16:30:02.0272953Z 
quality (node 24)	Typecheck	2026-08-11T16:30:03.8272839Z ##[error]packages/core/test/unit/scripts/acceptance-scan.test.ts(5,32): error TS7016: Could not find a declaration file for module '../../../../../scripts/acceptance-scan.mjs'. '/home/runner/work/motion5/motion5/scripts/acceptance-scan.mjs' implicitly has an 'any' type.
quality (node 24)	Typecheck	2026-08-11T16:30:03.8578917Z ##[error]Process completed with exit code 2.
```
