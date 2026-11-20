# @gerak/core: blend

Blending turns two values or poses into the value between them, and keyframes turns a list of keys into a curve. Reach for it to interpolate a number, an angle, a point or a whole pose.

- **`mix`** `(from: number, to: number, share: number): number`: The number `share` of the way from `from` to `to`; a share past 0 or 1 extrapolates.
- **`mixAngle`** `(from: number, to: number, share: number): number`: An angle in degrees `share` of the way from `from` to `to`, turning the short way round.
- **`mixPoint`** `(from: Point2d, to: Point2d, share: number): Point2d`: A point `share` of the way from `from` to `to`.
- **`mixPose`** `(from: Pose2d, to: Pose2d, share: number): Pose2d`: A pose `share` of the way between two; a field one pose lacks counts as its rest, and a custom number as 0.
- **`keyframes`** `<T>(start: T, keys: readonly Key<T>[], blend: (from: T, to: T, share: number) => T): (time: Time) => T`: A value moving from `start` at 0 ms to each key in turn, then holding; `blend` is `mix`, `mixPoint`, `mixPose` or alike.
- **`Key`** `type Key<T> = { at: number; to: T; ease?: Ease }`: One keyframe: the value reached at `at` ms, eased from the key before; with no `ease` it is linear.
- **`mixPoint3d`** `(from: Point3d, to: Point3d, share: number): Point3d`: A 3D point `share` of the way from `from` to `to`.
- **`mixPose3d`** `(from: Pose3d, to: Pose3d, share: number): Pose3d`: A pose `share` of the way between two; turns take the short arc, past the ends too; a missing field rests.
