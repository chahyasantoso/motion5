# @gerak/core

Read this page whole before writing a scene.

## How core works

Motion evaluates every frame as a pure `Signal` of `(time, events)`:

```text
Clock (ms) -> Time { progress, clock } -> Span / Timing -> 0..1 -> ease / envelope -> blend / path -> Pose2d / Pose3d -> combine
```

- **2D stage:** px, origin top-left, **`+y` down**, `rotation` in degrees clockwise; `translate -> rotate -> scale` around `anchor`.
- **3D world:** world units, **`+y` up**, Euler `Z-X-Y` degrees; `lift2d(pose, { unitsPerPx })` maps 2D to 3D xy.
- **Clocks:** `timed` (`{ elapsed, length }` ms, needed by `span`, `chain`, `lanes`, `loop`, `velocity`); `live` (`liveAt`, `elapsed` only); `untimed` (`atProgress`, `UNTIMED`, `progress` only).

## Shapes

| Shape | Type | Core functions |
| --- | --- | --- |
| **Timing** | `Timing` (`of(t: Time) => Time`) | `span`, `chain`, `lanes`, `loop` build them; `reversed`, `repeated`, `timeAt`, `withProgress` remap a `Time` |
| **Curve** | `Curve<T>` / `Ease` (`(u: number) => T`) | `ease.*`, `backEase`, `springEase`, `arch`, `wave`, `attack`, `decay`, `taper`, `ballistic`, `along`, `along3d` |
| **Signal** | `Signal<T>` (`(t: Time, e: Events) => T`) | Returned by `tally`, `keyframes`; measured by `velocity`, `velocity3d` |

## Arranging time

| Helper | Output | Use when |
| --- | --- | --- |
| `span(fromMs, toMs)` | `Span` | One window; `.of(time, ease?)` clamps outside `[0, 1]`, `.at(share)` gives ms |
| `chain(lengths, { gap?, overlap? })` | `readonly Span[]` | Windows one after another (`gap` or `overlap`, not both) |
| `lanes(lengths, stagger, { from?, by?, spacing? })` | `Lanes` | Staggered `.of(time, i)` per item (`from`: `"start" \| "end" \| "center" \| "edges" \| { seed }`) |
| `loop(periodMs, { yoyo? })` | `Timing` | A repeating cycle (`yoyo` reverses odd cycles) |
| `reversed(time)` / `repeated(time, count)` | `Time` | Wrap any `Time` to play backwards (`1 - p`) or cycle `count` times |
| `sequence(time, [[span, fn], ...])` | `R` | Phases on one target; a finished phase holds its end |
| `timeAt(time, ms)` / `withProgress(time, p)` | `Time` | Sample a signal at another moment |

- `motion(fn)` is a `Motion`: `.in(span, ease?)` holds its start before and end after (eased inside), `.loop(ms)` repeats, `.take()` replaces fields, `.ambient()` marks it always moving.
- `shared(signal)` runs once per frame however many elements read it.

## Fields, rests, and combining

Every pose field is optional and omitted fields stay inactive:

- **Add, rest `0`:** `x`, `y`, `z`, `rotation`, `rotationX`, `rotationY`, `skewX`, `skewY`, `blur`, `shadowX`, `shadowY`, `shadowBlur`, `hue`, `lightness` (`-1..1`), `tint` (`0..1`), `drawnFrom` (`0..1`), `custom.*`.
- **Multiply, rest `1`:** `scale`, `scaleX`, `scaleY`, `scaleZ`, `opacity`, `drawn` (`0..1`).
- **Replace:** `shape` (rest `0`, morph index), `clipX`, `clipY`, `clipRadius`, `clipWidth`, `clipHeight`, `layer` (no rest).
- **`anchor` (2D only):** `"center" | "top" | "bottom" | "left" | "right"`; `combine` keeps the first anchor given (`Pose3d` forbids `anchor`).
- **`combine` vs `mixPose`:** `combine([a, b])` layers poses (`combine3d` composes Z-X-Y turns). `mixPose(a, b, share)` / `mixPose3d` interpolates (a missing field uses its rest).

## Eases, blends, paths, measures, events

- **`ease`:** `linear`, `sine`, `quad`, `cubic`, `quart`, `expo`, `back` (`In`/`Out`/`InOut`), `elasticOut`, `bounceIn`, `bounceOut`. Custom: `backEase({ amount, direction })`, `springEase`, `spring(offset, speed, seconds, { stiffness, damping })`, `springMemory`.
- **Envelopes (`0..1` progress):** `arch(p)` (`0 -> 1 -> 0`), `wave({ count, phase? })(p)`, `attack({ rate })(p)`, `decay({ rate })(p)`, `taper({ power })(p)`.
- **Blends:** `mix`, `mixAngle`, `mixPoint`, `mixPoint3d`, `mixPose`, `mixPose3d`, `keyframes(start, keys, blend)`.
- **Paths & shapes:** `circlePath`, `ellipsePath`, `rectPath`, `linePath`, `polygonPath`, `arcPath`, `pathFrom(d)`, `toCubics` / `toCubics3d` (anchor `in*`/`out*` are relative), `radial(angle, distance)`. Follow curves via `along(cubics)(share)`, `along3d`, `pathLength`, `pathBounds`; throw via `ballistic({ dx, dy, apex })(p)`.
- **3D camera:** `orbit`, `aim(from, to)`, `Lens3d` (`Pose3d & { fov }`), `project3d(point, lens, stage)`.
- **State:** `state(start, rule)` folds events; `springTo` / `easeTo` follow what a `pick` of it reads.
- **Measures, events, utilities:** `velocity(signal, time, events)` / `velocity3d` take the **scene's `time`**. `tally({ start, on, target? })` integrates events; join lists with `mergeEvents` (`NO_EVENTS` when empty). Use `seeded(seed)` (never `Math.random()`), `clamp`, `unreachable`.
- **Principles** wrap a signal: `squashStretch(options)(signal)`, each with a `3d` twin.

