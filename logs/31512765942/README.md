# CI log archive: 31512765942

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31512765942
- Captured: 2026-08-11T16:31:24Z

Detailed failed-job output: [failed-jobs.log](./failed-jobs.log)
Job and step outcomes: [jobs.json](./jobs.json)

## Job outcomes

- boundaries (node 24): failure — failed steps: Boundary scan and planted fixtures (failure)
- performance (node 24, advisory): success
- integration (node 24): success
- quality (node 24): failure — failed steps: Format check (failure)

## Failed job output

```text
boundaries (node 24)	Boundary scan and planted fixtures	﻿2026-08-11T16:31:01.1602648Z ##[group]Run npm run test:boundaries
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.1603017Z ^[[36;1mnpm run test:boundaries^[[0m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.1647648Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.1647934Z ##[endgroup]
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.2726219Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.2726798Z > motion5@0.0.0 test:boundaries
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.2728008Z > node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.2728815Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.3290966Z boundary scan passed
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.7671471Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.7676885Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:01.7677694Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0166228Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m | ^[[22m^[[31m1 failed^[[39m^[[2m)^[[22m^[[32m 27^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0168178Z ^[[31m     ^[[31m×^[[31m passes a clean fixture^[[39m^[[32m 8^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0169211Z      ^[[32m✓^[[39m fails on renderer and animation-engine imports^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0170067Z      ^[[32m✓^[[39m fails on banned compatibility vocabulary^[[32m 0^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0170818Z      ^[[32m✓^[[39m extracts exports outside the public allow list^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0171596Z      ^[[32m✓^[[39m detects a consumer reaching into core source internals^[[32m 0^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0172547Z      ^[[32m✓^[[39m executes the shipped scanner against a planted unlisted consumer package^[[32m 9^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0173657Z      ^[[32m✓^[[39m executes the shipped scanner against the current tree^[[32m 7^[[2mms^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0202385Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0203114Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 1 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0203823Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0207840Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mboundary scan planted violations^[[2m > ^[[22mpasses a clean fixture
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0215489Z ^[[31m^[[1mAssertionError^[[22m: expected true to be false // Object.is equality^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0216463Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0217374Z ^[[32m- Expected^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0218218Z ^[[31m+ Received^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0218490Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0218705Z ^[[32m- false^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0219142Z ^[[31m+ true^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0219356Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0220184Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m27:47^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0260061Z     ^[[90m 25|^[[39m     ^[[34mexpect^[[39m(^[[34mimportsBoundary^[[39m(cleanFixture))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0261576Z     ^[[90m 26|^[[39m     ^[[34mexpect^[[39m(^[[34mimportsRenderer^[[39m(cleanFixture))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0263096Z     ^[[90m 27|^[[39m     ^[[34mexpect^[[39m(^[[34mbannedSymbol^[[39m(bannedSymbolFixture))^[[33m.^[[39m^[[34mtoBe^[[39m(^[[35mfalse^[[39m)^[[33m;^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0264228Z     ^[[90m   |^[[39m                                               ^[[31m^^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0264630Z     ^[[90m 28|^[[39m   })^[[33m;^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0265069Z     ^[[90m 29|^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0265288Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0265758Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯^[[22m^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0265987Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0266000Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0270262Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0271771Z ^[[2m      Tests ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m6 passed^[[39m^[[22m^[[90m (7)^[[39m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0272851Z ^[[2m   Start at ^[[22m 16:31:01
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0274298Z ^[[2m   Duration ^[[22m 239ms^[[2m (transform 70ms, setup 0ms, import 87ms, tests 27ms, environment 0ms)^[[22m
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0275296Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0287368Z 
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0320420Z ##[error]AssertionError: expected true to be false // Object.is equality
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
boundaries (node 24)	Boundary scan and planted fixtures	2026-08-11T16:31:02.0544757Z ##[error]Process completed with exit code 1.
quality (node 24)	Format check	﻿2026-08-11T16:30:43.1688215Z ##[group]Run npm run format:check
quality (node 24)	Format check	2026-08-11T16:30:43.1688570Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Format check	2026-08-11T16:30:43.1738510Z shell: /usr/bin/bash -e {0}
quality (node 24)	Format check	2026-08-11T16:30:43.1738810Z ##[endgroup]
quality (node 24)	Format check	2026-08-11T16:30:43.2728447Z 
quality (node 24)	Format check	2026-08-11T16:30:43.2729458Z > motion5@0.0.0 format:check
quality (node 24)	Format check	2026-08-11T16:30:43.2730037Z > prettier . --check
quality (node 24)	Format check	2026-08-11T16:30:43.2730288Z 
quality (node 24)	Format check	2026-08-11T16:30:43.3611757Z Checking formatting...
quality (node 24)	Format check	2026-08-11T16:30:45.1328015Z [^[[33mwarn^[[39m] scripts/boundary-scan.mjs
quality (node 24)	Format check	2026-08-11T16:30:45.1653613Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Format check	2026-08-11T16:30:45.2080688Z ##[error]Process completed with exit code 1.
```
