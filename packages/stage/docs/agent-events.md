# Events

Read this when motion answers page interactions (hover, press, click, focus, scroll into view) or scripted cues. Names are in [the events reference](../../core/docs/reference/events.md).

## From the page

In the page bootstrap (`<name>-main.ts`), attach the opt-in [`listen`](../../dom/docs/page.md) adapter to the mount or driver, and read `pageInputs` (`hovered`, `pressed`, `focused`, `pointer-x`, `pointer-y`) in the scene:

```ts
// scene
import { pageInputs, springTo, value } from "@gerak/core";
import { bind, box, scene } from "@gerak/stage";

const card = box("card");
const over = value(pageInputs, "hovered", "card");
const lift = springTo(over, (on) => (on > 0 ? -14 : 0));

export default scene({ length: 900 }, card.moves(bind({ y: lift })));
```

```ts
// <name>-main.ts
import { listen, mount } from "@gerak/dom";
import piece from "./piece";

const mounted = mount(piece, { clock: "live" });
listen(mounted, { elements: ["card"] });
```

With `@gerak/moves`, `follow(goalState)` (or `follow(value(contract, "lift", "card"))`) is the same spring towards a `State<number>`.

- `input` holds every `InputEntry` up to the current time, oldest first: `{ kind, name, at, value, target?, other?, point? }` in ms.
- Listen to (or attach React handlers on) a still wrapper element if the moving child leaves under the cursor.
- Derive answers strictly from `(time, events)` rather than mutable component variables so replays, scrubbing, and `gerak review --action hover:.card-hit@1000` match identically.

## Inside the scene (`cues`)

Pass deterministic scripted events in the scene's `cues` option:

```ts
import { drop, DROP_LANDING } from "@gerak/moves";
import { beat, box, scene } from "@gerak/stage";

const fall = beat("fall", 800);
const HIT_MS = fall.from + DROP_LANDING * (fall.to - fall.from);

export default scene(
  { length: 1400, cues: [{ kind: "trigger", name: "hit", at: HIT_MS, value: 1, target: "box" }] },
  box("box").moves(drop({ distance: 120, squash: 0.15 }).in(fall)),
);
```

- `player.on(name, listener)` notifies listeners as forward playback crosses an event (seeking backwards does not fire).
