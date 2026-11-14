# Toolkit plan: scenes that stay fast, tools that answer faster

**Status:** Approved, 2026-11-14, after one round of critique.
**Base:** `main` at `6079f613`, the merge of pull request 594.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ADR-166-motion-review-and-a-one-call-loop.md`,
`docs/ADR-181-live-inputs.md`, `docs/ADR-182-rigged-3d-characters-and-bodies-in-depth.md`,
`docs/ADR-183-2d-over-3d-on-one-clock.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A person or a cheap agent building any motion piece sees at once when a scene is too slow to play smoothly, and
has general tools for what the last measure built by hand: how much of a sample stream has passed, where a body
landed, an object riding a bone, many targets bound at once, and one value or one region looked at over time.**

The overlay measure, `dragon-intro`, passed every check yet plays at about 20 frames a second by its sixth second. Its
scene costs 0.1 ms a frame at 0.5 s and 62 ms at 9.5 s (a 60 fps frame has 16.7 ms in all), because two parts read
the whole past on every frame:
- its caption sums a `follow` from the start of the talk in 48 ms steps to find how much has been said;
- each "+1" label seeks the physics back to its prop's landing to find where it landed.

Nothing caught it: the review checks values, not cost, and the frame tools step a paused clock. The agent's
interview named the rest: lid placement took ten calls, binding many 3D targets three typecheck rounds, and looking
closely at a frame or one value over time about six calls each.

Not planned: an eyelid helper and a caption helper. Eyelids belong to one kind of model, and words already reveal
through `@gerak/stage`'s `words`; what both lacked is general, and is planned below.

## 2. Decisions to record (D0, ADR-184)

- **A scene step's cost is checked, by growth first.** `motion:review` times every sample as it plays (the median
  of three runs) and every seek back it already makes, and reports a cost that grows with time (the last fifth of
  the samples costing over four times the first fifth and over 1 ms): "cost grows with time: a step reads all of the
  past". It also reports a step over `--budget` ms (default 8, half a 60 fps frame), a looser bar because a busy or
  slow machine moves it. Tests drive the growth rule with a scene built to grow and never assert a time.
