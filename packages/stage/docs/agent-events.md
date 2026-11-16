# Events

Read this when the motion answers something: the page's pointer, scrolling into view, or one target's moment, such as
a landing. Names are in [the reference](../../core/docs/reference/events.md).

## From the page

With `@gerak/core` alone, derive answers cleanly by folding over `events` (and smoothing or summing with `spring` or
`tally`). When optional `@gerak/moves` is installed, `follow` and `react` encapsulate that spring/reaction fold:

```ts
import { eventDriver } from "@gerak/dom";
import { span, spring, type Events, type Time } from "@gerak/core";

export const scene = (time: Time, events: Events) => {
  const latest = events.filter((e) => e.target === "card").at(-1);
  if (latest === undefined) return { card: { y: 0 } };
  const ms = (time.clock.kind === "live" ? time.clock.elapsed : 0) - latest.at;
  const target = latest.name === "enter" ? -14 : 0;
  return { card: { y: target + spring(0 - target, 0, Math.max(0, ms) / 1000).offset } };
};
export const clock = () => eventDriver({ introMs: 900 });
```

With `@gerak/moves`, the same hover retargeting is one `follow` call:

```ts
import { eventDriver } from "@gerak/dom";
import { type Events, type Time } from "@gerak/core";
import { follow } from "@gerak/moves";

const lift = follow({ start: 0, on: { enter: -14, leave: 0 }, target: "card" });
export const scene = (time: Time, events: Events) => ({ card: { y: lift(time, events) } });
```

- The scene's second argument is every event so far, oldest first: `{ name, at, target }` in ms, and a pointer event's
  `x` and `y` from the watched element's top left corner, so a burst starts where the click landed.
- `eventDriver` is a live clock: ms since the page started, progress 0. Place an intro with a `span`, which reads a
  live clock's ms; a move given a live time directly sits at its start.
- `follow` (`@gerak/moves`) is a spring each named event retargets from where it is and how fast it goes, so a leave half way turns
  back with no jump. One `follow` per number.
- `useWatch(playing?.driver, "card")` gives a ref whose element logs `enter`, `leave`, `down`, `up`, `click`, `focus`
  and `blur` for `card`. Put it on a still wrapper and the moving pose on a child, or a lifting card loses the
  pointer. The driver's `watchView` logs `in-view` and `out-of-view`.
- Read what happened from `events`, never from a variable a click handler sets: the tools replay events and cannot see
  a variable.
- Tools: page tools take `--action hover:.card-hit@1000,leave:.card-hit@1120,click:.stage@300(200,150)`, done with the
  real mouse; `gerak sample` and `gerak timeline` take `--events enter:card@1000,click:stage@1200(640,360)`.

## Inside the scene

A scene's own moments are events too. Export them as `cues`, and pass them to `usePlayer(scene, clock, cues)`.
With `@gerak/core`, place cues at a span fraction via `span.at(share)` and combine responses via `mergeEvents`:

```ts
const fall = span(fromMs, toMs);
const HIT_MS = fall.at(0.7); // or `fall.at(drop.moments(options).landing)` with `@gerak/moves`
const reach = span(startMs, HIT_MS); // something else timed to end on it
export const cues: Events = [{ name: "hit", at: HIT_MS, target: "box" }];
// With optional `@gerak/moves`:
const give = react({ on: ["hit"], kind: "wobble", amplitude });
```

- When `@gerak/moves` is installed, `move.moments(options)` gives where a move reaches its moments as shares, and `react` answers each past event it names (`wobble` starts at rest and swings, `recoil` and `flash` jump on the event's frame, `shake` jitters; 0 before the event).
- `player.on(name, listener)` calls back as forward play passes an event, for a sound or a class; a seek back calls
  nothing.
