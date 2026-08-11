# CI log archive: 31512759207

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31512759207
- Captured: 2026-08-11T16:31:08Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- boundaries (node 24): failure — failed steps: Boundary scan and planted fixtures (failure)
- quality (node 24): failure — failed steps: Format check (failure)
- integration (node 24): success
- performance (node 24, advisory): success

## Failed job output

```text
boundaries (node 24)	Boundary scan and planted fixtures	﻿2026-08-11T16:30:42.4123940Z ##[group]Run npm run test:boundaries
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.4124325Z ^[[36;1mnpm run test:boundaries^[[0m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.4170700Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.4171013Z ##[endgroup]
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.5191720Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.5192332Z > motion5@0.0.0 test:boundaries
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.5193251Z > node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.5193772Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.5581862Z boundary scan passed
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.8450549Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.8455619Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:42.8456853Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0662698Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 25^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0664690Z ^[[31m     ^[[31m×^[[31m passes a clean fixture^[[39m^[[32m 7^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0665891Z      ^[[32m✓^[[39m fails on renderer and animation-engine imports^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0667163Z      ^[[32m✓^[[39m fails on banned compatibility vocabulary^[[32m 0^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0668609Z      ^[[32m✓^[[39m extracts exports outside the public allow list^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0669974Z      ^[[32m✓^[[39m detects a consumer reaching into core source internals^[[32m 0^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0670857Z      ^[[32m✓^[[39m executes the shipped scanner against a planted unlisted consumer package^[[32m 8^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0671742Z      ^[[32m✓^[[39m executes the shipped scanner against the current tree^[[32m 6^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0699497Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0700135Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0700644Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0705001Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mboundary scan planted violations^[[2m > ^[[22mpasses a clean fixture
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0712027Z ^[[31m^[[1mAssertionError^[[22m: expected true to be false // Object.is equality^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0712563Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0713332Z ^[[32m- Expected^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0713925Z ^[[31m+ Received^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0714282Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0714708Z ^[[32m- false^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0715020Z ^[[31m+ true^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0715205Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0715968Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m27:47^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0750353Z     ^[[90m 25|^[[39m     ^[[34mexpect^[[39m(^[[34mimportsBoundary^[[39m(cleanFixture))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0751982Z     ^[[90m 26|^[[39m     ^[[34mexpect^[[39m(^[[34mimportsRenderer^[[39m(cleanFixture))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0753188Z     ^[[90m 27|^[[39m     ^[[34mexpect^[[39m(^[[34mbannedSymbol^[[39m(bannedSymbolFixture))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0753966Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0754391Z     ^[[90m 28|^[[39m   })^[[33m;^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0754783Z     ^[[90m 29|^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0755086Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0755549Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0755944Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0755969Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0759728Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0761043Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m6 passed^[[39m^[[22m^[[90m (7)^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0761701Z ^[[2m   Start at ^[[22m 16:30:42
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0762808Z ^[[2m   Duration ^[[22m 214ms^[[2m (transform 45ms, setup 0ms, import 60ms, tests 25ms, environment 0ms)^[[22m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0764369Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0777012Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.0800497Z ##[error]AssertionError: expected true to be false // Object.is equality
boundaries (node 24)	Boundary scan and planted fixtures	
boundaries (node 24)	Boundary scan and planted fixtures	- Expected
boundaries (node 24)	Boundary scan and planted fixtures	+ Received
boundaries (node 24)	Boundary scan and planted fixtures	
boundaries (node 24)	Boundary scan and planted fixtures	- false
boundaries (node 24)	Boundary scan and planted fixtures	+ true
boundaries (node 24)	Boundary scan and planted fixtures	
boundaries (node 24)	Boundary scan and planted fixtures	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:27:47
boundaries (node 24)	Boundary scan and planted fixtures	
boundaries (node 24)	Boundary scan and planted fixtures	
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:30:43.1022904Z ##[error]Process completed with exit code 1.
quality (node 24)	Format check	﻿2026-08-11T16:30:50.3268124Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T16:30:50.3268485Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T16:30:50.3312967Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T16:30:50.3313248Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T16:30:50.4382487Z 
quality (node 24)	Format check	2026-08-11T16:30:50.4383322Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T16:30:50.4383859Z > prettier . --check
quality (node 24)	Format check	2026-08-11T16:30:50.4384073Z 
quality (node 24)	Format check	2026-08-11T16:30:50.5314638Z Checking formatting...
quality (node 24)	Format check	2026-08-11T16:30:52.4243629Z [^[[33mwarn^[[39m] scripts/boundary-scan.mjs
quality (node 24)	Format check	2026-08-11T16:30:52.4605817Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T16:30:52.5086402Z ##[error]Process completed with exit code 1.
```
