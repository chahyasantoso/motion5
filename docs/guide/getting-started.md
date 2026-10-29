# Getting started

## Requirements

Node 24, ESM, and TypeScript 5.8 if you are using types. The packages are `private` at version
`0.0.0` and are not published, so you consume them from a workspace checkout or a vendored build.

Build the declarations and entry files once before importing from the package name outside the
workspace:

```bash
npm install
npx tsc -p packages/core/tsconfig.build.json
```

## The ports you supply

`Engine` takes a clock, an interpolator, and a scheduler, and validates all three at construction:

- **Clock** advances time. `createManualClock()` for tests and deterministic examples,
  `createBrowserClock(frameSource)` for a real page.
- **Interpolator** turns authored cells into values. `createGsapInterpolator(gsap)` is the supported
  v1 implementation.
- **Scheduler** decides when a pending progress change is applied. `createMicrotaskScheduler()` is
  the shipped implementation.

Plugins are admitted by a `PluginCatalog`. A track that names `plugin: "fk"` loads only when the
catalog admitted `fk`; a track without a plugin needs no catalog entry.

## A complete first project

```ts
import { Engine, PluginCatalog, createManualClock } from "@motion5/core";
import type { ProjectDefinition } from "@motion5/core";
import { createGsapInterpolator, createMicrotaskScheduler } from "@motion5/core/adapters";
import { transformPlugin } from "@motion5/plugins/transform";
import gsap from "gsap";

const nextTurn = () => new Promise((resolve) => setTimeout(resolve, 0));

const plugins = new PluginCatalog();
plugins.register(transformPlugin);

const clock = createManualClock();
const engine = new Engine({
  clock,
  interpolator: createGsapInterpolator(gsap),
  scheduler: createMicrotaskScheduler(),
  plugins,
});

const project: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "landing",
  motions: [
    {
      id: "hero",
      trigger: { type: "time", duration: 1000 },
      tracks: [
        {
          id: "title",
          input: {
            values: {
              x: [
                { p: 0, v: 0 },
                { p: 1, v: 240 },
              ],
            },
          },
        },
      ],
    },
  ],
};

const handle = engine.load(project);
```

`input.values` is a table of identified rows or a flat record; the authored form above is a record
with one animated field. See [the authored schema](../AUTHORED-SCHEMA.md).

## Loading plugins lazily

The loader takes an explicit catalog of approved descriptors and admits the demanded ids into a
`PluginCatalog` before `Engine.load`:

```ts
import { Engine, PluginCatalog } from "@motion5/core";
import { createPluginLoader, ensuredOrThrow } from "@motion5/plugins/loader";
import { fkPlugin } from "@motion5/plugins/fk";

const approved = new Map([["fk", { load: async () => fkPlugin }]]);
const plugins = new PluginCatalog();
ensuredOrThrow(await createPluginLoader(approved).ensure(plugins, { kind: "project", project }));
const handle = new Engine({ clock, interpolator, scheduler, plugins }).load(project);
```

The catalog is an allowlist, not a string-to-import bridge: a plugin module path never comes from
project data. A refusal is returned as a typed failure; `ensuredOrThrow` turns it into an `Error`
that keeps the import or admission error as its `cause`.

## Node ids are qualified for you

You author local ids. The runtime qualifies them exactly once, at load:

- a motion track becomes `motionId/trackId`, so `title` inside `hero` is `hero/title`;
- a free track becomes `~/trackId`, so a `cursor` free track is `~/cursor`.

## Membership, then motion

A loaded node publishes nothing until it is mounted:

```ts
handle.mount("hero/title");
clock.tick(500);
await nextTurn();

const patch = handle.get("hero/title");
if (patch?.status === "ready") {
  // 500 of the trigger's 1000 units have elapsed, so x sits halfway between the stops.
  console.log(patch.sourceProgress, patch.outputs.values);
}
```

`clock.tick(500)` advances time. The scheduler's microtask pass then applies progress and publishes
the patch. Nothing publishes mid-tick, and nothing publishes twice for one value.

In a browser the pass runs at the end of the turn that produced the work, inside the same frame and
before paint. The helper exists for tests and scripts, where nothing else drives the loop.

## Reading values

`handle.get(nodeId)` is a pull: the retained live patch, or `undefined` if the node never published
or is unmounted. `handle.subscribeNode(nodeId, listener)` is a push: the listener runs for every new
patch for that node and returns its own unsubscribe.

A patch is deeply frozen in every environment. `outputs.values` may be a table or a record; a
consumer that needs one row selects it through the core selector rather than indexing the first row.

## Tearing down

Dispose in the order you built. The project handle owns everything the load created; the clock is
yours because you created it:

```ts
handle.unmount("hero/title");
handle.dispose();
clock.dispose();
```

`unmount` is reversible and publishes no terminal patch. `dispose` is not reversible. A failed
`load()` disposes everything it had already built before it throws.

## Where to go next

[Triggers](./triggers.md) covers scroll and manual control. [Rendering
patches](./rendering-patches.md) covers DOM and Three adapters and the row selector.
