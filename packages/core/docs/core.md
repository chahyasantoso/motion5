# @gerak/core

Read this page whole before writing a scene. It says how core works; each reference page below lists every export with its signature.

## The model

A scene is a pure function of time and events. Every frame asks it again; it keeps no state.

```text
Time -> timing (span, lanes, loop) -> 0..1 progress -> curve (ease, envelope, path) -> pose -> combine
```

- `Time` is `{ progress, clock }`. `progress` runs 0 to 1. The clock is `timed` (`{ elapsed, length }` ms), `live` (`elapsed` only) or `untimed` (`progress` only).
- **Milliseconds:** `elapsedOf(time.clock)`; `undefined` on an untimed clock. Never `progress * length` by hand.
- `Signal<T>` is `(time, events) => T`. Moves, principles and state all make signals.
- `Curve<T>` is `(progress) => T`. A curve with settings is built from them first: `wave({ count })(p)`.
- `Timing` maps one `Time` to another. Build one, then call `.of(time)`.

## Time

- `span(from, to).of(time, ease?)` gives the time inside a window: `progress` 0 before, 1 after, eased inside; its clock is the window's own, `elapsed` ms from its start.
- `chain(lengths)` lays windows end to end; `lanes(lengths, stagger)` gives each item its own window (`.of(time, i)`); `loop(ms)` repeats; `reversed`, `repeated` reshape a time.
- `sequence(time, [[span, fn], ...])` plays phases on one target; a finished phase holds its end.
- `timeAt(time, ms)` and `withProgress(time, p)` sample another moment. Never loop from 0 to now.
- `motion(fn)` makes a `Motion`: a function of time with `.in(window, ease?)` (plays over a span or a scroll/trigger window, holding its start before and its end after), `.loop(ms)`, `.take()` (replaces the fields it sets) and `.ambient()` (never settles). Every move returns one.
- **Inside `.in(span)`** a motion's `time` is the span's own: `progress` 0 to 1 across it, `elapsedOf` ms since it began.
- `shared(signal)` computes once per frame however many readers ask.

## Poses

A pose is a record of optional fields; a field left out does nothing.

- **2D:** px, origin top-left, `+y` down, `rotation` degrees clockwise. Transforms apply translate, rotate, skew, scale, about the element's pivot.
- **3D:** world units, `+y` up, Euler `Z-X-Y` degrees. `lift2d(pose, { unitsPerPx })` maps 2D into 3D.
- **Combining** (`combine([a, b])`), by field:
  - add, rest 0: `x`, `y`, `z`, rotations, skews, `blur`, shadows, `hue`, `lightness`, `tint`, `drawnFrom`, `custom.*`;
  - multiply, rest 1: `scale`, `scaleX`, `scaleY`, `scaleZ`, `opacity`, `drawn`;
  - replace: `shape` (morph index), clips, `layer`;
  - `anchor` (2D): the first one given wins.
- `mixPose(a, b, share)` blends two poses; a missing field uses its rest.

## Curves

- **Eases** reshape progress: `ease.*` (`In`, `Out`, `InOut` of sine, quad, cubic, quart, expo, back), `elasticOut`, bounces, and `backEase`, `springEase` built from settings. A `span` clamps progress, so an ease that overshoots goes on the value: `mix(a, b, ease.backOut(p))`.
- **Envelopes** are amounts over progress: `arch` (0, 1, 0), `wave`, `attack`, `decay`, `taper`.
- **Blends:** `mix`, `mixAngle` (short way round), `mixPoint`, `mixPose`, `keyframes`.
- **Paths:** shape makers (`circlePath`, `rectPath`, …) and `toCubics` give cubics. `along(cubics)(share)` answers a point in the path's own coordinates, not an offset from an element's rest. `ballistic` throws.
- **Springs:** `spring(offset, speed, seconds, options)` steps one; `springMemory` says how long it rings.

## Principles

Each is built from options, then given a signal, and returns a signal of the same pose type: `squashStretch({ stretch, max })(signal)`. Every knob is in px, ms, degrees or a share.

- `squashStretch`: stretch along travel with speed, area kept.
- `anticipation`: wind up the other way, then play.
- `followThrough`: each field chases the signal on a spring.
- `overlap`: the same signal, later.
- `arc`: bow straight travel into a curve.
- `exaggerate`: push each field further from its rest.
- `secondary`: a second value driven by the first one's speed.

Each has a `3d` twin where the pose type needs one. `smear`, `trail` and `trailTurn` are the parts they are built from. Slow in and out are eases; staging and appeal are not functions.

## State from events

Events are `{ name, at, target, value? }`, oldest first. A scene never stores what happened; it folds the log.

- `state(start, rule, { target? })` folds events up to a time; `.steps` lists when it changed.
- `scroll.y` folds `"scroll"` sample events in px (from 0); `pointer.x` and `pointer.y` fold `"pointer-x"` and `"pointer-y"` samples from 0 to 1 across the viewport (from 0.5). `INPUT_EVENTS` names the three sample events; `springTo(scroll.y, (y) => y)` gives smooth scroll.
- `springTo(state, pick)` springs and `easeTo(state, pick, { ms })` eases to what `pick` reads, from wherever the value is when the state changes.
- `tally` integrates held values over time. `velocity(signal, time, events)` reads speed; pass the scene's time, not an eased one.
- Random is `seeded(seed)`, never `Math.random()`.

## Reference

<!-- generated:reference:start -->
- [fields](./reference/fields.md): Pose fields, rest values, combining rules, and lifting 2D poses to 3D. Reach for this group when defining fields or combining poses.
- [time](./reference/time.md): Time is a number over a span; this group reads it, shapes it (loop, chain, reversed, repeated) and arranges phases or lanes into one timeline. Reach for it whenever a move starts late, repeats or follows another.
- [blend](./reference/blend.md): Blending turns two values or poses into the value between them, and keyframes turns a list of keys into a curve. Reach for it to interpolate a number, an angle, a point or a whole pose.
- [ease](./reference/ease.md): Easing reshapes progress so motion accelerates or settles; spring and back are the eases with overshoot. Reach for it to give a move weight instead of a straight line.
- [envelope](./reference/envelope.md): An envelope is an amount over time: an arch up and down, an attack, a decay, a taper or a wave. Reach for it to fade a quantity in or out or to pulse it.
- [geometry](./reference/geometry.md): Geometry holds the vector, matrix and quaternion maths, the 3D camera lens, and the path tools: shape outlines, arcs, resampling, reversal, transforms, bounds and area. Reach for it when a scene needs a point, a rotation or an outline.
- [path](./reference/path.md): Motion along a curve or through the air: a point and tangent along a path, its length, and a ballistic arc. Reach for it to send something along a line or to throw it.
- [measure](./reference/measure.md): Measures read a signal back: how fast it moves, and the area under a stream of samples. Reach for it to check a move's feel or to drive one value from another's speed.
- [events](./reference/events.md): An event is something that happened at a moment, such as a hover, a press or a landing, carried beside the scene's time. Reach for it to react to the page or to mark moments for other moves.
- [utility](./reference/utility.md): Small shared helpers: a seeded random, a clamp and an exhaustive-switch guard. Reach for them instead of writing your own.
- [principles](./reference/principles.md): The motion principles as signal transforms: squash and stretch, anticipation, follow-through, overlap, arcs, exaggeration and secondary action, each built from its options then given a signal. Reach for them to give a move weight and life.
- [state](./reference/state.md): State from events: a fold of the event log up to a time, and values that spring or ease when the state changes. Reach for it when motion answers hover, press, click or cues.
<!-- generated:reference:end -->
