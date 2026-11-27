# App input, values, and triggers

Read this when motion answers page interactions (hover, press, click, focus, scroll into view), app state, or scripted cues. Names are in [the events reference](../../core/docs/reference/events.md) and [the state reference](../../core/docs/reference/state.md).

## From the app and page

The app owns interaction rules and all lasting state, and sends **values** (`set`) and **triggers** (`trigger`) through a declared `Contract` (`inputs({ values?, triggers? })`). A page opts into hover, press, focus, and pointer values (`pageInputs`) by attaching [`listen`](../../dom/docs/page.md) to the mount or driver; `mount` itself attaches no user-interaction DOM listeners beyond passive `scroll`. Several mounts can share one `liveClock` via `{ kind: "driver", driver }`.

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

With `@gerak/moves`, `follow(goalState)` springs towards any `State<number>` (such as `value(contract, "lift", "card")`), `react(triggers(contract, "hit"))` plays on triggers, and `valueAt(contract, "choice", trigger)` reads the value held when `trigger` arrived.

- `input` holds `InputEntry` records up to the current time, oldest first: `{ kind, name, at, value, target?, other?, point? }` in ms (`liveClock` keeps `max(settleMs ?? 2000, 4000)` ms plus each name-and-target's latest entry).
- Attach `listen` (or React handlers calling `mounted.set` / `mounted.trigger`) on a still wrapper element if the moving child leaves under the cursor.
- Derive motion strictly from `(time, input)` via `value`, `valueAt`, and `triggers` rather than mutable scene variables so replays, scrubbing, and `gerak review --action hover:.card-hit@1000` match identically.

## Inside the scene (`cues`)

Pass deterministic scripted `InputEntry` records in the scene's `cues` option:

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
