# Getting started

gerak makes motion from code. A **scene** is a function from time, and the events so far, to one value per target.
A **player** runs a scene on a **driver** (a clock, the page's scroll, or your hand), and a renderer writes each value
onto an element or a Three.js object.

## A scene on a plain page

```ts
import { applyValue, clockDriver } from "@gerak/dom";
import { drop, span, type Time } from "@gerak/moves";
import { play } from "@gerak/player";

const durationMs = 1200;
const fall = span(0, 900, durationMs);

const scene = (time: Time) => ({
  title: drop({ distance: 400, squash: 0.2 }, fall.of(time)),
});

const title = document.querySelector<HTMLElement>("#title");
const player = play(scene, clockDriver({ duration: durationMs }));
if (title !== null) player.subscribe("title", (pose) => applyValue(title, pose));
```

`drop` waits `distance` above the element's layout position and lands on it; `span` places the move between 0 and
900 ms of the 1200 ms clock. `player.dispose()` stops it.

## In React

```tsx
import { clockDriver } from "@gerak/dom";
import { usePlayer, useTarget } from "@gerak/react";

const clock = () => clockDriver({ duration: durationMs });

export function Title() {
  const playing = usePlayer(scene, clock);
  const title = useTarget(playing?.player, "title");
  return <h1 ref={title}>Hello</h1>;
}
```

Define `scene` and `clock` outside the component, or `usePlayer` restarts. `useTarget` writes the pose every frame
with no render.

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

- [Making motion as an agent](./agent-motion.md): the brief, the move catalog, composing and the review loop.
- [Agent reference](./agent-reference.md): every function, type and command, each with a short example.
- [3D scenes](./agent-3d.md), [rigs](./agent-rigs.md), [events](./agent-events.md), [physics](./agent-physics.md)
  and [motion principles](./agent-principles.md) when a brief needs them.
