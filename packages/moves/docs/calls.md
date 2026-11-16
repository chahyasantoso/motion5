# @gerak/moves: calls

Examples of moves, couplings, signals and style cards; primitives (`span`, `chain`, `lanes`, `ease`, `mix`, `VALUE_FIELDS`, `Time`, `Pose2d`, `Pose3d`) come from `@gerak/core`, and every `@gerak/moves` export is in [the reference](./reference/README.md).

```ts
import {
  atProgress,
  chain,
  ease,
  elapsedOf,
  lanes,
  liveAt,
  loop,
  reversed,
  sequence,
  span,
  timeAt,
  type Time,
} from "@gerak/core";
import { drop, fade, hop, rise } from "@gerak/moves";

drop({ distance: 300 }, atProgress(0.5));
scene(liveAt(1200), events);
const ms = elapsedOf(time.clock) ?? 0;
const turnRate = ((heading(timeAt(time, ms + 8)) - heading(timeAt(time, ms - 8))) * 1000) / 16;

const flight = span(400, 2400);
hop(options, flight.of(time, ease.quadOut));
const landMs = flight.at(hop.moments(options).lastLanding);

const card = (time: Time) => sequence(time, [[enter, (t) => rise(options, t)], [leave, (t) => fade({}, reversed(t))]]);
const shots = chain([2000, 1500, 3000], { overlap: 300 });
const drift = loop(4000, { yoyo: true }).of(time);

const LETTERS = lanes([1, 1, 1, 1], 0.25);
const BURST = lanes([1, 1, 1, 1, 1], 0.2, { from: "center", spacing: ease.quadOut });
const RIPPLE = lanes([1, 1, 1, 1], 0.2, { by: distances });
drop(options, LETTERS.of(word.of(time), i));
```

Each move is `move(options, time)`. `move.options` lists its options with ranges; `move.moments(options)` gives named
shares of its progress. The catalog, not this page, says what each move does and takes (`npx gerak moves`, `--role <role>`, or `<id>` when `@gerak/moves-tools` is installed). By role:

- `exit`: **`smudge`**; `reversed(time)` from `@gerak/core` also turns any move into one
- `enter`: **`drop`**, **`hop`**, **`rise`**, **`slide`**, **`pop`**, **`fade`**, **`unfold`**, **`swing`**
- `emphasis`: **`pulse`**, **`shake`**, **`wobble`**, **`nod`**
- `travel`: **`arc`**
- `reveal`: **`wipe`**, **`trace`**
- `follow`: **`rope`**
- `modifier`: **`anticipate`**, **`overshoot`**

What a move answers, which the catalog does not print:

- An `enter`, `emphasis`, `travel` or `exit` move answers a `Pose2d`. `hop` adds `contact: { hits, justHit }`: `hits` counts
  the landings so far, and `justHit` runs 1 at a landing to 0 a fifth of a flight away, for what the landing touches.
- `wipe` answers a `Pose2d` of `clipX`, `clipY` and `clipRadius`, and `trace` one of `drawn` and `drawnFrom`; `trace`'s
  `tail` (default 1) is the share of the path kept drawn behind the head. `applyValue` writes both.
- `rope` takes the points it follows as a third argument and answers anchors for `toCubics` (`@gerak/core`).
- `reversed(time)` and `repeated(time, count)` from `@gerak/core` are functions of time, not moves: any move plays through them. `anticipate` and `overshoot` take a `(time) => pose` function as a third argument and act on every number that adds, `custom` numbers included.

```ts
import { applyPath } from "@gerak/dom";
import { toCubics } from "@gerak/core";
import { anticipate, overshoot, pulse, rise, rope } from "@gerak/moves";

applyPath(path, toCubics(rope(options, time, { points })));
rise(options, reversed(time));
pulse(options, repeated(time, 3));
overshoot({ share, amount }, time, (t) => anticipate({}, t, (u) => slide(options, u)));
```

`trail`, `follow` and `velocity` take the scene's time, never an eased one (`@gerak/core` owns `ease`, `mix`, `keyframes`, `along`, `combine`, `velocity` and `seeded`).

```ts
import { along, combine, combine3d, lift2d, mix, mixPoint, mixPose3d, seeded, toCubics, toCubics3d, velocity, velocity3d } from "@gerak/core";
import { follow, react, smear, smear3d, squashed, squashed3d, trail, trailTurn } from "@gerak/moves";

const tail = trail((t) => body(t).rotation ?? 0, { damping: 10 });
tail(time, events);

combine([drop(options, time), { opacity: 0.5 }]);
combine([slide(options, time), squashed(0.3, hit, "right")]);
const { pose: smeared, heading } = smear(velocity(ball, time, events), { stretch: 0.2, max: 2 });

const ball = lift2d(hop({ height: 260, bounces: 2 }, time), { unitsPerPx: 0.01 });
const head = mixPose3d(LOOK_LEFT, LOOK_RIGHT, turn.of(time, ease.cubicInOut).progress);
const tailTurn = trailTurn((t) => body(t), { damping: 12 });
tailTurn(time, events);
combine3d([squashed3d(0.3, landing), ball]);
const { pose: pose3d, turn } = smear3d(velocity3d(body, time, events), { stretch: 0.08, max: 1.8 });

const lift = follow({ start: 0, on: { enter: -12, leave: 0 }, target: "card" });
const give = react({ on: ["catch"], kind: "wobble", amplitude: 26 });
```

Writing a move: `defineMove` checks the options against `options` (kinds, `min`, `max`, `enum`) and fills defaults;
`run(options, time, input)` takes an optional third argument of any type, which callers must then pass. All pose fields (`VALUE_FIELDS`) live in `@gerak/core` ([core.md](../../core/docs/core.md)). `checkMove(move)` and `describeFinding(id, finding)` from `@gerak/moves-tools` sample the example and each ranged option bound and check rest, finite numbers, descriptions and smooth motion.

```ts
import type { Pose2d } from "@gerak/core";
import { defineMove } from "@gerak/moves";

const slide = defineMove({
  id: "slide", role: "enter", description: "Slides in.",
  options: { distance: { kind: "number", min: 0, description: "px" } },
  example: { options: { distance: 300 } },
  moments: () => ({}),
  run: ({ distance }, { progress }): Pose2d => ({ x: -distance * (1 - progress) }),
});
```
