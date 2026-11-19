# Events

Read this when motion answers page interactions (hover, press, click, focus, scroll into view) or scripted cues. Names are in [the events reference](../../core/docs/reference/events.md).

## From the page

In `defineStage`, enable interaction tracking on any cast member with `.watch()` and read `events` passed to `scene({ time, events })`:

```ts
import { spring } from "@gerak/core";
import { defineStage } from "@gerak/stage";

export default defineStage({
  durationMs: 900,
  beats: { intro: [0, 900] },
  cast: (m) => ({ card: m.box().watch().ambient() }),
  scene: ({ time, events }) => {
    const latest = events.filter((e) => e.target === "card").at(-1);
    if (latest === undefined) return { card: { y: 0 } };
    const ms = (time.clock.kind === "live" ? time.clock.elapsed : 0) - latest.at;
    const target = latest.name === "enter" ? -14 : 0;
    return { card: { y: target + spring(-target, 0, Math.max(0, ms) / 1000).offset } };
  },
});
```

With `@gerak/moves`, `follow` encapsulates the spring fold cleanly (`const lift = follow({ start: 0, on: { enter: -14, leave: 0 }, target: "card" })`).

- `events` holds every event up to the current time, oldest first: `{ name, at, target }` in ms, plus pointer `(x, y)` relative to the watched element's top-left corner.
- Put `.watch()` on a still wrapper `m.group` if the moving child leaves under the cursor.
- Derive answers strictly from `(time, events)` rather than mutable component variables so replays, scrubbing, and `gerak review --action hover:.card-hit@1000` match identically.

## Inside the scene (`cues`)

Pass deterministic scripted events via `cues` inside `defineStage`:

```ts
import { span } from "@gerak/core";
import { drop } from "@gerak/moves";
import { defineStage } from "@gerak/stage";

const fallSpan = span(0, 800);
const HIT_MS = fallSpan.at(0.7);

export default defineStage({
  beats: { fall: [0, 800], settle: [800, 1400] },
  cast: (m) => ({ box: m.box() }),
  cues: [{ name: "hit", at: HIT_MS, target: "box" }],
  scene: ({ time, beats }) => ({
    box: drop({ distance: 120, squash: 0.15 })(beats.fall.of(time)),
  }),
});
```

- `player.on(name, listener)` notifies listeners as forward playback crosses an event (seeking backwards does not fire).
