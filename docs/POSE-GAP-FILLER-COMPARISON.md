# Pose gap filler comparison

This is the one comparison record that phase 5 of
[#530](https://github.com/chahyasantoso/motion5/issues/530) calls for: every metric for `raw`,
`hold` and `chain-kalman` in both landmark spaces, the caveats that bound it, and the call on
whether the INN issue is opened. It records what the committed code measures on the committed
synthetic input, not a promise about a real camera.

The block between the `comparison-record` markers is generated, never edited by hand.
`formatComparisonRecord` in `apps/pose-gap-filler/src/replay/record.ts` writes it from the input in
`apps/pose-gap-filler/test/comparison-record.ts`, and `GF-75` fails when the committed block differs
from a fresh build by one byte. After any change to a filler, the stabilizer, the detector, the rig
or the input, regenerate it with
`POSE_COMPARISON_WRITE=1 npx vitest run apps/pose-gap-filler/test/record.test.ts` and read the diff.
The live page builds the same record from a real recording: load a still take with "Calibrate",
then a movement take with "Replay", and the report is this block for that take.

## What is compared

- **Input.** A seeded synthetic exercise (an arm raise with a squat, 2.4 s per repetition) is the
  movement every filler is replayed over. A separately seeded synthetic still take calibrates the
  detector and measures the reference's noise, so calibration never sees the frames it judges.
  Both are MediaPipe-shaped: the twelve limb joints in image and world form, with per-axis Gaussian
  noise of 1.5 px and 8 mm.
- **Masks.** `DEFAULT_MASKS`: a half-second gap every three seconds on the left wrist, right elbow,
  left ankle and right knee, staggered so no two limbs lose a joint on the same frames. A mask
  reaches the run only as `forced` trust, and every metric is judged against the landmark the mask
  hid.
- **Settings.** The live page's defaults: the `one-euro` stabilizer tuned per space, and in each
  space the detector calibrated on the still take.
- **Populations.** Filled rows are the fillers' own output with no rig, the answer to "where is an
  untrusted joint" that the filler alone owns and that an INN would replace behind the same
  interface. Rig rows are what the live page draws: a limb's middle and tip where a fresh Engine
  rig solved them.
- **Metrics.** Position error is the distance from what was shown to the hidden landmark over
  masked frames. Lost frames are masked frames where nothing was shown. Bone-length deviation
  covers bones touching a masked joint. Jitter is the three-frame acceleration of shown (or, with a
  rig, solved) joints. Lag is the frame shift that best aligns shown and reference positions, an
  alignment proxy rather than causal latency. Recovery snap is the jump at each gap's end.

## How the call is made

- **Reference noise.** `calibrateDetector` estimates the reference's own noise from the still take
  as the mean frame-to-frame step of trusted samples divided by the square root of 2. For
  independent isotropic noise that is exact in any dimension and needs no truth, so the live page
  can measure it on a real still take; slow sway only adds to it. `GF-70` holds the estimate
  within 5% below and 10% above the true distance to the noiseless twin in both spaces, at one and
  three times the default noise.
- **Best filler.** The filler under test, `hold` or `chain-kalman`, with the lowest mean filled
  position error; fewer lost frames break a tie. `raw` is the reference and is never a candidate.
- **Measurable gap.** The best error must exceed `MEASURABLE_GAP_FACTOR` (2) times the reference
  noise. A perfect predictor of the true pose still scores the reference's noise against that
  noisy reference, so an error inside twice the noise cannot be told from none, and no later filler
  could be shown to beat it.
- **Why filled rows decide.** The rig places a masked middle joint from the bone lengths and the
  writer's held bend side, which no filler owns, so rig rows mix the filler's answer with the
  writer's. The verdict reads the filler's own answer; the rig rows show what a person would see.
- **INN.** `open` when any space has a measurable gap, and the INN must beat that space's best
  filler on mean masked error without losing more frames, never `raw`. `not-needed` when every
  space is within noise. `undecided` when no space is measurable and some space had no still take.

## Record

<!-- comparison-record:begin -->

- Input: synthetic exercise seed 11, 12000 ms at 30 fps, calibrated on synthetic still seed 7, 10000
  ms at 30 fps, 360 frames, stabilizer `one-euro`. Summaries are mean / p95 / max.

### image space (px)

- Detector: calibrated on the still recording, visibility threshold 0.861 and speed gate 20.0 bone
  lengths/s; reference noise 1.91 px.
- Filled `raw`: position error 0.0 / 0.0 / 0.0 px, lost frames 0, bone-length deviation 0.0 / 0.0 /
  0.0 px, jitter 4153.9 / 8064.6 / 12688.0 px/s², lag 0.0 ms, recovery snap 5.0 / 13.9 / 13.9 px.
- Filled `hold`: position error 27.7 / 94.1 / 130.9 px, lost frames 0, bone-length deviation 12.7 /
  42.0 / 111.3 px, jitter 1245.3 / 3130.3 / 118724.6 px/s², lag 33.3 ms, recovery snap 38.8 / 131.9
  / 131.9 px.
- Filled `chain-kalman`: position error 21.9 / 70.8 / 103.3 px, lost frames 2, bone-length deviation
  10.6 / 32.3 / 48.4 px, jitter 1342.2 / 3349.4 / 74781.0 px/s², lag 33.3 ms, recovery snap 28.5 /
  78.1 / 78.1 px.
- Rig `raw`: position error 11.5 / 45.5 / 51.5 px, lost frames 0, bone-length deviation 9.0 / 32.3 /
  45.5 px, jitter 5972.0 / 13021.9 / 94993.9 px/s², lag 0.0 ms, recovery snap 5.6 / 14.3 / 14.3 px.
- Rig `hold`: position error 29.4 / 94.1 / 130.9 px, lost frames 0, bone-length deviation 9.0 / 32.3
  / 45.5 px, jitter 3013.5 / 5696.0 / 118724.6 px/s², lag 33.3 ms, recovery snap 30.7 / 131.9 /
  131.9 px.
- Rig `chain-kalman`: position error 24.1 / 74.7 / 103.3 px, lost frames 2, bone-length deviation
  8.9 / 32.3 / 44.0 px, jitter 2989.3 / 6631.2 / 114302.0 px/s², lag 33.3 ms, recovery snap 17.0 /
  97.7 / 97.7 px.
- Verdict (filled rows): measurable gap. The best filler is `chain-kalman` at 21.9 px mean masked
  error with 2 lost frames, 11.5 times the reference noise of 1.9 px, a gap of 20.0 px.

### world space (mm)

- Detector: calibrated on the still recording, visibility threshold 0.861 and speed gate 20.0 bone
  lengths/s; reference noise 13.02 mm.
- Filled `raw`: position error 0.0 / 0.0 / 0.0 mm, lost frames 0, bone-length deviation 0.0 / 0.0 /
  0.0 mm, jitter 28051.7 / 48886.8 / 76956.5 mm/s², lag 0.0 ms, recovery snap 29.4 / 69.3 / 69.3 mm.
- Filled `hold`: position error 154.0 / 466.9 / 659.3 mm, lost frames 0, bone-length deviation 53.4
  / 197.2 / 357.5 mm, jitter 9297.4 / 20358.5 / 596876.0 mm/s², lag 33.3 ms, recovery snap 232.3 /
  663.2 / 663.2 mm.
- Filled `chain-kalman`: position error 117.5 / 326.0 / 425.7 mm, lost frames 2, bone-length
  deviation 26.6 / 152.5 / 370.5 mm, jitter 9775.0 / 20977.8 / 420681.7 mm/s², lag 33.3 ms, recovery
  snap 240.1 / 406.3 / 406.3 mm.
- Rig `raw`: position error 26.1 / 109.0 / 255.6 mm, lost frames 0, bone-length deviation 9.2 / 24.7
  / 42.3 mm, jitter 35741.5 / 87702.1 / 233122.9 mm/s², lag 0.0 ms, recovery snap 46.0 / 236.2 /
  236.2 mm.
- Rig `hold`: position error 114.5 / 466.9 / 659.3 mm, lost frames 0, bone-length deviation 9.2 /
  24.7 / 42.3 mm, jitter 14123.7 / 32372.4 / 596876.0 mm/s², lag 33.3 ms, recovery snap 157.1 /
  663.2 / 663.2 mm.
- Rig `chain-kalman`: position error 83.8 / 274.8 / 425.7 mm, lost frames 2, bone-length deviation
  9.2 / 24.7 / 42.3 mm, jitter 14055.0 / 33143.2 / 420681.7 mm/s², lag 33.3 ms, recovery snap 135.0
  / 406.3 / 406.3 mm.
- Verdict (filled rows): measurable gap. The best filler is `chain-kalman` at 117.5 mm mean masked
  error with 2 lost frames, 9.0 times the reference noise of 13.0 mm, a gap of 104.5 mm.

- INN: open. The best filler leaves a measurable gap, so the INN issue is warranted, and it must
  beat `chain-kalman` in image space (21.9 px, 2 lost frames) and `chain-kalman` in world space
  (117.5 mm, 2 lost frames) on mean masked error without losing more frames, never `raw`.

<!-- comparison-record:end -->

## Reading

- `chain-kalman` is the best filler in both spaces, and the gap it leaves is about an order of
  magnitude above the reference noise in each, so the call is `open` on this input.
- `chain-kalman` is not free: it is the only filler that loses frames, because its coast is capped
  before the half-second gap ends, where `hold` shows a stale joint instead. The INN target names
  both numbers for that reason.
- In world space the rig makes `raw` worse and `chain-kalman` better than their filled rows: the
  rig enforces the median bone lengths, which helps an inferred tip, while a masked middle is placed
  on the held bend side. The worst masked rig errors for `raw` are the right elbow in world space
  and the right knee in image space, the two masked middle joints, during the repetition's fastest
  bend change. That error belongs to the writer's bend-side hold, not to any filler, and an INN
  would not remove it.
- Image-space bone-length deviation is never a fair score: a bone's image length changes with
  foreshortening, so a fixed length is wrong there by construction. World space is where that
  column means what it says.

## Caveats

- The input is synthetic. Its reference is a noisy MediaPipe-shaped landmark, and MediaPipe is the
  reference, not ground truth: on a real take the reference is MediaPipe itself, whose errors no
  metric here can see.
- Synthetic noise is independent and Gaussian. Real MediaPipe noise is correlated in time, has
  outliers and swaps left and right, so the real reference noise and the real gaps can both differ.
- The masks are periodic and artificial. A real occlusion correlates with motion, pose and
  visibility, and a real gap can begin with a gated teleport rather than a clean hold-out.
- One seed per take. The record is deterministic, so it pins the code's behaviour on this input,
  not the spread over inputs.
- The numbers were generated in a sandbox on Node 22; `GF-75` re-derives them on every CI run, so a
  CI run is where they become evidence.

## Decision

- The INN issue is warranted by this record, and its acceptance bar is the INN line above: beat
  `chain-kalman` in each space on mean masked error without losing more frames, never `raw`.
- It is opened once a real still take and a real movement take, replayed on the live page, also
  read `INN: open` in the space they were calibrated in. A synthetic gap alone does not open it,
  because the synthetic noise model is the input's weakest assumption.
- Withdrawn: judging the call on rig rows, which would charge the writer's bend-side hold to the
  filler; judging against `raw`, which the plan forbids; a noise floor from the noiseless twin,
  which a real take does not have; a fixed error threshold in px or mm, which would not carry
  across spaces, cameras or subjects.
