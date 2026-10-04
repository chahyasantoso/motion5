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

## Geometric visibility and detector corruption

- `src/synthetic/occlusion.ts` classifies every anatomical landmark from truth and the observation
  camera only. Its closed `SyntheticVisibility` union has precedence `behind-camera`,
  `out-of-frame`, `occluded { occluderId }`, `visible`. The body has a torso, chest, pelvis, head
  sphere and six limb capsules per side; each limb excludes its own attached landmarks. Props
  are `none`, an axis-aligned `table`, or a capsule `pillar`. Rays stop 20 mm short of a landmark
  to tolerate surface grazing. Capsule tests use actual first contact with the finite cylinder
  and endpoint spheres; box tests use slabs. The nearest first contact names the blocker, not
  the nearest centreline (`GF-102` through `GF-107`).
- `DetectorScores` maps geometry to confidence without changing it. `IDEAL_SCORES` keeps the
  legacy ideal scores; `GEOMETRIC_SCORES` uses the exhaustive `SCORE_PROFILE` table. An occluded
  joint is visibility 0.3 but presence 0.9. The same adapter and gap detector read both image and
  world reports; presence never decides trust. Neither corruption nor hand swaps move the
  geometric truth attached to an anatomical slot (`GF-108`, `GF-109`).
- `CorruptionSpec` is seeded, counter-based and independent of evaluation order. Jitter shares
  a noise field between image pixels and camera-world metres. Its stationary finite-kernel
  AR(1) approximation truncates at a 1% tail or 64 taps, whichever comes first, then normalises
  variance. The 64-tap cap bounds cost even for correlation near 1; such values are an approximation,
  not exact AR(1). Zero jitter skips Gaussian evaluation. Outliers displace both spaces at the
  landmark's depth; false-high visibility contradicts hidden geometry without rewriting presence.
  Swap episodes exchange the whole arm pair (shoulders through hands) or leg pair (hips through
  feet), preserving slot geometry. Individual starts last 2 to 8 frames; overlapping starts keep
  the group swapped and can extend the continuous episode. Missing positions stay missing
  (`GF-110` through `GF-114`).
- `FrameTiming` is `captured { tMs }` or `dropped`; `tMs` is delivery time. Camera frame `k` has
  truth sampled at `k * SIMULATOR_FRAME_MS` (30 fps), not at its delayed delivery time. Lateness
  remains under one camera period, preserving timestamp order. Dropped frames never reach the
  adapter. A source generation resets its selection cursor, including a restart after only one
  sample. Scripted loss membership follows camera time, never lateness. Finite input validation
  refuses invalid magnitudes, rates, times and frame indices (`GF-115` through `GF-120`).
- The panel selects ideal/geometric confidence, none/table/pillar props and none/phone/harsh
  corruption. `phone` and `harsh` are deliberately synthetic proposals, not calibrated detector
  measurements. Debug landmark colours show camera geometry independently of confidence:
  green visible, orange occluded, yellow out of frame, purple behind camera. The info panel
  names the blocker even when the report is confidently wrong (`GF-121`). The independent
  debug camera never changes measured geometry.
- `SimulatorInit` permits observation defaults; `SimulatorState` always contains the resolved
  scores, props and corruption. Test fixtures use the initial-state contract, avoiding the
  incomplete resolved-state fixture caught by PR #544's full typecheck.
- Follow-up exit checks enforce safe nonnegative frame indices even on the no-corruption fast
  path, validate direct observation/corruption inputs, and forbid swap episode starts before
  frame zero (`GF-122`, `GF-123`). Jitter kernel taps and normalisation are computed once per
  frame. Prop records/coordinates and degenerate/tangent cylinder cases are checked (`GF-124`).
  A minimal injected DOM/canvas-port test proves every panel select updates observation state
  without moving truth (`GF-125`); it is not a browser smoke test.

## Shared body and reconstructed Three avatar

The world pipeline owns `src/body/state.ts`, one immutable body estimate shared by the world
filler and the renderer. Direct filler callers use the same owner internally, not a second torso
algorithm. The estimate contains a camera-relative origin, calibrated torso-local shoulder/hip
offsets, observed/inferred/unavailable orientation, root provenance and expiry. Attachment offsets
are captured on the first fully trusted nondegenerate torso after reset; the existing estimator
still owns shoulder/hip widths and limb lengths. This is measured person calibration, not the
synthetic actor's authored anatomy or the avatar's display scale.

Trusted roots are copied exactly, never pulled toward the model. Missing roots use a trusted
partner and estimator-owned width, then shared calibrated placement; with no usable body placement
they may use their own bounded position coast. Inferred roots never recursively train other
anchors, lengths, trust or observed age. Each root expires against its own last trusted timestamp.
Merely missing torso evidence may coast its previous basis within the same horizon, explicitly
labeled inferred. Zero/collinear/canceling current torso evidence publishes no orientation.
All body/filter state resets with the subject. Body updates roll back every filter and metadata
record if a later operation fails (`GF-126` through `GF-133`, `GF-148` through `GF-151`).

