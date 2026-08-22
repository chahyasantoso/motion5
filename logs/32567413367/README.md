# CI log archive: 32567413367

- Workflow: CI
- Conclusion: failure
- Head branch: feat/core-testing-entrypoint
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32567413367
- Captured: 2026-08-22T10:22:33Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-22T10:22:10.7540407Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:10.7540745Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:10.7587038Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:10.7587495Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:10.7587713Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:10.7587939Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:10.8698875Z 
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:10.8699519Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:10.8699931Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:10.8700133Z 
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:14.1334562Z ##[error]packages/core/test/unit/scripts/boundary-scan.test.ts(12,3): error TS2305: Module '"../../../../../scripts/boundary-scan.mjs"' has no exported member 'importsTestingEntrypoint'.
quality (node 24)	Run npm run typecheck	2026-08-22T10:22:14.1742443Z ##[error]Process completed with exit code 2.
boundaries (node 24)	Run npm run test:boundaries	﻿2026-08-22T10:22:12.6811209Z ##[group]Run npm run test:boundaries
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:12.6811608Z ^[[36;1mnpm run test:boundaries^[[0m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:12.6850904Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:12.6851200Z env:
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:12.6851400Z   NODE_VERSION: 24
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:12.6851615Z ##[endgroup]
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:12.7881985Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:12.7882833Z > motion5@0.0.0 test:boundaries
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:12.7883957Z > node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:12.7884647Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:12.8310991Z boundary scan passed
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.1482266Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.1485912Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.1486714Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4474193Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m19 tests^[[22m^[[2m | ^[[22m^[[31m7 failed^[[39m^[[2m)^[[22m^[[32m 77^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4477205Z      ^[[32m✓^[[39m passes a clean fixture^[[32m 2^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4479572Z      ^[[32m✓^[[39m fails on renderer and animation-engine imports^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4482269Z      ^[[32m✓^[[39m fails on banned compatibility vocabulary^[[32m 0^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4484916Z      ^[[32m✓^[[39m fails on a consumer reaching into core source internals^[[32m 0^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4487415Z      ^[[32m✓^[[39m extracts exports outside the public allow list^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4489609Z ^[[31m       ^[[31m×^[[31m fails on @motion5/core/testing imports^[[39m^[[32m 3^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4491736Z ^[[31m       ^[[31m×^[[31m fails on relative core/src/testing imports^[[39m^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4493684Z ^[[31m       ^[[31m×^[[31m passes for production adapters and plugins^[[39m^[[32m 0^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4495492Z ^[[31m       ^[[31m×^[[31m passes for the main entrypoint^[[39m^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4497383Z      ^[[32m✓^[[39m reports every planted violation class through the shipped scanner^[[32m 9^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4499311Z      ^[[32m✓^[[39m reads a core package entry that is not engine.ts^[[32m 6^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4501307Z      ^[[32m✓^[[39m discovers a consumer package that no list mentions^[[32m 5^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4502952Z      ^[[32m✓^[[39m keeps a consumer renderer import legal^[[32m 5^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4504437Z      ^[[32m✓^[[39m executes the shipped scanner against the current tree^[[32m 9^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4505867Z      ^[[32m✓^[[39m G-5: no file under packages/core/src imports gsap^[[32m 9^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4507387Z ^[[31m       ^[[31m×^[[31m reports testing entrypoint import from an app^[[39m^[[32m 6^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4509157Z ^[[31m       ^[[31m×^[[31m reports core source-internal import from an app (the #164 mistake)^[[39m^[[32m 5^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4511099Z ^[[31m       ^[[31m×^[[31m reports renderer import from the testing layer^[[39m^[[32m 4^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4512806Z        ^[[32m✓^[[39m executes the shipped scanner against the current tree and expects no violations^[[32m 8^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4547821Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4548587Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 7 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4549016Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4553800Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mboundary scan predicates^[[2m > ^[[22mW-1: importsTestingEntrypoint predicate^[[2m > ^[[22mfails on @motion5/core/testing imports
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4557844Z ^[[31m^[[1mTypeError^[[22m: importsTestingEntrypoint is not a function^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4559397Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m134:14^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4631607Z     ^[[90m132|^[[39m   ^[[34mdescribe^[[39m(^[[32m"W-1: importsTestingEntrypoint predicate"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4633162Z     ^[[90m133|^[[39m     ^[[34mit^[[39m(^[[32m"fails on @motion5/core/testing imports"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4634525Z     ^[[90m134|^[[39m       expect(importsTestingEntrypoint(testingEntrypointViolationFixtur…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4635306Z     ^[[90m   |^[[39m              ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4635928Z     ^[[90m135|^[[39m     })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4636255Z     ^[[90m136|^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4636459Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4636802Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4637112Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4638832Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mboundary scan predicates^[[2m > ^[[22mW-1: importsTestingEntrypoint predicate^[[2m > ^[[22mfails on relative core/src/testing imports
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4641484Z ^[[31m^[[1mTypeError^[[22m: importsTestingEntrypoint is not a function^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4642964Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m138:14^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4643962Z     ^[[90m136|^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4645114Z     ^[[90m137|^[[39m     ^[[34mit^[[39m(^[[32m"fails on relative core/src/testing imports"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4646637Z     ^[[90m138|^[[39m       expect(importsTestingEntrypoint("import { createFakeScheduler } …
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4647607Z     ^[[90m   |^[[39m              ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4648218Z     ^[[90m139|^[[39m     })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4648738Z     ^[[90m140|^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4648971Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4649424Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4649805Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4652187Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mboundary scan predicates^[[2m > ^[[22mW-1: importsTestingEntrypoint predicate^[[2m > ^[[22mpasses for production adapters and plugins
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4654405Z ^[[31m^[[1mTypeError^[[22m: importsTestingEntrypoint is not a function^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4655783Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m142:14^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4656573Z     ^[[90m140|^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4657190Z     ^[[90m141|^[[39m     ^[[34mit^[[39m(^[[32m"passes for production adapters and plugins"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4657970Z     ^[[90m142|^[[39m       expect(importsTestingEntrypoint("import { createBrowserClock } f…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4658475Z     ^[[90m   |^[[39m              ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4659012Z     ^[[90m143|^[[39m       expect(importsTestingEntrypoint("import { fkPlugin } from '@moti…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4659505Z     ^[[90m144|^[[39m     })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4659681Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4660394Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4660844Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4662802Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mboundary scan predicates^[[2m > ^[[22mW-1: importsTestingEntrypoint predicate^[[2m > ^[[22mpasses for the main entrypoint
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4664855Z ^[[31m^[[1mTypeError^[[22m: importsTestingEntrypoint is not a function^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4666193Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m147:14^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4667046Z     ^[[90m145|^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4668004Z     ^[[90m146|^[[39m     ^[[34mit^[[39m(^[[32m"passes for the main entrypoint"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4669305Z     ^[[90m147|^[[39m       expect(importsTestingEntrypoint("import { Engine } from '@motion…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4673913Z     ^[[90m   |^[[39m              ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4674618Z     ^[[90m148|^[[39m     })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4675212Z     ^[[90m149|^[[39m   })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4675526Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4675971Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4676358Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4678753Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mboundary scan planted violations^[[2m > ^[[22mW-2: apps are discovered and scanned for testing entrypoint imports^[[2m > ^[[22mreports testing entrypoint import from an app
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4682101Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'apps/demo/src/main.ts: test-only entr…'^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4683633Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m197:26^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4685273Z     ^[[90m195|^[[39m     ^[[34mit^[[39m(^[[32m"reports testing entrypoint import from an app"^[[39m^[[33m,^[[39m ^[[35masync^[[39m () ^[[33m=>^[[39m {
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4686841Z     ^[[90m196|^[[39m       const violations = await withTestingEntrypointRoot((root) => sca…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4688201Z     ^[[90m197|^[[39m       expect(violations).toContain("apps/demo/src/main.ts: test-only e…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4692161Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4692840Z     ^[[90m198|^[[39m     })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4693398Z     ^[[90m199|^[[39m   })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4693731Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4694195Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4694590Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4697133Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mboundary scan planted violations^[[2m > ^[[22mW-3: apps are discovered and scanned for core source-internal imports^[[2m > ^[[22mreports core source-internal import from an app (the #164 mistake)
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4700202Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'apps/demo/src/bug.ts: core source-int…'^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4701782Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m204:26^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4703065Z     ^[[90m202|^[[39m     it("reports core source-internal import from an app (the #164 mist…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4704300Z     ^[[90m203|^[[39m       const violations = await withTestingEntrypointRoot((root) => sca…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4705519Z     ^[[90m204|^[[39m       expect(violations).toContain("apps/demo/src/bug.ts: core source-…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4706479Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4707137Z     ^[[90m205|^[[39m     })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4715536Z     ^[[90m206|^[[39m   })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4715908Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4716366Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4716762Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4719298Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mboundary scan planted violations^[[2m > ^[[22mW-4: testing layer files are scanned for renderer/engine imports^[[2m > ^[[22mreports renderer import from the testing layer
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4722447Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'packages/core/src/testing/fakes.ts: r…'^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4723960Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m211:26^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4725701Z     ^[[90m209|^[[39m     ^[[34mit^[[39m(^[[32m"reports renderer import from the testing layer"^[[39m^[[33m,^[[39m ^[[35masync^[[39m () ^[[33m=>^[[39m {
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4726599Z     ^[[90m210|^[[39m       const violations = await withTestingEntrypointRoot((root) => sca…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4727302Z     ^[[90m211|^[[39m       expect(violations).toContain("packages/core/src/testing/fakes.ts…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4727831Z     ^[[90m   |^[[39m                          ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4728190Z     ^[[90m212|^[[39m     })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4728516Z     ^[[90m213|^[[39m   })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4728681Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4728930Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4729145Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4729165Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4729459Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4730472Z ^[[2m      Tests ^[[22m ^[[1m^[[31m7 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m12 passed^[[39m^[[22m^[[90m (19)^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4731039Z ^[[2m   Start at ^[[22m 10:22:13
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4731733Z ^[[2m   Duration ^[[22m 288ms^[[2m (transform 46ms, setup 0ms, import 64ms, tests 77ms, environment 0ms)^[[22m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4732470Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4732478Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4754957Z ##[error]TypeError: importsTestingEntrypoint is not a function
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:134:14
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4763387Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4765219Z ##[error]TypeError: importsTestingEntrypoint is not a function
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:138:14
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4766776Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4768643Z ##[error]TypeError: importsTestingEntrypoint is not a function
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:142:14
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4769667Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4771365Z ##[error]TypeError: importsTestingEntrypoint is not a function
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:147:14
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4772332Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4773872Z ##[error]AssertionError: expected [] to include 'apps/demo/src/main.ts: test-only entr…'
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:197:26
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4774950Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4776499Z ##[error]AssertionError: expected [] to include 'apps/demo/src/bug.ts: core source-int…'
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:204:26
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4777549Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4779200Z ##[error]AssertionError: expected [] to include 'packages/core/src/testing/fakes.ts: r…'
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:211:26
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:22:13.4947303Z ##[error]Process completed with exit code 1.
```
