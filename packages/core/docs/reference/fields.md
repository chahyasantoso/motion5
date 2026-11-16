# @gerak/core: fields

A field is one named number of a pose, such as x, y or rotate; this group declares the fields, how contributions combine, and the 2D and 3D pose shapes. Reach for it when a scene defines its own fields or combines several contributions into one pose.

- **`CUSTOM_FIELD`** `const CUSTOM_FIELD: ValueField`: A number a piece names itself, under `custom`: it rests at 0 and adds, and each renderer says where it goes.
- **`POSE_2D_FIELDS`** `const POSE_2D_FIELDS: readonly (CarriedBy<"both" | "2d"> | "anchor")[]`: Every field a renderer must write for a pose: its numbers and its anchor.
- **`VALUE_FIELDS`** `const VALUE_FIELDS: Readonly<{ x: { readonly meaning: "Moves the target right of where the page puts it; px in 2D, world units in 3D."; rea…`: Every field a value can carry, one row each; nothing else states a field's rest or how it combines.
- **`valueField`** `(name: string): ValueField`: The row a field name has in the table, or nothing when it has none.
- **`Anchor`** `type Anchor`: The point of a box that stays put while it scales and turns.
- **`Combining`** `type Combining`: How two answers for one field on one target become one.
- **`Pose2d`** `type Pose2d`: A 2D pose, every field optional: `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY`, `opacity`, `anchor` and `custom` numbers. Stage px, y down, degrees clockwise.
- **`ValueField`** `type ValueField`: What a field of a value is: what it changes, its unit, which poses carry it, where it rests, how it combines, and what the gate asks of it.
- **`combine3d`** `(poses: readonly Pose3d[]): Pose3d`: Poses on one target as one: each field joins as its row says, custom numbers add, turns compose in order.
- **`lift2d`** `(pose: Pose2d, options: { readonly unitsPerPx: number; }): Pose3d`: A 2D pose on the 3D xy plane: px scaled by `unitsPerPx`, y and the turn flipped, the anchor dropped; every 2D move reaches 3D through it.
- **`Pose3d`** `type Pose3d`: A 3D pose, every field optional: `x`, `y`, `z`, `rotation` (about z), `rotationX`, `rotationY`, scales, `opacity`. Y up, degrees on Z-X-Y; a `Pose2d` is refused.
- **`combine`** `(poses: readonly Pose2d[]): Pose2d`: Poses on one target as one: each field joins as its table row says, custom numbers add, the first anchor stays.
- **`POSE_2D_NUMBERS`** `const POSE_2D_NUMBERS: readonly CarriedBy<"both" | "2d">[]`: The numbers a 2D pose carries: the rows whose dimension is `2d` or `both`, in table order.
