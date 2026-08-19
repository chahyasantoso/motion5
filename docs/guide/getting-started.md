# Getting started

## Requirements

Node 24, ESM, and TypeScript 5.8 if you are using types. Both packages are currently `private` at version `0.0.0` and are not published to a registry, so today you consume them from a workspace checkout or a vendored build. `npm install motion5` does not resolve anything.

Build the declarations and entry files once before importing from the package name outside the workspace:

```bash
npm install
npx tsc -p packages/core/tsconfig.build.json
```

## The three ports you supply

`Engine` never reaches for a global. It takes a clock, an interpolator, and a scheduler, and it validates all three at construction:

- **Clock** advances time. `createManualClock()` for tests and deterministic examples, `createBrowserClock(frameSource)` for a real page.
- **Interpolator** turns authored keyframes into values. `createGsapInterpolator(gsap)` is the supported v1 implementation.
- **Scheduler** decides _when_ a pending progress change is applied. `createMicrotaskScheduler()` is the shipped implementation: it drains on a microtask, so applying a change is always a separate turn from producing it. Inject a `SchedulerHost` if you need a different queue.

A `PluginRegistry` is optional but practically required: every authored keyframe key must be claimed by a registered plugin, so a project with an `x` track and no plugins fails to load.

## A complete first project

```ts
import { Engine, PluginRegistry, createManualClock } from "@motion5/core";
import type { ProjectDefinition } from "@motion5/core";
import { createGsapInterpolator, createMicrotaskScheduler } from "@motion5/core/adapters";
import { transformPlugin } from "@motion5/core/plugins/transform";
import gsap from "gsap";

// The scheduler drains on a microtask, so let the queue run before reading a value. Two passes can
// chain: one applies progress, the next publishes the graph follow-up that applying it queued.
const nextTurn = () => new Promise((resolve) => setTimeout(resolve, 0));

const plugins = new PluginRegistry();
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
          duration: 1,
          keyframes: {
            x: {
              stops: [
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

## Node ids are qualified for you

You author local ids. The runtime qualifies them exactly once, at load, and every call afterwards uses the qualified form:

- a motion track becomes `motionId/trackId`, so `title` inside `hero` is `hero/title`;
- a free track becomes `~/trackId`, so a `cursor` free track is `~/cursor`.

There is no API that accepts a local id. If a call reports an unknown node, check whether you passed the authored id instead of the qualified one.

## Membership, then motion

A loaded node publishes nothing until it is mounted. Mounting is explicit because membership is what gates publication:

```ts
handle.mount("hero/title");

clock.tick(500);
await nextTurn();

const patch = handle.get("hero/title");
if (patch?.status === "ready") {
  // 500 of the trigger's 1000 units have elapsed, so sourceProgress is 0.5 and x sits halfway
  // between the two authored stops.
  console.log(patch.sourceProgress, patch.values.x);
}
```

Two separate things just happened, and keeping them separate is the whole design. `clock.tick(500)` advanced time, which let the `time` driver emit progress. The scheduler's microtask pass then ran the job that applied it and published the resulting patch. Nothing publishes mid-tick, and nothing publishes twice for the same value.

In a browser you do not write `await nextTurn()`. The pass runs on its own at the end of the turn that produced the work, inside the same frame and before paint, so a patch is ready by the time anything renders. The helper exists for tests and scripts, where nothing else is driving the loop.

If a scheduled job throws, the pass still runs every job behind it and then reports once. With the default host that report arrives as an unhandled rejection, so pass `onError` to `createMicrotaskScheduler` when you want to route failures yourself.

## Reading values

`handle.get(nodeId)` is a pull: the currently retained patch, or `undefined` if the node has never published or is unmounted. `handle.subscribeNode(nodeId, listener)` is a push: the listener runs for every new patch for that node and returns its own unsubscribe. Both are shown in [Rendering patches](./rendering-patches.md).

A patch is deeply frozen, in every environment, with no production opt-out. Do not try to mutate `patch.values`.

## Tearing down

Dispose in the order you built. The project handle owns everything the load created; the clock is yours because you created it:

```ts
handle.unmount("hero/title");
handle.dispose();
clock.dispose();
```

`unmount` is reversible and publishes no terminal patch: the node still exists and may become a member again. `dispose` is not reversible. A failed `load()` disposes everything it had already built before it throws, so you never have to clean up after a rejected project.

## Where to go next

The `time` trigger above is the simplest of three. [Triggers](./triggers.md) covers scroll sources and manual control, including why `signal()` throws on a driver-backed motion and `seek()` does not.
