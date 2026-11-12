# Events

Read this when the motion answers something: the page's pointer, scrolling into view, or one target's moment, such as
a landing. Names are in [the reference](./agent-reference.md#events).

## From the page

```ts
import { eventDriver } from "@gerak/dom";
import { follow, type Events, type Time } from "@gerak/moves";

const lift = follow({ start: 0, on: { enter: -14, leave: 0 }, target: "card" });
export const scene = (time: Time, events: Events) => ({ card: { y: lift(time, events) } });
export const clock = () => eventDriver({ introMs: 900 });
```

- The scene's second argument is every event so far, oldest first: `{ name, at, target }` in ms, and a pointer event's
  `x` and `y` from the watched element's top left corner, so a burst starts where the click landed.
- `eventDriver` is a live clock: ms since the page started, progress 0. Place an intro with a `span`, which reads a
  live clock's ms; a move given a live time directly sits at its start.
- `follow` is a spring each named event retargets from where it is and how fast it goes, so a leave half way turns
  back with no jump. One `follow` per number.
- `useWatch(playing?.driver, "card")` gives a ref whose element logs `enter`, `leave`, `down`, `up`, `click`, `focus`
  and `blur` for `card`. Put it on a still wrapper and the moving pose on a child, or a lifting card loses the
  pointer. The driver's `watchView` logs `in-view` and `out-of-view`.
- Read what happened from `events`, never from a variable a click handler sets: the tools replay events and cannot see
  a variable.
- Tools: page tools take `--action hover:.card-hit@1000,leave:.card-hit@1120,click:.stage@300(200,150)`, done with the
  real mouse; `motion:sample` and `motion:timeline` take `--events enter:card@1000,click:stage@1200(640,360)`.

## Inside the scene

A scene's own moments are events too. Export them as `cues`, and pass them to `usePlayer(scene, clock, cues)`:

```ts
const fall = span(fromMs, toMs);
const HIT_MS = fall.at(drop.moments(options).landing); // the ms the move's moment falls on
const reach = span(startMs, HIT_MS); // something else timed to end on it
export const cues: Events = [{ name: "hit", at: HIT_MS, target: "box" }];
const give = react({ on: ["hit"], kind: "wobble", amplitude });
```

- `move.moments(options)` gives where a move reaches its moments, as shares; `span.at(share)` turns one into ms.
- `react` answers each past event it names: `wobble` starts at rest and swings, `recoil` and `flash` jump on the
  event's frame, `shake` jitters. It is exactly 0 before the event.
- `player.on(name, listener)` calls back as forward play passes an event, for a sound or a class; a seek back calls
  nothing.
