# @gerak/moves: parts

- **`noise1d`** `(seed: number, scale?: number): (ms: number) => number`: A smooth wandering value from -1 to 1 over time in ms, easing to a fresh seeded target every `scale` ms; the same seed wanders the same.
- **`follow`** `(options: FollowOptions): (time: Time, input: Input) => number`: A spring each named event sends towards its goal, or a sample's own with `"value"`, turning back with no jump; pure in time and input, a later call goes on from the last.
- **`react`** `(options: ReactOptions): (time: Time, input: Input) => number`: A damped answer to each past event by `kind` (`recoil`, `wobble`, `flash` or `shake`); 0 before the first and once all have died.
- **`FollowOptions`** `type FollowOptions = { start: number; on: Readonly<Record<string, number | "value">>; target?: string; stiffness?: number; damping?: number; rest?: number }`: Settings of a `follow`: `start`, `on` (goal by event name, or `"value"` for the event's own), `target`, `stiffness` (default 170), `damping` (26) and `rest` (0.001).
- **`ReactionKind`** `type ReactionKind = "recoil" | "wobble" | "flash" | "shake"`: How a response to one event moves: from a full start, from rest, as a fade, or as a shake.
- **`ReactOptions`** `type ReactOptions = { on: readonly string[]; target?: string; kind: ReactionKind; amplitude: number; decay?: number; frequency?: number }`: Settings of a `react`: event names `on`, `target`, `kind`, `amplitude`, `decay` (default 6 a second) and `frequency` (4 a second).
- **`squashed`** `(options: SquashedOptions): (weight: number) => Pose2d`: A pose `weight` of the way into `squash` against the `anchor` side, `"bottom"` when absent; `"left"` and `"right"` squash sideways.
- **`squashed3d`** `(options: Squashed3dOptions): (weight: number) => Pose3d`: A body `weight` of the way into its `squash` along `axis`, widened on the other two so its volume stays.
- **`SquashedOptions`** `type SquashedOptions = { squash: number; anchor?: Anchor }`: Settings of `squashed`.
- **`Squashed3dOptions`** `type Squashed3dOptions = { squash: number; axis?: "x" | "y" | "z" }`: Settings of `squashed3d`.