- **Real frame rate is measured on a running page.** `motion:fps <page> [--to ms] [--show]` plays the page on its
  real clock in Chromium (the page tools' paused clock gains an opt-out for it) and prints frames a second per
  500 ms window, the frames over 16.7 and 33 ms, and the worst frames with how their time split: the scene, the
  writes, and the rest of the frame (drawing and the browser). The player times its steps with the User Timing API
  (`gerak:scene`, `gerak:write`) only when a reader turns it on (`globalThis.__gerakTiming`, which the command sets
  before the page loads), so a page in use keeps no growing buffer of marks. `--show` opens a visible window with a
  live counter the command injects; no page carries code for it. The output names the WebGL renderer: headless
  Chrome draws on the GPU where there is one, uncapped by vsync; on SwiftShader a number is relative only.
- **How much of a sample stream has passed is `tally`.** `tally({ start, on: { mouthOpen: "value" } })` in
  `@gerak/moves` answers, at any time, the area under the samples so far (each held until the next), and
  `.total(events)` the whole stream's area, so `tally / total` is how far through it the speech, a progress bar or a
  score is. It reads a prefix table built once per events list and extended, not rebuilt, when a live list grows by
  appending, so a step costs the same at 9 s as at 1 s, recorded or live. It tallies the raw samples, not `follow`'s
  spring, so it is exact and seeks for free. A caption reveals its words by that share.
- **A contact says where and with what.** A physics contact event carries `point`, `{ x, y, z? }` in the scene's
  units (px in 2D, converted from the engine's metres as body positions are; `z` only in 3D), and `other`, the other
  body or collider. `MotionEvent` gains optional `point` and `other`; its `x` and `y` stay a pointer's px only. A
  scene never seeks a simulation backwards to learn where something was.
- **An object rides a bone from a point in the model's space.** `attach(skeleton, bone, object, { at, turn })` in
  `@gerak/three/skeleton` makes `object` a child of the named bone, placed at a point and turn given in the model's
  space at capture, the space of the joint table, computed from the captured rest, so it is right whatever the
  model's groups are doing. Eyelids, hats, held props and glasses are each one call.
- **Many 3D targets bind from one list.** A scene may return a list of `Pose3d` as one target, and
  `useTarget3d(player, "props", { at: i })` binds its `i`th pose; the review already walks a list target by index.
- **Looking closer is a flag.** `motion:frames --crop x,y,width,height --zoom n` captures a region scaled up;
  `motion:sample --watch <path> --from ms --to ms --every ms` prints one value over time.

## 3. Slices

### K1. `tally` and the event fields (planner)

- **Invariant:** as decided; `tally` at any time equals the area summed by hand over the samples; its cost per call
  does not grow with the number of samples before it (a test counts table builds); `isMotionEvent` accepts `point`
  and `other`.
- **Owner:** `packages/moves/src/events.ts`, exported from `packages/moves/src/index.ts`.

### K2. Cost in the review

- **Invariant:** as decided; a scene whose step loops over its past is flagged as growing; a flat scene is not; the
  budget is a flag and a per-target `limits` field does not change it; a stage module is timed as a scene is.
- **Owner:** `packages/tools/src/scene/review.ts` and its argument parser.
- **Test:** two small scenes, one summing a loop from 0 to its time (built to cost well over 1 ms by its end), one
  constant: only the first is flagged as growing; `--budget 0.0001` flags a step of the constant one. The overlay
  measure's `dragon-intro`, as merged, is flagged as growing before the lead removes it.

### K3. Frame rate on a running page

- **Invariant:** as decided; with timing off the player writes no mark; `motion:fps` on a scratch page whose step
  busy-waits 30 ms reports under 34 fps in every window, and on the `--three` scaffold above 50 (headless).
- **Owner:** `packages/player/src` for the timing switch; `packages/tools/src/page/page.ts` for the real-clock
  opt-out; `packages/tools/src/page/fps.ts`, `bin/motion-fps.mjs` and the root `package.json` script.

### K4. Contacts with a point

- **Invariant:** as decided, in both worlds; the point lies on both bodies' surfaces within the engine's tolerance;
  events replay the same on a seek back.
- **Owner:** `packages/physics/src` (`Contact`, `simulate`'s events), `packages/rapier/src/world.ts` and
  `world3d.ts`.
- **Test:** a ball dropped on a floor at a known x and z: its contact is at the floor's height under the ball, with
  `other: "floor"`; 2D the same, in px; two balls meeting name each other.

### K5. Attach and list targets

- **Invariant:** as decided; an object attached at a model-space point lands there at rest whatever the model's
  parent groups are posed to, and follows the bone when posed; `useTarget3d` with `at` writes that index only.
- **Owner:** `packages/three/src/skeleton.ts`, `packages/three/src/react.ts`.
- **Test:** on the dragonling, attach a marker at an iris centre from `dragonling.eyes.json` with the model inside
  a turned, moved group: it sits on the iris at rest and moves with `Head` when nodded.

### K6. Looking closer

- **Invariant:** as decided; a crop outside the stage is refused naming the edge; `--watch` reads a dotted path and
  refuses one the scene never returns.
- **Owner:** `packages/tools/src/page/frames.ts`, `packages/tools/src/scene/scene.ts` (sampling) and their parsers.

### K7. Guide

- `docs/guide/agent-motion.md` gains "A step's cost": a step reads the present, never all of the past; `tally` for
  how much has passed; `motion:review`'s budget and `motion:fps`. `agent-3d.md` and `agent-physics.md` swap their
  workarounds for `attach`, list targets and contact points. Reference and map regenerated.

### K8. Proof

- **Measure, alone, fresh, cheap:** the lead removes `dragon-intro`; a Sonnet worker at medium effort builds it again
  from the same brief and the new guide.
- **It passes when:** everything the overlay measure had to pass; `motion:review` reports no growing cost and no step
  over budget; headless `motion:fps --to 10000` has no window below half its first window's rate. The lead then
  runs `motion:fps --show` once on the owner's machine and reports the windows; 55 fps or more in every window is
  the bar, read by the lead, not the worker.
- **It is compared with the first build:** tokens, calls and minutes against 214k, 106 and 22, and the render rounds
  it took. Its interview asks again what would have helped most.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Planner | D0, K1 | the event fields K4 writes and the `tally` the guide teaches |
| 2 | Executor | K2 and K6 | tools' scene and page commands, one owner for their parsers |
| 2 | Executor | K3 | the player's marks and `motion:fps` |
| 2 | Executor | K4 | physics and rapier |
| 2 | Executor | K5 | three |
| 3 | Planner | K7 | what the measure reads |
| 3 | Executor model, medium effort, fresh | K8 measure | |
| 3 | Executor | cold review | |

One pull request, after wave 3.

## 5. Risks

- **Timing noise:** a busy machine slows a sample. The review takes the median of three and flags growth by a ratio,
  not a time; `motion:fps` reports windows, not a single number.
- **Headless rendering varies:** headless Chrome uses the GPU where there is one but has no vsync; Playwright's own
  Chromium and GPU-less machines use SwiftShader. The output names the renderer; the measure's absolute bar is read
  with `--show`, the headless bar only as a ratio within one run.

## 6. Done when

The measure passes, its cost is compared with the first build's, `npm run check` is green, and
`docs/SESSION-STATUS.md` says so.
