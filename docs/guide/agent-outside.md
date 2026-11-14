# Outside the stage

Read this to play a piece outside this repository, or to move a real page's own elements instead of a stage module's.
The loop is in [the agent guide](./agent-motion.md).

## Outside this repository

The `motion:*` npm scripts and `stage.html` live in this repository. In your own project, install the
packages (see the README) and mount the module on a page yourself:

```ts
import { mountStage, stageModuleOf } from "@gerak/dom";
import { readStageModule } from "@gerak/stage";
import * as piece from "./piece";

const read = readStageModule(piece);
if ("reason" in read) throw new Error(read.reason);
const container = document.querySelector<HTMLElement>("#stage");
if (container === null) throw new Error("No #stage element.");
const stage = mountStage(container, stageModuleOf(read));
```

- The stage builds inside a shadow root, so `document.querySelector` does not find its members; read them through
  `container.firstElementChild?.shadowRoot`.
- To check a moment by hand, pause and seek: `stage.driver.pause()`, then `stage.driver.seek(progress)`, where
  progress runs from 0 to 1 over the story, not in ms.
- A move's options, with their ranges, are in its entry in [the reference](./agent-reference.md#gerakmoves); the
  catalog command prints the same in this repository.

## On a real site's elements

A stage module needs none of this. To bind a page's own elements, define `scene` and `clock` outside the component,
or `usePlayer` restarts:

```tsx
const playing = usePlayer(scene, clock);
const title = useTarget(playing?.player, "title");
return <div ref={title} onClick={() => playing?.driver.replay()} />;
```

`useTarget` writes a pose every step with no render; its third argument writes anything else, such as one pose out of
a list (the reference's `useTarget` entry shows it). To pass the player to a child, type the prop
`Player<ReturnType<typeof scene>> | undefined`, `Player` from `"@gerak/player"`. Target names are typed by literal, so
bind a list of targets (`prop0`, `prop1`, ...) through one target holding a list, not names built from a template
string. On a plain page, `play(scene, clock())` and
`player.subscribe("title", (pose) => applyValue(element, pose))`.
