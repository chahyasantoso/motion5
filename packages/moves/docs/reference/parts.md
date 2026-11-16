# @gerak/moves: parts

- **`definePart`** `<F extends object>(contract: PartContract, fn: F): F`: Declares what a part promises and returns the part itself, unchanged; the part gate refuses a part with no declaration, or one whose samples break the rule of its kind.
- **`partContract`** `(fn: object): PartContract`: The contract `definePart` recorded for a part, or nothing when it was never declared.
- **`PartContract`** `type PartContract`: What a part promises, by the folder it lives in; each sampled kind carries closures the part gate runs.
- **`trail`** `(signal: (time: Time, events: Events) => number, options: TrailOptions): (time: Time, events: Events) => number`: A value chasing `signal(time, events)` on a spring, for follow-through and drag. Pass the scene's time: the signal applies its own spans and eases.
- **`TrailOptions`** `type TrailOptions`: Settings of a `trail`: `stiffness` (default 170), `damping` (26), `stepMs` (1 to 33, default 8) and `rest`, the distance under which it sits on the signal.
- **`trailTurn`** `(signal: (time: Time, events: Events) => Pose3d, options: TrailOptions): (time: Time, events: Events) => Pose3d`: A turn chasing a `Pose3d` signal's turn on a spring, the short way round, resting exactly on it; pass the scene's time. Trail a position with three `trail` calls.
- **`noise1d`** `(seed: number, scale?: number): (ms: number) => number`: A smooth wandering value from -1 to 1 over time in ms, easing to a fresh seeded target every `scale` ms; the same seed wanders the same.
- **`follow`** `(options: FollowOptions): (time: Time, events: Events) => number`: A spring each named event sends towards its goal, or a sample's own with `"value"`, turning back with no jump; pure in time and events, a later call goes on from the last.
- **`react`** `(options: ReactOptions): (time: Time, events: Events) => number`: A damped answer to each past event by `kind` (`recoil`, `wobble`, `flash` or `shake`); 0 before the first and once all have died.
- **`FollowOptions`** `type FollowOptions`: Settings of a `follow`: `start`, `on` (goal by event name, or `"value"` for the event's own), `target`, `stiffness` (default 170), `damping` (26) and `rest` (0.001).
- **`ReactionKind`** `type ReactionKind`: How a response to one event moves: from a full start, from rest, as a fade, or as a shake.
- **`ReactOptions`** `type ReactOptions`: Settings of a `react`: event names `on`, `target`, `kind`, `amplitude`, `decay` (default 6 a second) and `frequency` (4 a second).
- **`squashed`** `(squash: number, weight: number, anchor?: Anchor): Pose2d`: A pose `weight` of the way into `squash` against the `anchor` side, `"bottom"` when absent; `"left"` and `"right"` squash sideways.
- **`squashed3d`** `(squash: number, weight: number, axis?: "x" | "y" | "z"): Pose3d`: A body `weight` of the way into its `squash` along `axis`, widened on the other two so its volume stays.
- **`smear`** `(velocity: { readonly vx: number; readonly vy: number; }, options: { readonly stretch: number; readonly max: number; }): { readonly pose: P…`: Stretches along travel by `stretch` per 1000 px/s up to `max`, area kept; `heading` in (-90, 90]. Content that must not turn goes in an inner element posed `{ rotation: -heading }`.
- **`squashFromSpeed`** `(speed: { readonly vx: number; readonly vy: number; }, options: SquashFromSpeedOptions): Pose2d`: A pose stretched along the heading of a px/s `speed` and squashed across it, `amount` per px/s up to `most`; empty at zero speed. Rotation is the heading in (-90, 90].
- **`SquashFromSpeedOptions`** `type SquashFromSpeedOptions`: Settings of `squashFromSpeed`: `amount` of squash per px/s, and the `most` it may reach, 0 to 0.9.
- **`smear3d`** `(velocity: { readonly vx: number; readonly vy: number; readonly vz: number; }, options: { readonly stretch: number; readonly max: number; }…`: Stretches along travel by `stretch` per unit a second up to `max`, volume kept; reversing never flips it; `turn` undoes it.
