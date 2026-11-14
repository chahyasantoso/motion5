# Overlay plan: 2D over 3D, one clock

**Status:** Approved, 2026-11-14.
**Base:** `main` at `4a02b34c`, the merge of pull request 593.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ADR-169-a-3d-pose-for-code-scenes.md`,
`docs/ADR-182-rigged-3d-characters-and-bodies-in-depth.md`, `docs/ADR-166-motion-review-and-a-one-call-loop.md`, `docs/guide/agent-3d.md`,
`.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A person building a web page puts 2D words, captions and callouts over a 3D scene, pinned to points in it (a
character's head, a part of a product, a body as it lands), and they move, scrub and review as one piece on one
clock.**

Today one scene can already return 2D and 3D targets together: `useTarget` and `useTarget3d` subscribe to the same
player. What is missing is the bridge and the checks:

- nothing turns a 3D point into stage pixels, so a label cannot follow a point;
- nothing answers where a posed bone's joint is, so a label cannot follow a head;
- `motion:review` holds one `--jump`, one `--turn` and one `--ratio` for every target, so a scene with px and world
  units in it is judged by one of them, and a 0-1 custom number such as a blink is judged as a position;
- a 3D page draws on its own `requestAnimationFrame` loop while DOM targets are written on the player's step, so a
  label and its point may show different frames.

## 2. Decisions to record (D0, ADR-183)

- **The scene projects, the page draws.** `project3d(point, lens, stage)` in `@gerak/moves`, beside `orbit` and
  `aim`, answers a world point's stage position in px from the top left, its depth, and whether it is in front of the
  lens. `lens` is a camera `Pose3d` plus `fov` (vertical degrees); `stage` is `{ width, height }`. It is pure, so a
  label's pose is part of the scene: sampled, reviewed and scrubbed like any other. The page builds its
  `PerspectiveCamera` from the same exported `fov` and stage size, so the lens has one owner: the scene module.
- **A posed joint's point is rig's answer.** `posedJoints3d(table, bones, root?)` in `@gerak/rig` answers every
  joint's world point under bone poses, by the same equation `applyBones` writes (bones turn about the model's axes
  at capture, carried by their parents), with `root` the pose of the model's parent group. Its test holds it to
  `captureSkeleton` and `applyBones` on the dragonling to 1e-6.
- **Review limits belong to targets.** A scene module may export `limits`, a record of target name to
  `{ jump?, turn?, ratio? }`; the command's flags are the default for every other target. A `custom.*` number is
  judged by `ratio`, never by `jump`. Nothing else in the review changes.
- **A 3D page draws on the player's step.** A Three.js page renders when a target it binds is written (the
  `invalidate` that `useTarget3d` already takes, or a render inside `player.subscribe`), never from a free-running
  loop, so the canvas and DOM targets always show the same time. The `--three` scaffold does so and binds one DOM
  label to its box through `project3d`.
- **Labels stay plain DOM over the canvas.** An overlay is an element above the canvas in the stage box, its targets
  bound with `useTarget`. No `CSS2DRenderer`, no React Three Fiber (`<Html>` waits for the R3F feature), and no
  occlusion: a label is drawn over the model or hidden by the scene through `visible` and `opacity`.

## 3. Slices

### O1. Projection

- **Invariant:** `project3d` matches Three.js's `Vector3.project` with a `PerspectiveCamera` posed by the same
  `Pose3d`, the same `fov` and aspect, to 1e-6 px; a point behind the lens answers `visible: false`.
- **Owner:** `packages/moves/src/stage3d.ts`, exported from `packages/moves/src/index.ts`.
- **Test:** in `packages/three/test` (which has three): random lenses from `orbit` and `aim` and random points
  against `Vector3.project`; a point behind the camera.

### O2. Posed joints

- **Invariant:** as decided; joints answer in the table's order; an unknown bone in `bones` throws, naming it.
- **Owner:** `packages/rig/src/chain3d.ts` (beside `jointOf`).
- **Test:** in `apps/pieces/test`: the dragonling's table and a pose with a head nod, a jaw open and a paw raised
  through `bonesOf3d`, against `captureSkeleton` and `applyBones` world positions, root moved and turned.

### O3. Review limits per target

- **Invariant:** as decided; a target's own limit replaces the flag for its fields only; a `custom.*` field is a
  ratio; a `limits` naming no target the scene returns is reported, not ignored.
