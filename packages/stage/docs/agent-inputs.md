# Live inputs

Read this when a piece follows streaming inputs (microphone level, slider, recorded sample session). Core time/input loop is in [stage.md](./stage.md).

Each live sample is an `InputEntry` carrying `kind: "value"` and `value`: `{ kind: "value", name: "mouthOpen", at: 1234, value: 0.6 }`. Scenes remain pure functions of `(time, input)`, so recorded sessions scrub and pass deterministic review.

- **Read samples functionally:** With `@gerak/moves`, `follow(value(voice, "mouthOpen"))` (for `voice = inputs({ values: { mouthOpen: {} } })`) smooths each sample's target; with `@gerak/core` alone, use `springTo(value(voice, "mouthOpen"), (v) => v)`. Never mutate external state across frames.
- **Recordings as `cues`:** Pass imported JSON sample arrays into `scene({ cues: talk, length }, ...)` so playback reaches every cue cleanly (`gerak review` reports cues past `durationMs`).
- **Live microphone / push inputs:** The app owns lasting state and sends typed updates via `mounted.set(contract, name, value, target?)` and `mounted.trigger(contract, name, value?, target?)` (forwarding to `mounted.driver`); loop ambient idle motion smoothly on `elapsedOf(time.clock)` rather than restarting cues.
- **Switch or morph mouths:** Use `shape(name, { base: shut, targets: [open, wide] })` and animate `shape` (`0` = `base`, `1` = `targets[0]`, `1.5` = halfway to `targets[1]`). Every outline must match continuous piece count (`matchOutlines` verifies this at compile time).
- **Measure progress in timed scenes with `tally`:** For timed scenes and `cues`, `tally({ start: 0, on: { mouthOpen: "value" } })` and `.total(input)` compute normalized cumulative intensity for word reveals or meters at $O(1)$ per step; on live pages, keep cumulative counts in the app and send them with `set`.
- **Verify:** Test sample overrides via `gerak sample <file>.ts --at 1300 --events "mouthOpen=0.6@1234"` and confirm `gerak review <file>.ts` reports clean seek determinism.
