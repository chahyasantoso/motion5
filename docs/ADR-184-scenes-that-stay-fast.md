# ADR-184: Scenes that stay fast

**Status:** Accepted, 2026-11-14

## Context

A scene is `(time, events) => targets`, and nothing stopped a step from reading the whole past: a caption summed a
`follow` from the start of a talk in small steps, and a label seeked a simulation back to learn where a prop had
landed. Such a scene passes every value check and still slows as it plays, because `motion:review` checks values,
not cost, and the frame tools step a paused clock. Placing an object on a bone, binding many 3D targets and looking
closely at one value or one region over time each took an agent many calls.

## Decision

- **A step's cost is checked, by growth first.** `motion:review` times every sample as it plays (the median of
  three runs) and every seek back it makes, and reports a cost that grows with time: the last fifth of the samples
  costing over four times the first fifth and over 1 ms. It also reports a step over `--budget` ms (default 8), a
  looser bar a busy machine moves. Tests drive growth with a scene built to grow and never assert a time.
- **Frame rate is measured on a running page.** `motion:fps <page> [--to ms] [--show]` plays a page on its real
  clock in Chromium and prints frames a second per 500 ms window, the frames over 16.7 and 33 ms, and the worst
  frames split into scene, writes and the rest. The player marks its steps with the User Timing API (`gerak:scene`,
  `gerak:write`) only when `globalThis.__gerakTiming` is set, which the command does before the page loads. `--show`
  opens a visible window with a counter the command injects. The output names the WebGL renderer: headless Chrome
  draws on the GPU where there is one, with no vsync, so a headless rate is how fast frames can be made, while
  SwiftShader (no GPU, or Playwright's own Chromium) makes it relative only.
- **How much of a sample stream has passed is `tally`.** `tally({ start, on, target })` in `@gerak/moves` answers
  the area under the counted events so far, each holding its value until the next, and `.total(events)` the whole
  stream's, so `tally / total` is how far through it a speech, a bar or a score is. It reads a table built once per
  events list and extended when a live list grows by appending, so a step costs the same late as early. It tallies
  the raw samples, not a spring, so it is exact and seeks for free.
- **A contact says where and with what.** A physics contact event carries `point`, `{ x, y, z? }` in the scene's
  units (px in 2D, `z` only in 3D), and `other`, the other body or collider. `MotionEvent` gains optional `point`
  and `other`; its `x` and `y` stay a pointer's px only, so no field means two things. A scene never seeks a
  simulation back to learn where something was.
- **An object rides a bone from a point in the model's space.** `attach(skeleton, bone, object, { at, turn })` in
  `@gerak/three/skeleton` parents `object` to the bone, placed at a point and turn in the model's space at capture,
  computed from the captured rest, whatever the model's groups are doing.
- **Many 3D targets bind from one list.** A scene may return a list of `Pose3d` as one target, and
  `useTarget3d(player, name, { at: i })` binds its `i`th pose.
- **Looking closer is a flag.** `motion:frames --crop x,y,width,height --zoom n` captures a region scaled up;
  `motion:sample --watch <path> --from ms --to ms --every ms` prints one value over time.

## Consequences

- A step that reads all of the past is refused by the review, whatever its values.
- No eyelid or caption helper: `attach` and `words` with `tally` are the general forms.