- **Owner:** `packages/tools/src/scene/review.ts` and the scene module reader (`readSceneModule`).
- **Test:** a scene with a px label moving 40 px a step and a 3D body moving 0.3 units a step: with `limits` on the
  body only, the body is flagged and the label is not; a blink going 0 to 1 in two steps passes the default ratio.

### O4. Drawing on the step

- **Invariant:** as decided; a DOM marker bound to `project3d` of a sphere's centre sits within 1 px of the sphere's
  drawn centre at every captured time, played and scrubbed.
- **Owner:** `packages/tools/src/scene/templates/component.three.tsx.template` and the `--three` scaffold;
  `apps/examples` for the browser test.
- **Test:** a Chromium test in `apps/examples/test` reading the marker's box and the sphere's drawn pixels at 0, 500
  and 1000 ms, after a seek back as well.

### O5. A worked example

- **Invariant:** `overlay3d` in `apps/examples` pins three callouts to points on a turning 3D object, one through
  `posedJoints3d`, and a caption from `cues` through `follow`; its test samples it and its page mounts in Chromium.
- **Owner:** `apps/examples` (`overlay3d.html`, `src/overlay3d*.ts(x)`, tests); example lists in
  `packages/tools/test/motion-new.test.ts` and `test/repo/agent-guide.test.ts`.

### O6. Guide

- `docs/guide/agent-3d.md` gains "2D over 3D": the lens the scene owns, `project3d` for a point, `posedJoints3d` for a
  joint, hiding a label behind the lens, `limits` for a mixed scene, drawing on the step. Reference and map by
  `npm run reference -- --write` and `npm run map -- --write`.

### O7. Proof

- **Measure, alone, fresh:** a cheap executor-model worker (Sonnet at medium effort) makes `dragon-intro`, at most
  10 seconds:
  - a 2D title drops in word by word over a dark stage while the camera pushes in on the dragonling;
  - props fall around it through 3D physics, and each landing pops a 2D "+1" at the prop's point on screen, from the
    contact events;
  - the dragonling turns to the viewer and talks: a DOM speech bubble pinned to its head, its tail at the mouth,
    reveals the words as the jaw moves from `talk.json` through `follow`;
  - it blinks: a few scripted blinks on beats of the story, and between them blinks at times drawn from `seeded`,
    so every play and every seek blinks at the same moments;
  - a 2D card slides in from the side and the dragonling turns its head to look at it;
  - the title wipes out and everything settles before the end.
- **It passes when:** samples are read only through `follow`; `motion:review` with the scene's own `limits` is clean
  and seeks as well as plays; the frame sheet shows every label on its point and the whole dragonling in frame; the
  lead checks two pinned labels against their sampled projections; and scrubbing gives the frame playing reached.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 4. Team and order

Roles, not model names: the **planner** conducts (plans, briefs, combines, judges), **executors** build slices from
short briefs, each in its own isolated workspace. When combining a wave that adds exports, the planner updates
`tsconfig.json`, `scripts/reference.mjs`, `docs/guide/agent-reference.md` and `docs/MAP.md`.

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Planner | D0, O1, O2 | the lens and joint shapes every later slice reads |
| 2 | Executor | O3 | tools only |
| 2 | Executor | O4 | the scaffold and its browser test |
| 3 | Executor | O5 | after O4, so the example draws on the step |
| 4 | Planner | O6 | what the measure reads |
| 4 | Executor model, medium effort, fresh | O7 measure | the guide must carry a cheap worker |
| 4 | Executor | cold review | |

One pull request, after wave 4.

## 5. Risks

- **Two owners of the lens:** a page that sets its own `fov` or aspect drifts every label; the scaffold and guide
  read both from the scene module, and O4's test fails on a drift of 1 px.
- **Stage scaling:** a stage scaled to the window by CSS scales the overlay with it only if both sit in one box; the
  scaffold puts canvas and overlay in the same stage element.
- **Text in headless Chromium:** labels wait for `document.fonts.ready`, which the page tools already await.
- **A label behind the model** stays drawn; occlusion is out of scope, and the measure's story keeps labels clear.
- **The dragonling has no eyelids of its own:** the page adds one lid per eye, a mesh in the skin colour riding the
  `Head` bone, placed from `apps/pieces/references/dragonling.eyes.json` (each iris's box, measured from the model and
  held to it by a test); the scene drives the lids as a custom number. A lid that clips the brow or shows a seam at
  rest is a finding of the measure.
- **A cheap measure may stall** where an Opus one would not; a stall is a finding about the guide, recorded, and the
  measure is not rerun on a stronger model to pass.

## 6. Done when

The measure passes, its tokens are recorded, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
