# Agent reference

Every export a scene uses, by package: a hand-written head on what the package is for and how its parts fit, then
one generated entry per export (its signature and doc comment), held current by `npm run reference -- --write`.
Look things up here instead of reading source. How to put them together is in [the agent guide](./agent-motion.md).
Units everywhere: stage px, y down, degrees clockwise, ms on clocks and events, seconds inside physics.

## Index

- [`@gerak/moves`](#gerakmoves)
- [`@gerak/player`](#gerakplayer)
- [`@gerak/dom`](#gerakdom)
- [`@gerak/react`](#gerakreact)
- [`@gerak/rig`](#gerakrig)
- [`@gerak/physics`](#gerakphysics) and [`@gerak/rapier`](#gerakrapier)
- [`@gerak/three`](#gerakthree)
- [Commands](#commands)

## @gerak/moves

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
window(time, 0.25, 0.5);

const LETTERS = lanes([1, 1, 1, 1], 0.25);
const BURST = lanes([1, 1, 1, 1, 1], 0.2, { from: "center", spacing: ease.quadOut });
drop(options, lane(word.of(time), i, LETTERS));
```

Each move is `move(options, time)`. `move.options` lists its options with ranges; `move.moments(options)` gives named
shares of its progress. The catalog, not this page, says what each move does and takes: `npm run motion:moves` prints
one line per move, `-- --role <role>` one role, and `-- <id>` one move in full with the shape of its call. By role:

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

<!-- generated:reference:start -->
- **`UNTIMED`** `const UNTIMED: Clock`: The untimed clock: no ms at all, as under scroll or manual control.
- **`atProgress`** `(progress: number): Time`: A `Time` at `progress` with no clock, for code that drives a move by hand.
- **`elapsedOf`** `(clock: Clock): number`: The ms a clock has run, or `undefined` for a clock that has none.
- **`liveAt`** `(elapsed: number): Time`: A live `Time` `elapsed` ms after the page started; it has no length, so its progress stays 0.
- **`span`** `(fromMs: number, toMs: number): Span`: A stretch in ms: `.of(time, ease?)` is a move's time inside it, counting from `fromMs`; `.at(share)` the ms a share falls on. Throws `RangeError` on an untimed time.
- **`window`** `(time: Time, from: number, to: number): Time`: `time` inside the shares `from` to `to`: progress mapped, a timed clock cut to it. Prefer `span`; `windowed` does the same to a bare number.
- **`windowed`** `(progress: number, from: number, to: number): number`: Maps `progress` inside `[from, to]` onto `[0, 1]`, holding outside it; a zero-length window steps at `from`.
- **`Clock`** `type Clock`: A clock: ms of a known length when timed, ms with no end when live, none under scroll or manual control.
- **`Span`** `type Span`: A stretch of the scene in ms: `of` gives a move's time inside it, `at` the ms a share of it falls on.
- **`Time`** `type Time`: Where a move is: `progress` from 0 to 1, and the clock behind it.
- **`backEase`** `(options: { readonly amount: number; readonly direction: EaseDirection; }): Ease`: A back curve that pulls back by `amount` before it goes (`"in"`), overshoots by it as it ends (`"out"`), or both (`"inOut"`); `amount: 0` is the cubic.
- **`ease`** `const ease: Readonly<{ linear: (u: number) => number; sineIn: Ease; sineOut: Ease; sineInOut: Ease; quadIn: Ease; quadOut: Ease; quadInOut:…`: The common eases under their usual names: `In` starts slow, `Out` ends slow, `InOut` does both.
- **`springEase`** `(options: SpringOptions): Ease`: A spring from 0 settling on 1, fitted to the span; lower `damping` rings more. Feed it to values, not to a move's progress.
- **`Ease`** `type Ease`: A curve from progress 0 to 1 onto eased progress, 0 at 0 and 1 at 1; back and elastic overshoot.
- **`EaseDirection`** `type EaseDirection`: Which end of a curve is slow: `in` starts slow, `out` ends slow, `inOut` does both.
- **`spring`** `(offset: number, speed: number, seconds: number, options: SpringOptions): SpringState`: Where a spring is, `seconds` after it left `offset` from its goal at `speed`, and how fast it goes.
- **`SpringOptions`** `type SpringOptions`: A unit-mass spring: pull towards its goal per second squared, and drag on its speed per second.
- **`SpringState`** `type SpringState`: Where a spring is from its goal, and how fast it moves, in units and units a second.
- **`trail`** `(signal: (time: Time, events: Events) => number, options: TrailOptions): (time: Time, events: Events) => number`: A value chasing `signal(time, events)` on a spring, for follow-through and drag. Pass the scene's time: the signal applies its own spans and eases.
- **`TrailOptions`** `type TrailOptions`: Settings of a `trail`: `stiffness` (default 170), `damping` (26), `stepMs` (1 to 33, default 8) and `rest`, the distance under which it sits on the signal.
- **`trailTurn`** `(signal: (time: Time, events: Events) => Pose3d, options: TrailOptions): (time: Time, events: Events) => Pose3d`: A turn chasing a `Pose3d` signal's turn on a spring, the short way round, resting exactly on it; pass the scene's time. Trail a position with three `trail` calls.
- **`timeAt`** `(time: Time, ms: number): Time`: `time` moved to `ms` on its own clock, for reading a signal a moment earlier or later; untimed stays as it is.
- **`mix`** `(from: number, to: number, share: number): number`: The number `share` of the way from `from` to `to`; a share past 0 or 1 extrapolates.
- **`mixAngle`** `(from: number, to: number, share: number): number`: An angle in degrees `share` of the way from `from` to `to`, turning the short way round.
- **`mixPoint`** `(from: { readonly x: number; readonly y: number; }, to: { readonly x: number; readonly y: number; }, share: number): { readonly x: number; …`: A point `share` of the way from `from` to `to`.
- **`mixPose`** `(from: Pose2d, to: Pose2d, share: number): Pose2d`: A pose `share` of the way between two; a field one pose lacks counts as its rest, and a custom number as 0.
- **`keyframes`** `<T>(start: T, keys: readonly Key<T>[], blend: (from: T, to: T, share: number) => T): (time: Time) => T`: A value moving from `start` at 0 ms to each key in turn, then holding; `blend` is `mix`, `mixPoint`, `mixPose` or alike.
- **`Key`** `type Key`: One keyframe: the value reached at `at` ms, eased from the key before; with no `ease` it is linear.
- **`sequence`** `<R>(time: Time, phases: readonly Phase<R>[]): R`: Answers the last phase that started, given its own time: an ended phase holds its end, before the first the first holds its start. An empty list throws.
- **`Phase`** `type Phase`: One phase of a sequence: the span it runs in, and what it answers given its own time there.
- **`seeded`** `(seed: number): () => number`: Repeatable random numbers from 0 up to 1 for a seed, so a scattered scene is the same each run; use it, never `Math.random()`.
- **`NO_EVENTS`** `const NO_EVENTS: Events`: The empty event list; share it rather than allocating one.
- **`follow`** `(options: FollowOptions): (time: Time, events: Events) => number`: A spring each named event sends towards its goal, turning back with no jump; pure in time and events.
- **`mergeEvents`** `(...lists: readonly Events[]): Events`: Several event lists as one, oldest first; a scene's own cues joined with the page's events.
- **`react`** `(options: ReactOptions): (time: Time, events: Events) => number`: A damped answer to each past event by `kind` (`recoil`, `wobble`, `flash` or `shake`); 0 before the first and once all have died.
- **`Events`** `type Events`: Every event so far, oldest first; a scene reads it beside its time.
- **`FollowOptions`** `type FollowOptions`: Settings of a `follow`: `start`, `on` (goal by event name), `target`, `stiffness` (default 170), `damping` (26) and `rest` (0.001).
- **`MotionEvent`** `type MotionEvent`: Something that happened at `at` ms on the scene's clock: a hover, a press, a landing; `target` names where.
- **`ReactionKind`** `type ReactionKind`: How a response to one event moves: from a full start, from rest, as a fade, or as a shake.
- **`ReactOptions`** `type ReactOptions`: Settings of a `react`: event names `on`, `target`, `kind`, `amplitude`, `decay` (default 6 a second) and `frequency` (4 a second).
- **`lane`** `(time: Time, index: number, of: Lanes): Time`: Lane `index` run inside `time`: its progress, and a timed clock split among the lanes.
- **`laneTime`** `(position: number, index: number, of: Lanes, durationMs?: number): Time`: Lane `index` at overall `position`; with `durationMs` its clock is that lane's own window, in ms.
- **`lanes`** `(lengths: readonly number[], stagger: number, options?: LanesOptions): Lanes`: Lanes of these relative lengths, each starting `stagger` after the one before it in the order `from` gives.
- **`LaneOrigin`** `type LaneOrigin`: Which lanes start first: from one end, from the centre out, from both edges in, or shuffled by a seed.
- **`Lanes`** `type Lanes`: Lanes started `stagger` lane-lengths apart in the order `from` gives; `span` reaches the last finish.
- **`LanesOptions`** `type LanesOptions`: Settings of `lanes`: `from` picks which start first (default `"start"`); `spacing`, an ease, bends the start times (default even).
- **`createLoopCycle`** `(options: LoopCycleOptions): LoopCycle`: Creates loop state and cycle arithmetic; `duration` is not re-validated here.
- **`LoopCycle`** `type LoopCycle`: Loop phase state; `advance` consumes a clock delta and returns progress.
- **`LoopCycleOptions`** `type LoopCycleOptions`: Options for `createLoopCycle`; phase, direction and completion are owned here, not by the driver.
- **`LoopCycleStep`** `type LoopCycleStep`: The progress a single `advance` produces.
- **`CUSTOM_FIELD`** `const CUSTOM_FIELD: ValueField`: A number a piece names itself, under `custom`: it rests at 0 and adds, and each renderer says where it goes.
- **`POSE_2D_FIELDS`** `const POSE_2D_FIELDS: readonly ("rotation" | "x" | "y" | "scale" | "scaleX" | "scaleY" | "opacity" | "blur" | "drawn" | "drawnFrom" | "clip…`: Every field a renderer must write for a pose: its numbers and its anchor.
- **`VALUE_FIELDS`** `const VALUE_FIELDS: Readonly<{ x: ValueField; y: ValueField; z: ValueField; rotation: ValueField; rotationX: ValueField; rotationY: ValueFi…`: Every field a value can carry, one row each; nothing else states a field's rest or how it combines.
- **`squashed`** `(squash: number, weight: number, anchor?: Anchor): Pose2d`: A pose `weight` of the way into `squash` against the `anchor` side, `"bottom"` when absent; `"left"` and `"right"` squash sideways.
- **`valueField`** `(name: string): ValueField`: The row a field name has in the table, or nothing when it has none.
- **`Anchor`** `type Anchor`: The point of a box that stays put while it scales and turns.
- **`Combining`** `type Combining`: How two answers for one field on one target become one.
- **`Pose2d`** `type Pose2d`: A 2D pose, every field optional: `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY`, `opacity`, `anchor` and `custom` numbers. Stage px, y down, degrees clockwise.
- **`ValueField`** `type ValueField`: What a field of a value is: where it rests, how it combines, and what the gate asks of it.
- **`combine3d`** `(poses: readonly Pose3d[]): Pose3d`: Poses on one target as one: each field joins as its row says, custom numbers add, turns compose in order.
- **`lift2d`** `(pose: Pose2d, options: { readonly unitsPerPx: number; }): Pose3d`: A 2D pose on the 3D xy plane: px scaled by `unitsPerPx`, y and the turn flipped, the anchor dropped; every 2D move reaches 3D through it.
- **`mixPoint3d`** `(from: { readonly x: number; readonly y: number; readonly z: number; }, to: { readonly x: number; readonly y: number; readonly z: number; }…`: A 3D point `share` of the way from `from` to `to`.
- **`mixPose3d`** `(from: Pose3d, to: Pose3d, share: number): Pose3d`: A pose `share` of the way between two; turns take the short arc, past the ends too; a missing field rests.
- **`squashed3d`** `(squash: number, weight: number, axis?: "x" | "y" | "z"): Pose3d`: A body `weight` of the way into its `squash` along `axis`, widened on the other two so its volume stays.
- **`Pose3d`** `type Pose3d`: A 3D pose, every field optional: `x`, `y`, `z`, `rotation` (about z), `rotationX`, `rotationY`, scales, `opacity`. Y up, degrees on Z-X-Y; a `Pose2d` is refused.
- **`aim`** `(from: Point3, to: Point3, up?: Point3): Pose3d`: The turn that points local -z (a camera's forward) from `from` at `to`, `up` +y when absent, no roll; `{}` when they meet.
- **`orbit`** `(options: { readonly target: Point3; readonly radius: number; readonly azimuth: number; readonly elevation: number; }): { readonly x: numbe…`: A point `radius` from `target`: azimuth about +y from +z toward +x, elevation up from the xz plane, degrees.
- **`Anchor2d`** `type Anchor2d`: A named path point with the handles of a smooth cubic through it, relative to the point.
- **`Cubic2d`** `type Cubic2d`: One cubic Bézier segment from `(x0, y0)` to `(x3, y3)`, named by the anchor it leaves.
- **`Point2d`** `type Point2d`: A named point in px.
- **`toCubics`** `(anchors: readonly Anchor2d[]): readonly Cubic2d[]`: One segment per pair of neighbouring anchors, leaving through one's out handle and arriving through the next's in handle.
- **`along`** `(cubics: readonly Cubic2d[], share: number, options?: { readonly turn?: boolean; }): Pose2d`: The `{ x, y }` pose `share` of the way along a path by distance, from the target's rest; `turn: true` adds `rotation`, the heading in degrees (down is 90).
- **`velocity`** `(signal: (time: Time, events: Events) => Pose2d, time: Time, events: Events, stepMs?: number): { readonly vx: number; readonly vy: number; }`: The `{ vx, vy }` px a second a signal moves at the scene's `time` (not an eased one), over `stepMs`; zero with no clock.
- **`smear`** `(velocity: { readonly vx: number; readonly vy: number; }, options: { readonly stretch: number; readonly max: number; }): { readonly pose: P…`: Stretches along travel by `stretch` per 1000 px/s up to `max`, area kept; `heading` in (-90, 90]. Content that must not turn goes in an inner element posed `{ rotation: -heading }`.
- **`toCubics3d`** `(anchors: readonly Anchor3d[]): readonly Cubic3d[]`: One segment per pair of neighbouring anchors, leaving through one's out handle and arriving through the next's in handle.
- **`along3d`** `(cubics: readonly Cubic3d[], share: number, options?: { readonly face?: boolean; }): Pose3d`: The pose `share` of the way along a 3D path by distance; `face` adds the turn of local +x onto the tangent, no roll.
- **`velocity3d`** `(signal: (time: Time, events: Events) => Pose3d, time: Time, events: Events, stepMs?: number): { readonly vx: number; readonly vy: number; …`: Units per second a signal's `x`, `y` and `z` move at the scene's `time`, never an eased one; zero with no clock.
- **`smear3d`** `(velocity: { readonly vx: number; readonly vy: number; readonly vz: number; }, options: { readonly stretch: number; readonly max: number; }…`: Stretches along travel by `stretch` per unit a second up to `max`, volume kept; reversing never flips it; `turn` undoes it.
- **`Anchor3d`** `type Anchor3d`: A named 3D path point with the handles of a smooth cubic through it, relative to the point.
- **`Cubic3d`** `type Cubic3d`: One 3D cubic Bézier segment from `(x0, y0, z0)` to `(x3, y3, z3)`, named by the anchor it leaves.
- **`combine`** `(poses: readonly Pose2d[]): Pose2d`: Poses on one target as one: each field joins as its table row says, custom numbers add, the first anchor stays.
- **`MOVE_ROLES`** `const MOVE_ROLES: readonly ("enter" | "exit" | "emphasis" | "travel" | "reveal" | "follow" | "modifier")[]`: Every role, in the order a catalog lists them.
- **`defineMove`** `<const Fs extends OptionFields, I, R, const M extends Moments>(declaration: MoveDeclaration<Fs, I, R, M>): Move<Fs, I, R, M>`: Makes a move from its declaration. The call checks options (kind, `min`, `max`, `enum`) and fills defaults; `run(options, time, input)` may take a third argument callers must then pass.
- **`InputArgs`** `type InputArgs`: The trailing argument a caller passes: none for a move whose `run` takes no input.
- **`Move`** `type Move`: A move: callable with a caller's options, and carrying what its declaration says of them.
- **`MoveDeclaration`** `type MoveDeclaration`: A move's one declaration: the source of its types, option checks, moments and catalog entry.
- **`MoveExample`** `type MoveExample`: A call the gate samples: `options` a caller would pass, and `input` when the move's `run` takes one.
- **`MoveRole`** `type MoveRole`: What a move is for: `enter`, `travel` end at rest; `exit` starts at rest; `emphasis` both; `reveal` ends shown; `follow`, `modifier` hold no rest.
- **`Moments`** `type Moments`: Named times a move reaches, as shares of its progress, such as a hop's landings.
- **`OptionField`** `type OptionField`: One option of a move; an option with a `default` may be left out by the caller.
- **`OptionFields`** `type OptionFields`: A move's options by name, each an `OptionField` with its kind, range, default and description.
- **`Options`** `type Options`: Options as a move runs on them: every default filled in.
- **`OptionsIn`** `type OptionsIn`: Options as a caller passes them: defaulted ones may be left out.
- **`drop`** `(options: OptionsIn<{ readonly distance: { readonly kind: "number"; readonly min: 0; readonly description: "Start this far above rest, in p…`: Falls from `distance` above its rest pose, accelerating, then lands and recovers from `squash`.
- **`rise`** `(options: OptionsIn<{ readonly distance: { readonly kind: "number"; readonly min: 0; readonly description: "Start this far below rest, in p…`: Rises from `distance` px below its rest pose, decelerating.
- **`slide`** `(options: OptionsIn<{ readonly distance: { readonly kind: "number"; readonly min: 0; readonly description: "Start this far from rest, in px…`: Slides in from `distance` px away on one side, decelerating.
- **`pop`** `(options: OptionsIn<{ readonly overshoot: { readonly kind: "number"; readonly default: 0.2; readonly min: 0; readonly max: 1; readonly desc…`: Grows from nothing past full size and settles back to exactly 1.
- **`fade`** `(options: OptionsIn<{}>, time: Time): Pose2d`: Fades in, opacity from 0 to 1.
- **`unfold`** `(options: OptionsIn<{ readonly from: { readonly kind: "string"; readonly enum: readonly ["top", "bottom", "left", "right"]; readonly defaul…`: Grows from nothing along one axis to full size, held at an edge.
- **`swing`** `(options: OptionsIn<{ readonly angle: { readonly kind: "number"; readonly description: "Start turned this far, in degrees."; }; readonly sw…`: Hangs in from a turn of `angle` degrees and swings to rest like a sign on a hinge.
- **`pulse`** `(options: OptionsIn<{ readonly amount: { readonly kind: "number"; readonly default: 0.15; readonly min: 0; readonly max: 2; readonly descri…`: Grows to `1 + amount` times its size and returns.
- **`shake`** `(options: OptionsIn<{ readonly distance: { readonly kind: "number"; readonly min: 0; readonly description: "The most it can reach to either…`: Shakes sideways `count` times, starting hard and dying away.
- **`wobble`** `(options: OptionsIn<{ readonly angle: { readonly kind: "number"; readonly min: 0; readonly description: "The widest turn, in degrees."; }; …`: Wobbles `count` times, a shake that turns instead of moving.
- **`nod`** `(options: OptionsIn<{ readonly distance: { readonly kind: "number"; readonly min: 0; readonly description: "How far down it dips, in px."; …`: Dips `distance` px down and comes back up, once.
- **`arc`** `(options: OptionsIn<{ readonly dx: { readonly kind: "number"; readonly description: "Start this far right of rest, in px (negative: left)."…`: Travels from an offset to rest along a path bowed by `lift` px.
- **`hop`** `(options: OptionsIn<{ readonly height: { readonly kind: "number"; readonly min: 0; readonly description: "Peak of the first flight above re…`: Lands `bounces + 1` times, each flight `decay` as high, and settles at rest. Adds `contact { hits, justHit }`: `justHit` runs 1 at a landing to 0 a fifth of a flight on.
- **`rope`** `(options: OptionsIn<{ readonly angle: { readonly kind: "number"; readonly default: 0; readonly description: "Heading of the straight rope a…`: Bends a chain of points from straight into their shape, link by link. Takes `{ points }` as a third argument and answers anchors for `toCubics`.
- **`trace`** `(options: OptionsIn<{ readonly tail: { readonly kind: "number"; readonly default: 1; readonly min: 0; readonly max: 1; readonly description…`: Draws a path on from its start, answering `drawn` and `drawnFrom`; `tail` (default 1) is the share kept drawn behind the head.
- **`wipe`** `(options: OptionsIn<{ readonly radius: { readonly kind: "number"; readonly min: 0; readonly description: "Final circle radius, in px; cover…`: Grows a circle from `(x, y)` to `radius`, easing in and out, answering `clipX`, `clipY` and `clipRadius` in px from the target's top left.
- **`reversed`** `(time: Time): Time`: A time run backwards (progress `p` answers `1 - p`); a function of time, not a move, so any move or value plays through it.
- **`anticipate`** `(options: OptionsIn<{ readonly share: { readonly kind: "number"; readonly default: 0.2; readonly min: 0; readonly max: 0.9; readonly descri…`: Winds up the other way from its input's travel, then plays the input and ends where it ends.
- **`overshoot`** `(options: OptionsIn<{ readonly share: { readonly kind: "number"; readonly default: 0.3; readonly min: 0; readonly max: 0.9; readonly descri…`: Plays its input, then passes its last pose and settles back onto it.
- **`repeated`** `(time: Time, count: number): Time`: A time with its progress running 0 to 1 `count` times (rounded down, at least 1); a function of time, not a move.
<!-- generated:reference:end -->

## @gerak/player

A scene is `(time, events) => targets`; `play` runs it on a driver.

```ts
const player = play(scene, clock(), { cues });
player.on("catch", () => sound.play());

const driver = manualDriver({ durationMs });
play(scene, driver);
driver.seekMs(1200);
```

<!-- generated:reference:start -->
- **`manualDriver`** `(options?: { readonly durationMs?: number; }): ManualDriver`: A driver moved by hand: `.seek(progress)`, `.seekMs(ms)`. Timed when given `durationMs`, untimed otherwise.
- **`play`** `<T extends object>(scene: Scene<T>, driver: Driver, options?: PlayOptions): Player<T>`: Runs `scene` against `driver`, telling each target's subscribers its value on every step.
- **`Driver`** `type Driver`: What drives a scene: the time now, the events so far when it watches any, and a signal each time it moves.
- **`ManualDriver`** `type ManualDriver`: A driver moved by hand, timed when it knows its length in ms.
- **`Player`** `type Player`: A scene's values by target, rerun whole on each step of its driver.
- **`PlayOptions`** `type PlayOptions`: Options of `play`: `cues`, the scene's own events at known ms, merged with the page's.
- **`Scene`** `type Scene`: A scene: every target's value from the time and the events so far.
<!-- generated:reference:end -->

## @gerak/dom

Writes a value onto an element, and the drivers that move a scene on the page's frames, scroll or pointer events.

```ts
player.subscribe("title", (pose) => applyValue(title, pose));
applyValue(cover, wipe({ radius: 1500, x: 640, y: 360 }, time));

export const clock = () => clockDriver({ duration: durationMs });
const scrolled = () => scrollDriver({ start: 0, end: 1200, length: durationMs });
export const clock = () => eventDriver({ introMs: 900 });
```

<!-- generated:reference:start -->
- **`applyPath`** `(target: RenderTarget, cubics: readonly Cubic2d[]): void`: Sets a path element's `d` to the cubic segments.
- **`applyValue`** `(target: RenderTarget, value: Pose2d, length?: number): void`: Writes a value, each custom number as `--<name>`; a stroke with no length to measure is left undashed.
- **`cssClip`** `(x: number, y: number, radius: number): string`: A CSS clip path showing what lies inside a circle `radius` px round, centred `x`, `y` px from the top left.
- **`cssDash`** `(from: number, to: number, length: number): { readonly strokeDasharray: string; readonly strokeDashoffset: number; }`: The stroke dash that shows the stretch from share `from` to share `to` of a path `length` long.
- **`cssOrigin`** `(anchor: Anchor): string`: The CSS transform origin an anchor names.
- **`cssTransform`** `(values: Readonly<Record<string, unknown>>): string`: A CSS transform from pose-like values: translate first, then turns, then scales; empty when nothing moves.
- **`pathData`** `(cubics: readonly Cubic2d[]): string`: SVG path data for joined cubic segments.
- **`TRANSFORM_KEYS`** `const TRANSFORM_KEYS: readonly string[]`: The value keys a CSS transform carries; every other key writes as its own property.
- **`RenderStyle`** `type RenderStyle`: The style properties a renderer writes; a real element's `CSSStyleDeclaration` has them all.
- **`RenderTarget`** `type RenderTarget`: An element a renderer writes: its style, and the attribute and measuring hooks an SVG element has.
- **`clockDriver`** `(options: ClockOptions): ClockDriver`: A timed clock on the page's frames. Under reduced motion it shows the last frame and never ticks until `.play()`; `reducedMotion: "play"` opts out.
- **`scrollDriver`** `(options: { readonly target?: ScrollTarget; readonly start: number; readonly end: number; readonly length?: number; }): Driver`: A driver from 0 to 1 as the target scrolls from `start` to `end` px; untimed unless given a `length` in ms.
- **`ClockDriver`** `type ClockDriver`: A driver on the page's frames, timed in ms, with the delay, repeat and yoyo a `time` trigger has.
- **`ClockOptions`** `type ClockOptions`: Settings of `clockDriver`: `duration` ms, `delay`, `repeat`, `yoyo`, `autoplay`, `frames` and `reducedMotion`.
- **`FrameSource`** `type FrameSource`: Where frames come from: `requestAnimationFrame` on a page, a fake one in a test.
- **`ScrollTarget`** `type ScrollTarget`: What a scroll driver reads: a window or a scrolling element.
- **`eventDriver`** `(options?: EventDriverOptions): EventDriver`: A live clock that logs events: `.watch`, `.watchView` and `.emit`. `introMs` keeps frames coming for an intro, `settleMs` after the last event.
- **`WATCHED`** `const WATCHED: Readonly<Record<string, string>>`: The page events a watched element turns into motion events, and the name each gets.
- **`EventDriver`** `type EventDriver`: A live driver: its clock runs from creation, and it logs the events of the elements it watches.
- **`EventDriverOptions`** `type EventDriverOptions`: Settings of `eventDriver`: `settleMs` (default 2000 ms), `introMs` (0), `frames` and `clock`.
- **`EventSource`** `type EventSource`: Something that sends DOM events: an element, or a stand-in in a test.
- **`PointerLike`** `type PointerLike`: What a pointer event says about where it happened.
<!-- generated:reference:end -->

## @gerak/react

Hooks that play a scene while a component stays and write each target onto its element with no render. Define the
scene, driver factory and cues outside the component. For a list target, give each element its own `useTarget` on the
list with a `render` that picks its index.

```tsx
const playing = usePlayer(scene, clock, cues);
const ball = useTarget(playing?.player, "ball");
const Letter = ({ player, i, char }: { player: Player<Frame> | undefined; i: number; char: string }) => {
  const render = useCallback((el: HTMLElement, poses: Frame["letters"]) => applyValue(el, poses[i] ?? {}), [i]);
  return <span ref={useTarget(player, "letters", render)}>{char}</span>;
};
const landed = useValue(playing?.player, "ball", (pose) => (pose.y ?? 0) === 0);
const hit = useWatch(playing?.driver, "card");
const centre = centreIn(dot, stage);
```

<!-- generated:reference:start -->
- **`centreIn`** `(from: LayoutBox, to: LayoutBox): Offset`: `from`'s layout centre as an `Offset` from `to`'s top-left corner; layout ignores transforms, so this is the rest pose.
- **`mergeRefs`** `<T>(...refs: readonly RefCallback<T>[]): RefCallback<T>`: Combines ref callbacks so one element can be bound by several hooks.
- **`LayoutBox`** `type LayoutBox`: The layout an element exposes; an `HTMLElement` has it.
- **`Offset`** `type Offset`: A point in px: `x` right and `y` down from a corner.
- **`PlayerHostProvider`** `(props: ProviderProps<PlayerHost>): ReactNode`: Gives every `usePlayer` below it a `PlayerHost`; a saved file then swaps a new `scene` or `cues` in with `player.replace`, keeping the player and its time.
- **`driverKeeper`** `(): DriverKeeper`: Makes a `DriverKeeper`: keeps its driver while a factory makes one of the same members and equal `options`; else takes the new one at the old time and disposes the old.
- **`usePlayer`** `<T extends object, D extends OwnedDriver>(scene: Scene<T>, createDriver: () => D, cues?: Events): Playing<T, D>`: Plays `scene` on a driver from `createDriver` with `cues`; define all three outside the component. Gives `Playing`, or `undefined` before it exists.
- **`useTarget`** `<T extends object, K extends PoseTargets<T>>(player: Player<T>, target: K): RefCallback<RenderTarget> (+1 overloads)`: Writes a target onto the element the ref lands on every step, with no render. For a list target give each element its own `useTarget` with a `render` that picks its index. Writes a target onto the element the ref lands on through `render`, every step, with no React render.
- **`useValue`** `<T extends object, K extends keyof T, V>(player: Player<T>, target: K, select: (value: T[K]) => V): V`: Reads a rarely changing value of a target into a render; `select` should answer a primitive.
- **`useWatch`** `(driver: EventDriver, target: string): RefCallback<Element>`: Logs the events of the element the ref lands on to `driver` as `target`'s; put it on an element that stays still.
- **`DriverKeeper`** `type DriverKeeper`: A host's one driver: kept while a factory makes the same driver, replaced at the same time when it does not.
- **`OwnedDriver`** `type OwnedDriver`: A driver a component owns, released when the component leaves.
- **`PlayerHost`** `type PlayerHost`: What a page may take over from `usePlayer`: which driver runs the scene, and how a scene is wrapped.
- **`Playing`** `type Playing`: What `usePlayer` gives: the `player` and the `driver` it plays on.
<!-- generated:reference:end -->

## @gerak/rig

Joint chains: `buildChain` checks a bone tree, `ik` solves it to goals, `fk` and `chainPoses` read it back as poses.
Exports below that no scene calls (matrices, quaternions, 3D chain solving) are there for other packages.

```ts
const arm = buildChain([{ id: "upper", length: 170 }, { id: "lower", parentId: "upper", length: 150 }]);
const { rotations } = ik(arm, { lower: { x: 486, y: 412 } }, { base, flip: true });
const tips = fk(arm, { rotations, base });
const { bones, tips } = chainPoses(arm, { rotations, base });
```

<!-- generated:reference:start -->
- **`buildChain`** `<const B extends readonly Bone2d[]>(bones: B): Chain2d<B[number]["id"]>`: A checked bone tree from `Bone2d` rows `{ id, parentId?, length, rotation?, minRotation?, maxRotation? }`, parent first; ids type every later answer. Throws on a bad list.
- **`chainPoses`** `<Id extends string>(chain: Chain2d<Id>, options?: ChainPose): { readonly bones: Readonly<Record<Id, BonePose>>; readonly tips: Readonly<Rec…`: Poses for elements laid out at the base: each bone from its start joint, and each tip as an offset.
- **`composeChain`** `(structure: Pick<BodyStructure, "ids" | "parentById">, base: WorldFrame, linkOf: (id: string, position: number) => Link2d): ReadonlyMap<...>`: The world frame at each bone's tip, parent first, from each bone's link.
- **`fk`** `<Id extends string>(chain: Chain2d<Id>, options?: ChainPose): Readonly<Record<Id, WorldFrame>>`: Each bone's tip as a world frame `{ x, y, rotation }`; `rotations` (degrees, by bone id) replace rest rotations, `base` is the root frame.
- **`ik`** `<Id extends string>(chain: Chain2d<Id>, goals: Readonly<Partial<Record<Id, Goal2d>>>, options?: { readonly base?: WorldFrame; readonly flip…`: Rotations that bring each goal's bone tip to its `{ x, y }` goal within limits, with a `quality.kind` (`"too-far"` past reach); `flip` bends the elbow the other way.
- **`Bone2d`** `type Bone2d`: One 2D bone: its length along its own x axis, a rest rotation in degrees, and an optional pivot offset.
- **`BonePose`** `type BonePose`: A bone's pose for an element laid out from the chain's base pointing right, turning on its left end.
- **`Chain2d`** `type Chain2d`: A checked bone tree, built once and reused every frame; `order` lists its bone ids parent first.
- **`ChainPose`** `type ChainPose`: How a chain is posed: each bone's rotation against its parent, in degrees, and where its root sits.
- **`Goal2d`** `type Goal2d`: Where a bone's tip should go, with an optional weight against other goals.
- **`Link2d`** `type Link2d`: What composes one link: its length, its rotation against its parent, and its pivot offset.
- **`TipPose`** `type TipPose`: An offset from the chain's base, for an element centred on the base, such as a hand on a tip.
- **`PivotOffset`** `type PivotOffset`: Authored pivot offset, in base's rotated frame.
- **`WorldFrame`** `type WorldFrame`: Pivot and direction in world space: keys a plugin publishes.
- **`eulerFromMatrix3d`** `(matrix: Matrix3): Euler3d`: Decomposes a CSS Z-X-Y matrix into angles canonical in `(-180, 180]`.
- **`IDENTITY_MATRIX3`** `const IDENTITY_MATRIX3: Matrix3`: Identity rotation: the frame a swing or twist is measured from.
- **`matrixFromEuler3d`** `(euler: Euler3d): Matrix3`: CSS `Rz(rotation) * Rx(rotationX) * Ry(rotationY)`, in degrees.
- **`matrixFromQuaternion`** `(q: Quaternion): Matrix3`: `q`'s row-major matrix; the `2 / |q|²` scale keeps a non-unit `q` a rotation.
- **`multiplyMatrix3`** `(left: Matrix3, right: Matrix3): Matrix3`: Multiplies row-major 3x3 matrices.
- **`quaternionFromEuler3d`** `(euler: Euler3d): Quaternion`: Unit quaternion of a CSS Z-X-Y triple: `qz * qx * qy`, `matrixFromEuler3d`'s order.
- **`slerpQuaternion`** `(from: Quaternion, to: Quaternion, weight: number): Quaternion`: Short-arc blend `weight` from `from` to `to`; a negative dot negates `to` first.
- **`swingFrame3d`** `(frame: Matrix3, direction: Vec3): Matrix3`: `frame` turned minimally to take local +x onto `direction`: a swing, no twist.
- **`swingTwist3d`** `(local: Matrix3): SwingTwist3d`: Splits `local` into swing and twist about local +x; a pure swing reads no twist.
- **`transposeMatrix3`** `(matrix: Matrix3): Matrix3`: The inverse of an orthonormal rotation matrix.
- **`Euler3d`** `type Euler3d`: 3D orientation convention, owned here: CSS Euler order Z-X-Y, degrees.
- **`Matrix3`** `type Matrix3`: A row-major 3x3 rotation matrix, nine numbers.
- **`PivotOffset3d`** `type PivotOffset3d`: A pivot offset, read in its parent's rotated frame.
- **`Quaternion`** `type Quaternion`: `w + xi + yj + zk`; unit where produced here; never authored or published.
- **`SwingTwist3d`** `type SwingTwist3d`: Local orientation as `swing * twist`; `twist` turns about local +x, applied first.
- **`Vec3`** `type Vec3`: A 3D vector as `[x, y, z]`.
- **`WorldFrame3d`** `type WorldFrame3d`: A 3D frame in world space: a position `x`, `y`, `z` and a turn `rotation`, `rotationX`, `rotationY` in degrees on the CSS Z-X-Y order.
- **`SolveQuality`** `type SolveQuality`: How well rotations met the goal: one flat union over both strategies. Residual is distance left; kind says why.
- **`SolveResult`** `type SolveResult`: One IK solve answer, same shape every strategy: rotations plus quality.
- **`UNBOUND_POLE3D`** `const UNBOUND_POLE3D: Pole3d`: Solve with no pole bound; shared, not allocated per solve.
- **`Pole3d`** `type Pole3d`: Authored bend control: `unbound` keeps the root-local +z rule; `point` is the world position the elbow bends toward, with the bend plane through pivot, goal and pole.
- **`ChainMember3d`** `type ChainMember3d`: One member of a 3D solver chain, as both 3D strategies read it. `base` names parent or root; `limit`, `influence`, `orient`, `goal` only where authored; absent = free or unpulled.
- **`FREE_JOINT3D`** `const FREE_JOINT3D: JointLimit3d`: The joint limit that constrains nothing; shared, not allocated per read.
- **`JointLimit3d`** `type JointLimit3d`: Sole owner of 3D joint limits: the legal local orientation, relative to the parent's solved frame, nearest the one the solve proposes.
- **`chainShape3d`** `(members: readonly ChainMember3d[]): ChainShape3d`: Chain shape, or a throw when no member carries a goal. Order: goal guard → `constrained` → `two-bone` pair → `tree`.
- **`solveChain3d`** `(root: WorldFrame3d, members: readonly ChainMember3d[], bend?: Pole3d): SolveResult3d`: Solves one 3D chain: position by shape, then each oriented leaf toward its goal. Orientation turns leaves without moving the tip, so position keeps priority.
- **`ChainShape3d`** `type ChainShape3d`: Strategy answering one 3D chain; derived at solve time, never authored. `two-bone` carries pair + goal, `tree` members, `constrained` members with a limiting joint.
<!-- generated:reference:end -->

## @gerak/stage

Who is on stage and when. A cast member is a proxy: `actor`, `many` and `group` say only what the scene's motion
needs (a name, how many parts, the text, when it is shown, whether it is watched); how it looks is the renderer's
skin. `story` names the beats and owns the piece's length; `restOf` reads where a member rests once laid out.

```ts
export const beats = story(4000, { arrive: [0, 1600], hold: [1600, 4000] });
export const cast = { word: letters("NIGHT", { enters: "arrive" }), dot: actor() };
```

<!-- generated:reference:start -->
- **`actor`** `(options?: Behaviour & { readonly text?: string; }): Actor`: One thing on stage, saying `text` when it has one.
- **`castNames`** `(cast: Readonly<Record<string, Member>>, beats?: readonly string[]): readonly CastName[]`: Every name the cast makes, in order, with presence taken from the nearest group that states it.
- **`group`** `(members: Readonly<Record<string, Member>>, options?: Behaviour): Group`: Members moved together; their keys join the cast's, so each must be unique across it.
- **`letters`** `(text: string, options?: Behaviour): Many`: A word or line split into its letters, one text actor each, in order.
- **`many`** `(count: number, options?: Behaviour): Many (+1 overloads)`: `count` things, or one per entry of `list` made by `make`; the scene answers one value per item.
- **`words`** `(text: string, options?: Behaviour): Many`: A line split into its words at spaces, one text actor each, in order.
- **`Actor`** `type Actor`: One thing on stage; the scene answers one value for it, and a renderer's skin decides what it looks like.
- **`Behaviour`** `type Behaviour`: What a member does beside being moved: when it is shown, whether its pointer events reach the scene.
- **`Cast`** `type Cast`: Who is on stage, by name; every key is unique across the whole cast, groups included.
- **`CastName`** `type CastName`: One name the cast makes: a member's key, or a key and an index for an item of `many`.
- **`Group`** `type Group`: Members moved together: the group's value applies to them, and each member's is relative to it.
- **`Many`** `type Many`: A list of things; the scene answers one value per item, in order.
- **`Member`** `type Member`: A cast member: what the scene's motion depends on, and nothing of how it looks.
- **`Presence`** `type Presence`: When a member is on stage, by the names of the story's beats; a member without them takes its group's.
- **`DEFAULT_FRAME`** `const DEFAULT_FRAME: Frame`: The frame a module gets when it names none.
- **`frame`** `(size: Frame): Frame`: A stage `width` by `height` px.
- **`story`** `<const B extends string>(durationMs: number, beats: Readonly<Record<B, readonly [number, number]>>): Story<B>`: Beats by name, each `[fromMs, toMs]` inside a piece `durationMs` long; beats may overlap.
- **`Frame`** `type Frame`: The stage's size in px; a renderer fits it to its container.
- **`Story`** `type Story`: A piece's beats as named spans, its length, and the beats' names in the order they were given.
- **`NO_REST`** `const NO_REST: Readonly<Record<string, Box>>`: The rest a tool with no renderer passes: no boxes.
- **`restOf`** `(rest: Readonly<Record<string, Box>>, name: string): Box`: The box `name` rests in, or a zero box when nothing measured it, so a scene never throws on a tool's run.
- **`Box`** `type Box`: Where a member rests once laid out: its centre and size in px, in the frame's own space.
- **`Rest`** `type Rest`: Each member's rest box by its cast name, as a renderer measured it after layout.
<!-- generated:reference:end -->

## @gerak/physics

The pure engine and `simulate`, which makes a seekable simulation from a world and a build function.

```ts
world.addBody({ id: "ball", shape: { kind: "circle", radius: 20 }, x: 640, y: 0, restitution: 0.5 });
const sim = simulate(builtinWorld(), (world) => {
  world.setGravity(0, 2600);
  world.addCollider("floor", { kind: "floor", y: 600 });
}, {
  spawn: (event, world) => {
    if (event.name === "click")
      world.addBody({ id: `bit${event.at}`, shape: { kind: "box", width: 14, height: 8 }, x: event.x ?? 0, y: event.y ?? 0 });
  },
});
sim.place(`bit${click.at}`, time, events);
```

<!-- generated:reference:start -->
- **`builtinWorld`** `(): PhysicsWorld`: The built-in engine: circles and boxes that turn, on floors, walls and segments; pure and synchronous.
- **`simulate`** `(world: PhysicsWorld, build: (world: PhysicsWorld) => void, options?: SimulateOptions): Simulation`: Builds a world once with `build`, then steps it at a fixed `dt`, spawning on events, as far as each question asks.
- **`Placed`** `type Placed`: Where a body is for an element laid out centred on the stage's top left corner, and whether it exists yet.
- **`SimulateOptions`** `type SimulateOptions`: Settings of `simulate`: `dt` seconds a step (default 1/120), `checkpointMs` (250), `maxCheckpoints` (32), `durationMs` (0) and `spawn`.
- **`Simulation`** `type Simulation`: A world played from time 0, seekable to any time, the same at the same time and events whatever came before.
- **`Spawner`** `type Spawner`: What a spawn may do to the world: add bodies, nothing else.
- **`BodySpec`** `type BodySpec`: A body to add: where its centre starts in stage px, its turn in degrees, and how fast both change.
- **`BodyState`** `type BodyState`: Where a body's centre is in stage px and how it is turned in degrees, and how fast each changes a second.
- **`Collider`** `type Collider`: A collider that never moves: the line bodies rest on, a side that keeps them in, or a ramp.
- **`Contact`** `type Contact`: Two things that started touching during a step: body ids, or a body id and a collider id.
- **`PhysicsWorld`** `type PhysicsWorld`: What every physics engine gives a scene, in stage px, degrees and seconds, y down and turns clockwise.
- **`Shape`** `type Shape`: A body's outline: a circle by its radius, or a box by its size, centred on the body.
- **`Surface`** `type Surface`: How a surface answers a hit: bounce kept, from 0 to 1, and grip, from 0 up; the two sides' values average.
<!-- generated:reference:end -->

## @gerak/rapier

The same worlds on Rapier, loaded once. `RapierWorld`s are `PhysicsWorld`s with `native` and `rigidBody(id)`.

```ts
const rapier = await rapierEngine();
const sim = simulate(rapier(), build);
```

<!-- generated:reference:start -->
- **`rapierEngine`** `(): Promise<() => RapierWorld>`: Loads Rapier's WASM once; the factory it gives makes worlds synchronously after that.
- **`RapierWorld`** `type RapierWorld`: A Rapier world behind the port, with Rapier's own world for what the port leaves out.
<!-- generated:reference:end -->

## @gerak/three

Writes poses onto Three.js objects; its React hook comes from `@gerak/three/react`, listed after it.

```tsx
player.subscribe("ball", (pose) => applyPose2d(mesh, pose));
player.subscribe("ball", (pose) => applyPose3d(mesh, pose));
const ball = useTarget3d(playing?.player, "ball");
return <mesh ref={ball} />;
```

<!-- generated:reference:start -->
- **`applyPose2d`** `(object: Object3D<Object3DEventMap>, pose: Pose2d, rest?: { readonly x: number; readonly y: number; }, custom?: CustomWriter): void`: Writes a 2D pose on an object: y and rotation flip for its axes; calls `custom(name, value, object)` for each custom number; leaves blur, stroke and clip alone.
- **`THREE_POSE_FIELDS`** `const THREE_POSE_FIELDS: readonly ["x", "y", "rotation", "scale", "scaleX", "scaleY", "opacity", "anchor"]`: The pose fields a Three.js object has a place for; it leaves blur, the stroke and the clip alone.
- **`applyPose3d`** `(object: Object3D<Object3DEventMap>, pose: Pose3d, rest?: { readonly x: number; readonly y: number; readonly z: number; }, custom?: CustomW…`: Writes a `Pose3d` on an object: y up, degrees on Z-X-Y; a missing field writes its rest, and each custom number goes to `custom(name, value, object)`.
<!-- generated:reference:end -->

## @gerak/three/react

<!-- generated:reference:start -->
- **`useTarget3d`** `<T extends object, K extends Pose3dTargets<T>>(player: Player<T>, target: K, options?: { readonly invalidate?: () => void; }): RefCallback<…`: Writes a 3D pose target on the object the ref lands on, every step, with no render; its position then is its rest.
<!-- generated:reference:end -->

## Commands

Run from the repository root. A page is a path inside the site with no leading `/`; the site is `apps/pieces`
unless `--root <dir>` serves another folder or `--url <address>` names a running server, and `--root` and `--out` are
read from the folder you run in. Page tools open the page in Chrome or Edge under a paused clock that also holds CSS
and Web Animations, seed `Math.random`, print JSON, and exit `1` on page errors. Each takes `--size WxH` and
`--action`: `hover:sel@ms`, `leave:sel@ms`, `click:sel@ms`, `press:sel@ms`, `release:sel@ms`, `scroll:px@ms`, with
`(x,y)` after the ms for a point on the element; a selector the page lacks fails at once.

- **`motion:live <name> [--root dir] [--port number]`**: starts the dev server (or reuses one) and prints the
  address of `live.html?scene=<name>`. Every scaffolded scene plays in it with no change to its files.
- **`motion:new <name> [--three]`**: writes `<name>.html`, its entry, a component and `src/<name>-scene.ts` in
  `apps/pieces`; `--three` makes the component a Three.js stage, one mesh per target bound with `useTarget3d`, and
  the scene returns `Pose3d` targets. Every target rests (`{}`) and the scene imports no move.
- **`motion:new --move <id> [--root dir]`**: writes `src/moves/<id>.ts`, a `defineMove` declaration (role `"enter"`,
  empty description, one option) whose `run` is not at rest at progress 1, so `motion:moves --check` refuses it until
  you write the description and the `run`. The id is lower kebab-case; an existing file is never overwritten.
- **`motion:moves [<id>] [--role role] [--check] [--json] [--parts] [--root dir]`**: lists every move of `@gerak/moves`, then of
  `<root>/src/moves/*.ts`, one line each: id, role, description, options with range and default, moments. `<id>` prints
  that move in full with a pasteable example and its file; `--role` filters; `--check` runs the move gate (and refuses
  an id declared twice) and exits `1` on a finding; `--parts` prints the building blocks of `@gerak/moves` that are not
  moves, by group, each with its call shape and what it is for.
- **`motion:review <page> --watch sel,sel --to ms [--at ms,ms] [--out dir] [--full]`**: `check` and `frames` at once:
  prints the findings and the `sheet` path; `--full` adds `read`'s first 40 moves; frames, up to 10, picked where the motion is fast or turns (labelled with the time and why) unless `--at` names them; exits `1` on a finding.
  On a Three.js page watch `canvas`: the sheet shows its pixels, and the scene-file form below checks its values.
- **`motion:review <scene.ts> [--to ms] [--hold ms] [--jump units] [--turn degrees] [--ratio n]`**: no page: samples
  every field of every target each 16 ms and finds a step over its limit in one frame (positions over `--jump`, default
  150 for px; turns the short way round over `--turn`, default 150; scales and opacity over `--ratio`, default 1.5), a
  final hold under `--hold`, and a target still moving at the end. For a 3D scene give `--jump` in world units.
- **`motion:check <page> --watch sel,sel --to ms`**: every 16 ms: watched elements overlapping over `--overlap`
  frames (12), a centre jumping over `--jump` px a frame (150), a final hold under `--hold` ms (500), anything still
  moving at the end; on the last frame, text under WCAG contrast (3:1 large, 4.5:1 other) and text off the page's
  edge. Overlaps compare what a viewer sees: hidden, transparent or clipped-out boxes are left out. An element with
  `data-motion-touch="<selector>"` may touch what the selector matches; empty, anything.
- **`motion:read <page> --select sel,sel --to ms`**: each element's own moves, one line each: channel (`x`, `y`,
  `rotation`, `scaleX`, `scaleY`, `opacity`), from and to, start and end, and the ease by name, or the nearest name
  and a fitted `cubic-bezier`. A move splits where it turns back.
- **`motion:frames <page> --at ms,ms [--out dir]`**: a PNG per time and a labelled `sheet.png`; read the sheet.
  `--onion sel --from ms --to ms --every ms` draws an element at each step on one frame, with its path.
- **`motion:probe <page> --at ms,ms --select sel`**: each match's box, centre, transform, colours, opacity, z-index.
- **`motion:render <page> --to ms [--out file] [--format gif]`**: an MP4 at 62.5 frames a second, the same bytes each
  run, or a 640 px GIF at 25; needs `ffmpeg`.
- **`motion:sample <scene.ts> (--at ms,ms | --progress p,p) [--nodes id,id] [--fields a,b] [--events list]`**: exact
  values with no browser; reads the module's `cues`.
- **`motion:timeline <scene.ts> [--events list]`**: one bar per target from its first change to its rest.
- **`motion:points <points.json> --spacing px`**: a list of `{ x, y }` resampled to an even spacing, for a rope.
