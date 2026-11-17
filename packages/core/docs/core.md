# @gerak/core

Read this page whole before writing a scene. Pure motion primitives with zero side effects: `import { span, mix, ease } from "@gerak/core"`.

## How core works

Motion flows left to right every frame as a pure function of `(time, events)`:

```text
Clock (ms) -> Time { progress, clock } -> Span / Timing -> 0..1 -> ease / envelope -> blend / path -> Pose2d / Pose3d -> combine
```

- **2D stage:** px, origin top-left, `+x` right, **`+y` down**, `rotation` in degrees clockwise; transforms apply `translate -> rotate -> scale` around `anchor`.
- **3D world:** world units, **`+y` up**, Euler `Z-X-Y` degrees; `lift2d(pose, { unitsPerPx })` bridges 2D poses to the 3D xy plane (scales px, flips `y` and `rotation`, drops `anchor`).
- **Clocks:** a `timed` clock carries `{ elapsed, length }` in ms (required by `span`, `chain`, `lanes`, `loop`, `velocity`). A `live` clock (`liveAt`) has `elapsed` only (`progress: 0`). An `untimed` clock (`atProgress`, `UNTIMED`, or `scrollDriver` without `length`) has `progress` only.

## Arranging time

| Helper | Output | Use when |
| --- | --- | --- |
| `span(fromMs, toMs)` | `Span` | One window; `.of(time, ease?)` clamps outside `[0, 1]`, `.at(share)` gives ms |
| `chain(lengths, { gap?, overlap? })` | `readonly Span[]` | Sequential windows without manual cumulative ms (`gap` or `overlap`, not both) |
| `lanes(lengths, stagger, { from?, by?, spacing? })` | `Lanes` | Staggered `.of(time, i)` per item (`from`: `"start" \| "end" \| "center" \| "edges" \| { seed }`) |
| `loop(periodMs, { yoyo? })` | `Timing` | Repeating cycle inside a timed clock (`yoyo: true` reverses odd cycles) |
| `reversed(time)` / `repeated(time, count)` | `Time` | Wrap any `Time` to play backwards (`1 - p`) or cycle `count` times |
| `sequence(time, [[span, fn], ...])` | `R` | Mutually exclusive phases on one target; finished phases hold their end |
| `timeAt(time, ms)` / `withProgress(time, p)` | `Time` | Sample a signal at another moment without looping over history |

- Pass monotonic `0..1` eases to `span.of(time, ease)`; pass overshooting eases (`back*`, `elasticOut`) on values via `mix(a, b, ease.backOut(t.progress))` so clamping to `0..1` does not clip overshoot.

## Fields, rests, and combining

Every pose field is optional and omitted fields stay inactive:

- **Add, rest `0`:** `x`, `y`, `z`, `rotation`, `rotationX`, `rotationY`, `skewX`, `skewY`, `blur`, `shadowX`, `shadowY`, `shadowBlur`, `hue`, `lightness` (`-1..1`), `tint` (`0..1`), `drawnFrom` (`0..1`), `custom.*`.
- **Multiply, rest `1`:** `scale`, `scaleX`, `scaleY`, `scaleZ`, `opacity`, `drawn` (`0..1`).
- **Replace:** `shape` (rest `0`, morph index), `clipX`, `clipY`, `clipRadius`, `clipWidth`, `clipHeight`, `layer` (no rest).
- **`anchor` (2D only):** `"center" | "top" | "bottom" | "left" | "right"`; `combine` keeps the first anchor given (`Pose3d` forbids `anchor`).
- **`combine` vs `mixPose`:** `combine([a, b])` layers concurrent poses per rule above (`combine3d` composes multi-axis turns as Z-X-Y rotations in order). `mixPose(a, b, share)` / `mixPose3d` interpolates between two poses (any missing field starts from its rest, or the present side when it has no rest).

## Eases, blends, paths, measures, events

- **`ease`:** `linear`, `sineIn`/`Out`/`InOut`, `quadIn`/`Out`/`InOut`, `cubicIn`/`Out`/`InOut`, `quartIn`/`Out`/`InOut`, `expoIn`/`Out`/`InOut`, `backIn`/`Out`/`InOut`, `elasticOut`, `bounceIn`, `bounceOut`. Custom overshoot/physics: `backEase({ amount, direction })`, `springEase`, `spring(offset, speed, seconds, { stiffness, damping })`, `springMemory`.
- **Envelopes (`0..1` progress):** `arch(p)` (`0 -> 1 -> 0`), `wave(p, count, phase?)`, `attack(p, rate)`, `decay(p, rate)`, `taper(p, power)`.
- **Blends:** `mix`, `mixAngle` (shortest arc), `mixPoint` (`Point2d`), `mixPoint3d` (`Point3d`), `mixPose`, `mixPose3d`, `keyframes(start, keys, blend)`.
- **Paths & shapes:** `circlePath({ cx, cy, r })`, `ellipsePath({ cx, cy, rx, ry })`, `rectPath({ x, y, width, height, rx?, ry? })`, `linePath({ x1, y1, x2, y2 })`, `polygonPath({ points, closed })`, `arcPath({ x0, y0, x1, y1, rx, ry, degrees?, large?, sweep? })`, `pathFrom(d)`, `toCubics` / `toCubics3d` (`Anchor2d`/`Anchor3d` handles `inX/Y`, `outX/Y` are relative to the point), `radial(angle, distance)`. Follow curves via `along(cubics, share, { turn? })`, `along3d`, `pathLength`, `pathBounds`; throw via `ballistic(p, { dx, dy, apex })`.
- **3D camera:** `orbit({ target, radius, azimuth, elevation })`, `aim(from, to, up?)`, `Lens3d` (`Pose3d & { fov }`), `project3d(point, lens, stage)`.
- **Measures & events & utilities:** `velocity(signal, time, events, stepMs?)` / `velocity3d` take the **scene's `time`** (not an eased time). `tally({ start, on, target? })` integrates event streams in O(1)/frame. Join event lists with `mergeEvents` (`NO_EVENTS` when empty). Use `seeded(seed)` (never `Math.random()`), `clamp`, `unreachable`.

