# Composition plan, part one: what the measure asked for, and events on a clock

**Status:** Approved by the owner, 2026-11-12.
**Base:** `main` at `3e484893`.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ADR-174-a-cast-of-proxies-and-a-story.md`,
`plan/stage-plan.md` section 5a, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**The third rebuild's four costliest gaps close, and a piece a person can touch plays on a clock that can be
scrubbed.**

The measure (`showreel-c`, 190 k tokens) named them: a stage member cannot be a stroke, so `trace`, `streak` and
`spread` draw nothing and the worker wrote two moves to fake them; presence is one span, so six dust landings took six
members and six beats; a one-shot move shows its start pose outside its span, which only a beat of its own hid; and
`trail` throws on a slow spring until `rest` is found by trial. Apart from the measure, a piece with a `watch` member
plays on the event driver, which cannot seek, so the live page shows it no timeline.

Transitions between scenes and layout moves are part two, a plan of their own.

## 2. Decisions to record (C0, ADR-175)

- **A path is content, like text.** `actor({ path: "M0 0 C…" })` gives a member a geometry the motion depends on:
  its length, which `drawn` and `trace` read, and later the line a thing moves along. A renderer draws it its own
  way: the DOM stage as an SVG `path` inside the member, its `viewBox` the path's own box so the skin's width and
  height scale it; a 3D renderer as a line. A value's transform goes to the member, its stroke fields to the path.
  The skin decides stroke colour and width.
- **Presence is a list of stretches.** `on: ["landing1", "landing2", ["anticipate", "weight"]]` shows a member while
  any of them runs, and hides it otherwise. An entry is a beat, or a pair of beats meaning from the first's start to
  the second's end. A member without `on` takes its group's, and a member with none is always shown. A stretch that
  ends at the story's end holds to the last frame. `enters` and `leaves` go: one way to say presence. Every piece and
  fixture is moved by script in the same slice.
- **A one-shot move needs no fix of its own.** Its start pose outside its span is hidden by presence on its beat,
  which is now one word. The proof checks it.
- **`trail` finds its own `rest`.** When none is given, it takes the smallest that keeps the spring's memory under
  the cap; a `rest` given and too small still throws, naming the one it would take.
- **Events ride a clock.** The clock driver watches members as the event driver does and records each event at the
  clock's elapsed time. Seeking keeps the log, and the player hands the scene only events at or before the time, cues
  included, so a scene that reads `events` by hand never sees the future; scrubbing back undoes them and playing
  forward replays them; `replay` clears the log. The stage always plays on the clock driver. Saving a recorded log as
  the module's `cues` belongs to the live kit (roadmap stage 6), not here.
- **One reader of a stage module.** `readStageModule(value)` in `@gerak/stage` answers the module or why it is not
  one; the tools and the pieces app both call it.
- **`letters` splits by grapheme,** so an emoji or an accented letter is one item.

## 3. Slices

### C1. A path on stage

- **Invariant:** `actor({ path })` is recorded; `mountStage` draws a path member as an SVG whose `path` carries
  `data-cast`, and a value's `drawn`, `drawnFrom` and stroke fields reach it; `trace`, `streak` and `spread` draw on
  a stage member.
- **Owner:** `packages/stage/src/cast.ts`, `packages/dom/src/stage.ts`.
- **Test:** a path member renders as SVG with its length read; a `trace` value draws half of it at half progress.

### C2. Presence as a list of beats

- **Invariant:** `on` replaces `enters` and `leaves` in `@gerak/stage`, the DOM stage and the scene review; a
  member is shown exactly while one of its stretches runs; `castNames` refuses an unknown beat in `on`; `letters`
  splits by grapheme.
- **Owner:** `packages/stage/src/cast.ts`, `packages/dom/src/stage.ts` (presence only),
  `packages/tools/src/scene/review.ts`, every piece and fixture using presence, and the cast and skin bullets of
  "The stage module" in `docs/guide/agent-motion.md` (C1's path line included).
- **Test:** a member on two beats with a gap between is shown, hidden, shown; the review reports a change in the
  gap; `letters("é👍🏽")` has two items.

### C3. `trail` finds its rest

- **Invariant:** with no `rest`, `trailSettings` takes the smallest rest under the memory cap; a given rest that is
  too small throws naming the one it would take.
- **Owner:** `packages/moves/src/trail.ts`.
- **Test:** a slow spring with no `rest` plays; the same spring with `rest: 0.01` throws naming a number.

### C4. Events on a clock

- **Invariant:** `clockDriver` gains `watch(name, element)`, recording pointer events at its elapsed time; `play`
  hands the scene only events at or before the time; seek keeps the log; replay clears it. The live page's timeline
  plays, scrubs and loops a watched piece and marks its recorded events.
- **Owner:** `packages/dom/src/drivers.ts`, `packages/dom/src/events.ts`, `packages/player/src/player.ts`,
  `apps/pieces/src/live/`, `docs/guide/live.md`.
- **Test:** a hover at 1 s seen at 1.5 s, gone after seeking to 0.5 s, back on playing to 1.5 s, gone after replay;
  the live browser test scrubs a watched piece.

### C5. One reader, and the stage on the clock

- **Invariant:** `readStageModule` is the one check of a stage module's shape. After C4, `mountStage` always plays on
  the clock driver and watches through it; the conductor makes that change when combining wave 2.
- **Owner:** `packages/stage/src/module.ts`, `packages/tools/src/scene/scene.ts`, `apps/pieces/src/stage-module.ts`;
  the driver line in `packages/dom/src/stage.ts` on combining.
- **Test:** both callers refuse the same bad module with the same reason; a watched stage piece seeks.

### C6. Proof

- **Measure, alone:** the hand-made showreel rebuilt a fourth time, from the original only, as `showreel-d`. Passes
  when the trails and the arc are strokes, the dust is one member per kind, no move was written to fake a stroke,
  and its frames are at least as close to the original's as `showreel-c`'s.
- **Cold review:** a Sonnet agent reviews the diff and runs every command and snippet the guide's changed lines name.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | C0, C5's reader | the decisions and the one reader shape the rest |
| 2 | Opus, medium | C1, C2 | both change the DOM stage and the cast; one worker owns `stage.ts` |
| 2 | Sonnet, medium | C3, C4 | the trail, the clock's watch and the live page; no file shared with the other worker |
| 3 | Opus, medium, alone | C6 measure | its tokens are its own |
| 3 | Sonnet, medium | C6 cold review | |

One pull request, after wave 3.

Both wave 2 workers regenerate the reference for their own commits; the conductor regenerates once on combining.

## 5. Risks

- **Dropping `enters` and `leaves` breaks pieces made since the stage merged.** All are in this repository and move
  by one script; nothing is published yet.
- **Events on a clock change what a watched piece means on replay:** a person's hover is forgotten on replay, as it
  is today, but kept on a seek. The live page says so on the timeline.
- **The player hiding future events changes what a scene with module `cues` sees.** Built-in moves already ignore
  events after the time; a test samples every piece before and after to show nothing else moved.
- **An SVG inside a member** puts a second element under one name; the stage writes a value's stroke fields to the
  path and its transform to the member.

## 6. Done when

`showreel-d` passes, a watched piece scrubs on the live page, `npm run check` is green, and
`docs/SESSION-STATUS.md` says so.