Per-root model residuals use an origin fitted from the **other** trusted calibrated roots; a
single visible anchor provides placement but no independent residual. These are body-fit
diagnostics, not detector ground truth or a new trust gate. Current torso orientation still uses
trusted torso evidence, so even the leave-one-out origin residual is not independent measurement
validation. The body model does not promise exact fitting of inconsistent noise.

Select **world (mm)** and enable **Three avatar** to see the reconstructed pelvis, trunk,
shoulder bar, neck/neutral head and the four solved chains. The view reads the same rig project's
ready patches through the read-only `RigSolver.readPatch` port and `@motion5/three`. Every frame-
bound group is a direct child of a calibrated parent: `Rx(pi)` maps camera x/right, y/down,
z/away to Three x/right, y/up, z/toward, and one uniform `0.001` parent scale converts mm to
metres. No preview mirror or extra Y reflection is applied. Motion5 FK frames are **distal
tips**; limb boxes extend backward along local `-x`. Parent rotation/positive uniform scale
compose normally; nonuniform, nonfinite and nonpositive scales are rejected (`GF-134` through
`GF-138`, `GF-153`). These are flat procedural primitives, not a nested GLTF/skinning adapter.

Geometry/materials/topology are built once and reused. The viewport owns no project, clock,
pose filter or solve. Only the existing writer submits one value batch per accepted pose, with
one pole per limb; measured middle/root pairs remain the only inputs that update observed bend
history. An inferred root translates the held pole but cannot retrain it (`GF-152`).

Blue means measured **inputs**, not guaranteed truth or an exact solved middle.
Amber wireframe means inferred inputs; solid grey means neutral orientation/anatomy.
Grey wireframe means stale presentation geometry with current evidence unavailable.
Noiseless consistent calibrated limbs reproduce middle and tip; the readout exposes separate
solved-versus-trusted middle and tip residuals for inconsistent noisy inputs (`GF-154`).
Unobserved residuals are unavailable, not zero. Skipped/lost limbs retain their last accepted
display transforms, never arbitrary old ready project patches (`GF-139` through `GF-141`).
Each limb and body primitive reports current, stale or unavailable presentation independently.
Before a primitive has any valid display geometry it remains unavailable; no authored simulator
truth or unseen anatomy is fabricated. Partial/complete evidence loss holds only already accepted
geometry, unchanged in world coordinates. A moving current body can therefore be disconnected
from a stale limb: attachment reconstruction would be a separate inferred presentation policy.
Stale residuals are unavailable and stale geometry is excluded from solver penetration diagnostics,
observed camera fit and replay metrics. Orbit framing includes visible stale geometry because it
is display-only. Raw/hold ablations keep their own roots rather than substituting stabilized anchors.

The single freshness owner, `view/presentation-history.ts`, retains timestamps and current-frame
membership only; the persistent Three primitives retain their display transforms. No held geometry
can enter trust, One Euro, Chain Kalman, length training, bend history or future observations.
Solver/project replacement and `clear()` invalidate display history and adapter revisions.
`live/publish-frame.ts` catches live solver publication failures, returns an empty current solve,
and leaves the source alive so the next frame can retry. Replay still fails on actual solver errors.

Before either smoother or filler sees a sample, the detector applies an independent per-joint
innovation gate using only accepted raw history. Engineering defaults are a 30 px / 120 mm floor
or 0.3 raw bone lengths, whichever is larger; velocity is low-pass estimated and extrapolated at
most 100 ms. The raw accepted detector-scale estimator is separate from stabilized anatomical
lengths, so choosing a smoother cannot change trust. Three nearby candidates at most 150 ms
apart can confirm persistent relocation, but never bypass the legacy speed limit.
Absent/forced/low-visibility/invalid samples break confirmation. A rejected candidate cannot train
any downstream stage; promoted candidates become new accepted evidence with zero initial velocity.
Rejections carry explicit innovation/speed/invalid diagnostics in native units.
Raw remains an intentionally ungated observation reference, including rejected coordinates.
Invalid joints consume a frame as gaps while valid joints still advance, just like absent joints;
invalid/non-increasing frame times or changing space without reset fail before state mutation.
First observations, slow drift and a persistent wrong plateau cannot be proven correct temporally.
These thresholds are synthetic engineering defaults, not calibrated phone data or an accuracy claim.

Coarse palm/foot planes use wrist/index/pinky or ankle/foot-index/heel extra world slots when
coordinates and confidence are finite, reported presence is not below threshold, and the plane
is nondegenerate. The 12-joint trust/model topology is unchanged; this local extra-slot evidence
is not a full speed-gated trust model. Missing/unusable evidence or an inferred tip uses an
explicit neutral orientation. It never claims full forearm twist, fingers, measured head
orientation or calibrated head dimensions (`GF-142`).

The independent avatar orbit changes presentation only, never simulator visibility. Source end,
setting/calibration/subject restart and WebGL context loss clear geometry immediately. Context
restoration stays empty until the next accepted pose. GPU initialization/runtime failures leave
the overlay and all sources usable. Resize/input/resource ownership is disposed on pagehide
(`GF-143` through `GF-147`, `GF-155`). Low-tier defaults use reused basic materials, pixel ratio
one, no antialiasing and no shadows. Lifecycle tests use injected rendering ports and actual
Three CPU scene objects, not a browser/WebGL smoke test.
