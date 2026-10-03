# Synthetic human rig

This is the design record for [#540](https://github.com/chahyasantoso/motion5/issues/540): a 3D
human driven by MediaPipe's 33 pose landmarks, and a synthetic human whose simulated MediaPipe
output the pipeline can be tested against, occlusion included. It states the scope, the contracts
each slice adds and the decisions behind them. What has landed is claimed only by
[SESSION-STATUS.md](./SESSION-STATUS.md).

## Scope

- One person, coarse whole-body articulation, a camera-relative root, and uncertainty that is shown
  rather than hidden. A joint the camera did not see is inferred or lost, never presented as
  measured.
- Not implied by 33 pose landmarks: finger articulation, facial animation, room-scale locomotion
  and cloth. MediaPipe's world landmarks are hip-centred, so global placement needs a camera or
  scene estimate the landmarks do not carry; the first root mode keeps the pelvis stationary.
- Everything lives in `apps/pose-gap-filler` and reaches `packages/core` only through the rig's
  writer. MediaPipe and human anatomy never enter core.
- One body definition and one Motion5 project, solved as the existing four two-bone limb islands.
  A shared full-body tree waits for intermediate-joint objectives core does not have.
- A learned temporal prior is [#539](https://github.com/chahyasantoso/motion5/issues/539), an
  optional improvement measured against this simulator, not a prerequisite for it.

## Baseline

- Read against `main` at `95e08e10722a31696c4da5e235325780f9b50ee8`, the squash of
  [PR #538](https://github.com/chahyasantoso/motion5/pull/538).
- Toolchain: Node 24 in CI, TypeScript 5.8.3, Prettier 3.6.2, GSAP 3.15.0. The 3D playground pins
  Three 0.186.1 with `@types/three` 0.186.0. MediaPipe Tasks Vision 0.10.35 and the
  `pose_landmarker_full` float16 model are loaded at runtime from pinned URLs, never installed.
- [POSE-GAP-FILLER-COMPARISON.md](./POSE-GAP-FILLER-COMPARISON.md) is the behavioural baseline and
  `GF-75` holds it byte for byte. A slice that changes it says so and regenerates it.
- Target devices are a proposal until they are measured: one midrange Android phone on Chrome and
  one recent iPhone on Safari, named with their numbers when the live path is timed on them. No
  phone performance is claimed before that.

## Sources

- `SourceSpec` in `src/live/sources.ts` is the closed union of where the live page's landmarks come
  from, and `createLandmarkSource` is its one factory. `camera` is the webcam through MediaPipe.
  `synthetic` loops the motion's committed take. `simulator` measures the page's synthetic human at
  30 fps as its person edits it, through `reportResult` and the same reader (`GF-99`).
- `SYNTHETIC_TAKES` in `src/replay/synthetic.ts` owns one take per motion: the comparison record's
  input and the live loop, so what a person watches is what the record judged. Each take is a whole
  number of its motion's periods, so the loop has no seam in the pose (`GF-84`).
- Creating a source acquires nothing. Only the `camera` arm creates the webcam source, which loads
  MediaPipe and asks for the camera only when started, so a synthetic session never reaches either
  (`GF-83`).
- `createPlaybackSource` paces a recording by its own clock, at most one frame per animation frame,
  so a slow device plays slower instead of skipping and the emitted sequence is the one replay steps
  through. Time only increases across a loop (`GF-81`, `GF-82`).
- `writePoseResult` in `src/filler/adapter.ts` writes a recorded pose in the shape `readRawPose`
  reads, so every producer enters the pipeline through the one reader of MediaPipe's shape
  (`GF-80`).
- `createSourceSession` in `src/live/session.ts` is the one owner of the source's lifecycle: at most
  one source runs, and every started source ends exactly once, through one `end` hook, whether it
  was stopped, its start rejected or the page's consumer threw (`GF-85`). Ending one ends any
  recording, saved as if stopped, so a take never spans two sources. It stamps every sample with its
  `session` (counting started sources) and its `sequence` within it (`GF-89`). Starting a source
  resets nothing itself: its first admitted sample is the ingest gate's `new-session` restart,
  which resets the pipeline and the rig, so a source that never produces a sample leaves them as
  they were.

## Observations, time and coordinates

- A measured joint carries `presence` beside `visibility` (`src/filler/frame.ts`):
  `reported` with a value clamped into [0, 1], or `unreported` when the producer gave none. It is
  never fabricated as a confident 1. Trust still reads visibility only, so a frame that differs
  only in presence is trusted identically and the comparison record is unchanged (`GF-86`).
- Recordings are written as version 2, `[x, y, z, visibility, presence]` with presence `null` when
  unreported. Version 1 files are still read through their own decoder into the current shape,
  with every presence unreported, and each version's landmark shape is refused in the other
  (`GF-87`).
- `createIngestGate` in `src/live/ingest.ts` is the one owner of admission and of when subject
  state resets. Its `Admission` is `continue`, `restart` (a new session, a stall past one second,
  or a pose reacquired after two seconds without one) or `reject` (non-finite time, time that does
  not increase within a session, a stale session). It reads the samples' own times and stamps,
  never a wall clock, so replay is admitted identically (`GF-88`). A restart resets the pipeline
  and the rig; a rejected sample is neither drawn nor recorded.
- Axes are MediaPipe's, camera-aligned and unmirrored: +x toward the image's right, which is a
  camera-facing person's left, +y down, and smaller z nearer the camera, in world and image alike.
  World landmarks are hip-centred and converted from metres to millimetres once, in the adapter.
  A person turned away keeps every anatomical name; only their image side changes (`GF-91`).
- `PreviewMirror` in `src/live/preview.ts` is display only. A mirrored preview flips drawn
  positions and the video about the stage's centre line and nothing upstream reads it, so the
  person's left wrist stays `left-wrist` (`GF-90`). The camera defaults to mirrored, a synthetic
  take to unmirrored.

## The synthetic actor

- `src/body/skeleton.ts` owns the body: 15 segments in one parent-first tree, 39 rotational degrees
  of freedom with anatomical ranges, and `DEFAULT_PROPORTIONS`, the legacy synthetic subject's
  bones, so the twelve limb joints keep the lengths the filler was proven on. +y is up and the
  actor faces +z, so its left is +x.
- `src/body/attachments.ts` attaches MediaPipe's 33 landmarks in index order. `joint` is a segment
  origin, which is what the twelve limb joints mean. `surface` is a point on a segment chosen to
  resemble a face, hand or foot landmark, a synthetic approximation the info panel labels so
  (`GF-93`).
- `actorFrame` is the one forward kinematics and the one owner of where the truth is. Its result
  is frozen, so no observation edit, corruption or page code can move the truth it is judged
  against. Independent fixtures check its axes and every bone's length (`GF-92`).
- `createCamera` is a pinhole in MediaPipe's camera axes, with `unproject` its inverse at a depth
  (`GF-94`). `observe` measures the truth through it. World landmarks are hip-centred on the hips
  as seen and keep every distance of the truth. Image z is an approximation of MediaPipe's learned
  relative depth, not a reproduction of it (`GF-95`).
- `ObservationEdit` is the closed union of what observation mode may do to the detector's output:
  `displace`, `swap` with the anatomical partner, `score`, `drop`. Edits apply in `EDIT_ORDER`
  whatever order they were made, and never write the truth (`GF-96`).
- `SCENARIOS` are data read by one interpolator: standing, a fast arm reversal, a squat, a half
  turn, a hand on the lower back, crossed arms, stepping out of frame, joints lost together, a
  short whole-pose loss and a loss long enough to reacquire after. They are deterministic in time,
  periodic, legal at every frame and seamless across the loop (`GF-97`). `ScriptedLoss` drops
  landmarks or the whole pose for a window; a 0.8 s loss continues the subject through the ingest
  gate and a 2.5 s one is reacquired as a new subject exactly once (`GF-100`).
- `dragHandle` poses one limb so its wrist or ankle reaches a target: the hinge from the law of
  cosines, the swing analytically on both branches, then damped least squares within the ranges.
  It reaches every target a legal pose of that limb reaches and reports `clamped` with
  `out-of-reach` or `joint-limit` otherwise, never stretching a bone. It is the truth actor's own
  solve, independent of the rig's IK, so the rig is never judged by its own algorithm (`GF-98`).
- `createSimulator` owns no clock and reads nothing from the pipeline. A frame is a pure function
  of its state (drive, camera, edits) and time. `SimulatorReport` is `pose` or `none`. Running the
  estimate on every frame changes nothing the simulator measures (`GF-99`, `GF-101`).
- The page's panel (`src/view/simulator-panel.ts`) has two modes. Pose mode edits the truth:
  the drive, one slider per degree of freedom, and the four handles dragged in the debug view.
  Observation mode edits only what the detector reports. The observation camera orbits the
  actor. The debug view has its own orbit, which nothing measured reads. Truth and estimate are
  separate layers the person toggles. The form, pick and info helpers are pure and tested
  (`GF-101`).
