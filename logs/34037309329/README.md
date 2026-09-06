# CI log archive: 34037309329

- Workflow: CI
- Conclusion: failure
- Head branch: chore/328-03-single-suite
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/34037309329
- Captured: 2026-09-06T13:52:31Z

## Failed job output

```text
quality (node 24)	Run npm run format:check	﻿2026-09-06T13:50:36.8970669Z ##[group]Run npm run format:check
quality (node 24)	Run npm run format:check	2026-09-06T13:50:36.8971035Z ^[[36;1mnpm run format:check^[[0m
quality (node 24)	Run npm run format:check	2026-09-06T13:50:36.9011213Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run format:check	2026-09-06T13:50:36.9011505Z env:
quality (node 24)	Run npm run format:check	2026-09-06T13:50:36.9011725Z   NODE_VERSION: 24
quality (node 24)	Run npm run format:check	2026-09-06T13:50:36.9012044Z   CI_EVIDENCE_DIR: /home/runner/work/_temp/ci-evidence
quality (node 24)	Run npm run format:check	2026-09-06T13:50:36.9012381Z ##[endgroup]
quality (node 24)	Run npm run format:check	2026-09-06T13:50:37.0031691Z 
quality (node 24)	Run npm run format:check	2026-09-06T13:50:37.0032763Z > motion5@0.0.0 format:check
quality (node 24)	Run npm run format:check	2026-09-06T13:50:37.0033483Z > prettier . --check
quality (node 24)	Run npm run format:check	2026-09-06T13:50:37.0033750Z 
quality (node 24)	Run npm run format:check	2026-09-06T13:50:37.0938943Z Checking formatting...
quality (node 24)	Run npm run format:check	2026-09-06T13:50:44.6903520Z [^[[33mwarn^[[39m] scripts/ci-evidence.mjs
quality (node 24)	Run npm run format:check	2026-09-06T13:50:44.7358353Z [^[[33mwarn^[[39m] Code style issues found in the above file. Run Prettier with --write to fix.
quality (node 24)	Run npm run format:check	2026-09-06T13:50:44.7870995Z ##[error]Process completed with exit code 1.
quality (node 24)	Show expected evidence-adapter formatting without writing	﻿2026-09-06T13:50:44.7953441Z ##[group]Run npx --no-install prettier scripts/ci-evidence.mjs
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:44.7953956Z ^[[36;1mnpx --no-install prettier scripts/ci-evidence.mjs^[[0m
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:44.7954288Z ^[[36;1mexit 1^[[0m
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:44.7993962Z shell: /usr/bin/bash -e {0}
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:44.7994237Z env:
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:44.7994475Z   NODE_VERSION: 24
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:44.7994758Z   CI_EVIDENCE_DIR: /home/runner/work/_temp/ci-evidence
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:44.7995095Z ##[endgroup]
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2624617Z #!/usr/bin/env node
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2643990Z // One owner for discovery parity and consumption of the single suite's evidence.
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2644570Z import assert from "node:assert/strict";
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2644976Z import { execFileSync } from "node:child_process";
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2645873Z import { createHash } from "node:crypto";
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2646323Z import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2646724Z import path from "node:path";
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2647130Z import { pathToFileURL } from "node:url";
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2647333Z 
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2647446Z const filters = {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2647679Z   all: "",
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2647960Z   integration: "packages/core/test/integration",
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2648413Z   "end-to-end": "packages/core/test/integration/end-to-end.test.ts",
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2648779Z };
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2649090Z const directory = () => process.env.CI_EVIDENCE_DIR;
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2649431Z const read = (file) => {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2649712Z   const bytes = readFileSync(file);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2650121Z   assert.ok(bytes.length <= 20000000, "Evidence exceeds read limit");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2650557Z   return JSON.parse(bytes.toString("utf8"));
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2650892Z };
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2651155Z const write = (name, value) => {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2651507Z   assert.ok(directory(), "CI_EVIDENCE_DIR is required");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2651897Z   mkdirSync(directory(), { recursive: true });
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2652644Z   writeFileSync(path.join(directory(), name), `${JSON.stringify(value)}\n`);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2653255Z };
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2653572Z function identity() {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2654110Z   const sha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2654691Z   assert.match(sha, /^[a-f0-9]{40}$/);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2655200Z   const configuration = createHash("sha256");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2656024Z   for (const file of ["package-lock.json", "vite.config.ts", "scripts/ci-evidence.mjs"])
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2656679Z     configuration.update(file).update("\0").update(readFileSync(file));
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2657080Z   return {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2657361Z     sha,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2658623Z     run: process.env.GITHUB_RUN_ID,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2659150Z     attempt: process.env.GITHUB_RUN_ATTEMPT,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2659722Z     configuration: configuration.digest("hex"),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2660229Z     node: process.version,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2660602Z   };
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2660900Z }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2661233Z function relative(file) {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2661875Z   const value = path.relative(process.cwd(), file).split(path.sep).join("/");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2662906Z   assert.ok(value && !value.startsWith("../") && !path.isAbsolute(value));
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2663505Z   return value;
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2663719Z }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2663950Z function key(test) {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2664240Z   assert.equal(typeof test.file, "string");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2664574Z   assert.equal(typeof test.name, "string");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2665043Z   assert.ok(test.file && test.name && !test.projectName, "Unsupported test identity");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2665516Z   return JSON.stringify([test.file, test.name]);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2665822Z }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2666066Z function counts(tests) {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2666497Z   assert.ok(Array.isArray(tests) && tests.length > 0, "Missing or empty inventory");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2666925Z   const result = new Map();
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2667491Z   for (const test of tests) {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2667754Z     const id = key(test);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2668058Z     result.set(id, (result.get(id) ?? 0) + 1);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2668348Z   }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2668645Z   return [...result].sort(([a], [b]) => a.localeCompare(b));
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2668975Z }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2669304Z export function verify(inventory, result, expected, scope) {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2669772Z   assert.ok(Object.hasOwn(filters, scope), "Unknown evidence scope");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2670183Z   assert.equal(inventory.version, 1);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2670498Z   assert.equal(result.version, 1);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2670946Z   assert.deepEqual(inventory.identity, expected, "Discovery identity mismatch");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2671664Z   assert.deepEqual(result.identity, expected, "Execution identity mismatch");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2672230Z   assert.equal(result.reason, "passed", "Suite did not complete successfully");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2672967Z   assert.deepEqual(result.errors, [], "Unhandled suite errors");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2673507Z   assert.ok(result.modules.length > 0, "Missing modules");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2673839Z   assert.ok(
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2674155Z     result.modules.every((module) => module.state === "passed"),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2674502Z     "Failed module",
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2674725Z   );
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2674956Z   const all = counts(inventory.all);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2675313Z   for (const subset of ["integration", "end-to-end"]) {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2675830Z     const selected = inventory.all.filter((test) => test.file.includes(filters[subset]));
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2676474Z     assert.deepEqual(counts(inventory[subset]), counts(selected), "Discovery parity failed");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2676911Z   }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2677256Z   const passed = result.tests.filter((test) => test.state === "passed");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2677791Z   assert.deepEqual(counts(passed), all, "Executed tests differ from discovery");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2678378Z   const selected = result.tests.filter((test) => test.file.includes(filters[scope]));
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2678886Z   assert.ok(selected.length > 0, "Missing scoped results");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2679238Z   if (scope !== "all")
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2679469Z     assert.ok(
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2679773Z       selected.every((test) => test.state === "passed"),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2680116Z       "Skipped or failed subset",
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2680373Z     );
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2680711Z   return { scope, tests: inventory[scope].length, identity: expected };
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2681066Z }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2681179Z 
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2681345Z export default class EvidenceReporter {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2681674Z   onTestRunEnd(modules, errors, reason) {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2681976Z     write("execution.json", {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2682234Z       version: 1,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2682639Z       identity: identity(),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2682889Z       reason,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2683185Z       errors: errors.map((error) => String(error.message)),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2683562Z       modules: modules.map((module) => ({
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2683903Z         file: relative(module.moduleId),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2684207Z         state: module.state(),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2684464Z       })),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2684711Z       tests: modules.flatMap((module) =>
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2685067Z         [...module.children.allTests()].map((test) => ({
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2685425Z           file: relative(module.moduleId),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2685731Z           name: test.fullName,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2686053Z           projectName: module.project.name || undefined,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2686396Z           state: test.result().state,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2686660Z         })),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2686856Z       ),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2687054Z     });
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2687249Z   }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2687441Z }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2687548Z 
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2687851Z if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2688445Z   try {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2688680Z     const command = process.argv[2];
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2688973Z     if (command === "discover") {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2689330Z       const inventory = { version: 1, identity: identity() };
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2689749Z       assert.ok(directory(), "CI_EVIDENCE_DIR is required");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2690131Z       mkdirSync(directory(), { recursive: true });
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2690536Z       for (const [scope, filter] of Object.entries(filters)) {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2690964Z         const output = path.join(directory(), `${scope}.json`);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2691311Z         execFileSync(
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2691563Z           process.execPath,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2691807Z           [
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2692203Z             "node_modules/vitest/vitest.mjs",
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2692675Z             "list",
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2693019Z             ...(filter ? [filter] : []),
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2693344Z             `--json=${output}`,
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2693603Z           ],
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2693874Z           { stdio: "inherit", timeout: 180000 },
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2694163Z         );
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2694568Z         inventory[scope] = read(output).map((test) => ({ ...test, file: relative(test.file) }));
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2695035Z         counts(inventory[scope]);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2695291Z       }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2695523Z       write("inventory.json", inventory);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2695803Z     } else {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2696108Z       assert.equal(command, "verify", "Unsupported operation");
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2696578Z       const inventory = read(path.join(directory(), "inventory.json"));
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2697066Z       const result = read(path.join(directory(), "execution.json"));
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2697618Z       console.log(JSON.stringify(verify(inventory, result, identity(), process.argv[3])));
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2698042Z     }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2698250Z   } catch (error) {
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2698511Z     console.error(error.message);
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2698781Z     process.exitCode = 1;
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2699018Z   }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2699209Z }
quality (node 24)	Show expected evidence-adapter formatting without writing	2026-09-06T13:50:45.2957074Z ##[error]Process completed with exit code 1.
integration (node 24)	Require successful suite owner, including evidence verification	﻿2026-09-06T13:51:42.4878967Z ##[group]Run test "$SUITE_RESULT" = success
integration (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:51:42.4879776Z ^[[36;1mtest "$SUITE_RESULT" = success^[[0m
integration (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:51:42.4924509Z shell: /usr/bin/bash -e {0}
integration (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:51:42.4925355Z env:
integration (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:51:42.4925821Z   NODE_VERSION: 24
integration (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:51:42.4926320Z   SUITE_RESULT: failure
integration (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:51:42.4926839Z ##[endgroup]
integration (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:51:42.5060263Z ##[error]Process completed with exit code 1.
end-to-end (node 24)	Require successful suite owner, including evidence verification	﻿2026-09-06T13:52:17.3818532Z ##[group]Run test "$SUITE_RESULT" = success
end-to-end (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:52:17.3819307Z ^[[36;1mtest "$SUITE_RESULT" = success^[[0m
end-to-end (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:52:17.3860461Z shell: /usr/bin/bash -e {0}
end-to-end (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:52:17.3861295Z env:
end-to-end (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:52:17.3861737Z   NODE_VERSION: 24
end-to-end (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:52:17.3862476Z   SUITE_RESULT: failure
end-to-end (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:52:17.3862964Z ##[endgroup]
end-to-end (node 24)	Require successful suite owner, including evidence verification	2026-09-06T13:52:17.4008518Z ##[error]Process completed with exit code 1.
```
