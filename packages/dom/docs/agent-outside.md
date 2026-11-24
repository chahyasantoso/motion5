# Outside the stage

Read this to mount a scene outside this repository, or to bind a component's own elements directly.
The loop is in [the agent guide](../../stage/docs/stage.md).

## On your own page

In your own project, install the packages, then run `npx gerak init`: the live/talk pages and CLI commands work there.
To play a module on a page of your own, tag its elements `data-cast="<name>"` and mount it yourself:

```ts
import { mount } from "@gerak/dom";
import piece from "./piece";

const container = document.querySelector<HTMLElement>("#stage");
if (container === null) throw new Error("No #stage element.");
const mounted = mount(piece, { clock: "timed", frame: "fit", root: container });
```

- Nodes stay in normal DOM inside `container`, so CSS selectors and layout behave as ordinary markup.
- To check a moment by hand on a timed clock, pause and seek: `mounted.driver.pause()`, then `mounted.driver.seek(progress)` (0 to 1), or inspect `mounted.measure()`.
- When `@gerak/moves` is installed, a move's options with their ranges are in [the moves reference](../../moves/docs/reference/README.md). For core-only pieces, see [core.md](../../core/docs/core.md).

## In React

Use `<Stage>` from `@gerak/react` over JSX carrying `data-cast="<name>"`:

```tsx
import { Stage } from "@gerak/react";
import piece from "./piece";

export function Hero() {
  return (
    <Stage scene={piece} options={{ clock: "live" }}>
      <div data-cast="title">Hello</div>
    </Stage>
  );
}
```

Or bind targets on a raw player directly without `scene`: define `scene` and `clock` outside the component, or `usePlayer` restarts:

```tsx
const playing = usePlayer(scene, clock);
const title = useTarget(playing?.player, "title");
return <div ref={title} onClick={() => playing?.driver.replay()} />;
```

`useTarget` writes a pose every step with no render; its third argument writes anything else. To pass the player to a child, type the prop `Player<ReturnType<typeof scene>> | undefined`, `Player` from `"@gerak/player"`. On a plain page without `scene`, `play(scene, clock())` and `player.subscribe("title", (pose) => applyValue(element, pose))`.
