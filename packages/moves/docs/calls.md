# @gerak/moves: calls

Examples of the calls a scene makes; every export with its signature is in [the reference](./reference/README.md).

Time, lanes, moves, eases, poses and events: everything a scene is made of. A `Time` is `{ progress, clock }` and
`progress` runs 0 to 1.

```ts
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
shares of its progress. The catalog, not this page, says what each move does and takes: `npx gerak moves` prints
one line per move, `--role <role>` one role, and `<id>` one move in full with the shape of its call. By role:

- `exit`: none of its own; `reversed(time)` turns any move into one
- `enter`: **`drop`**, **`hop`**, **`rise`**, **`slide`**, **`pop`**, **`fade`**, **`unfold`**, **`swing`**
- `emphasis`: **`pulse`**, **`shake`**, **`wobble`**, **`nod`**
- `travel`: **`arc`**
- `reveal`: **`wipe`**, **`trace`**
- `follow`: **`rope`**
- `modifier`: **`anticipate`**, **`overshoot`**

What a move answers, which the catalog does not print:

- An `enter`, `emphasis` or `travel` move answers a `Pose2d`. `hop` adds `contact: { hits, justHit }`: `hits` counts
  the landings so far, and `justHit` runs 1 at a landing to 0 a fifth of a flight away, for what the landing touches.
- `wipe` answers a `Pose2d` of `clipX`, `clipY` and `clipRadius`, and `trace` one of `drawn` and `drawnFrom`; `trace`'s
  `tail` (default 1) is the share of the path kept drawn behind the head. `applyValue` writes both.
- `rope` takes the points it follows as a third argument and answers anchors for `toCubics`.
- `reversed(time)` and `repeated(time, count)` are functions of time, not moves: each answers a time, and any move
  or value can be played through it. `anticipate` and `overshoot` are moves that take another move's answer as a
  third argument, a `(time) => pose` function, and act on every number that adds, `custom` numbers included.

```ts
applyPath(path, toCubics(rope(options, time, { points })));
rise(options, reversed(time));
pulse(options, repeated(time, 3));
overshoot({ share, amount }, time, (t) => anticipate({}, t, (u) => slide(options, u)));
```

Eases are `(share) => share`; feed `springEase` to values, not to a move's progress. `trail`, `follow` and `velocity`
take the scene's time, never an eased one.

```ts
span(0, 600).of(time, ease.backOut);
const crouch = mix(0, 400, leap.of(time, backEase({ amount: 3, direction: "in" })).progress);
const scale = mix(0, 1, pop.of(time, springEase({ stiffness: 170, damping: 10 })).progress);
const { offset } = spring(-1, 0, 0.2, { stiffness: 170, damping: 12 });

const tail = trail((t) => body(t).rotation ?? 0, { damping: 10 });
tail(time, events);

const hand = mixPoint(REST, CATCH, lunge.of(time, ease.cubicInOut).progress);
const lean = keyframes(0, [{ at: 1700, to: -9, ease: ease.sineInOut }, { at: 2400, to: 0 }], mix);
lean(time);

const random = seeded(5);
const x = 400 + random() * 200;
```

A pose may carry `custom`, a record of numbers the piece names itself; each rests at 0 and adds.

```ts
const carry: Pose2d = { x: 10, anchor: "bottom" };
combine([drop(options, time), { opacity: 0.5 }]);
combine([slide, squashed(0.3, hit, "right")]);
const pose = along(toCubics(anchors), ease.cubicInOut(time.progress), { turn: true });
const { vx, vy } = velocity(ball, time, events);
const { pose, heading } = smear(velocity(ball, time, events), { stretch: 0.2, max: 2 });
```

3D poses are `Pose3d`: y up, turns in degrees on the Z-X-Y Euler (`rotation` is about z). A `Pose2d` is refused where a
`Pose3d` goes; every 2D move reaches 3D through `lift2d`.

```ts
const lid: Pose3d = { y: 0.4, rotationX: -70 };
const ball = lift2d(hop({ height: 260, bounces: 2 }, time), { unitsPerPx: 0.01 });
combine3d([ball, { rotationY: spin }]);
const head = mixPose3d(LOOK_LEFT, LOOK_RIGHT, turn.of(time, springEase({ stiffness: 170, damping: 12 })).progress);
const head = trailTurn((t) => body(t), { damping: 12 });
head(time, events);
combine3d([squashed3d(0.3, landing), ball]);
const pose = along3d(toCubics3d(anchors), flight.of(time, ease.sineInOut).progress, { face: true });
const { pose, turn } = smear3d(velocity3d(body, time, events), { stretch: 0.08, max: 1.8 });
const camera = { ...eye, ...aim(eye, { x: 0, y: 0.5, z: 0 }) };
const eye = orbit({ target: { x: 0, y: 0, z: 0 }, radius: 6, azimuth: mix(-30, 30, pan.of(time).progress), elevation: 20 });
```

Events are `{ name, at, target?, x?, y? }`, `at` in ms and `x`, `y` from the watched element's corner.

```ts
const lift = follow({ start: 0, on: { enter: -12, leave: 0 }, target: "card" });
lift(time, events);
const give = react({ on: ["catch"], kind: "wobble", amplitude: 26 });
give(time, events);
const all = mergeEvents(events, sim.events(time));
```

Writing a move: `defineMove` checks the options against `options` (kinds, `min`, `max`, `enum`) and fills defaults;
`run(options, time, input)` takes an optional third argument of any type, which callers must then pass. `VALUE_FIELDS`
is the one table of what a value's fields are (`rest`, how it combines, whether its path must be `smooth`, whether a
reveal `shows` it); beside the transform and `opacity` its rows are `blur`, `drawn`, `drawnFrom`, `clipX`, `clipY` and
`clipRadius`. `checkMove(move)` from `@gerak/tools/scene` is the gate: it samples the example, and the example at each
ranged option's least and greatest, and answers a list of findings, empty when the move holds its role's rest, stays
finite, has its descriptions and takes no jump. `describeFinding(id, finding)` turns one into a line.

```ts
const slide = defineMove({
  id: "slide", role: "enter", description: "Slides in.",
  options: { distance: { kind: "number", min: 0, description: "px" } },
  example: { options: { distance: 300 } },
  moments: () => ({}),
  run: ({ distance }, { progress }): Pose2d => ({ x: -distance * (1 - progress) }),
});
```
