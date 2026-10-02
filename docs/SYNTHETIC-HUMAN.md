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
  `synthetic` loops the motion's committed take.
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
  was stopped, its start rejected or the page's consumer threw (`GF-85`). Starting a source resets
  the pipeline and restarts the rig, because a new source is a new subject. Ending one ends any
  recording, saved as if stopped, so a take never spans two sources.
