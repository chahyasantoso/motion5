# CI log archive: 32478444494

- Workflow: CI
- Conclusion: failure
- Head branch: feat/issue-173-plugin-owned-requirements
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/32478444494
- Captured: 2026-08-21T11:43:12Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-21T11:42:50.3073003Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:50.3073362Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:50.3118171Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:50.3118666Z env:
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:50.3118876Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:50.3119092Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:50.4155970Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:50.4156512Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:50.4157304Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:50.4157529Z 
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:53.5990986Z ##[error]packages/core/test/unit/domain/track.test.ts(75,7): error TS2741: Property 'requirements' is missing in type '{ plugins: readonly { name: string; compose: (values: Readonly<ImmutableRecord>, progress: number) => ImmutableRecord; }[]; diagnostics: readonly never[]; authoredKeyframes: Readonly<{}>; internalKeys: readonly never[]; outputSerializers: Readonly<...>; preparation: { ...; }; }' but required in type 'ResolvedPlugins'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:53.6002347Z ##[error]packages/core/test/unit/domain/track.test.ts(89,7): error TS2741: Property 'requirements' is missing in type '{ plugins: readonly { name: string; compose: (values: Readonly<ImmutableRecord>, progress: number) => ImmutableRecord; }[]; diagnostics: readonly never[]; authoredKeyframes: Readonly<{}>; internalKeys: readonly never[]; outputSerializers: Readonly<...>; preparation: { ...; }; }' but required in type 'ResolvedPlugins'.
quality (node 24)	Run npm run typecheck	2026-08-21T11:42:53.6349375Z ##[error]Process completed with exit code 2.
```
