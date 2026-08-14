# CI log archive: 31784621105

- Workflow: CI
- Conclusion: failure
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/31784621105
- Captured: 2026-08-14T08:37:36Z

## Failed job output

```text
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	﻿2026-08-14T08:37:11.9113258Z ##[group]Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:11.9120525Z ^[[36;1mnode --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'^[[0m
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:11.9167731Z shell: /usr/bin/bash -e {0}
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:11.9168009Z env:
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:11.9168202Z   NODE_VERSION: 24
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:11.9168421Z ##[endgroup]
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0251283Z node:internal/errors:985
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0252119Z   const err = new Error(message);
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0252707Z               ^
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0253028Z 
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0254068Z Error: Command failed: npm pack packages/core --pack-destination /home/runner/work/motion5/motion5/.tmp-package-consumer-WgmEN0
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0255806Z npm error code 128
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0256337Z npm error An unknown git error occurred
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0257420Z npm error command git --no-replace-objects ls-remote ssh://git@github.com/packages/core.git
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0258307Z npm error git@github.com: Permission denied (publickey).
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0259239Z npm error fatal: Could not read from remote repository.
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0259825Z npm error
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0260446Z npm error Please make sure you have the correct access rights
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0261208Z npm error and the repository exists.
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0262338Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-14T08_37_13_968Z-debug-0.log
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0263675Z 
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0264106Z     at genericNodeError (node:internal/errors:985:15)
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0265091Z     at wrappedFn (node:internal/errors:539:14)
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0265568Z     at ChildProcess.exithandler (node:child_process:417:12)
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0265990Z     at ChildProcess.emit (node:events:509:28)
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0266374Z     at maybeClose (node:internal/child_process:1124:16)
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0266844Z     at ChildProcess._handle.onexit (node:internal/child_process:306:5) {
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0267232Z   code: 128,
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0267451Z   killed: false,
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0267700Z   signal: null,
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0268244Z   cmd: 'npm pack packages/core --pack-destination /home/runner/work/motion5/motion5/.tmp-package-consumer-WgmEN0',
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0268777Z   stdout: '',
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0269035Z   stderr: 'npm error code 128\n' +
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0269427Z     'npm error An unknown git error occurred\n' +
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0270007Z     'npm error command git --no-replace-objects ls-remote ssh://git@github.com/packages/core.git\n' +
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0270634Z     'npm error git@github.com: Permission denied (publickey).\n' +
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0271107Z     'npm error fatal: Could not read from remote repository.\n' +
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0271497Z     'npm error\n' +
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0271854Z     'npm error Please make sure you have the correct access rights\n' +
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0272282Z     'npm error and the repository exists.\n' +
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0272896Z     'npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-14T08_37_13_968Z-debug-0.log\n'
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0273408Z }
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0273513Z 
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0273616Z Node.js v24.18.0
package consumer (node 24)	Run node --input-type=module -e 'import("./scripts/package-consumer-check.mjs").then(({checkPackedConsumer}) => checkPackedConsumer()).then(({ok, errors}) => { if (!ok) { console.error(errors); process.exit(1); } })'	2026-08-14T08:37:15.0321916Z ##[error]Process completed with exit code 1.
quality (node 24)	Run npm test	﻿2026-08-14T08:37:11.2232978Z ##[group]Run npm test
quality (node 24)	Run npm test	2026-08-14T08:37:11.2233320Z ^[[36;1mnpm test^[[0m
quality (node 24)	Run npm test	2026-08-14T08:37:11.2274122Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm test	2026-08-14T08:37:11.2274423Z env:
quality (node 24)	Run npm test	2026-08-14T08:37:11.2274644Z   NODE_VERSION: 24
quality (node 24)	Run npm test	2026-08-14T08:37:11.2274875Z ##[endgroup]
quality (node 24)	Run npm test	2026-08-14T08:37:11.3477700Z 
quality (node 24)	Run npm test	2026-08-14T08:37:11.3478530Z > motion5@0.0.0 test
quality (node 24)	Run npm test	2026-08-14T08:37:11.3479064Z > vitest run
quality (node 24)	Run npm test	2026-08-14T08:37:11.3479314Z 
quality (node 24)	Run npm test	2026-08-14T08:37:11.6522159Z 
quality (node 24)	Run npm test	2026-08-14T08:37:11.6526653Z ^[[1m^[[30m^[[46m RUN ^[[49m^[[39m^[[22m ^[[36mv4.1.10 ^[[39m^[[90m/home/runner/work/motion5/motion5^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:11.6527930Z 
quality (node 24)	Run npm test	2026-08-14T08:37:12.1481442Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugins.test.ts ^[[2m(^[[22m^[[2m12 tests^[[22m^[[2m)^[[22m^[[32m 35^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:12.2026314Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-reentrancy.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:12.4654156Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-state.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:12.4922985Z  ^[[32m✓^[[39m packages/core/test/integration/engine-x3-contribution.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 32^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:12.7191763Z  ^[[32m✓^[[39m packages/core/test/contract/v5-validator.test.ts ^[[2m(^[[22m^[[2m9 tests^[[22m^[[2m)^[[22m^[[32m 17^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:12.7347342Z  ^[[32m✓^[[39m packages/core/test/contract/validation-owner.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:12.9678083Z  ^[[32m✓^[[39m packages/core/test/integration/p2-runtime-smells.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:13.0217286Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/boundary-scan.test.ts ^[[2m(^[[22m^[[2m10 tests^[[22m^[[2m)^[[22m^[[32m 76^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:13.2358721Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/publisher-flat-inputs.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:13.2895615Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/clock-tick-identity.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:13.4846319Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-structural-change.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:13.5152561Z  ^[[32m✓^[[39m packages/core/test/unit/graph/order.test.ts ^[[2m(^[[22m^[[2m8 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:13.7488822Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ir-validation.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:13.7838731Z  ^[[32m✓^[[39m packages/core/test/integration/cross-motion.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 12^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:13.9427496Z  ^[[32m✓^[[39m packages/core/test/integration/diagnostics.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:14.0288603Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/composition-output-shape.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:14.3219706Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-contract.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:14.3678574Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-authored-duration.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 24^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:14.5706129Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/scheduler-reentrancy.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:14.6028970Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:14.6560498Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/public-declaration-surface.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[33m 2676^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:14.6562633Z      ^[[33m^[[2m✓^[[22m^[[39m scans the emitted entry declaration closure, not just source strings ^[[33m 2673^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:14.7898141Z  ^[[32m✓^[[39m packages/core/test/unit/domain/track.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:14.8499088Z  ^[[32m✓^[[39m packages/core/test/integration/engine-headless.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:14.8825813Z  ^[[32m✓^[[39m packages/core/test/integration/publisher-output-merge-consistency.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.0032927Z  ^[[32m✓^[[39m packages/core/test/integration/adoption.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.0364380Z  ^[[32m✓^[[39m packages/core/test/unit/graph/references.test.ts ^[[2m(^[[22m^[[2m7 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.1337498Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-absolute-stops.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 23^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.1848834Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.2462769Z  ^[[32m✓^[[39m packages/core/test/integration/graph-publisher.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.3632349Z  ^[[32m✓^[[39m packages/core/test/integration/remount.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.4212376Z  ^[[32m✓^[[39m packages/core/test/contract/adapters.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.4591748Z  ^[[32m✓^[[39m packages/core/test/integration/graph-rollback.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 13^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.5823580Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-types.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.6598110Z  ^[[32m✓^[[39m packages/core/test/integration/engine-load-validation.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.6608954Z  ^[[32m✓^[[39m packages/core/test/unit/domain/motion.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.7888177Z  ^[[32m✓^[[39m packages/core/test/integration/graph-runtime.test.ts ^[[2m(^[[22m^[[2m4 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.8471695Z  ^[[32m✓^[[39m packages/core/test/migration/v4-to-v5.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:15.8872237Z  ^[[32m✓^[[39m packages/core/test/integration/flush-output-merge.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.0138952Z  ^[[32m✓^[[39m packages/core/test/integration/dom-plugin-metadata.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.0347834Z  ^[[32m✓^[[39m packages/core/test/integration/dom-patch-apply.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.0706801Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-listener-snapshot.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.1934031Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/governance-gates.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.2866169Z  ^[[32m✓^[[39m packages/react/test/patch-store-lifecycle.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.2989890Z ^[[90mstderr^[[2m | packages/react/test/public-package-surface.test.ts^[[2m > ^[[22m^[[2mReact public package surface (C2)^[[2m > ^[[22m^[[2mrenders and updates through the package entry alone
quality (node 24)	Run npm test	2026-08-14T08:37:16.2992190Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T08:37:16.2995050Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T08:37:16.2996635Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T08:37:16.2997785Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T08:37:16.2998818Z 
quality (node 24)	Run npm test	2026-08-14T08:37:16.3002301Z  ^[[32m✓^[[39m packages/react/test/public-package-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.3883742Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-sparse-percent-map.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 19^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.4855678Z  ^[[32m✓^[[39m packages/core/test/contract/ports.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.5280860Z  ^[[32m✓^[[39m packages/core/test/integration/project-runtime.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.5700261Z  ^[[32m✓^[[39m packages/core/test/unit/domain/plugin-contribution-completeness.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.6898909Z  ^[[32m✓^[[39m packages/core/test/unit/domain/s7-plugin-evidence.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.7815644Z  ^[[32m✓^[[39m packages/core/test/integration/partial-seed-inputs.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.8185670Z  ^[[32m✓^[[39m packages/core/test/integration/end-to-end.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 14^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.9234008Z  ^[[32m✓^[[39m packages/core/test/integration/contract-baseline.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 18^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:16.9674858Z  ^[[32m✓^[[39m packages/core/test/unit/domain/lifecycle.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.0408712Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-paused-timeline.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.1256401Z  ^[[32m✓^[[39m packages/core/test/unit/graph/ids.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.1722672Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/acceptance-scan.test.ts ^[[2m(^[[22m^[[2m3 tests^[[22m^[[2m)^[[22m^[[32m 20^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.2335185Z  ^[[32m✓^[[39m packages/core/test/unit/domain/values.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.3178046Z  ^[[32m✓^[[39m packages/core/test/unit/runtime/patch-registry-retention.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.4389547Z  ^[[32m✓^[[39m packages/core/test/unit/graph/observation-projection-validation.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.5232290Z  ^[[32m✓^[[39m packages/core/test/integration/motion-trigger-lifecycle.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.6189769Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/mutation-config.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 8^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.7084434Z  ^[[32m✓^[[39m packages/core/test/integration/dom-transform-removal.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.8250334Z  ^[[32m✓^[[39m packages/core/test/contract/s4-validation-owner.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 5^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:17.8851709Z  ^[[32m✓^[[39m packages/core/test/unit/domain/triggers.test.ts ^[[2m(^[[22m^[[2m6 tests^[[22m^[[2m)^[[22m^[[32m 11^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:18.0548557Z  ^[[32m✓^[[39m packages/react/test/patch-store.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:18.0985646Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/s7-recovery-audit.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:18.3038517Z ^[[90mstderr^[[2m | packages/react/test/public-hook-render.test.ts^[[2m > ^[[22m^[[2mReact public hook render/update (C2)^[[2m > ^[[22m^[[2mrenders the current patch and updates after publication
quality (node 24)	Run npm test	2026-08-14T08:37:18.3040802Z ^[[22m^[[39mreact-test-renderer is deprecated. See https://react.dev/warnings/react-test-renderer
quality (node 24)	Run npm test	2026-08-14T08:37:18.3042086Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T08:37:18.3059619Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T08:37:18.3061293Z  ^[[32m✓^[[39m packages/react/test/public-hook-render.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 21^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:18.3096955Z The current testing environment is not configured to support act(...)
quality (node 24)	Run npm test	2026-08-14T08:37:18.3135133Z 
quality (node 24)	Run npm test	2026-08-14T08:37:18.3971740Z  ^[[32m✓^[[39m packages/core/test/integration/project-handle-surface.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 10^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:18.5730238Z  ^[[32m✓^[[39m packages/core/test/integration/membership-gating.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:18.6258613Z  ^[[32m✓^[[39m packages/core/test/integration/plugin-use-contract.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 7^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:18.8549238Z  ^[[32m✓^[[39m packages/core/test/contract/gsap-multi-stop.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 9^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:19.1163368Z  ^[[32m✓^[[39m packages/core/test/unit/placeholder.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m)^[[22m^[[32m 4^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:19.3392457Z  ^[[32m✓^[[39m packages/core/test/integration/golden-roundtrip.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 16^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:19.5787441Z  ^[[32m✓^[[39m packages/react/test/public-hook.test.ts ^[[2m(^[[22m^[[2m1 test^[[22m^[[2m)^[[22m^[[32m 6^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:19.9087723Z  ^[[32m✓^[[39m packages/core/test/unit/scripts/api-surface-check.test.ts ^[[2m(^[[22m^[[2m5 tests^[[22m^[[2m)^[[22m^[[33m 2546^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:19.9089942Z      ^[[33m^[[2m✓^[[22m^[[39m accepts the committed public declaration surface ^[[33m 2541^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6269477Z  ^[[31m❯^[[39m packages/core/test/unit/scripts/packed-consumer-check.test.ts ^[[2m(^[[22m^[[2m2 tests^[[22m^[[2m | ^[[22m^[[31m2 failed^[[39m^[[2m)^[[22m^[[33m 4792^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6271401Z ^[[31m     ^[[31m×^[[31m accepts documented ESM and TypeScript imports from the packed core artifact^[[39m^[[33m 2644^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6272901Z ^[[31m     ^[[31m×^[[31m rejects deep wildcard imports that bypass the documented export map^[[39m^[[33m 2145^[[2mms^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6306947Z 
quality (node 24)	Run npm test	2026-08-14T08:37:23.6307712Z ^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m^[[1m^[[41m Failed Tests 2 ^[[49m^[[22m^[[31m⎯⎯⎯⎯⎯⎯⎯^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6308157Z 
quality (node 24)	Run npm test	2026-08-14T08:37:23.6311702Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/packed-consumer-check.test.ts^[[2m > ^[[22mP6-02 packed package consumer^[[2m > ^[[22maccepts documented ESM and TypeScript imports from the packed core artifact
quality (node 24)	Run npm test	2026-08-14T08:37:23.6316237Z ^[[31m^[[1mAssertionError^[[22m: promise rejected "Error: Command failed: npm pack packages/… { …(6) }" instead of resolving^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6318071Z ^[[36m ^[[2m❯^[[22m packages/core/test/unit/scripts/packed-consumer-check.test.ts:^[[2m6:40^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6342016Z     ^[[90m  4|^[[39m ^[[34mdescribe^[[39m(^[[32m"P6-02 packed package consumer"^[[39m^[[33m,^[[39m () ^[[33m=>^[[39m {
quality (node 24)	Run npm test	2026-08-14T08:37:23.6343183Z     ^[[90m  5|^[[39m   it("accepts documented ESM and TypeScript imports from the packed co…
quality (node 24)	Run npm test	2026-08-14T08:37:23.6344056Z     ^[[90m  6|^[[39m     await expect(checkPackedConsumer()).resolves.toEqual({ ok: true, e…
quality (node 24)	Run npm test	2026-08-14T08:37:23.6344700Z     ^[[90m   |^[[39m                                        ^[[31m^^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6345103Z     ^[[90m  7|^[[39m   })^[[33m;^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6345402Z     ^[[90m  8|^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6345562Z 
quality (node 24)	Run npm test	2026-08-14T08:37:23.6346694Z ^[[31m^[[1mCaused by: Error^[[22m: Command failed: npm pack packages/core --pack-destination /home/runner/work/motion5/motion5/.tmp-package-consumer-yvh1ty
quality (node 24)	Run npm test	2026-08-14T08:37:23.6347417Z npm error code 128
quality (node 24)	Run npm test	2026-08-14T08:37:23.6348010Z npm error An unknown git error occurred
quality (node 24)	Run npm test	2026-08-14T08:37:23.6348634Z npm error command git --no-replace-objects ls-remote ssh://git@github.com/packages/core.git
quality (node 24)	Run npm test	2026-08-14T08:37:23.6349256Z npm error git@github.com: Permission denied (publickey).
quality (node 24)	Run npm test	2026-08-14T08:37:23.6349869Z npm error fatal: Could not read from remote repository.
quality (node 24)	Run npm test	2026-08-14T08:37:23.6350198Z npm error
quality (node 24)	Run npm test	2026-08-14T08:37:23.6350554Z npm error Please make sure you have the correct access rights
quality (node 24)	Run npm test	2026-08-14T08:37:23.6351063Z npm error and the repository exists.
quality (node 24)	Run npm test	2026-08-14T08:37:23.6352128Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-14T08_37_20_952Z-debug-0.log
quality (node 24)	Run npm test	2026-08-14T08:37:23.6352848Z ^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6353440Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6359992Z ^[[31m^[[1mSerialized Error:^[[22m^[[39m ^[[90m{ code: 128, killed: false, signal: null, cmd: 'npm pack packages/core --pack-destination /home/runner/work/motion5/motion5/.tmp-package-consumer-yvh1ty', stdout: '', stderr: 'npm error code 128\nnpm error An unknown git error occurred\nnpm error command git --no-replace-objects ls-remote ssh://git@github.com/packages/core.git\nnpm error git@github.com: Permission denied (publickey).\nnpm error fatal: Could not read from remote repository.\nnpm error\nnpm error Please make sure you have the correct access rights\nnpm error and the repository exists.\nnpm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-14T08_37_20_952Z-debug-0.log\n' }^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6364716Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6365095Z 
quality (node 24)	Run npm test	2026-08-14T08:37:23.6369322Z ^[[41m^[[1m FAIL ^[[22m^[[49m packages/core/test/unit/scripts/packed-consumer-check.test.ts^[[2m > ^[[22mP6-02 packed package consumer^[[2m > ^[[22mrejects deep wildcard imports that bypass the documented export map
quality (node 24)	Run npm test	2026-08-14T08:37:23.6371904Z ^[[31m^[[1mError^[[22m: Command failed: npm pack packages/core --pack-destination /home/runner/work/motion5/motion5/.tmp-package-consumer-M4nUNb
quality (node 24)	Run npm test	2026-08-14T08:37:23.6372991Z npm error code 128
quality (node 24)	Run npm test	2026-08-14T08:37:23.6373438Z npm error An unknown git error occurred
quality (node 24)	Run npm test	2026-08-14T08:37:23.6374390Z npm error command git --no-replace-objects ls-remote ssh://git@github.com/packages/core.git
quality (node 24)	Run npm test	2026-08-14T08:37:23.6375372Z npm error git@github.com: Permission denied (publickey).
quality (node 24)	Run npm test	2026-08-14T08:37:23.6376313Z npm error fatal: Could not read from remote repository.
quality (node 24)	Run npm test	2026-08-14T08:37:23.6376822Z npm error
quality (node 24)	Run npm test	2026-08-14T08:37:23.6377365Z npm error Please make sure you have the correct access rights
quality (node 24)	Run npm test	2026-08-14T08:37:23.6377845Z npm error and the repository exists.
quality (node 24)	Run npm test	2026-08-14T08:37:23.6378503Z npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-14T08_37_23_175Z-debug-0.log
quality (node 24)	Run npm test	2026-08-14T08:37:23.6379046Z ^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6379403Z ^[[31m^[[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯^[[22m^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6379648Z 
quality (node 24)	Run npm test	2026-08-14T08:37:23.6379696Z 
quality (node 24)	Run npm test	2026-08-14T08:37:23.6380184Z ^[[2m Test Files ^[[22m ^[[1m^[[31m1 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m75 passed^[[39m^[[22m^[[90m (76)^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6381009Z ^[[2m      Tests ^[[22m ^[[1m^[[31m2 failed^[[39m^[[22m^[[2m | ^[[22m^[[1m^[[32m281 passed^[[39m^[[22m^[[90m (283)^[[39m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6381563Z ^[[2m   Start at ^[[22m 08:37:11
quality (node 24)	Run npm test	2026-08-14T08:37:23.6382271Z ^[[2m   Duration ^[[22m 11.95s^[[2m (transform 1.33s, setup 0ms, import 3.64s, tests 10.93s, environment 10ms)^[[22m
quality (node 24)	Run npm test	2026-08-14T08:37:23.6382816Z 
quality (node 24)	Run npm test	2026-08-14T08:37:23.6391073Z 
quality (node 24)	Run npm test	2026-08-14T08:37:23.6424988Z ##[error]AssertionError: promise rejected "Error: Command failed: npm pack packages/… { …(6) }" instead of resolving
quality (node 24)	Run npm test	 ❯ packages/core/test/unit/scripts/packed-consumer-check.test.ts:6:40
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	Caused by: Caused by: Error: Command failed: npm pack packages/core --pack-destination /home/runner/work/motion5/motion5/.tmp-package-consumer-yvh1ty
quality (node 24)	Run npm test	npm error code 128
quality (node 24)	Run npm test	npm error An unknown git error occurred
quality (node 24)	Run npm test	npm error command git --no-replace-objects ls-remote ssh://git@github.com/packages/core.git
quality (node 24)	Run npm test	npm error git@github.com: Permission denied (publickey).
quality (node 24)	Run npm test	npm error fatal: Could not read from remote repository.
quality (node 24)	Run npm test	npm error
quality (node 24)	Run npm test	npm error Please make sure you have the correct access rights
quality (node 24)	Run npm test	npm error and the repository exists.
quality (node 24)	Run npm test	npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-14T08_37_20_952Z-debug-0.log
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
quality (node 24)	Run npm test	Serialized Error: { code: 128, killed: false, signal: null, cmd: 'npm pack packages/core --pack-destination /home/runner/work/motion5/motion5/.tmp-package-consumer-yvh1ty', stdout: '', stderr: 'npm error code 128\nnpm error An unknown git error occurred\nnpm error command git --no-replace-objects ls-remote ssh://git@github.com/packages/core.git\nnpm error git@github.com: Permission denied (publickey).\nnpm error fatal: Could not read from remote repository.\nnpm error\nnpm error Please make sure you have the correct access rights\nnpm error and the repository exists.\nnpm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-08-14T08_37_20_952Z-debug-0.log\n' }
quality (node 24)	Run npm test	
quality (node 24)	Run npm test	2026-08-14T08:37:23.6769181Z ##[error]Process completed with exit code 1.
```
