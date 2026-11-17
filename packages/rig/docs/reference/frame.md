# @gerak/rig: frame

- **`PivotOffset`** `type PivotOffset = { x: number; y: number }`: Authored pivot offset, in base's rotated frame.
- **`WorldFrame`** `type WorldFrame = { x: number; y: number; rotation: number }`: Pivot and direction in world space: keys a plugin publishes.
- **`swingTwist3d`** `(local: Matrix3): SwingTwist3d`: Splits `local` into swing and twist about local +x; a pure swing reads no twist.
- **`PivotOffset3d`** `type PivotOffset3d = { x: number; y: number; z: number }`: A pivot offset, read in its parent's rotated frame.
- **`SwingTwist3d`** `type SwingTwist3d = { swing: Matrix3; swingAxis: Vec3; swingDegrees: number; twistDegrees: number }`: Local orientation as `swing * twist`; `twist` turns about local +x, applied first.
- **`WorldFrame3d`** `type WorldFrame3d = { x: number; y: number; z: number; rotation: number; rotationX: number; rotationY: number }`: A 3D frame in world space: a position `x`, `y`, `z` and a turn `rotation`, `rotationX`, `rotationY` in degrees on the CSS Z-X-Y order.
