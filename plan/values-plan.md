# Values and sequence plan

**Status:** Draft for the owner's review.
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
  | `--<name>` | 0 | add | none |

- **A custom field is a CSS variable.** A key that starts with `--` is written onto the element as that custom
  property, and the page's CSS decides what it means: a colour by `color-mix`, a glow, a counter. The library never
  learns what a colour is, so it carries no look.
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
- **A span takes the scene's length from the time it is given.** `span(fromMs, toMs)` has no third argument. A
  timed clock already carries its length; an untimed driver, such as scroll, is given one where it is made.

## 4. Slices

Each slice: invariant, owner, failing test, reference and guide entries in the same slice.

### V1. The field table and the one value

- **Invariant:** `VALUE_FIELDS` lists every field with its rest and how it combines; `Pose2d` is derived from it
  and takes `--name` keys; `combine` and the blend walk the table; `checkMove` reads rest and smoothness from it.
- **Owner:** `packages/moves/src/pose.ts`; `packages/tools/src/scene/moves.ts` loses its sets.
- **Test:** two values with `blur` and `--tint` combine by adding; a field added to the table with no row in the
  gate is impossible, because the gate has no rows; an entrance that ends with `blur: 2` is refused as off rest.

### V2. One renderer

- **Invariant:** `applyValue(target, value)` writes transform, opacity, `filter: blur()`, the clip circle, the dash
  with a head and a tail, and each `--name` as a custom property. A field left out is written at its rest, so an
  opacity set once does not stay. `useTarget` with no `render` uses it for any value.
- **Owner:** `packages/dom/src/render.ts`, `packages/react/src/player.ts`; `packages/three` ignores fields it has no
  place for.
- **Test:** a value with `opacity: 0.3` then one without leaves the element at 1; `drawnFrom: 0.2, drawn: 0.6` gives
  the dash that shows that stretch; `--tint: 0.4` is on the element's style. `wipe` and `trace` pieces render as
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

### V5. What the showreel still lacked

- **Invariant:** `dangle`, a follow whose input is its parent's motion as a function of time, swings behind it and
  settles, built on `trail`; `trace` takes `tail`, a share of the path that follows the head.
- **Owner:** `packages/moves/src/`.
- **Test:** a parent that stops makes `dangle` swing past and settle; a parent that never moves leaves it at rest.

### V6. Tools that say less

- **Invariant:** `motion:review` prints the findings and the sheet's path; `--full` adds the moves read back with
  their eases. The guide's loop names the short form.
- **Owner:** `packages/tools/src/`.
- **Test:** the default output of a clean review is under a stated number of lines.

### V7. Proof: the showreel again

- The `showreel` piece is rewritten on the new value and `sequence`. **Passes when** its component has no `render`
  function that carries a plain number for colour, blur or a stroke; its scene has no `if` on elapsed time; and its
  frame sheet at the six times matches the one read before this plan.
- The worker reports what is still awkward, as the first rebuild did.

## 5. Risks

- **`clipX` and `clipY` rename a published-looking shape.** `wipe`'s options keep their names; only its answer
  changes, and nothing outside the repository reads it.
- **A field written at rest when left out** changes what a component sees if it relied on a value staying. The
  worked examples and proof pieces are the test.
- **Custom fields put meaning in CSS.** That is the point, and it also means the gate cannot say what `--tint: 3`
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
| 3 | Sonnet | V6 | tools only, no shared file |
| 4 | Opus | V5, V7 | the same worker writes the two moves and uses them |

## 7. Done when

`VALUE_FIELDS` is the only place a field's rest or combining is stated; the showreel passes V7; `npm run check` is
green; the guide and the reference describe one value and `sequence`; and `docs/SESSION-STATUS.md` says so.
