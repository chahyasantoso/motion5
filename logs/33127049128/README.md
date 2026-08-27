# CI log archive: 33127049128

- Workflow: CI
- Conclusion: failure
- Head branch: feat/d0-goal-slot-contract
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33127049128
- Captured: 2026-08-27T23:40:06Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-27T23:39:44.7110638Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:44.7110983Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:44.7153539Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:44.7154021Z env:
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:44.7154250Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:44.7154475Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:44.8162982Z 
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:44.8163790Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:44.8164444Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:44.8164755Z 
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:47.9915892Z ##[error]packages/core/test/unit/domain/plugin-slot-claim.test.ts(72,7): error TS2322: Type '{ requires: { root: string; targets: { "forearm-L": string; "forearm-R": string; }; }; }' is not assignable to type 'AuthoredKeyframe'.
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:47.9925363Z   Types of property 'requires' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:47.9926631Z     Type '{ root: string; targets: { "forearm-L": string; "forearm-R": string; }; }' is not assignable to type 'Readonly<Record<string, string>>'.
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:47.9927719Z       Property 'targets' is incompatible with index signature.
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:47.9928612Z         Type '{ "forearm-L": string; "forearm-R": string; }' is not assignable to type 'string'.
quality (node 24)	Run npm run typecheck	2026-08-27T23:39:48.0329543Z ##[error]Process completed with exit code 2.
```
