# ADR-196: The browser plays motion it can work out ahead of time

**Status:** Accepted, 2026-11-20

## Context

After [ADR-195](./ADR-195-frames-for-a-cause.md), `mountPage` still ran every scroll-driven element on the main
thread, as GSAP and ScrollTrigger do, so both lag the scroll when the page's script is busy, and yuzu without
`smooth` cost 40 ms of script time against GSAP's 30 ms over 60 wheel steps. A gerak frame is a pure function of
time and events, so a motion that reads only its scroll beat's progress can be worked out for every scroll position
before the scroll happens; a GSAP tween or callback cannot. Chromium plays a Web Animation of `transform` and
`opacity` on its compositor thread, on a `ScrollTimeline` or the document timeline.

## Decision

1. **The mount chooses, the author does not.** On mount and on each remeasure, `mountPage` decides per element
   whether the browser plays it. There is no option, flag or mark in a scene; an internal switch turns it off for
   tests. `frame(stage, input)` stays the one answer to a pose, and headless tools never use the browser.
2. **The stage reports what drives each element.** `frame(stage, { drives })` fills, per element, a `Drive`:
   `scroll` when every motion plays in a scroll beat without `smooth`, `trigger` with the beat when every motion
   plays in one trigger beat, and `more` otherwise, including any read of the clock, `events`, `carry` or another
   element, a principle, a loop or a travel. A motion's window reads its events through a hidden key, so that read
   is not counted as the motion's own.
3. **Which elements the browser plays.** A `scroll` or `trigger` element with no `.show` and no `.ambient()`, whose
   poses set only `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY` and `opacity` with one fixed `anchor`; a trigger
   element also shows its start pose before the trigger fires. A clock note on a sample where nothing should move
   (any scroll sample, a trigger sample at its end) keeps the element in the engine.
4. **Keyframes are sampled from the scene.** The mount samples `frame()` on a grid (16 px of scroll, or 1/32 of a
   trigger's ms) and adds samples where straight lines miss the scene by more than 0.25 px, 0.1 degree, 0.001 scale or
   0.005 opacity, then keeps the fewest that stay within the tolerance. Every keyframe of a part names the same
   transform functions in `cssTransform`'s order, so the browser blends each field along a straight line.
5. **Scroll elements play on one `ScrollTimeline` over the whole scroll range.** A keyframe at scroll `y` sits at
   offset `y / (scrollHeight - clientHeight)`, `fill: "both"`; a spike matched `scrollY` to the pixel at two viewport
   sizes, so no `rangeStart` or `rangeEnd`. A remeasure cancels and rebuilds them.
6. **Trigger elements play on the document timeline, steered by their beat.** On each input frame the mount asks the
   beat its progress and `heading` (1 forward, -1 back, 0 at rest), and sets the animations' time and playback rate
   when the heading changes or the animation is more than two frames from the beat's progress. `reverse`, `stay` and `replay` stay the trigger fold's alone.
7. **The page tools keep their clock.** They hold only animations on the document timeline, since scripted scroll
   drives a scroll timeline, and tell the mount they hold the clock, so trigger elements stay in the engine there.

## Consequences

- yuzu without `smooth`, 60 wheel steps, script time: 16 ms against GSAP's 24 ms (32 ms with the browser path off);
  with the CPU slowed 6x, about 135 ms against 220 ms. With the committed `smooth` bottle, 58 ms against 24 ms.
- Read from Chromium's own compositor frames while wheeling through yuzu's story section, the progress bar sits
  within 0.7 px of the scroll position (mean 0.3 px), with or without a 40 ms task every 100 ms. Run on the main
  thread, it trails by about 22 px on average (GSAP's: about 35 px), and the task did not widen either gap.
- yuzu's story progress and steps play on the scroll timeline, and its feature and gallery cards on the document
  timeline; the bottle (`travel`, `smooth`) and the aura (`bind`, springs) stay in the engine.
- Every piece samples the same as before; headless frames take no part in this.
- A browser without `ScrollTimeline`, or a mount with its own `scrollTarget`, runs every element in the engine.

- A motion that throws during sampling leaves every element of that hand-off in the engine; a scroll range longer
  than the sample budget hands nothing to the browser.

## Rejected

- An option or scene mark to opt in: the mount can tell from the scene, and two ways to say it would need two
  owners.
- Re-implementing `reverse`, `stay` and `replay` in the mount: a second owner of what a trigger does when scroll
  crosses back.
- `rangeStart` and `rangeEnd` per beat: one timeline over the whole range matched exactly and needs no view ranges.
- Handing trigger animations to the page tools' hold: their start is the trigger's, not the time the tools first
  saw them.
