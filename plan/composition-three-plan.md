# Composition plan, part three: what the fifth rebuild still paid for

**Status:** Approved by the owner, 2026-11-13.
**Base:** `main` at `99c04055`, the merge of pull request 586.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ADR-176-strokes-from-the-layout-and-a-library-that-grows.md`,
`plan/composition-two-plan.md` section 3a, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**The next rebuild spends its tokens on motion, not on working round the tools.**

Three rebuilds in a row cost 190 k, 242 k and 252 k: quality rose each time, cost did not fall. `showreel-e` named
where it went. Two measures each wrote their own PNG decoder and diff, because `motion:frames` cannot compare runs. A
draw-on and its retract cannot combine, since `drawn` replaces, and an empty stroke still paints a dot under round
caps, so every stroke needs an exact beat of its own. A group's `still` passes to children that move. The review
reports a jump while a member is hidden by `on`. Text cannot change over time, so the timecode was left out. And a
path cannot read another stroke.

Transitions between scenes and layout moves are part four, with a measure of their own: a site's route change, not
the showreel.

## 2. Decisions to record (E0, ADR-177)

- **Frames compare in the tools.** `motion:frames --compare <dir>` prints, for each frame both runs have, the mean
  difference out of 255 and the share of pixels off by more than 32, decoded with Node's own `zlib`, no new
  dependency; frames of different sizes are named, not compared.
- **Strokes combine.** `drawn` combines by multiplying and `drawnFrom` by adding, so a draw-on and its retract sum
  into one value; both fields' rests are their neutral elements already.
- **An empty stroke paints nothing.** A value whose `drawn` is at or below its `drawnFrom` sets the path's
  `visibility` to `hidden`, and any other value clears it, never `visible`, so a member hidden by `on` hides its
  path too.
- **`still` is the member's own.** A group marked `still` says its own value never moves, and the review holds it
  to that; it says nothing of its members, each of which states its own.
- **The review reads presence.** A change between two samples where the member is hidden at either one is not a
  jump: a value that moves while hidden, or snaps as the member appears, is presence, not motion.
- **Text may follow time.** `actor({ text: (time) => string })` is evaluated by the renderer on each frame, as a
  readout, not a value; a `letters` or `words` list keeps fixed text, since its length is the scene's shape.
- **A path may read another stroke.** The stage draws strokes in passes: a path that reads a stroke not drawn yet
  waits for a later pass; a pass that draws nothing new leaves a loop, which the stage reports and the review
  refuses, naming the strokes. No graph is built ahead of time.

## 3. Slices

### E1. Frames compare

- **Invariant:** `motion:frames --compare <dir>` prints one line per shared frame with mean and share over 32, and
  names frames only one side has.
- **Owner:** `packages/tools/src/page/frames.ts` and a PNG reader beside it.
- **Test:** two identical frames compare at 0 and 0; a frame with one changed pixel compares at the expected mean.

### E2. Strokes combine and hide when empty

- **Invariant:** `combine` multiplies `drawn` and adds `drawnFrom`; `applyValue` hides a path whose shown length is
  zero and shows it again otherwise.
- **Owner:** `VALUE_FIELDS` in `packages/moves/src/pose.ts`, `packages/dom/src/render.ts`.
- **Test:** a draw-on combined with its reversed copy draws, holds and retracts; a zero-length stroke is hidden; every
  piece samples and frames the same, or the difference is the fix.

### E3. Presence the review reads, and `still` per member

- **Invariant:** `castNames` no longer passes `still` down; the review reports a still group that moves; the scene
  review skips jumps while a member is hidden.
- **Owner:** `packages/stage/src/cast.ts`, `packages/tools/src/scene/review.ts`.
- **Test:** a still group's moving child is not reported unused and needs no `still: false`; a jump inside a hidden
  stretch is not reported, one while shown is.

### E4. Text over time

- **Invariant:** an actor's `text` may be a function of time; the DOM stage writes it each frame when it changed;
  `readStageModule` accepts it; the tools call it at each sampled time only to check it answers a string.
- **Owner:** `packages/stage/src/cast.ts`, `module.ts`, `packages/dom/src/stage.ts`, `packages/tools/src/scene/`.
- **Test:** a timecode actor reads `00:01` at 1 s and `00:02` at 2 s in the stage; the review reports a text
  function that answers something other than a string.

### E5. Strokes read strokes

- **Invariant:** a path may read another stroke's box; the stage draws strokes in dependency order and refuses a
  loop with both names; the review reports the loop.
- **Owner:** `packages/dom/src/stage.ts`, `packages/tools/src/scene/review.ts`.
- **Test:** a connector from one line's end to a word draws after the line; two paths reading each other are
  refused, naming both.

### E6. Proof

- **Measure, alone, fresh:** the showreel rebuilt a sixth time as `showreel-f`. Passes when it writes no PNG code of
  its own, its strokes use no beat only to hide an empty stroke, the timecode is back, and its frames are as close as
  `showreel-e`'s. Its token count is recorded beside the earlier rows; one run is too noisy to pass or fail on it.
- **Cold review:** a Sonnet agent reviews the diff and runs what it claims.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | E0, E2, E3 | the decisions and three small changes the rest build on |
| 2 | Opus, medium | E4, E5 | both change the DOM stage; one worker owns `stage.ts` |
| 2 | Sonnet, medium | E1 | tools only |
| 3 | Opus, medium, fresh | E6 measure | |
| 3 | Sonnet, medium | E6 cold review | |

Both wave 2 workers regenerate the reference for their own commits; the conductor regenerates once on combining.
One pull request, after wave 3.

## 5. Risks

- **Changing how `drawn` combines** changes any piece that combined two strokes on one member. Samples before and
  after show which; each difference is read, not waved through.
- **A text function runs every frame** in the renderer; the stage writes the DOM only when the string changed.
- **Ordering strokes** adds a graph to the stage; a loop is refused, never solved by guessing.

## 6. Done when

`showreel-f` passes, its tokens are recorded against `showreel-e`'s, `npm run check` is green, and
`docs/SESSION-STATUS.md` says so.
