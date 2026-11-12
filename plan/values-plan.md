# Values and sequence plan

**Status:** Approved by the owner, 2026-11-11.
**Base:** `feat/authoring-proof-2` at the commit that adds this file (pull request 578).
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` ("What a real piece asked for"),
`plan/authoring-plan.md` ("A hand-made piece, rebuilt"), `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**Everything a move can change is one kind of value, and one target can do several things in a row without the
scene choosing by the clock.**

A 15 second hand-made piece was rebuilt with gerak, and four of its five gaps had one cause. A move answers a pose,
a reveal or a drawn stroke, three kinds with three renderers, and colour and blur are no kind at all. So thirty of
seventy elements were handled outside the moves, a stroke had no tail, and a modifier could not touch a reveal. The
fifth gap was that the dot's eight phases were picked by `if` on elapsed time.

## 2. What the code is today

- `Pose2d` (`packages/moves/src/pose.ts`): optional `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY`, `opacity`,
  and `anchor`. Two lists beside it say which fields add and which multiply.
- `Reveal` `{ x, y, radius }` and `Drawn` `{ drawn }` (`shapes.ts`): separate types, and `Reveal`'s `x` and `y` mean
  a circle's centre, not an offset.
- `combine` and `mixPose`: 18 and 35 lines, each walking the two pose lists.
- `packages/dom/src/render.ts`: `applyPose`, `applyReveal`, `applyDrawn`, one per kind; a component picks one by
  hand.
- The gate (`packages/tools/src/scene/moves.ts`) keeps its own three sets of field names for rest and smoothness:
  a second owner of what a field is.
- `span(fromMs, toMs, durationMs)` (`time.ts`): the third argument is the whole scene's length. All five interviewed
  agents passed the stretch's length at least once.

The surface is small: about 250 lines across those files decide what a value is.

## 3. Decisions to record (V0, ADR-173)

- **One value.** `Pose2d` keeps its name and widens. Every field is a number and has one row in one table,
  `VALUE_FIELDS`, in `@gerak/moves`: its rest, whether it adds or multiplies when combined, and its unit. `anchor`
  stays the one field that is not a number.

  | Field | Rest | Combines | Was |
  | --- | --- | --- | --- |
  | `x`, `y`, `rotation` | 0 | add | pose |
  | `scale`, `scaleX`, `scaleY`, `opacity` | 1 | multiply | pose |
  | `blur` | 0 | add | none |
  | `drawn`, `drawnFrom` | 1 and 0 | replace | `Drawn`, which had no tail |
  | `clipX`, `clipY`, `clipRadius` | 0, 0 and none | replace | `Reveal` |
  | `custom.<name>` | 0 | add | none |

- **A custom field is a named number, and each renderer says where it goes.** A value may carry `custom`, a record
  of numbers a piece names itself, such as `{ tint: 0.4 }`. The pure layer only combines, blends and checks them.
  The DOM renderer writes each as the CSS custom property `--<name>`, and the page's CSS decides what it means: a
  colour by `color-mix`, a glow, a counter. The Three.js renderer hands each to a function the piece gives it, which
  sets a material's colour, a uniform or a light. The library never learns what a colour is, so it carries no look,
  and no renderer's vocabulary reaches the moves.
- **`Reveal` and `Drawn` go, and so do `applyReveal`, `applyDrawn` and `applyPose`.** One `applyValue` writes
  whatever fields a value carries. `wipe` answers clip fields and `trace` answers `drawn`. Nothing is published, so
  there is no alias.
- **The table is the one owner of what a field is.** `combine`, the blend, the modifiers, the gate and the renderer
  read it. The gate's own sets are deleted.
- **A modifier works on a value.** `reversed` and `repeated` only reshape time, so they take any answer.
  `anticipate` and `overshoot` act on every field that adds.
- **`sequence` is one function for phases and for shots.** Given a time and a list of `[span, answer]`, it answers
  the phase the time is in, holds the last one that ended, and before the first holds its start. It is generic, so
  the same call orders moves on one target and scenes in a piece.
- **A piece is still one scene.** There is no second kind of thing called a multi-scene. A long piece is one scene
  function built from parts by `sequence`, and each part is given a time that starts at 0, so a beat can be written
  and reused without knowing where it sits. What `sequence` does not do is put a shot's elements on the page or
  take them off, or blend two shots; those belong to the `stage` package and to transitions, later in the roadmap.
