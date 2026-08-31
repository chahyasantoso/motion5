# CI log archive: 33352745056

- Workflow: CI
- Conclusion: failure
- Head branch: perf/ra-18-graph-ir-dependents
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33352745056
- Captured: 2026-08-31T03:06:57Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-31T03:06:30.8597903Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:30.8598262Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:30.8637841Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:30.8638335Z env:
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:30.8638542Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:30.8638761Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:30.9737016Z 
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:30.9737800Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:30.9738384Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:30.9738624Z 
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7921651Z ##[error]packages/core/test/integration/flush-output-merge.test.ts(9,54): error TS2322: Type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7934500Z   Property 'dependents' is missing in type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7940308Z ##[error]packages/core/test/integration/graph-publisher.test.ts(29,54): error TS2322: Type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7944536Z   Property 'dependents' is missing in type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7949831Z ##[error]packages/core/test/integration/p2-runtime-smells.test.ts(20,54): error TS2322: Type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7954020Z   Property 'dependents' is missing in type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7959353Z ##[error]packages/core/test/integration/partial-seed-inputs.test.ts(9,54): error TS2322: Type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7963508Z   Property 'dependents' is missing in type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7968864Z ##[error]packages/core/test/integration/publisher-output-merge-consistency.test.ts(19,54): error TS2322: Type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7973307Z   Property 'dependents' is missing in type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7978617Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(26,54): error TS2322: Type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7983136Z   Property 'dependents' is missing in type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7988632Z ##[error]packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts(18,3): error TS2322: Type '{ nodes: PublisherNode[]; nodeById: Readonly<{ [x: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7993305Z   Property 'dependents' is missing in type '{ nodes: PublisherNode[]; nodeById: Readonly<{ [x: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.7998269Z ##[error]packages/core/test/unit/runtime/publisher-reentrancy.test.ts(35,3): error TS2322: Type '{ nodes: PublisherNode[]; nodeById: Readonly<{ [x: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.8002471Z   Property 'dependents' is missing in type '{ nodes: PublisherNode[]; nodeById: Readonly<{ [x: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.8008913Z ##[error]packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts(26,10): error TS2352: Conversion of type '{ nodes: PublisherNode[]; nodeById: { [x: string]: PublisherNode; }; order: string[]; diagnostics: never[]; }' to type 'GraphIR & { nodes: readonly PublisherNode[]; }' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.8013583Z   Property 'dependents' is missing in type '{ nodes: PublisherNode[]; nodeById: { [x: string]: PublisherNode; }; order: string[]; diagnostics: never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:06:34.8362557Z ##[error]Process completed with exit code 2.
```
