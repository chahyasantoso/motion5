# Engine

## Goal

People and agents who put a gerak scene on a landing page get a page that costs no more main-thread time than the
same page written with GSAP and ScrollTrigger, without writing anything differently. The code works out once what
does not change between frames, works out each beat once per frame, and writes each node only what changed.

Status: proposed 2026-11-20. Starts after PR 609 (`feat/page-perf`) merges. Two slices, one pull request after the
last. `plan/compositor-plan.md` builds on it.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- A frame is a pure function of time and events (`packages/core/docs/core.md`); `frame(stage, input)` runs the whole
  scene, and `mountPage` (`packages/dom/src/page.ts`) runs it once per animation frame and writes every node.
- Per frame the scene runs every element's motion stack as a chain of closures, making a context, a `Time` and a
  pose for each motion and part. Each motion works out its own window: a scroll beat reads `scroll.y` through the
  events and resolves its section edges through the measured boxes on every call, so a beat used by three cards is
  worked out three times, or six with `.take()`.
- Writing goes through the player's per-target subscriptions, a visibility check per node, a pose comparison and a
  per-property text cache (`packages/dom/src/render.ts`).
- Measured on the yuzu proof, 60 wheel steps in Chromium: gerak about 80 ms of script time against GSAP's 29 ms, and
  about 570 ms against 230 ms with the CPU slowed 6x. Garbage collection is 8 to 14 ms of each profile. Frames hold
  at 144 Hz in both.
- A memo that skips an element whose reads did not change was built, proved equal to running every element, and
  measured with no gain, because deciding that an element is unchanged cost as much as running it. It is parked on
  the local branch `feat/page-memo` (commit `b28ee3f6`).

## Decisions

### 1. Each beat is worked out once per frame

- A scroll point is resolved to a number when the page is measured, not through the measured boxes on each call.
- A scene frame reads its input states once (`scroll.y`, `pointer.x`, `pointer.y`) and works out each beat's
  window time once; every motion and part that plays in that beat reads the same `Time`.
- Trigger beats keep their incremental fold; a frame folds each once.
- `frame(stage, input)` gives the same targets as before for every input; nothing an author writes changes.

### 2. A frame allocates nothing it does not hand to an author's code

- The scene keeps one pose slot per element and part, and layers combine into it in place; `combine`, `replacing` and
  `joinTravel` work on slots, not new records.
- A motion's context is one object per element and part, refilled each frame. A motion must not keep its context
  past its call; `core.md` states it with the purity rule.
- What a motion returns is still a new pose; that cost stays the author's.

### 3. Each node gets a writer made for it

- On mount, each node gets a writer for the fields its element can set, found from its motions' first frames and
  widened when a new field appears. A transform-only element writes only `transform`.
- A writer keeps the last number of each field and builds the transform text only when a transform field changed.
- `mountPage` writes every target in one pass per frame, not through a subscription per target; visibility is
  written only when it changes. `mountPage().player` keeps its API.
- `applyValue` stays the one owner of pose to CSS; the writer is built from it, so `mountStage` and `mountPage`
  write alike.

### 4. The memo returns only if it pays

- With beats worked out once per frame, asking whether an element is unchanged is comparing a few numbers. The
  parked memo is rebased on Decisions 1 to 3 and measured. It lands only if it saves at least 25% per frame on the
  300-card page below, and costs no piece more than 5%.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| A. Frame plan | 1, 2, 3 | every piece samples the same; yuzu at or under 1.3x GSAP's script time with the CPU slowed 6x |
| B. Memo, measured | 4 | adopted with its numbers, or dropped with them |

## Tests first, per slice

- A: a beat shared by three elements is worked out once per frame (a counting window); a scroll point is resolved
  once per measure; a steady scroll frame allocates no pose slot or context (counted through the slot pool); a node
  whose element only moves writes only `transform`; a node whose visibility does not change is not written.
- B: the memo-on and memo-off comparison over every piece, and the six dependency tests, from `feat/page-memo`.

## Measure

- Baseline before Slice A, kept outside the repository: `npx gerak sample <file> --at 0,250,500,750,1000,1500,2000,3000,4000,6000,8000,12000`
  for every `apps/pieces/*/src/*.ts` outside `moves/`, and the yuzu piece with scripted scroll
  (`--events scroll=px@ms,...`).
- After each slice, compare by value (keys in any order, 1e-9). No piece may change.
- Speed, in Chromium on the same machine, each run three times: yuzu against the GSAP proof
  (`gsap-proof/` from PR 608) for 60 wheel steps, unthrottled and with the CPU slowed 6x; and headless microseconds
  per frame for a synthetic page of 20, 100 and 300 trigger-revealed cards with one scroll-driven element.

## Docs and record

- `packages/core/docs/core.md`: a motion keeps nothing from its context past its call.
- `packages/dom/docs/page.md` and `packages/dom/docs/drawing.md`: a node writes only the fields its element sets.
- A new ADR records Decisions 1 to 4 with the next free number; then `npm run adr-index:write`.
- Rewrite `docs/SESSION-STATUS.md`, including the Open line on the cost against GSAP.

## Execution

1. Baseline and speed measures as above, before any code.
2. Slice A test first, then Slice B. `npm run check` is green before the pull request.
3. One cold review by an agent that has not read this plan.
4. One pull request after Slice B, reporting `npm run check`, `npm run pack:check`, the sample comparison, the speed
   table before and after, and the memo's verdict.

## Working notes for any harness

- Windows, Git Bash. Run git as plain commands.
- Browser tests (`*-browser.test.ts`) can time out under full-suite load. Rerun a failing one alone with
  `npx vitest run <file>` before treating it as a failure; never weaken it.
- Timing tests compare ratios of minimums over repeated windows, with the limit set between measured fixed and
  unfixed ratios.
- Builder subagents run on Sonnet 5.5 at medium effort or below.

## Not in this plan

- Running motions off the main thread: `plan/compositor-plan.md`.
- Changing how a scene is written.
- Stopping frames early once nothing moves.
