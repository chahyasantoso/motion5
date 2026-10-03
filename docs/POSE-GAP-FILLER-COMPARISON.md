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
  space the detector calibrated on the still take. A recording keeps both forms of every landmark,
  so one still take calibrates both spaces (`calibrateSpaces`), on the live page as here, and the
  calibration survives a space switch.
  Calibration tunes visibility/speed, not the additional pre-filter innovation gate: its
  engineering defaults remain 30 px / 120 mm or 0.3 raw bone lengths, bounded 100 ms prediction,
  and three consistent candidate confirmations. Raw observations remain the ungated reference.
- **Populations.** Filled rows are the fillers' own output with no rig, the answer to "where is an
  untrusted joint" that the filler alone owns and that an INN would replace behind the same
  interface. Rig rows contain current Engine publications, not presentation-only stale avatar
  geometry. The avatar can stay visible while a rig metric correctly counts an unavailable solve;
  visual persistence never reduces lost-frame counts or manufactures observations.
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
  noisy reference, so an error inside twice the noise establishes no meaningful gap by this rule.
  It is a heuristic bar, not a proof that no later filler could do better.
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
  0.0 px, jitter 4153.9 / 8064.6 / 12688.0 px/s², lag 0.0 ms, recovery snap 4.7 / 12.8 / 12.8 px.
- Filled `hold`: position error 27.7 / 94.1 / 130.9 px, lost frames 0, bone-length deviation 12.7 /
  42.0 / 111.3 px, jitter 1266.6 / 3133.7 / 128112.6 px/s², lag 33.3 ms, recovery snap 43.2 / 142.3
  / 142.3 px.
- Filled `chain-kalman`: position error 22.1 / 71.5 / 104.3 px, lost frames 2, bone-length deviation
  10.8 / 32.3 / 48.4 px, jitter 1284.6 / 3271.7 / 74875.9 px/s², lag 33.3 ms, recovery snap 30.1 /
  78.2 / 78.2 px.
- Rig `raw`: position error 11.7 / 45.5 / 51.5 px, lost frames 0, bone-length deviation 9.3 / 32.3 /
  45.5 px, jitter 5979.3 / 13021.9 / 94993.9 px/s², lag 0.0 ms, recovery snap 10.2 / 81.8 / 81.8 px.
- Rig `hold`: position error 29.6 / 94.1 / 130.9 px, lost frames 0, bone-length deviation 9.3 / 32.3
  / 45.5 px, jitter 2983.5 / 5812.0 / 128112.6 px/s², lag 33.3 ms, recovery snap 38.5 / 142.3 /
  142.3 px.
- Rig `chain-kalman`: position error 24.3 / 75.1 / 104.3 px, lost frames 2, bone-length deviation
  9.2 / 32.3 / 44.1 px, jitter 2876.6 / 6423.6 / 114302.0 px/s², lag 33.3 ms, recovery snap 22.6 /
  97.8 / 97.8 px.
- Verdict (filled rows): measurable gap. The best filler is `chain-kalman` at 22.1 px mean masked
  error with 2 lost frames, 11.6 times the reference noise of 1.9 px, a gap of 20.2 px.

### world space (mm)

- Detector: calibrated on the still recording, visibility threshold 0.861 and speed gate 20.0 bone
  lengths/s; reference noise 13.02 mm.
- Filled `raw`: position error 0.0 / 0.0 / 0.0 mm, lost frames 0, bone-length deviation 0.0 / 0.0 /
  0.0 mm, jitter 28051.7 / 48886.8 / 76956.5 mm/s², lag 0.0 ms, recovery snap 26.5 / 68.1 / 68.1 mm.
- Filled `hold`: position error 154.0 / 466.9 / 659.3 mm, lost frames 0, bone-length deviation 53.4
  / 197.2 / 357.5 mm, jitter 9384.1 / 20332.7 / 649809.0 mm/s², lag 33.3 ms, recovery snap 256.2 /
  722.0 / 722.0 mm.
- Filled `chain-kalman`: position error 117.5 / 326.0 / 425.7 mm, lost frames 2, bone-length
  deviation 26.6 / 152.5 / 370.5 mm, jitter 8819.7 / 20483.3 / 355151.8 mm/s², lag 33.3 ms, recovery
  snap 274.6 / 366.3 / 366.3 mm.
- Rig `raw`: position error 26.0 / 109.0 / 255.6 mm, lost frames 0, bone-length deviation 9.2 / 24.8
  / 42.1 mm, jitter 35780.2 / 87679.7 / 233122.9 mm/s², lag 0.0 ms, recovery snap 45.6 / 225.3 /
  225.3 mm.
- Rig `hold`: position error 114.5 / 466.9 / 659.3 mm, lost frames 0, bone-length deviation 9.2 /
  24.8 / 42.1 mm, jitter 14354.5 / 32348.2 / 649809.0 mm/s², lag 33.3 ms, recovery snap 175.4 /
  722.0 / 722.0 mm.
- Rig `chain-kalman`: position error 83.7 / 274.8 / 425.7 mm, lost frames 2, bone-length deviation
  9.2 / 24.8 / 42.1 mm, jitter 13248.3 / 32348.2 / 204350.4 mm/s², lag 33.3 ms, recovery snap 58.8 /
  234.1 / 234.1 mm.
- Verdict (filled rows): measurable gap. The best filler is `chain-kalman` at 117.5 mm mean masked
  error with 2 lost frames, 9.0 times the reference noise of 13.0 mm, a gap of 104.5 mm.

- INN: open. The best filler leaves a measurable gap, so the INN issue is warranted, and it must
  beat `chain-kalman` in image space (22.1 px, 2 lost frames) and `chain-kalman` in world space
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
- The numbers were generated in a sandbox on Node 22, and `GF-75` re-derived them byte for byte on
  Node 24.21.0 in CI (PR #538 run 36958413903), so the record does not depend on the Node version.

## Decision

- The record reads `INN: open`, and the follow-up is
  [#539](https://github.com/chahyasantoso/motion5/issues/539). Its acceptance bar is the INN line
  above: beat `chain-kalman` in each space on mean masked error without losing more frames, never
  `raw`, on this record and on a real still and movement take replayed on the live page.
- #539 withdraws an invertible network (a normalizing flow) as the first learned filler: it models
  one frame's ambiguity, not a half-second of motion. It takes a small causal temporal convolution
  fused into `chain-kalman` as an uncertain measurement, so with no confident prior it is
  `chain-kalman`.
- Withdrawn: judging the call on rig rows, which would charge the writer's bend-side hold to the
  filler; judging against `raw`, which the plan forbids; a noise floor from the noiseless twin,
  which a real take does not have; a fixed error threshold in px or mm, which would not carry
  across spaces, cameras or subjects.
