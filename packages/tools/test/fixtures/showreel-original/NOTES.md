# Timing Is Everything — 15 s reel

## Concept

The words do what they say: each principle of animation is set as one word, and that word performs its own meaning.
A coral dot, the animator's bouncing ball, sets off the piece, leaves, comes back to start SETTLE, and holds the coral world inside itself.
At the end everything collapses back into the dot, which leaps across the frame and lands as the full stop of "Timing is everything."

## Timeline (ms)

| ms | Beat |
|---|---|
| 0–450 | Camera starts pushed in (1.12). The dot springs into existence with overshoot. |
| 450–850 | Dot crouches (squash, anchored to the floor). |
| 850–1250 | Launch: one-frame snap from squash to stretch, dot shoots up and out; shockwave ring; coral trail draws on behind it and erases itself; camera eases back to 1.0. |
| 1000–1700 | ANTICIPATE rises letter by letter out of a mask under the baseline, 45 ms stagger, back-eased overshoot, slight lean. |
| 1400–2900 | Slow camera push-in (tension). |
| 2250–2900 | Letters crouch in a 35 ms wave, charging from paper to coral; they tremble at full crouch. |
| 2900–3550 | Release: each letter snaps to stretch and leaps off the top with motion blur, 38 ms wave; camera tilts up after them. |
| 3460–4795 | WEIGHT falls from above, one letter at a time (gravity ease-in, stretch and blur in the fall); the floor line draws out from the centre; each landing squashes, jiggles, tilts, kicks dust and shakes the camera, harder each time; the final T lands late and hardest and flashes the floor coral. |
| 5550–6260 | Exit: the word lifts 14 px (anticipation), then plunges through a collapsing floor, centre letters first; the camera dips after it. |
| 6150–7150 | OVERLAP: a coral bar sweeps in from the left carrying seven letters on strings; the letters lag, swing and overlap each other. |
| 7150–8700 | The pendulums settle at seven different rates (different string lengths). |
| 8700–9450 | The bar pulls back 55 px (anticipation) then whips off right; the letters trail behind it. |
| 9450–10230 | The dot falls back in, lands (ring, small camera shake), hops once, squashes. |
| 10230–11450 | SETTLE bursts out of the dot (ring); letters arc out, centre pair first, and spring-settle with visible damped overshoot in position, rotation and scale. |
| 10800–11300 | An underline draws outward from the dot in both directions. |
| 11400–11800 | The dot shrinks (anticipation), then a coral circle grows out of it and floods the frame; the dot, letters and underline flip to ink. |
| 12200–12920 | The underline retracts into the dot; the letters lean back (back-ease) and are sucked into the dot, outer pair first; the dot pulses as each one arrives. |
| 12700–13050 | The coral field shrinks back into the dot and becomes it: match cut back to a coral dot on ink. |
| 13050–13920 | "Timing is everything" rises word by word out of masks. The dot crouches (13050–13250), then flies a ballistic arc (13250–13900), stretched along its velocity and shrinking to period size, with a fading trail. |
| 13900–14400 | The dot lands as the full stop: ring, squash, one small hop, second squash, rest; the line ripples right to left from the impact; tiny camera bump. |
| 13050–15000 | Final slow camera push-in to 1.045. |
| 14250–14850 | Credit line rises and fades in. Last frame holds. |

## Techniques and where

- Staggered letters: ANTICIPATE rise, crouch and leap waves; WEIGHT drops; SETTLE burst (centre out) and collapse (outside in); final line by word.
- Mask reveal: ANTICIPATE (`clip-path` on the word cuts at the baseline), final line (each word in an `overflow:hidden` box).
- Anticipation: dot crouch before launch, before the arc and before the wipe; ANTICIPATE crouch; WEIGHT lift before the plunge; OVERLAP bar pulls back before whipping out; SETTLE letters back-ease away from the dot before being sucked in.
- Squash and stretch: the dot everywhere (bottom-anchored squash, stretch along the velocity vector in flight); ANTICIPATE letters; WEIGHT landings.
- Gravity: quadratic fall for WEIGHT letters and the returning dot; ballistic arc (time-linear quadratic Bézier) for the final leap.
- Weight and contact: escalating camera shake per WEIGHT landing, floor dip, dust particles, late heaviest final letter.
- Overlap and follow-through: OVERLAP pendulums, simulated once at load at a fixed 1 ms step (damped pendulum driven by the bar's acceleration, per-letter lag and string length), then sampled by the clock, so `seek` stays deterministic.
- Spring settle: closed-form damped springs for the dot's appearance and burst pop and for SETTLE position, rotation and scale; damped-sine ripples on the final line.
- Path draw-on: launch trail, SETTLE underline (draws outward from the dot and retracts into it), final arc trail (a moving window that chases the dot); all through `stroke-dasharray`/`stroke-dashoffset` with arc-length tables.
- Circle wipe and match cut: coral field grows from the dot and shrinks back into it; the dot swaps colour at that moment.
- Colour changes: ANTICIPATE charges paper to coral while crouching; WEIGHT floor flashes coral; SETTLE flips to ink on coral.
- Motion blur: CSS `blur()` scaled to speed on the leap, the falls, the burst and the collapse.
- Camera: one `#camera` element takes the push-in at the start, the tension push, the tilt after the leap, the shakes, the dip after the plunge, a slight roll as OVERLAP arrives, and the final push.
- Reel HUD: beat label and a seconds:frames timecode at 30 fps, driven by the same clock.

## Build notes

- One clock: `window.seek(ms)` sets every moving element's transform and opacity (plus colour, blur and dash where a beat uses them). `requestAnimationFrame` only feeds it the elapsed time; it clamps to 0–15000 and holds the last frame. A click replays.
- `check.cjs` runs the clock in Node against a fake document at every 25 ms and fails on any NaN or Infinity.

## Could not do within the constraints

- True directional motion blur: CSS `blur()` is isotropic, so fast moves blur in every direction.
- A real typeface: no external fonts, so it relies on system Arial Black and Georgia; letter widths and the period position are measured at load, but the look changes on a machine without those fonts.
- Sound: a reel this tightly timed wants hits on the WEIGHT landings and the final full stop.
- Per-letter shape morphing (the dot becoming a letter's counter) needs path morphing between glyph outlines, which needs the outlines, which needs a font file.
- The WEIGHT floor breaking into pieces as the word falls through it.
