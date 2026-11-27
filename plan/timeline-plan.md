# Timeline: every beat runs on a timeline it plugs in

## Goal

An agent or a person writing a section names each beat and says what it runs on: wall time, the scroll position,
an element's way through the viewport, or a clock that starts when something happens. They then read one model
instead of three beat kinds, and a section that mixes all of them reads as plainly as one that uses one.

The code adds a `Timeline` port to `@gerak/core`, makes a beat a name plus the timeline it plugs in, builds
`clock`, `scroll`, `view`, `smooth` and `triggered` on that port, and lets the compositor hand a timeline to the
browser by what the timeline declares, not by what kind it is.

It runs after `plan/foundation-plan.md`, which settles who owns input: gerak reads the page's time and scroll
position; the app sends values and triggers through a declared contract.

Read `AGENTS.md` first. Every rule there applies.

## The model

- The driver is the page's heartbeat: it says what time it is and hands over the app's values and triggers and the scroll
  position, once per frame.
- A timeline turns that heartbeat into one beat's own time, progress 0 to 1 plus ms.
- A beat is a name and a timeline. A motion plays `.in(beat, ease)`.
- One player per scene combines every beat's timeline into each element's pose, frame by frame.

This is the model the browser uses: an animation runs on a `DocumentTimeline`, a `ScrollTimeline` or a
`ViewTimeline`.

## Invariants

Each has one owner and a test that fails before the change.

| # | Invariant | Owner | Test |
| --- | --- | --- | --- |
| T1 | Anything that takes a beat or a window takes one type, `Timeline`, read through its required methods only. | `core` | typecheck: `InWindow`, `MotionWindow` and the optional `active?` and `moving?` are gone; `packages/core/test/timeline.test.ts` |
| T2 | A new kind of timeline needs no change to `beat`, `scene`, `.in`, `.shows` or the compositor. | `core` | a test-only timeline (progress from an app value) drives a motion, shows an element and is reviewed headless |
| T3 | A trigger starts on any condition, not only on scroll. | `stage` | `triggered` on `reached`, `ended`, `is` and `on` each start, stay, reverse and replay as `back` says |
| T4 | The compositor hands a timeline to the browser only from its declared `native`, read with an exhaustive `switch`. | `dom` compositor | no `"scroll-beat"` or `"trigger-beat"` check remains in `stage` or `dom`; the compositor browser tests pass unchanged |
| T5 | A section mixing a clock beat, a scroll beat, a trigger beat and a loop gives the same poses as before the change. | `stage` | `gerak sample` on the cookie, yuzu and reel pieces gives the same poses as on the merged foundation branch |
| T7 | An element goes to the browser only when all its motions declare one `native`; otherwise the whole element stays on the main thread. | `dom` compositor | a compositor browser test: one element on a `scroll` and a `smooth` beat, and one on a `scroll` and a `clock` beat, hand nothing; one on two `scroll` beats over the same scroll range hands both |
| T8 | `clock(ms, { after })` takes only a clock beat; a clock after any other beat is `triggered(ended(beat), clock(ms))`. | `stage` | `packages/stage/test/timeline.types.test.ts`: `@ts-expect-error` on `after` a `scroll` beat |
| T9 | An element's motions layer in list order by core's field rules whatever timelines their beats run on. | `stage` | a scroll motion and a triggered motion both setting `y` give the scroll's `y` plus the pop's, and a `.take()` triggered motion replaces it from its start |
| T10 | On a timed clock, `scroll` and `view` timelines read the scroll position recorded as a value at times, so a reel can use them. | `stage` | a reel scene with a `scroll` beat renders the same frames in order and in shuffled order |

## Decisions

### 1. The `Timeline` port in core

```ts
// core: knows no boxes, elements or browser timelines
interface Timeline<I = unknown> {
  /** This timeline's local time at `time`: progress 0 to 1, plus elapsed ms where it has a clock. */
  at(time: Time, input: I): Time;
  /** Whether its time is past its start at `time`, so `.take()` and `.shows` count it. */
  active(time: Time, input: I): boolean;
  /** Whether its time keeps changing with no new input, so the page keeps asking for frames. */
  moving(time: Time, input: I): boolean;
  /** What it reads: nothing, the scroll position, or the app's input. */
  readonly reads: InputNeed;
  /** How many ms of past value changes it needs to compute its time now. */
  readonly lookback: number;
}

// stage: adds what the page and the compositor need
interface StageTimeline extends Timeline<StageInput> {
  /** A browser timeline it can be handed to, or undefined to stay on the main thread. */
  readonly native: NativeTimeline | undefined;
}
```

- Core owns `Timeline` and `InputNeed` (`scroll` and `values`), so `motion.in` takes any timeline without core
  importing `stage`.
- `StageInput` is `{ input, rest, viewport }`: the app's values and triggers and the scroll position, the measured
  boxes, and the viewport's width and height, which `RestReader` does not carry and `view` needs.
- A core `Span` is a `Timeline`, so core-only pieces using `span`, `chain`, `lanes` and `sequence` do not change.
  `stage` reads a `Span` as a `StageTimeline` whose `native` is `document`.
