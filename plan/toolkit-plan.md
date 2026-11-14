# Toolkit plan: scenes that stay fast, tools that answer faster

**Status:** Proposed, 2026-11-14.
**Base:** `feat/overlay` at `aae7edbd`, pull request 594; rebased onto `main` once 594 merges.
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

- **A scene step's cost is checked.** `motion:review` times every sample (the median of three runs) and reports a
  sample over `--budget` ms (default 4, a quarter of a 60 fps frame), and a cost that grows with time (the last
  fifth of the samples costing over four times the first fifth): "cost grows with time: a step reads all of the
  past". Both are findings like any other.
- **Real frame rate is measured on a running page.** `motion:fps <page> [--to ms] [--show]` plays the page on its
  real clock in Chromium and prints frames a second per 500 ms window, the frames over 16.7 and 33 ms, and the worst
  frames with how their time split. The player marks each step with the User Timing API (`gerak:scene`,
  `gerak:write`), which the command, DevTools and any profiler read; `--show` opens a visible window with a live
  counter for a person to watch. A headless number is relative: its renderer is software; `--show` uses the GPU.
- **How much of a sample stream has passed is `tally`.** `tally({ start, on: { mouthOpen: "value" } })` in
  `@gerak/moves` answers, at any time, the area under the samples so far (each held until the next), and
  `.total(events)` the whole stream's area, so `tally / total` is how far through it the speech, a progress bar or a
  score is. It reads a prefix table built once per events list, so a step costs the same at 9 s as at 1 s. A caption
  reveals its words by that share.
- **A contact says where and with what.** A physics contact event carries the contact point (`x`, `y`, and `z` in
  3D, world units) and the other body or collider (`with`). `MotionEvent` gains optional `z` and `with`; `x` and
  `y` mean a pointer's px for pointer events and a point in the scene's units for physics ones, as each event's name
  says. A scene never seeks a simulation backwards to learn where something was.
- **An object rides a bone from a point in the model's space.** `attach(skeleton, bone, object, { at, turn })` in
  `@gerak/three/skeleton` makes `object` a child of the named bone, placed at a point and turn given in the model's
  space at capture, the space of the joint table, computed from the captured rest, so it is right whatever the
  model's groups are doing. Eyelids, hats, held props and glasses are each one call.
- **Many 3D targets bind from one list.** A scene may return a list of `Pose3d` as one target, and
  `useTarget3d(player, "props", { at: i })` binds its `i`th pose, as `useTarget`'s third argument does in 2D.
- **Looking closer is a flag.** `motion:frames --crop x,y,width,height --zoom n` captures a region scaled up;
  `motion:sample --watch <path> --from ms --to ms --every ms` prints one value over time.

## 3. Slices

### K1. `tally` and the event fields (planner)

- **Invariant:** as decided; `tally` at any time equals the area summed by hand over the samples; its cost per call
  does not grow with the number of samples before it (a test counts table builds); `isMotionEvent` accepts `z` and
  `with`.
- **Owner:** `packages/moves/src/events.ts`, exported from `packages/moves/src/index.ts`.

### K2. Cost in the review

- **Invariant:** as decided; a scene whose step loops over its past is flagged as growing; a flat scene is not; the
  budget is a flag and a per-target `limits` field does not change it.
- **Owner:** `packages/tools/src/scene/review.ts` and its argument parser.
- **Test:** two small scenes, one summing a loop from 0 to its time, one constant: only the first is flagged;
  `--budget 0.001` flags the constant one.

### K3. Frame rate on a running page

- **Invariant:** as decided; the player's marks cost nothing measurable when no one reads them; `motion:fps` on a
  page whose step sleeps 30 ms reports under 34 fps in every window, and on the scaffold above 50.
- **Owner:** `packages/player/src` for the marks; `packages/tools/src/page/fps.ts`, `bin/motion-fps.mjs` and the root
  `package.json` script.

### K4. Contacts with a point

- **Invariant:** as decided, in both worlds; the point lies on both bodies' surfaces within the engine's tolerance;
  events replay the same on a seek back.
- **Owner:** `packages/physics/src` (`Contact`, `simulate`'s events), `packages/rapier/src/world.ts` and
  `world3d.ts`.
- **Test:** a ball dropped on a floor at a known x and z: its contact is at the floor's height under the ball, with
  `with: "floor"`; 2D the same.

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
- **It passes when:** everything the overlay measure had to pass; `motion:review`'s budget is clean; `motion:fps
  --to 10000` reports at least 55 fps in every window with `--show`, and no window below half its first window's
  rate headless.
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
- **Headless rendering is software:** a 3D page's headless rate is lower than on a GPU; the measure's absolute bar is
  read with `--show`, the headless bar only as a ratio within one run.
- **A wider `MotionEvent`:** pointer `x`/`y` in px and contact `x`/`y`/`z` in world units share fields; the event's
  name says which, and the guide shows both.

## 6. Done when

The measure passes, its cost is compared with the first build's, `npm run check` is green, and
`docs/SESSION-STATUS.md` says so.
