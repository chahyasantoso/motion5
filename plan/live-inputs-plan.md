# Live inputs plan: driving a rig from numbers

**Status:** Approved by the owner, 2026-11-13.
**Base:** `main` at `42a22c4a`, the merge of pull request 590.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` section 5 (stage 7), `docs/ADR-175`,
`docs/ADR-178` to `docs/ADR-180`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A rigged character follows numbers that arrive while it plays, such as a mouth opening as a person talks and an
eye closing as they blink, and a recorded session of those numbers replays, scrubs and renders exactly.**

Tracking stays outside: a face tracker, a microphone's level or a slider gives numbers; the base takes them. Today an
event carries a name, a time, a target and a point, never a value, and only the live event driver can log one by
hand, not the stage. `follow` springs towards a goal fixed per event name, so it cannot follow a stream. And a path
member's outline is fixed, so a mouth cannot change shape.

## 2. Decisions to record (I0, ADR-181)

- **A sample is an event with a value.** `MotionEvent` gains `value?: number`. `mouthOpen` 0.6 at 1234 ms is
  `{ name: "mouthOpen", at: 1234, value: 0.6 }`, logged like a click, so a scene stays a pure function of time and
  events, and a session replays, scrubs and renders like any other.
- **The stage takes samples by hand.** `MountedStage.send(name, value, target?)` logs one at the clock's time. A
  sample keeps the clock running past the story's end, as a watched member does, until a settle time after the last
  one. A piece driven live does not loop its story, since a loop clears the log each pass: an idle motion such as
  breathing loops inside the scene while the clock runs on.
- **The tools take samples too.** The event text of `motion:sample` and `motion:review` gains `name=0.6@1234` (and
  `name:target=0.6@1234`), so a sample is tested by hand like a click. The review reports a cue past the story's end,
  which no clock would reach.
- **`follow` follows a stream.** An entry of its `on` may be `"value"`: the event's own value is the goal. The same
  spring smooths a jittery tracker and turns back with no jump; there is no second spring helper. A stream at 30 a
  second never rests between samples, so each follow keeps the spring's state at the last time it answered, and a
  later call over the same log, longer or not, goes on from there; any other call starts again. Its answers are what
  a run from the start gives, so it stays pure from outside.
- **A recorded session is `cues`.** `motion:record` is not needed: a session is a JSON list of events a piece imports
  as its `cues`, and the stage already plays a module's cues. `stage.events()` hands back what was logged, ready to
  save.
- **A path member may morph.** An actor gives `shapes`, a list of outlines after its `path`; the value field `shape`
  blends them: 0 is `path`, 1 is `shapes[0]`, 1.5 halfway between `shapes[0]` and `shapes[1]`. Outlines are matched
  once, when the cast is read: a closed outline is turned to start at the point nearest the first outline's start and
  to run the same way round, then each pair is split at its longest cubics until both have as many, so the geometry
  of each is exact. Outlines whose counts of separate pieces differ are refused, naming the member. A member's box
  stays its `path`'s, and the review reports `shape` given to a member with no `shapes`.
- **Imported art goes into a bigger scene.** `motion:import-svg <file> --into <piece> --at x,y [--scale s] --prefix
  <word>` adds the drawing's parts to an existing piece, placed and scaled in its frame, every name prefixed in camel
  case (`penguinBody`) so two imports never collide, and its defs' ids prefixed too. Pivots and joints are then set in
  the piece's own frame px. It stays one stage module; there is no composition layer.
- **Four findings from the artwork review are fixed.** A path member's box is never thinner than 1 px, so a flat line
  draws where its SVG draws it. A `use` of a `symbol` is imported through the symbol's viewBox as ordinary parts, and
  `motion:compare` adds an `outside` entry for differences no member's box covers. Each part's gradients are written
  inside its own `<svg>` with ids unique to the part, so no `url(#id)` crosses a shadow root in any engine. A browser
  test holds a pose's `anchor` over a `pivot`.
- **Switching needs nothing new.** Mouth parts drawn apart switch with `opacity` from the scene; a morph is for the
  steps switching makes too visible.

## 3. Slices

### I1. Values on events, `send`, and `follow` on a stream

- **Invariant:** `isMotionEvent` accepts `value`; `send` logs it at the clock's time and keeps the clock running past
  the end until it settles; `follow` with `on: { mouthOpen: "value" }` springs to each sample, going on from its last
  answer over the same log; the event text reads `name=0.6@1234`; the review reports a cue past the story's end.
- **Owner:** `packages/moves/src/events.ts` (`MotionEvent`, `follow`), `packages/dom/src/drivers.ts` and `stage.ts`
  (`send`, `events`), `packages/tools/src/scene/` (event text, the review).
- **Test:** a stream of samples followed; seeking backwards answers what playing forwards did; frame after frame over
  10 000 samples costs about what the last 100 do, and gives what one call from the start gives; `send` past the
  story's end changes the scene's next frame.

### I2. Morphing outlines

- **Invariant:** as decided above; `shape` is a value field that replaces and is smooth; the DOM writes the blended
  outline each frame it changes.
- **Owner:** `packages/stage/src/strokes.ts` (matching, read by `readStageModule`), `packages/dom/src/render.ts` and
  `stage.ts` (the blend), `VALUE_FIELDS` (`shape`).
- **Test:** two outlines of three and five cubics match to five each and draw the same shapes as before; a circle
  started at its top against one started at its bottom, drawn the other way round, blends without twisting; `shape`
  0.5 is the cubic-wise midpoint; a two-piece outline against a one-piece outline is refused by name; the review
  reports `shape` on a member with no `shapes`.

### I3. Guide

- A section of `docs/guide/agent-motion.md`, "Driving a rig": samples as events, `follow` on `"value"`, `send` for a
  live source, a recording as `cues` inside the story's length, no story loop for a live piece, switching mouth parts
  and morphing them, and what to check.
- "Rigging artwork" gains `--into`, `--at`, `--scale` and `--prefix`: importing a drawing into a bigger scene, with
  room round it, instead of as a piece of its own.
- "Rigging artwork" gains its first step for a character with no SVG: draw it as an SVG file in
  `apps/pieces/references/`, each part its own shape with a clear id, then import it, so a drawn character and a
  supplied one take one path.

### I5. The artwork review's findings

- **Invariant:** as decided above.
- **Owner:** `packages/dom/src/stage.ts` (the 1 px floor, per-part defs), `packages/tools/src/scene/svg-extract.ts`
  and `import-svg.ts` (`symbol`), `packages/tools/src/page/compare.ts` (`outside`).
- **Test:** a 1 px horizontal line compares near 0 against its SVG; a `use` of a symbol becomes parts that compare
  near 0; a part dropped from a piece shows in `outside`; two parts filled by one gradient each carry their own copy
  and draw as before; the `compare` fixture runs in Firefox and WebKit where Playwright has them, and skips otherwise;
  a part with an off-centre pivot squashed with `anchor: "bottom"` keeps its bottom edge, and turns about the pivot
  without one.

### I6. Importing into a scene

- **Invariant:** as decided above; importing the penguin twice into one piece under two prefixes gives two sets of
  parts and defs that never collide, each drawn where `--at` and `--scale` put it.
- **Owner:** `packages/tools/src/scene/import-svg.ts` and its bin.
- **Test:** a fixture imported `--into` a piece at an offset and a scale: its points move and scale as asked, its
  stroke widths scale, and the piece's existing members and skin are kept; a clash of names is refused, naming it.

### I4. Proof

- **A recording:** a script writes `apps/pieces/references/talk.json`, eight seconds of samples at 30 a second:
  `mouthOpen` from a speech-like envelope and `blink` 0 to 1 and back every three to five seconds, fixed by a seed.
  It is made, not tracked, and says so.
- **Measure, alone, fresh:** an Opus worker at medium effort makes `penguin-scene`, a 1280 by 720 scene: the penguin,
  imported `--into` it with room around it, stands on an ice floe in the sea while snow falls, and talks to the
  viewer from `talk.json`, its beak and eyelids drawn as parts in its style and driven through `follow`, switching or
  morphing the beak as the brief asks. It draws the floe and at least one other element as SVGs of its own and
  imports them the same way. It passes when the scene reads samples only through `follow`, no part is cut by the
  frame, scrubbing to any moment gives the frame playing reached, `motion:compare` holds each import to its SVG at
  rest, and the review is clean.
- **By hand, for the owner:** a page `talk.html?piece=penguin-talk` feeds `send` from the microphone's level, so the
  beak moves as a person talks. It needs a person and a microphone; nothing tests it.
- **Cold review:** a Sonnet agent reviews the diff and runs what it claims.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | I0, I1 | the decisions and the event change every slice reads |
| 2 | Sonnet, medium | I2, and I5's stage parts (1 px floor, per-part defs, the anchor test) | one worker owns `stage.ts` and `render.ts` |
| 2 | Sonnet, medium | I5's tools parts (`symbol`, `outside`) | import and compare |
| 2 | Sonnet, medium | I4 recording and the microphone page | a script and one page |
| 3 | Sonnet, medium | I6 | the import again, after wave 2, so one worker owns `import-svg.ts` at a time |
| 4 | Conductor | I3 | what the measure reads |
| 4 | Opus, medium, fresh | I4 measure | |
| 4 | Sonnet, medium | cold review | |

One pull request, after wave 4.

## 5. Risks

- **A long session:** every frame reads the events; `follow` goes on from its last answer, and the review of a piece
  with thousands of cues is timed in the measure. A cache inside a pure function is held by a test that compares it
  with a run from the start at random times, forwards and back.
- **Matching outlines by splitting** keeps each outline exact but can pair a corner with a curve, so a blend may twist
  midway. The measure looks at the midway frames; a better pairing waits for a brief that needs it.
- **The microphone page** is the only part no test reaches.
- **Per-part gradients copy a shared gradient once for each part that uses it.** It is markup made once at mount,
  never per frame, so a character costs a few kilobytes; a scene where hundreds of parts share one gradient would
  pay for each copy, and is the case to look at again.

## 6. Done when

The measure passes, its tokens are recorded, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