- `NativeTimeline` lives in `stage` and is a closed union: `document` (a clock), `scroll` (two scroll positions),
  `view` (an element and a range) and `triggered` (a condition's scroll position plus a clock). `dom` reads it.

### 1b. The live window comes from declared lookback

- Every timeline declares `lookback`: `clock` and `scroll` and `view` 0, `triggered(…, clock(ms))` `ms`, `smooth`
  its spring's settle time worked out from stiffness and damping.
- Core primitives that read past changes declare theirs from their settings: `springTo`, `easeTo`, `follow`,
  `trail` and `speedOf`.
- `compileScene` takes the largest lookback across the scene's beats and motions. The `liveClock` window is the
  largest across its mounts' scenes, never less than `settleMs`, which stays the floor for hand-written motion
  functions gerak cannot look inside. This replaces the fixed `max(settleMs, 4000)` from the foundation plan.
- Invariant T6, owner `compileScene`: a scene with a `triggered(…, clock(8000))` beat keeps the change that fired
  it for 8 s with no option set, and a `replace` 5 s in continues the sequence. The test fails on the foundation's
  fixed window.

### 2. A beat is a name and a timeline

- `beat(name, timeline)` is the one form. `beat(name, ms, place)`, `beat(name, ms, { when, back })` and
  `beat(name, { scroll })` are deleted, with `BeatPlace`, `TriggerPlace`, `ScrollBeatOptions`, `ScrollBeat`,
  `TriggerBeat`, `isScrollBeat` and `isInputBeat`.
- `.in`, `.shows`, `.take`, `stagger` and `bind` take a beat, so any timeline. `.shows([from, to])` over scroll
  points becomes `.shows` over a `scroll` beat.

### 3. The timelines gerak ships

| Timeline | Runs on | Replaces |
| --- | --- | --- |
| `clock(ms, { at? } \| { after, gap? })` | wall time | `beat(name, ms, place)` |
| `scroll(from, to)` | the scroll position between two scroll points | `beat(name, { scroll })` |
| `view(element, { range? })` | the element's way through the viewport, from its measured box and the scroll position | new |
| `smooth(timeline, spring?)` | any timeline's progress, trailed by a spring | `smooth` on scroll beats only |
| `triggered(condition, clock(ms), { back })` | a clock started by a condition | `beat(name, ms, { when, back })` |

- `view` reads measured boxes and the scroll position, so it needs no `IntersectionObserver` and renders the same
  headless.
- A timeline is a pure function of time, the scroll position and the app's input. It never reads outside state
  such as a video's `currentTime`; syncing to a video is a driver's job.
- `clock(ms, { after })` takes only a clock beat, since only a clock beat ends at a known ms. A clock that follows a
  `scroll`, `view` or `triggered` beat is `triggered(ended(beat), clock(ms))`, the one form for it (T8).
- On a timed clock the scroll position is a value recorded at times like any other, so `scroll` and `view`
  timelines run in a reel the same way they run on a page (T10).
- An element's motions layer in list order by core's field rules whatever timelines their beats run on, and a
  `.take()` motion replaces the fields it sets from its beat's start. Mixing timelines changes nothing about it (T9).

### 4. Conditions start triggers

- A condition says, at a time, whether it holds: `reached(point)` (scroll is past a point), `ended(beat)` (a
  beat's progress is 1), `is(contract, name, value, target?)` (an app value equals `value`, so
  `is(listen, "hovered", 1, "cta")` is a hover), and `on(contract, trigger, target?)`, which starts its clock again
  at every trigger of that name, for a motion that plays each time, like a cookie dropping on `jar-add`.
- `back` keeps its three meanings for when the condition stops holding: `"reverse"`, `"stay"`, `"replay"`.
- A condition declares what it reads, and its scroll position when it has one, so `triggered` can declare a
  `native` for the compositor.

### 5. The compositor reads `native`

- `handoff.ts` and `compositor.ts` choose a browser `ScrollTimeline`, a `ViewTimeline` or a triggered animation
  from `native`, in one exhaustive `switch`. The `Map<TriggerBeat, TriggerRun>` keys on the beat.
- A `smooth` timeline declares no `native` and stays on the main thread, as smooth scroll beats do today.
- The browser animates a whole element, so an element goes to the browser only when all its motions declare the
  same `native` (one clock, or one scroll range, or one view range). When they differ, or one declares none, the
  whole element stays on the main thread (T7).

### 6. Moving every piece

- A codemod rewrites the old `beat(...)` forms in the 48 files that use them (about 290 calls), then
  `npm run format` runs as its own commit.
- `stage.md` replaces its Beats section with the model above and the table of timelines. `core.md` documents
  `Timeline`. The reference pages are regenerated.
- ADR-210 records the port and the deletions.

## Measure

- T5's same-poses sample of cookie, yuzu and the reel pieces.
- One brief, the section that mixes a clock beat, a scroll beat, a trigger beat, a hover and a loop, built by a
  Claude Sonnet subagent on the merged foundation, on this plan's branch, and as plain HTML and JS. The branch must cost no
  more tokens than the foundation and beat the plain build.

## Slices

One pull request for the plan. Each slice gets its own cold review.

| Slice | Scope | Done when |
| --- | --- | --- |
| 1 | Tests first: T1–T10 | T5 passes on the merged foundation; T1–T4 and T6–T10 fail for the reasons above |
| 2 | Decisions 1, 1b and 2: the port, declared lookback, `Span` as a timeline, `beat(name, timeline)` beside the old forms | T1 and T6 green; existing tests green |
| 3 | Decisions 3–4: the timelines and conditions | T2, T3, T8, T9 and T10 green |
| 4 | Decision 5: the compositor reads `native` | T4 and T7 green; compositor browser tests green |
| 5 | Decision 6: codemod, old forms deleted, docs, ADR | T5 green; `check`, `test:browser` and `pack:check` green |
| 6 | Measure | Token counts recorded in the pull request |