- **A built-in is for what an app cannot build.** A new field, a renderer's ability or a simulation goes in the
  packages. A move that can be made from the parts already there is written in the app's `src/moves` by whoever
  needs it, and moves into `@gerak/moves` when a second piece uses it. So the catalog lists the parts as well as
  the moves: `trail`, `spring`, `along`, `velocity`, `smear`, `keyframes`, the eases and blends, one line each,
  because a worker that did not know `trail` was there could not build a hanging letter from it.
- **A span takes the scene's length from the time it is given.** `span(fromMs, toMs)` has no third argument. A
  timed clock already carries its length; an untimed driver, such as scroll, is given one where it is made.

## 4. Slices

Each slice: invariant, owner, failing test, reference and guide entries in the same slice.

### V1. The field table and the one value

- **Invariant:** `VALUE_FIELDS` lists every field with its rest and how it combines; `Pose2d` is derived from it
  and carries a `custom` record; `combine` and the blend walk the table; `checkMove` reads rest and smoothness from it.
- **Owner:** `packages/moves/src/pose.ts`; `packages/tools/src/scene/moves.ts` loses its sets.
- **Test:** two values with `blur` and `custom.tint` combine by adding; a field added to the table with no row in the
  gate is impossible, because the gate has no rows; an entrance that ends with `blur: 2` is refused as off rest.

### V2. One renderer

- **Invariant:** `applyValue(target, value)` writes transform, opacity, `filter: blur()`, the clip circle, the dash
  with a head and a tail, and each custom number as the property `--<name>`. A field left out is written at its rest, so an
  opacity set once does not stay. `useTarget` with no `render` uses it for any value.
- **Owner:** `packages/dom/src/render.ts`, `packages/react/src/player.ts`; `packages/three` ignores fields it has no
  place for.
- **Test:** a value with `opacity: 0.3` then one without leaves the element at 1; `drawnFrom: 0.2, drawn: 0.6` gives
  the dash that shows that stretch; `custom.tint` of 0.4 is on the element's style as `--tint`. `wipe` and `trace` pieces render as
  before.

### V3. Modifiers over a value

- **Invariant:** each modifier's input is `(time) => R` for any answer; `anticipate` and `overshoot` move every
  field whose row says add.
- **Owner:** `packages/moves/src/`.
- **Test:** `reversed` of `wipe` shrinks the circle; `overshoot` of a value with `blur` passes its end on `blur`.

### V4. Sequence, and a span with two arguments

- **Invariant:** `sequence(time, phases)` as decided; `span(fromMs, toMs).of(time)` reads the length from the time;
  an untimed time with no length throws a message that names the fix.
- **Owner:** `packages/moves/src/time.ts`, a new `sequence.ts`; `packages/dom/src/drivers.ts` for the scroll
  driver's length.
- **Test:** three phases with gaps answer the first's start before it, each phase inside it, and the last ended one
  in a gap; the same call over two scenes switches whole records; every worked example and proof piece still
  samples the same after its spans lose their third argument.

### V5. The catalog lists the parts

- **Invariant:** `npm run motion:moves -- --parts` prints one line for each building block a move is made from,
  with its call shape; the plain listing ends with a line that says so. `trace` takes `tail`, a share of the path
  that follows the head. No `dangle` is added to the packages: the proof's worker builds it from `trail` in the
  app, which is the test that the parts can be found.
- **Owner:** `packages/tools/src/scene/catalog.ts`, `packages/moves/src/trace.ts`.
- **Test:** every function the reference lists under eases, blends, paths and follow-through appears under
  `--parts`, read from one list the reference test also reads.

### V6. Tools that say less

- **Invariant:** `motion:review` prints the findings and the sheet's path; `--full` adds the moves read back with
  their eases. The guide's loop names the short form.
- **Owner:** `packages/tools/src/`.
- **Test:** the default output of a clean review is under a stated number of lines.

### V8. The review sees fast motion

- **Invariant:** `motion:review` chooses its own frame times when none are given: more where a watched element
  moves fastest or changes direction, few where it rests, and always the first and last. The sheet labels each frame
  with its time and the speed that put it there.
- **Owner:** `packages/tools/src/page/`.
- **Test:** a scene with one 100 ms snap in three seconds gets at least three frames inside the snap; a scene at rest
  gets the two ends and no more.
- **Why now:** every piece in both proofs was reported as not seen at full speed, and six evenly spaced frames miss
  a pop that lasts two.

### V9. Tests that write a scene use a copy

- **Invariant:** no test writes a file the repository tracks. The live browser tests copy the scene they edit into
  a temporary app and serve that.
