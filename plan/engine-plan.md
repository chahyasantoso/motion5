# Engine

## Goal

People and agents who put a gerak scene on a landing page get a page that costs no more main-thread time than the
same page written with GSAP and ScrollTrigger, and nothing at all while nothing moves, without writing anything
differently. The page mount runs the scene only when an input arrived or something is moving by itself, and then
only the elements that can have changed.

Status: approved 2026-11-20. Two slices, one pull request after the last. `plan/compositor-plan.md` follows it.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- A frame is a pure function of time and events (`packages/core/docs/core.md`); `frame(stage, input)` runs the whole
  scene, and `mountPage` (`packages/dom/src/page.ts`) runs it on every animation frame until `settleMs` after the
  last input.
- Measured on yuzu against the GSAP proof, 60 wheel steps in Chromium (script time): a page with no animation script
  4.3 ms, GSAP 29 ms, gerak 80 ms, and gerak mounted with no motions 24 ms. Of 326 frames, 60 had new input and the
  scene ran on all 326. Skipping the scene on frames with no input gave 26 to 28 ms, level with GSAP.
- Measured and dropped: a per-element memo, a per-step memo and readable keyframes with a fast path. Each gave the
  same poses and no gain in the browser, because deciding that a motion is unchanged costs as much as running it.

## Decisions

### 1. A frame runs for a cause

- An input frame follows a scroll, pointer or element event since the last frame: the whole scene runs, as today.
- A clock frame has no new input, but some element can move with time alone: only those elements run; every other
  element keeps its last pose and is not written.
- With neither, the mount requests no frame.
- `frame(stage, input)` stays the one answer to a pose at a time and input; headless tools never use clock frames.

### 2. What moves with time alone is found when an element runs

- An element moves with time alone while one of its motions plays in a clock beat that has not ended, a trigger beat
  whose clock part is running, a `smooth` scroll beat whose spring has not settled, or a loop; or when a motion read
  the scene's own clock, `carry` or another element, or has no window.
- The scene learns this each time the element runs, by tracking what its motions read. Nothing is declared by the
  author.
- A motion must answer the same to the same reads; `core.md` states it with the purity rule.

### 3. The loop costs little per frame

- The boxes object a frame passes is built on remeasure, not per frame.
- The player checks only a growing log's last event, and announces cues only when someone listens.
- The CSS writer keeps one record per element.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| A. Frames for a cause | 1, 2 | every piece gives the same poses with clock frames on and off; yuzu at or under 1.2x GSAP's script time, unthrottled and with the CPU slowed 6x |
| B. A lean loop | 3 | the no-motion page within 2x the blank page's script time |

## Tests first, per slice

- A: an element in a finished beat does not run on a clock frame (a counting motion); a clock beat in progress, a
  running trigger, a settling spring, a loop and a motion reading the clock each still run on clock frames; a page
  with nothing moving requests no frame; the on-and-off comparison over every piece.
- B: frame cost stays flat over a long log; a log's growth is checked at its end only.

## Measure

- Baseline before Slice A, outside the repository: samples of every piece, and yuzu with scripted scroll.
- After each slice, compare by value (1e-9). No piece may change.
- Speed, in Chromium, three runs each: yuzu against the GSAP proof (`gsap-proof/` from PR 608) for 60 wheel steps,
  unthrottled and with the CPU slowed 6x; the no-motion yuzu; and a page with no animation script.

## Docs and record

- `packages/dom/docs/page.md`: when the mount runs a frame, and that nothing runs while nothing moves.
- `packages/core/docs/core.md`: a motion answers the same to the same reads.
- A new ADR records Decisions 1 to 3 and the measured alternatives; then `npm run adr-index:write`.
- Rewrite `docs/SESSION-STATUS.md`.

## Execution

1. Baseline as above, before any code.
2. Slice A test first, then Slice B. `npm run check` is green before the pull request.
3. One cold review by an agent that has not read this plan.
4. One pull request after Slice B, reporting `npm run check`, `npm run pack:check`, the sample comparison and the
   speed table before and after.

## Working notes for any harness

- Windows, Git Bash. Run git as plain commands.
- Browser tests can time out under full-suite load. Rerun a failing one alone before treating it as a failure.
- Builder subagents run on Sonnet 5.5 at medium effort or below.

## Not in this plan

- Running elements off the main thread: `plan/compositor-plan.md`.
- Running only the elements a given input reaches.
- Changing how a scene is written.
