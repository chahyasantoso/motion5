# CI log archive: 32568986919

- Workflow: CI
- Conclusion: failure
- Head branch: feat/core-testing-entrypoint
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32568986919
- Captured: 2026-08-22T10:58:02Z

## Failed job output

```text
boundaries (node 24)	Run npm run test:boundaries	﻿2026-08-22T10:57:45.0357962Z ##[group]Run npm run test:boundaries
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.0358198Z ^[[36;1mnpm run test:boundaries^[[0m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.0389843Z shell: /usr/bin/bash -e {0}
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.0390021Z env:
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.0390137Z   NODE_VERSION: 24
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.0390259Z ##[endgroup]
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.1177244Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.1178032Z > motion5@0.0.0 test:boundaries
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.1178518Z > node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.1178744Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.1627943Z boundary scan passed
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.5387629Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.5390222Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.5390555Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7582512Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m18 tests^[[22m^[[2m | ^[[22m^[[31m6 failed^[[39m^[[2m)^[[22m^[[32m 49^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7583354Z      ^[[32m✓^[[39m passes a clean fixture^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7583970Z      ^[[32m✓^[[39m fails on renderer and animation-engine imports^[[32m 0^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7584540Z      ^[[32m✓^[[39m fails on banned compatibility vocabulary^[[32m 0^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7584947Z      ^[[32m✓^[[39m fails on a consumer reaching into core source internals^[[32m 0^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7585324Z      ^[[32m✓^[[39m extracts exports outside the public allow list^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7585717Z      ^[[32m✓^[[39m reports every planted violation class through the shipped scanner^[[32m 6^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7586116Z      ^[[32m✓^[[39m reads a core package entry that is not engine.ts^[[32m 3^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7586464Z      ^[[32m✓^[[39m discovers a consumer package that no list mentions^[[32m 3^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7586792Z      ^[[32m✓^[[39m keeps a consumer renderer import legal^[[32m 3^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7587135Z      ^[[32m✓^[[39m executes the shipped scanner against the current tree^[[32m 6^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7587514Z      ^[[32m✓^[[39m G-5: no file under packages/core/src imports gsap^[[32m 6^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7587955Z ^[[31m     ^[[31m×^[[31m W-1: names the testing entrypoint and no production entrypoint^[[39m^[[32m 2^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7588486Z ^[[31m     ^[[31m×^[[31m W-2: reports an app that imports the test-only entrypoint^[[39m^[[32m 3^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7588989Z ^[[31m     ^[[31m×^[[31m W-3: reports an app that reaches into core source, which is the #164 mistake^[[39m^[[32m 2^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7589470Z ^[[31m     ^[[31m×^[[31m W-4: scans the core testing layer for renderer and engine imports^[[39m^[[32m 2^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7589929Z ^[[31m     ^[[31m×^[[31m W-5: declares ./testing and does not declare ./ports/fakes^[[39m^[[32m 1^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7590571Z      ^[[32m✓^[[39m W-6: leaves the shipped tree with no testing entrypoint violation^[[32m 5^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7591003Z ^[[31m     ^[[31m×^[[31m W-7: takes the workspace roots from the root manifest^[[39m^[[32m 4^[[2mms^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7611791Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7612198Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 6 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7612527Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7615030Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mtest-only entrypoint tier (issue #167, ADR-048)^[[2m > ^[[22mW-1: names the testing entrypoint and no production entrypoint
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7618743Z ^[[31m^[[1mTypeError^[[22m: importsTestingEntrypoint is not a function^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7619374Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m180:12^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7653471Z     ^[[90m178|^[[39m ^[[34mdescribe^[[39m(^[[32m"test-only entrypoint tier (issue #167, ADR-048)"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7654198Z     ^[[90m179|^[[39m   it("W-1: names the testing entrypoint and no production entrypoint",…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7655336Z     ^[[90m180|^[[39m     expect(importsTestingEntrypoint(testingEntrypointViolationFixture)…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7656282Z     ^[[90m   |^[[39m            ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7656882Z     ^[[90m181|^[[39m     expect(importsTestingEntrypoint(testingSourcePathViolationFixture)…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7657556Z     ^[[90m182|^[[39m     expect(importsTestingEntrypoint(coreEntrypointFixture)).toBe(false…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7657870Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7658153Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7658363Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7659408Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mtest-only entrypoint tier (issue #167, ADR-048)^[[2m > ^[[22mW-2: reports an app that imports the test-only entrypoint
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7660519Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'apps/demo/src/main.ts: testing entryp…'^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7661425Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m189:24^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7662126Z     ^[[90m187|^[[39m   it("W-2: reports an app that imports the test-only entrypoint", asyn…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7663150Z     ^[[90m188|^[[39m     const violations = await withWorkspaceRoot(WORKSPACES, (planted) =…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7663892Z     ^[[90m189|^[[39m     expect(violations).toContain("apps/demo/src/main.ts: testing entry…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7664399Z     ^[[90m   |^[[39m                        ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7664737Z     ^[[90m190|^[[39m   })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7664994Z     ^[[90m191|^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7665124Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7665366Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7665581Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7666641Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mtest-only entrypoint tier (issue #167, ADR-048)^[[2m > ^[[22mW-3: reports an app that reaches into core source, which is the #164 mistake
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7667791Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'apps/demo/src/main.ts: core source-in…'^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7668495Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m194:24^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7669126Z     ^[[90m192|^[[39m   it("W-3: reports an app that reaches into core source, which is the …
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7669712Z     ^[[90m193|^[[39m     const violations = await withWorkspaceRoot(WORKSPACES, (planted) =…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7670329Z     ^[[90m194|^[[39m     expect(violations).toContain("apps/demo/src/main.ts: core source-i…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7670794Z     ^[[90m   |^[[39m                        ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7671102Z     ^[[90m195|^[[39m   })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7671359Z     ^[[90m196|^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7671470Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7671691Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7671876Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7673341Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mtest-only entrypoint tier (issue #167, ADR-048)^[[2m > ^[[22mW-4: scans the core testing layer for renderer and engine imports
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7674477Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'packages/core/src/testing/fakes.ts: r…'^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7675174Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m199:24^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7675806Z     ^[[90m197|^[[39m   it("W-4: scans the core testing layer for renderer and engine import…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7676395Z     ^[[90m198|^[[39m     const violations = await withWorkspaceRoot(WORKSPACES, (planted) =…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7677002Z     ^[[90m199|^[[39m     expect(violations).toContain("packages/core/src/testing/fakes.ts: …
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7677483Z     ^[[90m   |^[[39m                        ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7677862Z     ^[[90m200|^[[39m   })^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7678108Z     ^[[90m201|^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7678225Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7678442Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7678871Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7679916Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mtest-only entrypoint tier (issue #167, ADR-048)^[[2m > ^[[22mW-5: declares ./testing and does not declare ./ports/fakes
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7680941Z ^[[31m^[[1mAssertionError^[[22m: expected [ '.', './internal', …(5) ] to include './testing'^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7681627Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m205:35^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7684101Z     ^[[90m203|^[[39m     const manifest = await readFile(join(root, "packages", "core", "pa…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7684850Z     ^[[90m204|^[[39m     const declared = (JSON.parse(manifest) as { exports: Record<string…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7685754Z     ^[[90m205|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(declared))^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"./testing"^[[39m)^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7686544Z     ^[[90m   |^[[39m                                   ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7687377Z     ^[[90m206|^[[39m     ^[[34mexpect^[[39m(^[[33mObject^[[39m^[[33m.^[[39m^[[34mkeys^[[39m(declared))^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoContain^[[39m(^[[32m"./ports/fakes"^[[39m)^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7688338Z     ^[[90m207|^[[39m     ^[[34mexpect^[[39m(declared[^[[32m"./testing"^[[39m])^[[33m.^[[39m^[[34mtoEqual^[[39m({
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7688663Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7688912Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7689110Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7690053Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/boundary-scan.test.ts^[[2m > ^[[22mtest-only entrypoint tier (issue #167, ADR-048)^[[2m > ^[[22mW-7: takes the workspace roots from the root manifest
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7691134Z ^[[31m^[[1mAssertionError^[[22m: expected [] to include 'apps/demo/src/main.ts: testing entryp…'^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7691956Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/boundary-scan.test.ts:^[[2m222:22^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7692809Z     ^[[90m220|^[[39m     const undeclared = await withWorkspaceRoot(PACKAGES_ONLY, (planted…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7693515Z     ^[[90m221|^[[39m     const violation = "apps/demo/src/main.ts: testing entrypoint impor…
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7694210Z     ^[[90m222|^[[39m     ^[[34mexpect^[[39m(declared)^[[33m.^[[39m^[[34mtoContain^[[39m(violation)^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7694690Z     ^[[90m   |^[[39m                      ^[[31m^^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7695250Z     ^[[90m223|^[[39m     ^[[34mexpect^[[39m(undeclared)^[[33m.^[[39mnot^[[33m.^[[39m^[[34mtoContain^[[39m(violation)^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7696182Z     ^[[90m224|^[[39m     ^[[35mconst^[[39m bare ^[[33m=^[[39m ^[[35mawait^[[39m ^[[34mmkdtemp^[[39m(^[[34mjoin^[[39m(^[[34mtmpdir^[[39m()^[[33m,^[[39m ^[[32m"motion5-no-manifest-"^[[39m))^[[33m;^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7696685Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7696910Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯^[[22m^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7697106Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7697126Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7697397Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[90m (1)^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7698017Z ^[[2m      Tests ^[[22m ^[[1m^[[31m6 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m12 passed^[[39m^[[22m^[[90m (18)^[[39m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7699052Z ^[[2m   Start at ^[[22m 10:57:45
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7699974Z ^[[2m   Duration ^[[22m 214ms^[[2m (transform 64ms, setup 0ms, import 78ms, tests 49ms, environment 0ms)^[[22m
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7700206Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7700222Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7716157Z ##[error]TypeError: importsTestingEntrypoint is not a function
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:180:12
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7721506Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7723276Z ##[error]AssertionError: expected [] to include 'apps/demo/src/main.ts: testing entryp…'
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:189:24
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7724158Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7725351Z ##[error]AssertionError: expected [] to include 'apps/demo/src/main.ts: core source-in…'
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:194:24
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7726111Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7727148Z ##[error]AssertionError: expected [] to include 'packages/core/src/testing/fakes.ts: r…'
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:199:24
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7727758Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7728456Z ##[error]AssertionError: expected [ '.', './internal', …(5) ] to include './testing'
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:205:35
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7729170Z 
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7730022Z ##[error]AssertionError: expected [] to include 'apps/demo/src/main.ts: testing entryp…'
boundaries (node 24)	Run npm run test:boundaries	 ❯ packages/core/test/unit/scripts/boundary-scan.test.ts:222:22
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	
boundaries (node 24)	Run npm run test:boundaries	2026-08-22T10:57:45.7893296Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm run typecheck	﻿2026-08-22T10:57:42.7990063Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:42.7990407Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:42.8035510Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:42.8036034Z env:
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:42.8036267Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:42.8036497Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:42.9093824Z 
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:42.9094762Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:42.9095306Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:42.9095524Z 
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:46.0350491Z ##[error]packages/core/test/unit/scripts/boundary-scan.test.ts(12,3): error TS2305: Module '"../../../../../scripts/boundary-scan.mjs"' has no exported member 'importsTestingEntrypoint'.
quality (node 24)	Run npm run typecheck	2026-08-22T10:57:46.0807480Z ##[error]Process completed with exit code 2.
```
