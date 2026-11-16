# @gerak/core: measure

Measures read a signal back: how fast it moves, and the area under a stream of samples. Reach for it to check a move's feel or to drive one value from another's speed.

- **`velocity`** `(signal: (time: Time, events: Events) => Pose2d, time: Time, events: Events, stepMs?: number): { readonly vx: number; readonly vy: number; }`: The `{ vx, vy }` px a second a signal moves at the scene's `time` (not an eased one), over `stepMs`; zero with no clock.
- **`velocity3d`** `(signal: (time: Time, events: Events) => Pose3d, time: Time, events: Events, stepMs?: number): { readonly vx: number; readonly vy: number; …`: Units per second a signal's `x`, `y` and `z` move at the scene's `time`, never an eased one; zero with no clock.
- **`tally`** `(options: TallyOptions): Tally`: The area under held samples up to any time, each held until the next, from a table built once per list and extended when a live list grows by appending; events oldest first.
- **`Tally`** `type Tally`: The area under held samples so far, in value-seconds: `total(events)` is the whole stream's, up to its last counted event, so `tally / total` is how far through it the stream is.
- **`TallyOptions`** `type TallyOptions`: Settings of a `tally`: `start`, `on` (a held value by event name, or `"value"` for the event's own) and `target`.
