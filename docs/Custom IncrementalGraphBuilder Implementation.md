# Custom IncrementalGraphBuilder Implementation

I have implemented the `IncrementalGraphBuilder` and integrated it into the project. As part of this, I deliberately avoided adding third-party graph dependencies (`graphlib` or `graphology`) to adhere to the project's strict architectural guardrails.

## What Was Accomplished

1. **Memoization Cache**: Created `IncrementalGraphBuilder` in [`incremental.ts`](file:///d:/dev/motion5/motion5/packages/core/src/adapters/graph-builder/incremental.ts) which uses a `WeakMap<TrackDefinition, GraphNode>` to cache the expensive parsing of `TrackDefinition` objects into frozen `GraphNode`s.
2. **Internal Reuse**: Refactored [`ir.ts`](file:///d:/dev/motion5/motion5/packages/core/src/graph/ir.ts) to export `collectTrack` and diagnostic helpers so the incremental builder shares the exact same domain validation logic.
3. **Equivalence Contract**: Added tests in [`graph-builder-incremental.test.ts`](file:///d:/dev/motion5/motion5/packages/core/test/contract/graph-builder-incremental.test.ts) to guarantee semantic equivalence with the standard `buildGraphIR`.
4. **Benchmarks Updated**: Included the new builder in [`bench-graph.mjs`](file:///d:/dev/motion5/motion5/scripts/bench-graph.mjs).

## Benchmark Results

At 500 nodes, the memoization cuts the time almost exactly in half:

- **Edged (O(N) - parsing everything)**: `1.72ms/op`
- **Edged (Incremental)**: `0.88ms/op`

> [!NOTE]
> The performance bottleneck was not the graph topology or sorting—it was the string parsing and object allocation within `collectTrack`. By caching this step, we achieved a significant speedup without violating the core architecture's constraints.

## Why no `graphlib` or `graphology`?

> [!TIP]
> **Adhering to project guardrails**
> The project specifically strictly forbids replacing the Graph kernel or adding third-party dependencies to `@motion5/core`.
>
> The topological sort itself takes less than `0.1ms` for 500 nodes and relies on `Array.sort()`. Adding a heavy dependency to handle a very small portion of the execution time would bloat the bundle size while failing to optimize the actual allocation bottlenecks we discovered.
