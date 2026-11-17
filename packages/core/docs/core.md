# @gerak/core

Read this page whole before writing a scene. The primitives every piece uses: time, fields and poses, blends, eases,
envelopes, geometry, paths, measures and events. `import { span, mix, ease } from "@gerak/core"`. Units: stage px, y
down, degrees clockwise, ms on clocks and events, 3D y up. A `Time` is `{ progress, clock }`, `progress` 0 to 1.

<!-- generated:reference:start -->
Groups: [fields](#fields) 13, [time](#time) 23, [blend](#blend) 8, [ease](#ease) 9, [envelope](#envelope) 5, [geometry](#geometry) 58, [path](#path) 5, [measure](#measure) 5, [events](#events) 6, [utility](#utility) 3.

## fields

A field is one named number of a pose (`x`, `y`, `rotation`, `skewX`, `skewY`, `scale`, `scaleX`, `scaleY`, `opacity`, `blur`, `shadowX`, `shadowY`, `shadowBlur`, `hue`, `lightness`, `tint`, `drawn`, `drawnFrom`, `clipX`, `clipY`, `clipRadius`, `clipWidth`, `clipHeight`, `shape`, `layer`, `anchor`, `custom`; 3D adds `z`, `rotationX`, `rotationY`, `scaleZ`). Reach for this group when a scene defines fields or combines contributions into one pose.

- **`CUSTOM_FIELD`** `const CUSTOM_FIELD: ValueField`: A number a piece names itself, under `custom`: it rests at 0 and adds, and each renderer says where it goes.
- **`POSE_2D_FIELDS`** `const POSE_2D_FIELDS: readonly (CarriedBy<"both" | "2d"> | "anchor")[]`: Every field a renderer must write for a pose: its numbers and its anchor.
- **`VALUE_FIELDS`** `const VALUE_FIELDS: { x, y, z, rotation, rotationX, rotationY, skewX, skewY, sc…`: Every field a value can carry, one row each; nothing else states a field's rest or how it combines.
- **`valueField`** `(name: string): ValueField | undefined`: The row a field name has in the table, or nothing when it has none.
- **`Anchor`** `type Anchor`: The point of a box that stays put while it scales and turns.
- **`Combining`** `type Combining`: How two answers for one field on one target become one.
- **`Pose2d`** `type Pose2d`: A 2D pose, every field optional: `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY`, `opacity`, `anchor` and `custom` numbers.
- **`ValueField`** `type ValueField`: What a field of a value is: what it changes, its unit, which poses carry it, where it rests, how it combines, and what the gate asks of it.
- **`combine3d`** `(poses: readonly Pose3d[]): Pose3d`: Poses on one target as one: each field joins as its row says, custom numbers add, turns compose in order.
- **`lift2d`** `(pose: Pose2d, options: { readonly unitsPerPx: number; }): Pose3d`: A 2D pose on the 3D xy plane: px scaled by `unitsPerPx`, y and the turn flipped, the anchor dropped; every 2D move reaches 3D through it.
- **`Pose3d`** `type Pose3d`: A 3D pose, every field optional: `x`, `y`, `z`, `rotation` (about z), `rotationX`, `rotationY`, scales, `opacity`.
- **`combine`** `(poses: readonly Pose2d[]): Pose2d`: Poses on one target as one: each field joins as its table row says, custom numbers add, the first anchor stays.
- **`POSE_2D_NUMBERS`** `const POSE_2D_NUMBERS: readonly CarriedBy<"both" | "2d">[]`: The numbers a 2D pose carries: the rows whose dimension is `2d` or `both`, in table order.

## time

Time is a number over a span; this group reads it, shapes it (loop, chain, reversed, repeated) and arranges phases or lanes into one timeline. Reach for it whenever a move starts late, repeats or follows another.

- **`UNTIMED`** `const UNTIMED: Clock`: The untimed clock: no ms at all, as under scroll or manual control.
- **`atProgress`** `(progress: number): Time`: A `Time` at `progress` with no clock, for code that drives a move by hand.
- **`elapsedOf`** `(clock: Clock): number | undefined`: The ms a clock has run, or `undefined` for a clock that has none.
- **`liveAt`** `(elapsed: number): Time`: A live `Time` `elapsed` ms after the page started; it has no length, so its progress stays 0.
- **`Clock`** `type Clock`: A clock: ms of a known length when timed, ms with no end when live, none under scroll or manual control.
- **`Time`** `type Time`: Where a move is: `progress` from 0 to 1, and the clock behind it.
- **`span`** `(fromMs: number, toMs: number): Span`: A stretch in ms: `.of(time, ease?)` is a move's time inside it, counting from `fromMs`; `.at(share)` the ms a share falls on.
- **`Span`** `type Span`: A stretch of the scene in ms: `of` gives a move's time inside it, `at` the ms a share of it falls on.
- **`Timing`** `type Timing<A>`: A time helper built once from its settings: `of` answers a move's time inside it.
- **`loop`** `(periodMs: number, options?: LoopOptions): Timing`: A cycle repeating every `periodMs`: `.of(time)` is the time inside the current cycle, progress 0 to 1 each period, 1 to 0 on odd cycles with `yoyo`.
- **`LoopOptions`** `type LoopOptions`: Settings of `loop`: `yoyo` runs every odd cycle backwards, so the motion turns instead of jumping.
- **`chain`** `(lengths: readonly number[], options?: ChainOptions): readonly Span[]`: Spans of these lengths in ms, the first at 0, each starting where the last ends plus `gap` or minus `overlap`.
- **`ChainOptions`** `type ChainOptions`: Settings of `chain`: `gap` ms of rest between spans, or `overlap` ms each starts before the last ends; not both.
- **`timeAt`** `(time: Time, ms: number): Time`: `time` moved to `ms` on its own clock, for reading a signal a moment earlier or later; untimed stays as it is.
- **`sequence`** `<R>(time: Time, phases: readonly Phase<R>[]): R`: Answers the last phase that started, given its own time: an ended phase holds its end, before the first the first holds its start.
- **`Phase`** `type Phase<R>`: One phase of a sequence: the span it runs in, and what it answers given its own time there.
- **`lanes`** `(lengths: readonly number[], stagger: number, options?: LanesOptions): Lanes`: Lanes of these relative lengths, each starting `stagger` after the last in the order `from` or `by` gives; `.of(time, index)` is lane `index` inside `time`, a timed clock split among lanes.
- **`LaneOrigin`** `type LaneOrigin`: Which lanes start first: from one end, from the centre out, from both edges in, or shuffled by a seed.
- **`Lanes`** `type Lanes`: Lanes started `stagger` lane-lengths apart in the order `from` or `by` gives; `span` reaches the last finish; `.of(time, index)` is lane `index` run inside `time`.
- **`LanesOptions`** `type LanesOptions`: Settings of `lanes`: `from` or `by` picks which start first (default `"start"`); `spacing`, an ease, bends the start times (default even).
- **`reversed`** `(time: Time): Time`: A time run backwards (progress `p` answers `1 - p`); a function of time, not a move, so any move or value plays through it.
- **`repeated`** `(time: Time, count: number): Time`: A time with its progress running 0 to 1 `count` times (rounded down, at least 1); a function of time, not a move.
- **`withProgress`** `(time: Time, progress: number): Time`: `time` moved to `progress`: a timed clock's elapsed follows it, so a move that reads the clock is moved too.

## blend

Blending turns two values or poses into the value between them, and keyframes turns a list of keys into a curve. Reach for it to interpolate a number, an angle, a point or a whole pose.

- **`mix`** `(from: number, to: number, share: number): number`: The number `share` of the way from `from` to `to`; a share past 0 or 1 extrapolates.
- **`mixAngle`** `(from: number, to: number, share: number): number`: An angle in degrees `share` of the way from `from` to `to`, turning the short way round.
- **`mixPoint`** `(from: Point2d, to: Point2d, share: number): Point2d`: A point `share` of the way from `from` to `to`.
- **`mixPose`** `(from: Pose2d, to: Pose2d, share: number): Pose2d`: A pose `share` of the way between two; a field one pose lacks counts as its rest, and a custom number as 0.
- **`keyframes`** `<T>(start: T, keys: readonly Key<T>[], blend: (from: T, to: T, share: number) =…`: A value moving from `start` at 0 ms to each key in turn, then holding; `blend` is `mix`, `mixPoint`, `mixPose` or alike.
- **`Key`** `type Key<T>`: One keyframe: the value reached at `at` ms, eased from the key before; with no `ease` it is linear.
- **`mixPoint3d`** `(from: Point3d, to: Point3d, share: number): Point3d`: A 3D point `share` of the way from `from` to `to`.
- **`mixPose3d`** `(from: Pose3d, to: Pose3d, share: number): Pose3d`: A pose `share` of the way between two; turns take the short arc, past the ends too; a missing field rests.

## ease

Easing reshapes progress so motion accelerates or settles; spring and back are the eases with overshoot. Reach for it to give a move weight instead of a straight line.

- **`backEase`** `(options: { readonly amount: number; readonly direction: EaseDirection; }): Ease`: A back curve that pulls back by `amount` before it goes (`"in"`), overshoots by it as it ends (`"out"`), or both (`"inOut"`); `amount: 0` is the cubic.
- **`ease`** `const ease: { linear, sineIn, sineOut, sineInOut, quadIn, quadOut, quadInOut, c…`: `linear`, `sine*`, `quad*`, `cubic*`, `quart*`, `expo*`, `back*` (`In`/`Out`/`InOut`), `elasticOut`, `bounceIn`, `bounceOut`.
- **`springEase`** `(options: SpringOptions): Ease`: A spring from 0 settling on 1, fitted to the span; lower `damping` rings more.
- **`Ease`** `type Ease`: A curve from progress 0 to 1 onto eased progress, 0 at 0 and 1 at 1; back and elastic overshoot.
- **`EaseDirection`** `type EaseDirection`: Which end of a curve is slow: `in` starts slow, `out` ends slow, `inOut` does both.
- **`spring`** `(offset: number, speed: number, seconds: number, options: SpringOptions): Sprin…`: Where a spring is, `seconds` after it left `offset` from its goal at `speed`, and how fast it goes.
- **`SpringOptions`** `type SpringOptions`: A unit-mass spring: pull towards its goal per second squared, and drag on its speed per second.
- **`SpringState`** `type SpringState`: Where a spring is from its goal, and how fast it moves, in units and units a second.
- **`springMemory`** `(options: SpringOptions, rest: number): number`: Seconds until what a spring was doing shrinks below `rest` of its size, at half its decay rate to cover ringing.

## envelope

An envelope is an amount over time: an arch up and down, an attack, a decay, a taper or a wave. Reach for it to fade a quantity in or out or to pulse it.

- **`wave`** `(progress: number, count: number, phase?: number): number`: How far along a sine swing is: the sine of `count` full cycles over progress 0 to 1, shifted by `phase` in turns.
- **`arch`** `(progress: number): number`: How strong a swing is when it rises then falls: 0 at progress 0, 1 at the middle, 0 at 1.
- **`attack`** `(progress: number, rate: number): number`: How much of a swing has built up when it rises exponentially: 0 at progress 0, approaching 1 at `rate`.
- **`decay`** `(progress: number, rate: number): number`: How much of a swing is left when it dies away exponentially: 1 at progress 0, falling at `rate`.
- **`taper`** `(progress: number, power: number): number`: How much of a swing is left when it shrinks to nothing: 1 at progress 0 down to 0 at 1, shaped by `power`.

## geometry

Geometry holds the vector, matrix and quaternion maths, the 3D camera lens, and the path tools: shape outlines, arcs, resampling, reversal, transforms, bounds and area. Reach for it when a scene needs a point, a rotation or an outline.

- 2D paths and shapes: `Anchor2d`, `Cubic2d`, `Point2d`, `toCubics`, `radial`, `arcPath`, `pathFrom`, `ArcOptions`, `PathRead`, `circlePath`, `ellipsePath`, `linePath`, `polygonPath`, `rectPath`, `resamplePath`, `reversePath`, `transformPath`, `Matrix2d`, `isClosedPath`, `meets`, `pathArea`, `pathBounds`, `SEAM`
- 3D rotation and vectors: `add3`, `axisX3`, `canonicalDegrees`, `cross3`, `divide3`, `dot3`, `eulerFromMatrix3d`, `IDENTITY_MATRIX3`, `LOCAL_X3`, `matrixFromEuler3d`, `matrixFromQuaternion`, `multiplyMatrix3`, `multiplyVector3`, `norm3`, `normalize3`, `quaternionFromEuler3d`, `rotationAboutAxis3d`, `scale3`, `slerpQuaternion`, `subtract3`, `swingFrame3d`, `transposeMatrix3`, `ZERO_EULER`, `Euler3d`, `Matrix3`, `Quaternion`, `Vec3`, `aim`, `orbit`, `project3d`, `Lens3d`, `Point3d`, `toCubics3d`, `Anchor3d`, `Cubic3d`
Signatures: [reference/geometry.md](./reference/geometry.md).

## path

Motion along a curve or through the air: a point and tangent along a path, its length, and a ballistic arc. Reach for it to send something along a line or to throw it.

- **`ballistic`** `(progress: number, options: BallisticOptions): { x: number; y: number; }`: Where a thrown thing is at progress 0 to 1: from (dx, dy) to (0, 0) under constant gravity, peaking `apex` px above the higher end.
- **`BallisticOptions`** `type BallisticOptions`: The throw's shape: start offset `dx` and `dy`, and how many px above the higher end it peaks.
- **`along`** `(cubics: readonly Cubic2d[], share: number, options?: { readonly turn?: boolean…`: The `{ x, y }` pose `share` of the way along a path by distance, from the target's rest; `turn: true` adds `rotation`, the heading in degrees (down is 90).
- **`along3d`** `(cubics: readonly Cubic3d[], share: number, options?: { readonly face?: boolean…`: The pose `share` of the way along a 3D path by distance; `face` adds the turn of local +x onto the tangent, no roll.
- **`pathLength`** `(cubics: readonly Cubic2d[]): number`: The length of a path of cubics, sampled; 0 for an empty path.

## measure

Measures read a signal back: how fast it moves, and the area under a stream of samples. Reach for it to check a move's feel or to drive one value from another's speed.

- **`velocity`** `(signal: (time: Time, events: Events) => Pose2d, time: Time, events: Events, st…`: The `{ vx, vy }` px a second a signal moves at the scene's `time` (not an eased one), over `stepMs`; zero with no clock.
- **`velocity3d`** `(signal: (time: Time, events: Events) => Pose3d, time: Time, events: Events, st…`: Units per second a signal's `x`, `y` and `z` move at the scene's `time`, never an eased one; zero with no clock.
- **`tally`** `(options: TallyOptions): Tally`: The area under held samples up to any time, each held until the next, from a table built once per list and extended when a live list grows by appending; events oldest first.
- **`Tally`** `type Tally`: The area under held samples so far, in value-seconds: `total(events)` is the whole stream's, up to its last counted event, so `tally / total` is how far through it the stream is.
- **`TallyOptions`** `type TallyOptions`: Settings of a `tally`: `start`, `on` (a held value by event name, or `"value"` for the event's own) and `target`.

## events

An event is something that happened at a moment, such as a hover, a press or a landing, carried beside the scene's time. Reach for it to react to the page or to mark moments for other moves.

- **`NO_EVENTS`** `const NO_EVENTS: Events`: The empty event list; share it rather than allocating one.
- **`isMotionEvent`** `(value: unknown): value is MotionEvent`: Whether `value` is a `MotionEvent`: a `name`, an `at` and, when given, a `target`, an `x`, `y`, a `value`, a `point` of numbers and an `other`.
- **`mergeEvents`** `(...lists: readonly Events[]): Events`: Several event lists as one, oldest first; a scene's own cues joined with the page's events.
- **`EventPoint`** `type EventPoint`: A point an event happened at, in the scene's units; `z` only in 3D.
- **`Events`** `type Events`: Every event so far, oldest first; a scene reads it beside its time.
- **`MotionEvent`** `type MotionEvent`: Something that happened at `at` ms on the scene's clock: a hover, a press, a landing, or a sample of a live number; `target` names where.

## utility

Small shared helpers: a seeded random, a clamp and an exhaustive-switch guard. Reach for them instead of writing your own.

- **`seeded`** `(seed: number): () => number`: Repeatable random numbers from 0 up to 1 for a seed, so a scattered scene is the same each run; use it, never `Math.random()`.
- **`unreachable`** `(value: never): never`: The sink of an exhaustive switch: a value TypeScript proves cannot arrive.
- **`clamp`** `(value: number, min: number, max: number): number`: `value` in `[min, max]`; `NaN` propagates.
<!-- generated:reference:end -->

## Arranging time

```ts
import { arch, chain, combine, ease, lanes, loop, mix, repeated, reversed, span, type Pose2d, type Time } from "@gerak/core";

const enter = span(fromMs, toMs); // a stretch in ms, placed by the clock of the time it is given
const dropIn = (t: Time): Pose2d => ({ y: mix(-distance, 0, ease.cubicOut(t.progress)) });
dropIn(enter.of(time)); // motion placed on a span
dropIn(reversed(leave.of(time))); // the same motion played backwards as an exit
const pulse = (t: Time): Pose2d => ({ scale: 1 + 0.1 * arch(t.progress) });
pulse(repeated(beat.of(time), count)); // repeated several times in one span
combine([dropIn(enter.of(time)), { opacity: enter.of(time).progress }]); // two poses combined on one target
lanes([1, 1, 1], stagger).of(enter.of(time), i); // target i's own time, each starting after the last
loop(periodMs, { yoyo: true }).of(time); // the time inside the current cycle; odd cycles run backwards
const [first, second] = chain([lengthA, lengthB], { gap }); // spans one after another; `overlap` starts each early
mix(from, to, turn.of(time, ease.sineInOut).progress); // a value of your own, eased
```

- `scene` returns one object with a key per cast member; every number of motion lives in the scene, none in the skin.
- A span is not a time: pass `span.of(time)`. It needs a clock in ms, so a scroll-driven scene gives `scrollDriver` a `length`.
- `span.of(time)` clamps progress to 0 before the span and 1 after it, so a pose built on it holds steady on both sides.
  A target that arrives, pulses and leaves is a `combine` of its phases, each on its own span (or `@gerak/moves` when installed).
- `sequence(time, [[span, (t) => answer], ...])` answers the last phase that has started, in its own time, for phases
  on one target that replace one another rather than add.
- An ease that overshoots (`backOut`, `elasticOut`) goes on a value through `mix`, never into `span.of(time, ease)` when the target expects `0..1`.
- `lanes(..., { by: [d0, d1] })` starts the lowest value first; `from: "center"` starts in the middle.
- A pose is `{ x, y, ... }`, all optional (see `fields` above for all 25 fields, anchor and `custom`); `anchor` stays still while it turns or scales.

## Call examples

```ts
const flight = span(400, 2400);
const midMs = flight.at(0.5); // the ms a share of a span falls on
const { offset } = spring(-1, 0, 0.2, { stiffness: 170, damping: 12 });
const lean = keyframes(0, [{ at: 1700, to: -9, ease: ease.sineInOut }, { at: 2400, to: 0 }], mix)(time);
const pose = along(toCubics(anchors), ease.cubicInOut(time.progress), { turn: true });
const { vx, vy } = velocity(ball, time, events); // takes the scene's time, never an eased one
const ball3d = lift2d(ball(time, events), { unitsPerPx: 0.01 }); // a 2D pose in 3D
const all = mergeEvents(events, simEvents); // events are { name, at, target?, x?, y? }, `at` in ms
```
