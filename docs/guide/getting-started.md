# Getting started

gerak makes motion from code. A **scene** is a function from time, and the input so far, to one value per target.
A **player** runs a scene on a **driver** (a clock, the page's scroll, or your hand), which owns an `inputLog` with typed `set` and `trigger` writers and `input()`, and a renderer writes each value
onto an element or a Three.js object.

## A scene on a plain page

```ts
import { applyValue, clockDriver } from "@gerak/dom";
import { span, type Time } from "@gerak/core";
import { drop } from "@gerak/moves";
import { play } from "@gerak/player";

const durationMs = 1200;
const fall = span(0, 900);

const scene = (time: Time) => ({
  title: drop({ distance: 400, squash: 0.2 })(fall.of(time)),
});

const title = document.querySelector<HTMLElement>("#title");
const player = play(scene, clockDriver({ duration: durationMs }));
if (title !== null) player.subscribe("title", (pose) => applyValue(title, pose));
```

`drop` waits `distance` above the element's layout position and lands on it; `span` places the move between 0 and
900 ms of the 1200 ms clock. `player.dispose()` stops it.

## In React

```tsx
import { useRef } from "react";
import { clockDriver } from "@gerak/dom";
import { useMount, usePlayer, useTarget } from "@gerak/react";

const clock = () => clockDriver({ duration: durationMs });

export function Title() {
  const playing = usePlayer(scene, clock);
  const title = useTarget(playing?.player, "title");
  return <h1 ref={title}>Hello</h1>;
}

export function PieceFrame() {
  const rootRef = useRef<HTMLDivElement>(null);
  useMount(rootRef, stageScene, { clock: "live" });
  return <div ref={rootRef}><h1 data-cast="title">Hello</h1></div>;
}
```

Define `scene` and `clock` outside the component, or `usePlayer` restarts. `useTarget` writes the pose every frame
with no render, `useSignal` follows scene state synchronously, `useMount` mounts compiled stage scenes onto a React ref with zero wrapper nodes, and `<Stage>` renders a container `<div>` around its children.

## Seeking by hand

```ts
import { manualDriver, play } from "@gerak/player";

const driver = manualDriver({ durationMs });
const player = play(scene, driver);
driver.seekMs(600);
player.values.title; // the pose at 600 ms
```

A scene is pure, so the same time always gives the same values: tests and the repository's tools sample it this way,
with no browser.

## Where next

- [Core](../../packages/core/docs/core.md) and [stage](../../packages/stage/docs/stage.md): read whole before making motion; the loop is in the second.
- [3D scenes](../../packages/three/docs/agent-3d.md), [rigs](../../packages/rig/docs/agent-rigs.md), [events](../../packages/stage/docs/agent-events.md), [physics](../../packages/physics/docs/agent-physics.md)
  and [motion principles](../../packages/moves/docs/agent-principles.md) when a brief needs them.
- [Every command](../../packages/tools/docs/commands.md).
