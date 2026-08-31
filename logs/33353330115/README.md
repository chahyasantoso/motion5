# CI log archive: 33353330115

- Workflow: CI
- Conclusion: failure
- Head branch: perf/ra-18-graph-ir-dependents
- Source run: https://github.com/chahyasantoso/motion5/actions/runs/33353330115
- Captured: 2026-08-31T03:17:17Z

## Failed job output

```text
quality (node 24)	Run npm run typecheck	﻿2026-08-31T03:16:53.8463847Z ##[group]Run npm run typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:53.8464232Z ^[[36;1mnpm run typecheck^[[0m
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:53.8504222Z shell: /usr/bin/bash -e {0}
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:53.8504534Z env:
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:53.8504752Z   NODE_VERSION: 24
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:53.8505028Z ##[endgroup]
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:53.9501852Z 
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:53.9502718Z > motion5@0.0.0 typecheck
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:53.9503552Z > tsc --noEmit -p tsconfig.json
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:53.9503963Z 
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9533099Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(26,54): error TS2322: Type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9544111Z   Property 'dependents' is missing in type '{ nodes: readonly PublisherNode[]; nodeById: Readonly<{ [k: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9547128Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(99,7): error TS2345: Argument of type 'GraphIR & { nodes: readonly PublisherNode[]; }' is not assignable to parameter of type 'PublisherSnapshot'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9556072Z   Types of property 'nodeById' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9556783Z     Type 'Readonly<Record<string, GraphNode>>' is not assignable to type 'Readonly<Record<string, PublisherNode>>'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9557408Z       'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9558356Z         Property 'compose' is missing in type 'GraphNode' but required in type 'PublisherNode'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9560502Z ##[error]packages/core/test/unit/runtime/composition-output-shape.test.ts(116,54): error TS2345: Argument of type 'GraphIR & { nodes: readonly PublisherNode[]; }' is not assignable to parameter of type 'PublisherSnapshot'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9561980Z   Types of property 'nodeById' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9562744Z     Type 'Readonly<Record<string, GraphNode>>' is not assignable to type 'Readonly<Record<string, PublisherNode>>'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9563530Z       'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9564100Z         Property 'compose' is missing in type 'GraphNode' but required in type 'PublisherNode'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9566676Z ##[error]packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts(18,3): error TS2322: Type '{ nodes: PublisherNode[]; nodeById: Readonly<{ [x: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9569683Z   Property 'dependents' is missing in type '{ nodes: PublisherNode[]; nodeById: Readonly<{ [x: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9572019Z ##[error]packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts(90,34): error TS2345: Argument of type 'GraphIR & { nodes: readonly PublisherNode[]; }' is not assignable to parameter of type 'PublisherSnapshot'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9573499Z   Types of property 'nodeById' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9574136Z     Type 'Readonly<Record<string, GraphNode>>' is not assignable to type 'Readonly<Record<string, PublisherNode>>'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9574735Z       'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9575293Z         Property 'compose' is missing in type 'GraphNode' but required in type 'PublisherNode'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9577055Z ##[error]packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts(95,34): error TS2345: Argument of type 'GraphIR & { nodes: readonly PublisherNode[]; }' is not assignable to parameter of type 'PublisherSnapshot'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9578845Z   Types of property 'nodeById' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9579530Z     Type 'Readonly<Record<string, GraphNode>>' is not assignable to type 'Readonly<Record<string, PublisherNode>>'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9580622Z       'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9581219Z         Property 'compose' is missing in type 'GraphNode' but required in type 'PublisherNode'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9583709Z ##[error]packages/core/test/unit/runtime/publisher-reentrancy.test.ts(35,3): error TS2322: Type '{ nodes: PublisherNode[]; nodeById: Readonly<{ [x: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' is not assignable to type 'GraphIR & { nodes: readonly PublisherNode[]; }'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9586307Z   Property 'dependents' is missing in type '{ nodes: PublisherNode[]; nodeById: Readonly<{ [x: string]: PublisherNode; }>; order: readonly string[]; diagnostics: readonly never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9589084Z ##[error]packages/core/test/unit/runtime/publisher-reentrancy.test.ts(162,23): error TS2345: Argument of type 'GraphIR & { nodes: readonly PublisherNode[]; }' is not assignable to parameter of type 'PublisherSnapshot'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9590634Z   Types of property 'nodeById' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9591270Z     Type 'Readonly<Record<string, GraphNode>>' is not assignable to type 'Readonly<Record<string, PublisherNode>>'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9591893Z       'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9592482Z         Property 'compose' is missing in type 'GraphNode' but required in type 'PublisherNode'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9594271Z ##[error]packages/core/test/unit/runtime/publisher-reentrancy.test.ts(165,34): error TS2345: Argument of type 'GraphIR & { nodes: readonly PublisherNode[]; }' is not assignable to parameter of type 'PublisherSnapshot'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9595966Z   Types of property 'nodeById' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9596605Z     Type 'Readonly<Record<string, GraphNode>>' is not assignable to type 'Readonly<Record<string, PublisherNode>>'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9597212Z       'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9598006Z         Property 'compose' is missing in type 'GraphNode' but required in type 'PublisherNode'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9599821Z ##[error]packages/core/test/unit/runtime/publisher-reentrancy.test.ts(169,34): error TS2345: Argument of type 'GraphIR & { nodes: readonly PublisherNode[]; }' is not assignable to parameter of type 'PublisherSnapshot'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9601323Z   Types of property 'nodeById' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9601963Z     Type 'Readonly<Record<string, GraphNode>>' is not assignable to type 'Readonly<Record<string, PublisherNode>>'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9602568Z       'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9603151Z         Property 'compose' is missing in type 'GraphNode' but required in type 'PublisherNode'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9606684Z ##[error]packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts(26,10): error TS2352: Conversion of type '{ nodes: PublisherNode[]; nodeById: { [x: string]: PublisherNode; }; order: string[]; diagnostics: never[]; }' to type 'GraphIR & { nodes: readonly PublisherNode[]; }' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9609829Z   Property 'dependents' is missing in type '{ nodes: PublisherNode[]; nodeById: { [x: string]: PublisherNode; }; order: string[]; diagnostics: never[]; }' but required in type 'GraphIR'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9612136Z ##[error]packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts(69,21): error TS2345: Argument of type 'GraphIR & { nodes: readonly PublisherNode[]; }' is not assignable to parameter of type 'PublisherSnapshot'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9613656Z   Types of property 'nodeById' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9614296Z     Type 'Readonly<Record<string, GraphNode>>' is not assignable to type 'Readonly<Record<string, PublisherNode>>'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9615092Z       'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9615894Z         Property 'compose' is missing in type 'GraphNode' but required in type 'PublisherNode'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9618073Z ##[error]packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts(91,35): error TS2345: Argument of type 'GraphIR & { nodes: readonly PublisherNode[]; }' is not assignable to parameter of type 'PublisherSnapshot'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9619840Z   Types of property 'nodeById' are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9620480Z     Type 'Readonly<Record<string, GraphNode>>' is not assignable to type 'Readonly<Record<string, PublisherNode>>'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9621092Z       'string' index signatures are incompatible.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9621716Z         Property 'compose' is missing in type 'GraphNode' but required in type 'PublisherNode'.
quality (node 24)	Run npm run typecheck	2026-08-31T03:16:57.9977970Z ##[error]Process completed with exit code 2.
```