- **Owner:** `apps/react-demo/test/live-browser.test.ts`, with a helper in `packages/tools/src/page/` if one is
  needed.
- **Test:** `git status` is clean after the suite is stopped halfway through a write.
- **Why now:** a test that timed out with the scene file broken on disk took the two tests after it down, and that
  was the red build on `main`.

### V7. Proof: the showreel again

- The `showreel` piece is rewritten on the new value and `sequence`. **Passes when** its component has no `render`
  function that carries a plain number for colour, blur or a stroke; its scene has no `if` on elapsed time; and its
  frame sheet at the six times matches the one read before this plan.
- The worker reports what is still awkward, as the first rebuild did.
- **The rebuild becomes the standing measure.** The hand-made original is copied into the repository as a fixture,
  and each rebuild records three numbers beside the last: the worker's tokens, the moves it wrote, and the plain
  numbers its component still carries by hand. The first rebuild's row is 198 k tokens, 7 moves and about 30
  elements carried by hand. A change to the base is judged by whether those go down.

## 5. Risks

- **`clipX` and `clipY` rename a published-looking shape.** `wipe`'s options keep their names; only its answer
  changes, and nothing outside the repository reads it.
- **A field written at rest when left out** changes what a component sees if it relied on a value staying. The
  worked examples and proof pieces are the test.
- **Custom fields put meaning in CSS.** That is the point, and it also means the gate cannot say what a `tint` of 3
  looks like. It can still hold it to rest and to a smooth path.
- **`sequence` holding the last phase** is right for a dot and wrong for a scene that should clear. A phase may
  answer an empty record; that is the caller's choice, not a second mode.
- **Removing the span's third argument touches every scene.** It is one mechanical commit, by script, before V4's
  behaviour change.

## 6. Team and order

The conductor (Fable) keeps the decisions and the judging, and starts workers straight from its own session.
Workers run on Sonnet 5.5 or Opus 5.5 at medium effort; every start names its model. One pull request per wave,
after one full check and one cold review.

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | V0, V1 | the table's shape decides every other slice |
| 2 | Sonnet A | V2 | a renderer against a table that exists |
| 2 | Sonnet B | V3 | four small moves made generic; touches no file of V2 |
| 3 | Opus | V4 | time is subtle, and every scene changes |
| 3 | Sonnet | V6, V8, V9 | tools and tests only, no file shared with V4 |
| 4 | Opus | V5, V7 | the catalog shows the parts, and the same worker builds from them |

### What each wave cost

| Wave | Who | Slices | Tokens | Tool calls | Time | What the conductor fixed on combining |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Conductor (Fable) | V0, V1 | not shown | | | |
| 2 | Opus, medium | V2 | 156 k | 68 | 9.5 min | opacity written at 1 overrode the page's own style; now a left-out field is cleared |
| 2 | Sonnet, medium | V3 | 87 k | 22 | 3.2 min | its test read the wipe's old field name, which V2 renamed |
| 2 | Sonnet, medium, cold review | | 120 k | 31 | 4.6 min | ten findings: seven fixed, three left |

V3 changed shape before it was briefed: `reversed` and `repeated` only reshape time, so they became functions of
time (`slide(options, reversed(time))`) and left the catalog's moves, which needed no typing for every kind of
answer. `anticipate` and `overshoot` stayed moves.

| 3 | Opus, medium | V4 | 116 k | 71 | 8.5 min | keyframes kept the scene length it no longer read; the conductor removed it |
| 3 | Sonnet, medium | V6, V8, V9 | 140 k | 7 after a restart | two sittings | the picker gave every frame to six letters and none to the dot |
| 3 | Sonnet, medium, cold review | | 92 k | 19 | 2.1 min | eight findings: six fixed, two left |

Wave 3 left from the review: concurrent test runs share one scratch prefix and the first to finish removes the other's
copies; a flag value equal to  is dropped. The wipe at the end of the timing page gets no picked frame of its
own, since the picker sees boxes and a clip does not move one.

Left from the review, and why: a `trace` with a `tail` below 1 ends with only the tail drawn and still passes as
a reveal (a comet is what a tail is for); `lift2d` names the fields it carries from a page pose onto a plane (a
mapping, not a rest or a rule); a custom name with a dot in it is read wrongly by the gate (the renderer now refuses
such a name).

## 7. Done when

`VALUE_FIELDS` is the only place a field's rest or combining is stated; the showreel passes V7; `npm run check` is
green; the guide and the reference describe one value and `sequence`; and `docs/SESSION-STATUS.md` says so.
