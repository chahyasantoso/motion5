# Rendering patches

Consumers render published patches. They never traverse the graph, call into a track, or inspect runtime internals. Everything below is built on two calls: `get(nodeId)` and `subscribeNode(nodeId, listener)`.

## What a patch is

```ts
interface Patch {
  readonly nodeId: string;
  readonly revision: number;
  readonly values: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
  readonly status: "ready" | "blocked" | "error" | "destroyed";
  readonly diagnostics: readonly Diagnostic[];
}
```

`revision` increments per published patch for that node. A patch is only published when something actually changed, so an unchanged flush is silent and you can trust `revision` as a change signal.

Status is the part worth reading carefully. `ready` carries usable values. `blocked` and `error` describe a node that still exists and may publish again, and both retain the last known values rather than blanking them. `destroyed` is terminal: the node has been evicted and will never publish again, so drop your local state for it.

## The DOM adapter

```ts
import { createDomPatchAdapter } from "@motion5/core/adapters";

const adapter = createDomPatchAdapter(document.querySelector("#stage")!, 1200, (nodeId) =>
  targets.get(nodeId),
);

const unsubscribe = handle.subscribeNode("hero/title", (patch) => adapter.apply(patch));
```

The adapter ignores anything that is not `ready`, diffs against what it last wrote so an unchanged property is not touched, and removes a property that disappears from a later patch. `x`, `y`, `z`, `rotation`, `rotationX`, `rotationY`, and `scale` are composed into one `transform` string rather than fighting each other. Keys starting with `_`, plus `offset` and any plugin-declared internal keys, are treated as internal and never written.

The second argument is the project's `perspective` in CSS pixels, applied once to the stage. Core validates and preserves `perspective` but never applies it, because that is a renderer's job.

Call `adapter.clear(target)` when you stop rendering a target, so its diff, its composed transform state, and its record of the newest revision it applied there are dropped.

All three belong to the adapter you called rather than to the element. Two adapters bound to one element compose independently and clear independently, and each refuses a patch that is not newer than the one it already applied for that target and node, so an out-of-order `PatchSource` cannot leave a target's diff cache describing a pose that is no longer there. See ADR-074.

## React

```tsx
import { useDomPatch } from "@motion5/react";

function Title({ handle }: { handle: ProjectHandle }) {
  const bind = useDomPatch<HTMLDivElement>(handle, "hero/title");
  return <div ref={bind} />;
}
```

`useDomPatch` binds one node to one DOM or SVG target and routes every patch through the same DOM adapter, metadata included: it takes a `PatchSource` that also answers `renderMetadata(nodeId)`, which a project handle does. It subscribes before reading the retained patch, writes later batches straight to the target without a React render, and clears adapter state when the target is replaced or unmounted. A renderable plugin output therefore reaches the target without a component learning its key. On an SVG target the adapter pins `transform-box: fill-box`, so a composed `rotation` or `scale` pivots around the element rather than around the view box.

A non-ready patch is a no-op, so a blocked, errored, or destroyed node leaves its target at the last applied pose rather than disappearing. That is the binding's contract, and it is deliberately not `useLivePatch`'s rule: when absence has to be rendered, gate the component on `usePatch` instead.

`usePatch` remains the projection API: derived markup, geometry that joins two nodes, and diagnostic readouts. It takes any `PatchSource`, which is exactly `{ get, subscribeNode }`, and is built on `useSyncExternalStore`, so it is tear-free under concurrent rendering and safe in strict mode. One hook subscribes to one node; render a component per animated node rather than subscribing to the project and re-rendering the tree.

## Your own consumer

Any renderer works, because a patch is plain frozen data:

```ts
const unsubscribe = handle.subscribeNode("hero/title", (patch) => {
  if (patch.status === "destroyed") {
    sprites.delete(patch.nodeId);
    return;
  }
  if (patch.status !== "ready") return;
  sprites.get(patch.nodeId)?.set(patch.values);
});
```

Two rules keep a consumer honest. Read the current value with `get(nodeId)` when you attach, because subscribing does not replay the retained patch. And never throw from a listener as flow control: a throwing listener does not stop its siblings from being notified, but the first failure is rethrown once the batch has finished delivering, and you will see it at the flush call site.
