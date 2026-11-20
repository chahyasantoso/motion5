# Compositor

## Goal

People and agents who put a gerak scene on a landing page get scroll motion that keeps up with the scroll even when
the page's main thread is busy, and costs less main-thread time than GSAP and ScrollTrigger, without writing anything
differently. The page mount hands the browser, as Web Animations, every element whose motion depends only on scroll,
and keeps the rest in the engine.

Status: approved 2026-11-20. Starts after PR 612 (`feat/engine`, the engine plan) merges; branch from `main`. Three
slices, one pull request after the last.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- A frame is a pure function of time and events, so a motion that reads only its scroll beat's progress can be
  worked out for any scroll position ahead of time. GSAP's tweens and callbacks cannot be.
- `mountPage` runs frames for a cause (ADR-195): the whole scene after an input, only the elements that move with
  time alone on other frames, and no frame at rest. Everything still runs on the main thread, as GSAP does; both lag
  the scroll when the main thread is busy.
- yuzu against the GSAP proof, 60 wheel steps, script time: about 40 ms against 30 ms without `smooth`, and about
  75 ms with the committed `smooth` bottle. The scroll-driven feature cards, story steps and gallery are what this
  plan moves; the bottle (`travel`, `smooth`) and the glow (`bind`, springs) stay in the engine.
- Chromium runs a Web Animation on a `ScrollTimeline` on its compositor thread when it animates only `transform` and
  `opacity`. Other engines without `ScrollTimeline` run the engine for every element.
- The page tools pause each CSS and Web Animations animation and set it to their clock (ADR-158); an animation on a
  scroll timeline follows the scripted scroll instead.
- `frame(stage, { only, moves })` runs a set of elements and reports which move with time alone; a motion's context
  notes a read of the clock, `carry` or another element (`packages/stage/src/author/scene-builder.ts`, `watched`).
  It does not yet note a direct read of `events` or of the measured boxes.

## Decisions

### 1. The mount chooses, the author does not

- On mount and on each remeasure, `mountPage` decides per element whether the browser drives it. There is no option,
  flag or mark in a scene. An internal switch turns it off for tests only.
- `frame(stage, input)` stays the one answer to what a pose is at a time and input; headless tools never use the
  browser path.

### 2. Which elements the browser drives

- An element qualifies when every motion on it plays in a scroll beat without `smooth`, its motions read nothing but
  their window time and the measured boxes, and it sets only `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY` and
  `opacity`. Slice A extends the watched context to note a direct read of `events`, which disqualifies.
- An element with any clock beat, `bind`, `travel`, `read`, `carry`, principle, spring or pointer read stays in the
  engine. An element that fails the read check on any sample stays in the engine.
- An element that triggers a clock beat (`beat(name, ms, { when })`) qualifies when its motions play only in trigger
  beats and meet the rest of the rule: the mount starts a Web Animation on the document timeline when scroll passes
  the point, and `back` maps to `reverse()`, nothing, or a reset and replay.

### 3. Keyframes are sampled from the scene

- The mount samples the element's pose from the scene across the beat, and adds samples where straight lines between
  them miss the scene by more than 0.25 px, 0.1 degree or 0.005 opacity. Keyframes are placed by scroll position and
  rebuilt on each remeasure.
- One `ScrollTimeline` on the document's scroller spans the whole scroll range: a keyframe at scroll `y` sits at
  offset `y / (scrollHeight - clientHeight)`, with `fill: "both"`. The spike matched `scrollY` to the pixel at two
  viewport sizes; no `rangeStart` or `rangeEnd`.
- Every keyframe of a part names the same transform functions, in `cssTransform`'s order, so the browser blends
  each field along a straight line; scale fields keep within 0.001.

### 4. The page tools keep their clock

- The page tools leave an animation on a scroll timeline on that timeline, since scripted scroll drives it; ADR-158
  gains that line.
- While the page tools hold the clock, the mount hands nothing to the browser: a scroll timeline catches up only when
  a frame is drawn, and a read after a scripted scroll does not wait for one.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| A. Scroll beats | 1, 2 (scroll), 3 | qualifying yuzu elements run as scroll-timeline animations and match the engine within the tolerances at 50 scroll positions and two viewport sizes |
| B. Triggers | 2 (triggers) | trigger-revealed cards run as document-timeline animations with every `back` value matching the engine |
| C. Tools and proof | 4, measure | page tools frame such a page as the engine would; the measure below is reported |

## Tests first, per slice

- A: an element whose motions read only scroll-beat time is handed to the browser and one reading the clock is not;
  the sampled keyframes stay within tolerance of `frame()`; a remeasure rebuilds them; with no `ScrollTimeline` every
  element stays in the engine.
- B: crossing a trigger point starts the animation once; `reverse`, `stay` and `replay` each match the engine's
  progress after crossing back.
- C: `gerak frames` of a page with a scroll-timeline animation shows it at the scripted scroll position.

## Measure

- Script time with `performance/page-vs-gsap.mjs` (`--gerak` the served yuzu page, `--gsap` the GSAP proof folder,
  `--throttle 6` for the slowed CPU), three runs each, yuzu with and without `smooth`: the target is less than GSAP's
  without `smooth`.
- Keeping up under load: with a 40 ms main-thread task every 100 ms, the cards' and story steps' positions against
  the scroll position, sampled by the compositor's own frames in a Chromium trace, for gerak and for GSAP.
- Sample comparison of every piece as in the engine plan; no piece may change.

## Docs and record

- `packages/dom/docs/page.md`: which elements the browser drives, the tolerances, and that `frame()` stays the
  answer.
- A new ADR records Decisions 1 to 4 with the next free number; ADR-158 gains its line; then
  `npm run adr-index:write`.
- Rewrite `docs/SESSION-STATUS.md`.

## Execution

1. Slice A starts with the range spike in Chromium, then tests first.
2. Slices A to C in order. `npm run check` is green before the pull request.
3. One cold review by an agent that has not read this plan.
4. One pull request after Slice C, reporting `npm run check`, `npm run pack:check`, the sample comparison and the
   measure.

## Working notes for any harness

- Windows, Git Bash. Run git as plain commands.
- Serve yuzu with `npx vite --port 5199` in `apps/pieces`; the page is `http://localhost:5199/yuzu/yuzu.html`.
- The GSAP proof is not in the repository: it is the folder
  `C:/Users/chahy/.gemini/antigravity/brain/9bcf47ab-cb72-4047-aea8-583fce0b9de8/scratch/gsap-proof` on the owner's
  machine. Set `GERAK_CHROMIUM` to a Chromium executable when Playwright's own browser is missing.
- Browser tests run in Chromium only. Rerun a timed-out one alone before treating it as a failure; never weaken it.
- Builder and review subagents run on Sonnet 5.5 at medium effort or below, never a frontier model.

## Not in this plan

- Pointer, springs and `smooth` on the compositor.
- Fields beyond transform and opacity.
- Stage pieces in a shadow-DOM frame (`mountStage`).