## Idiom

```ts
import { arch, chain, combine, ease, lanes, mix, repeated, reversed, sequence, span, type Pose2d, type Time } from "@gerak/core";

const [enter, hold, leave] = chain([500, 1200, 400]);
const drop = (t: Time): Pose2d => ({ y: mix(-80, 0, ease.cubicOut(t.progress)), opacity: t.progress });
const popOut = (t: Time): Pose2d => ({ y: mix(0, 60, ease.backOut(t.progress)) });

const card = (time: Time): Pose2d =>
  combine([drop(enter.of(time)), { scale: 1 + 0.08 * arch(repeated(hold.of(time), 2).progress) }, drop(reversed(leave.of(time)))]);
const item = (time: Time, i: number): Pose2d => drop(lanes([1, 1, 1], 0.35, { from: "center" }).of(enter.of(time), i));
const phased = (time: Time): Pose2d => sequence(time, [[enter, drop], [leave, popOut]]);
```

## Exports by reference group

<!-- generated:reference:start -->
- [fields](./reference/fields.md) (13): `CUSTOM_FIELD`, `POSE_2D_FIELDS`, `VALUE_FIELDS`, `valueField`, `Anchor`, `Combining`, `Pose2d`, `ValueField`, `combine3d`, `lift2d`, `Pose3d`, `combine`, `POSE_2D_NUMBERS`
- [time](./reference/time.md) (23): `UNTIMED`, `atProgress`, `elapsedOf`, `liveAt`, `Clock`, `Time`, `span`, `Span`, `Timing`, `loop`, `LoopOptions`, `chain`, `ChainOptions`, `timeAt`, `sequence`, `Phase`, `lanes`, `LaneOrigin`, `Lanes`, `LanesOptions`, `reversed`, `repeated`, `withProgress`
- [blend](./reference/blend.md) (8): `mix`, `mixAngle`, `mixPoint`, `mixPose`, `keyframes`, `Key`, `mixPoint3d`, `mixPose3d`
- [ease](./reference/ease.md) (9): `backEase`, `ease`, `springEase`, `Ease`, `EaseDirection`, `spring`, `SpringOptions`, `SpringState`, `springMemory`
- [envelope](./reference/envelope.md) (5): `wave`, `arch`, `attack`, `decay`, `taper`
- [geometry](./reference/geometry.md) (58): 2D `Anchor2d`, `Cubic2d`, `Point2d`, `toCubics`, `radial`, `arcPath`, `pathFrom`, `ArcOptions`, `PathRead`, `circlePath`, `ellipsePath`, `linePath`, `polygonPath`, `rectPath`, `resamplePath`, `reversePath`, `transformPath`, `Matrix2d`, `isClosedPath`, `meets`, `pathArea`, `pathBounds`, `SEAM`; 3D `add3`, `axisX3`, `canonicalDegrees`, `cross3`, `divide3`, `dot3`, `eulerFromMatrix3d`, `IDENTITY_MATRIX3`, `LOCAL_X3`, `matrixFromEuler3d`, `matrixFromQuaternion`, `multiplyMatrix3`, `multiplyVector3`, `norm3`, `normalize3`, `quaternionFromEuler3d`, `rotationAboutAxis3d`, `scale3`, `slerpQuaternion`, `subtract3`, `swingFrame3d`, `transposeMatrix3`, `ZERO_EULER`, `Euler3d`, `Matrix3`, `Quaternion`, `Vec3`, `aim`, `orbit`, `project3d`, `Lens3d`, `Point3d`, `toCubics3d`, `Anchor3d`, `Cubic3d`
- [path](./reference/path.md) (5): `ballistic`, `BallisticOptions`, `along`, `along3d`, `pathLength`
- [measure](./reference/measure.md) (5): `velocity`, `velocity3d`, `tally`, `Tally`, `TallyOptions`
- [events](./reference/events.md) (6): `NO_EVENTS`, `isMotionEvent`, `mergeEvents`, `EventPoint`, `Events`, `MotionEvent`
- [utility](./reference/utility.md) (3): `seeded`, `unreachable`, `clamp`
<!-- generated:reference:end -->
