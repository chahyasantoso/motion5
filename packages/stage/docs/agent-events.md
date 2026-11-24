# Events

Read this when motion answers page interactions (hover, press, click, focus, scroll into view) or scripted cues. Names are in [the events reference](../../core/docs/reference/events.md).

## From the page

Give an element `watch: true` and fold its events with core's `state`; a motion reads the result at scene time:

```ts
import { springTo, state } from "@gerak/core";
import { bind, box, scene } from "@gerak/stage";

const card = box("card", { watch: true });
const over = state(false, (was, e) => (e.name === "enter" ? true : e.name === "leave" ? false : was), {
  target: "card",
});
const lift = springTo(over, (on) => (on ? -14 : 0));

export default scene({ length: 900 }, card.moves(bind({ y: lift })));
```

With `@gerak/moves`, `follow({ start: 0, on: { enter: -14, leave: 0 }, target: "card" })` is the same spring from an event table.

- `events` holds every event up to the current time, oldest first: `{ name, at, target }` in ms, plus pointer `(x, y)` relative to the watched element's top-left corner.
- Watch a still wrapper element if the moving child leaves under the cursor.
- Derive answers strictly from `(time, events)` rather than mutable component variables so replays, scrubbing, and `gerak review --action hover:.card-hit@1000` match identically.

## Inside the scene (`cues`)

Pass deterministic scripted events in the scene's `cues` option:

```ts
import { drop, DROP_LANDING } from "@gerak/moves";
import { beat, box, scene } from "@gerak/stage";

const fall = beat("fall", 800);
const HIT_MS = fall.from + DROP_LANDING * (fall.to - fall.from);

export default scene(
  { length: 1400, cues: [{ name: "hit", at: HIT_MS, target: "box" }] },
  box("box").moves(drop({ distance: 120, squash: 0.15 }).in(fall)),
);
```

- `player.on(name, listener)` notifies listeners as forward playback crosses an event (seeking backwards does not fire).