## Idiom

```ts
import { arch, chain, combine, ease, lanes, mix, repeated, reversed, type Pose2d, type Time } from "@gerak/core";

const [enter, hold, leave] = chain([500, 1200, 400]);
const drop = (t: Time): Pose2d => ({ y: mix(-80, 0, ease.cubicOut(t.progress)), opacity: t.progress });

const card = (time: Time): Pose2d =>
  combine([drop(enter.of(time)), { scale: 1 + 0.08 * arch(repeated(hold.of(time), 2).progress) }, drop(reversed(leave.of(time)))]);
const item = (time: Time, i: number): Pose2d => drop(lanes([1, 1, 1], 0.35, { from: "center" }).of(enter.of(time), i));
```

## Exports by reference group

<!-- generated:reference:start -->
- [fields](./reference/fields.md) (13): `CUSTOM_FIELD`, `POSE_2D_FIELDS`, `VALUE_FIELDS`, `valueField`, `Anchor`, `Combining`, `Pose2d`, `ValueField`, `combine3d`, `lift2d`, `Pose3d`, `combine`, `POSE_2D_NUMBERS`
- [time](./reference/time.md) (28): `UNTIMED`, `atProgress`, `elapsedOf`, `liveAt`, `Clock`, `Time`, `Curve`, `Signal`, `span`, `Span`, `motion`, `Motion`, `shared`, `Timing`, `loop`, `LoopOptions`, `chain`, `ChainOptions`, `timeAt`, `sequence`, `Phase`, `lanes`, `LaneOrigin`, `Lanes`, `LanesOptions`, `reversed`, `repeated`, `withProgress`
- [blend](./reference/blend.md) (8): `mix`, `mixAngle`, `mixPoint`, `mixPose`, `keyframes`, `Key`, `mixPoint3d`, `mixPose3d`
- [ease](./reference/ease.md) (9): `backEase`, `ease`, `springEase`, `Ease`, `EaseDirection`, `spring`, `SpringOptions`, `SpringState`, `springMemory`
- [envelope](./reference/envelope.md) (5): `wave`, `arch`, `attack`, `decay`, `taper`
- [geometry](./reference/geometry.md) (58): 2D `Anchor2d`, `Cubic2d`, `Point2d`, `toCubics`, `radial`, `arcPath`, `pathFrom`, `ArcOptions`, `PathRead`, `circlePath`, `ellipsePath`, `linePath`, `polygonPath`, `rectPath`, `resamplePath`, `reversePath`, `transformPath`, `Matrix2d`, `isClosedPath`, `meets`, `pathArea`, `pathBounds`, `SEAM`; 3D `add3`, `axisX3`, `canonicalDegrees`, `cross3`, `divide3`, `dot3`, `eulerFromMatrix3d`, `IDENTITY_MATRIX3`, `LOCAL_X3`, `matrixFromEuler3d`, `matrixFromQuaternion`, `multiplyMatrix3`, `multiplyVector3`, `norm3`, `normalize3`, `quaternionFromEuler3d`, `rotationAboutAxis3d`, `scale3`, `slerpQuaternion`, `subtract3`, `swingFrame3d`, `transposeMatrix3`, `ZERO_EULER`, `Euler3d`, `Matrix3`, `Quaternion`, `Vec3`, `aim`, `orbit`, `project3d`, `Lens3d`, `Point3d`, `toCubics3d`, `Anchor3d`, `Cubic3d`
- [path](./reference/path.md) (5): `ballistic`, `BallisticOptions`, `along`, `along3d`, `pathLength`
- [measure](./reference/measure.md) (5): `velocity`, `velocity3d`, `tally`, `Tally`, `TallyOptions`
- [events](./reference/events.md) (6): `NO_EVENTS`, `isMotionEvent`, `mergeEvents`, `EventPoint`, `Events`, `MotionEvent`
- [utility](./reference/utility.md) (3): `seeded`, `unreachable`, `clamp`
- [principles](./reference/principles.md) (25): `smear`, `smear3d`, `trail`, `TrailOptions`, `trailTurn`, `squashStretch`, `squashStretch3d`, `SquashStretchOptions`, `anticipation`, `anticipation3d`, `AnticipationOptions`, `followThrough`, `followThrough3d`, `FollowThroughOptions`, `overlap`, `OverlapOptions`, `arc`, `arc3d`, `Arc3dOptions`, `ArcBendOptions`, `exaggerate`, `exaggerate3d`, `ExaggerateOptions`, `secondary`, `secondary3d`
- [state](./reference/state.md) (9): `state`, `State`, `StateOptions`, `Step`, `springTo`, `SpringToOptions`, `easeTo`, `EaseToOptions`, `UpDown`
<!-- generated:reference:end -->
