# Anatomy plan: parts, fields and a catalog that measures

**Status:** Approved 2026-11-14; waves 1 to 3 built on `feat/anatomy` (ADR-185). Waves 4 to 6, the motion
vocabulary (ADR-186), approved 2026-11-15 after one round of critique.
**Base:** `feat/toolkit` at `bad02ccf` (pull request 595, not merged); rebase on `main` once it merges.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md`, `docs/ADR-172-*.md`,
`docs/ADR-173-*.md`, `docs/ADR-184-*.md`, `docs/ADR-185-*.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**An agent knows gerak's primitives and how to use them; designs the brief's motion in them as a spec it writes
into the piece; finds tested moves that meet that spec and decides to use, adjust, combine or write one; and the
review checks the finished piece against its own spec.**

- **Primitives:** fields (what can change) and parts by kind (how a change is shaped), each read from one card with
  a sample of its use.
- **Spec:** the piece exports `design`, each target's fields with the quality its motion should have.
- **Moves:** the catalog answers the spec with gate-passing moves, each with what matched, at which options.
- **Check:** `motion:review` measures each specified field and names where the motion misses its stated quality.

A person reading the code finds each layer, each kind of part and each brief in its own folder.

This plan also lays the ground for **installable style kits**, the next plan: a kit carries a style's moves, its
skin tokens and a style card (its qualities as descriptor ranges and its habits), so a person installs it, writes a
new brief with new references, and an agent makes a new piece in that style, which the review checks against the
card. Here: portable move files, a catalog that reads any declared source of moves, and descriptor ranges in one
shape a style card can reuse.

Not planned here: the style kit; publishing a move pack; a shared registry; the motion atlas
(`plan/motion-atlas-plan.md`, deferred); a sameness score over agents' pieces, including a comparison of agents with
and without the move catalog (its own plan, with at least two runs per arm); colour in 3D (a 3D piece keeps
`custom` numbers); `chroma`; a mask of any shape; a new package; a sampled rule for signals.

## 2. Architecture

Five layers, each using only those below it and each in its own folder; `test/repo/moves-layers.test.ts` refuses
an import from a higher layer's folder.

| Layer | Answers | Lives in |
| --- | --- | --- |
| Fields | what can change on a target, where it rests, how two answers join, how the review judges it | `packages/moves/src/fields/` |
| Parts | how a number, point or pose changes, with no role, rest contract or option gate | `packages/moves/src/parts/<kind>/` |
| Moves | parts coupled on fields inside one progress, with a role, options, moments and an example | `packages/moves/src/moves/`; a brief's own in `apps/pieces/<brief>/src/moves/` |
| Composition | moves placed in time and across targets: phases, lanes, reshaped time, loop state for a live clock | `packages/moves/src/compose/`; the piece format in `@gerak/stage` |
| Pieces | one brief's motion, as content | `apps/pieces/<brief>/`, the worked examples included |

### `packages/moves/src`

```text
fields/       pose.ts pose3d.ts combine.ts           (the table, the pose types, combine, combine3d, lift2d)
parts/        contract.ts (definePart) and one folder per kind (§4)
  time/           time.ts time-at.ts
  ease/           ease.ts
  envelope/       envelopes.ts
  oscillation/    wave.ts shaken.ts
  dynamics/       spring.ts
  path/           ballistic.ts along.ts along3d.ts arc-length.ts
  geometry/       shapes.ts path.ts cubics3d.ts radial.ts stage3d.ts
  blend/          mix.ts mix3d.ts
  coupling/       squashed.ts squash-speed.ts smear.ts smear3d.ts
  signal/         events.ts trail.ts trail-turn.ts velocity.ts velocity3d.ts speed-of.ts keyframes.ts noise.ts
  utility/        random.ts event-list.ts
moves/        declare.ts, whole.ts and one file per move and modifier
compose/      sequence.ts lanes.ts reversed.ts repeated.ts loop.ts
index.ts      the one entry; no subpath exports
```

`cubics3d.ts` takes `toCubics3d` out of `along3d.ts`; `event-list.ts` takes `NO_EVENTS`, `mergeEvents`,
`isMotionEvent` and the types `MotionEvent`, `Events` and `EventPoint` out of `events.ts`, which then imports them.

### `apps/pieces`

```text
<brief>/src/            the brief's pieces and components; src/moves/ its own moves
<brief>/references/     its own assets
<brief>/<name>.html     a piece's own page
src/                    the players every brief shares
references/             assets more than one brief uses
stage.html live.html talk.html index.html
test/                   every test of the app
```

A brief is a top-level folder holding a `src/`; `src`, `references`, `test`, `dist` and `node_modules` never are.
A move outside `@gerak/moves` imports only `@gerak/moves`, so it travels to another project as it is.

## 3. Built (waves 1 to 3, ADR-185)

- **A0, A1:** ADR-185; `@gerak/moves` in layer folders; the layer test; promotion into `src/moves/`.
- **A1b:** one folder per brief in `apps/pieces`; the worked examples there; `briefs.ts` owns where pieces live.
- **A2, A6:** building blocks listed from their folders by doc comment; no `recipe`, parts read from imports.
- **A3:** `wave`, `taper`, `decay`, `attack`, `arch`, `ballistic`, `radial`, `noise1d`.
- **A5:** `skewX`, `skewY`, `shadowX`, `shadowY`, `shadowBlur`, `hue`, `lightness`, `tint`; the `judged` column.
- **A4:** moves built on those parts, samples unchanged within 1e-9; no `Math.sin`, `Math.cos` or `Math.exp` in a
  moves folder; a `custom` name may not be a field's.
- **A7:** descriptors; one search over the sources declared in an app's `package.json`, tagged, capped, ranked by
  fit, with imports; an index cache; `--like` keeps the moves inside a quality's ranges; the near-duplicate gate
  and `scripts/duplicate-baseline.json`.

## 4. Decisions to record (ADR-186): the motion vocabulary

The kinds a piece is assembled from, each with one owner:

| Kind | What it is | Contract | Owner |
| --- | --- | --- | --- |
| Field | one named number a target can carry | meaning, unit, rest, how two answers join, least and most, how the review judges it, dimension | its row of `VALUE_FIELDS` |
| Pose | the fields of one target at one instant | a partial record of fields, `anchor` and `custom` numbers | `Pose2d`, `Pose3d`, derived from the rows |
| Part | a function of `index.ts` declared in `parts/<kind>/` | its kind's rule where the kind has one | `definePart` and its folder |
| Move | parts coupled on fields inside one progress | role, options with ranges, moments, example | `defineMove` |
| Composition | moves placed in time and across targets | answers a time, or a pose from poses | `compose/` |
| Shape | a moved field's measured motion | measured by the gate, never declared | the gate |

### Fields

- `ValueField` gains `meaning` (one sentence), `unit` (`px`, `deg`, `scale`, `share`, `index`, `order` or
  `number`) and `dimension` (`2d`, `3d` or `both`). The shared presets (`OFFSET`, `SIZE` and the rest) omit those
  three, so every row states its own; a test refuses two rows with one meaning.
- **One owner for which fields a pose carries:** `POSE_2D_NUMBERS` and `pose3d.ts`'s `NUMBERS` are derived from the
  `dimension` column, and `Pose2d` and `Pose3d` from them.
- **Each renderer owns what it writes.** The DOM renderer and `@gerak/three` (for `Pose2d` through `applyPose2d` and
  for `Pose3d`) each export `WRITTEN` and `UNWRITTEN` (a field and the reason); a repo test refuses a field of a
  pose type a renderer takes that is in neither list, or in both.

### Parts

- **A part** is a function, or a frozen object of functions (`ease`), exported from `index.ts` and declared in a
  file under `parts/<kind>/`. Functions a part file exports for its own tests (`springMemory`, `trailSettings`,
  `arcLength`, `speedOf`, `mixCustom`, `shaken`, `withProgress`) are not parts.
- **A part's kind is its folder.** `definePart(contract, fn)` in `parts/contract.ts` records the contract in a
  module-level `WeakMap` keyed by `fn` and returns `fn` itself, typed `<F extends object>(contract, fn: F) => F`, so
  no declared type, call site or generated reference entry changes; `partContract(fn)` reads it. A contract's `kind`
  must equal its folder, which a repo test checks; the folder is the owner.
- **Kinds, their rules and their parts.** A contract is a union by kind, read with an exhaustive `switch`; `samples`
  are the argument lists the gate calls the part with, after progress where the part takes one.

  | Kind | Rule the part gate samples | Contract beyond `kind` | Parts |
  | --- | --- | --- | --- |
  | `time` | none | none | `span`, `window`, `windowed`, `atProgress`, `liveAt`, `elapsedOf`, `timeAt` |
  | `ease` | 0 at progress 0 and 1 at 1, for each member or each sample's built ease | `samples` (options of a factory) | `ease`, `backEase`, `springEase` |
  | `envelope` | at least 0 over progress 0 to 1, and its declared values at 0 and 1, for every sample | `samples`, `at0`, `at1` | `taper`, `decay`, `attack`, `arch` |
  | `oscillation` | within `bound` over progress 0 to 1, for every sample | `samples`, `bound` | `wave` |
  | `dynamics` | starting at rest with no speed stays at rest | `samples` | `spring` |
  | `path` | at `ends(...sample)` at progress 0 and 1 | `samples`, `ends` | `ballistic`, `along`, `along3d` |
  | `geometry` | none | none | `toCubics`, `toCubics3d`, `radial`, `aim`, `orbit`, `project3d` |
  | `blend` | equals `a` at share 0; at share 1 equals `b` on every field `b` carries (angles modulo 360) | `samples` (pairs a, b) | `mix`, `mixAngle`, `mixPoint`, `mixPose`, `mixPose3d`, `mixPoint3d` |
  | `coupling` | at an amount or speed of 0, its pose (`.pose` when it answers one) equals rest field by field | `samples` with amount or speed 0 | `squashed`, `squashed3d`, `squashFromSpeed`, `smear`, `smear3d` |
  | `signal` | none in this plan | none | `follow`, `react`, `tally`, `trail`, `trailTurn`, `velocity`, `velocity3d`, `keyframes`, `noise1d` |
  | `utility` | none | none | `seeded`, `mergeEvents`, `isMotionEvent` |

- **The part gate** runs in `npm run check` and refuses an exported part with no contract, a contract whose kind is
  not its folder, and a sampled rule broken by any sample.
- `--parts` and `moveParts()` group by kind, then `fields` and `compose` as two more groups.

### The vocabulary and the design query

- **`motion:moves -- --anatomy`** prints the fields grouped by what they change (place, turn, size, look, colour,
  reveal, order) with meaning and unit, the parts by kind with call shape and first sentence, and the shape words
  with the qualities; `--anatomy --json` gives the same data, which the design query and a later style card read.
- **Shapes per field.** The gate keeps the shape of every field a move moves, at its example; `primary` stays for the
  summary line. `--near`, `--far` and the duplicate distance become the mean, over the union of two moves' fields, of
  the existing per-shape distance where both move the field and 1 where only one does.
- **The design query.** `--move <field>[:<quality>]` (repeatable; a custom number as `custom.<name>`) and
  `--uses <kind or part>[,...]`. For each move:
  - `fieldFit` = the mean over requested fields of 1 when the move does not move it, else (when a quality is given)
    the existing distance to the quality's middle divided by the number of descriptors the quality names, else 0;
  - `usesFit` = the share of `--uses` names the move imports (a kind counts when it imports any part of that kind);
  - rows order by `fieldFit`, then by `usesFit` descending, then by id; each row names, per requested field and use,
    whether it matched and the measured value that decided it.
  - **No move fits** when every move misses a requested field or has `fieldFit` above `NO_FIT` (one constant in
    `catalog.ts`, set so the tests below hold); the answer says so, lists the design's fields, qualities and uses,
    and gives `npm run motion:new -- --move <id> --in <brief>`.
- **Usage on the card.** Each part's line in `--anatomy` adds one sample call and its values at progress 0, 0.5 and
  1, from the first of its contract's `samples` (`taper(p, 2): 1, 0.25, 0`); each field's line adds what the DOM
  renderer writes for a sample value (`hue: 30` writes `--gerak-hue: 30deg`), from the renderer's `WRITTEN` list. A
  part with no sampled rule shows its call shape only.
- **Tested moves only.** A search row shows `passes` or the count of gate findings; moves with findings are left out
  of every query unless `--all`, and the summary says how many were left out.
- **Fit at its options.** A move is scored at its example and at each option set the gate samples; the row reports
  the best, naming the options when they are not the example's (`fits with squash 0.6`).
- **Moves that play on a renderer.** `--renderer <dom|three>` keeps the moves whose every moved field is in that
  renderer's `WRITTEN` list (V1), and the full entry names the fields a renderer leaves unwritten.
- **The spec answers the query.** `--design <file> --target <name>` reads the piece's `design` and asks for that
  target's fields and qualities, as the same `--move` flags would.
- **The duplicate check** uses the per-field distance; `NEAR_DUPLICATE` is re-tuned so the pairs found are a subset
  of today's two baseline pairs, and the baseline only shrinks.

### The design spec

- **A piece may export `design`:** a record of target name to fields, each field to a quality name from `QUALITIES`;
  a field's value may instead be a record of beat name to quality, measured in that beat's span. Types:
  `Design = Readonly<Record<string, Readonly<Record<string, Quality | Readonly<Record<string, Quality>>>>>>`, where
  `Quality` is a key of `QUALITIES`. `readStageModule` carries it through as plain names, refusing only a value that
  is not that shape, since `@gerak/stage` sits below the tools; the review refuses an unknown target, field, beat or
  quality, naming it.
- **The review checks it.** For each specified target and field, `motion:review` samples the field over the piece's
  run (or the named beat's span), keeps the stretch from its first change to its last, measures its shape as the
  gate does, and reports a finding where a descriptor lies outside the quality's range: "`ball.y` (landing): peak
  0.3, heavy wants 0.6 to 1; it falls like a light thing". A field the scene never moves is a finding too. The
  shape measure and `QUALITIES` have one owner each, imported by the review.

## 5. Slices

### V0. Parts by kind (planner, by script)

- **Invariant:** every file under `parts/` moves with `git mv` to its kind's folder per §2; `toCubics3d` and the
  event list are cut out with their bodies unchanged; only import paths change; `index.ts` exports the same names in
  the same order; every move's samples are byte-identical; the layer test passes; `PART_GROUPS` becomes the kinds,
  then `fields` and `compose`.
- **Owner:** `packages/moves/src/parts/`, `packages/tools/src/scene/parts.ts`.

### V1. Fields as contracts (executor)

- **Invariant:** §4 Fields. **Owner:** `packages/moves/src/fields/{pose,pose3d}.ts`, `packages/dom/src/render.ts`,
  `packages/three/src/{pose2d,pose3d}.ts`, a repo test.
- **Test:** a row missing `meaning` fails to type-check even though it spreads a preset (a `@ts-expect-error` test);
  two rows with one meaning fail; the coverage test fails when a renderer's `WRITTEN` loses a field, and when a field
  sits in both lists; `POSE_2D_NUMBERS` and the 3D numbers equal what the rows' dimensions give.

### V2. Parts with contracts and the part gate (executor)

- **Invariant:** §4 Parts. **Owner:** `packages/moves/src/parts/**` (declarations only), `parts/contract.ts`,
  `packages/tools/src/scene/parts.ts` (the gate and the listing), the check's entry for the gate.
- **Test:** per sampled kind, a scratch part that breaks the rule is refused (an envelope below 0, an ease not 1 at
  1, an oscillation past its bound, a path off its end, a blend not `b` at 1, a coupling not at rest); every current
  part passes; a part with no contract and a contract in the wrong folder are refused; `mixPose`, `keyframes` and the
  `ease` object keep their types (a type test); the generated reference is unchanged.

### V3. The vocabulary and the design query (executor, after V1 and V2)

- **Invariant:** §4 The vocabulary and the design query. **Owner:** `packages/tools/src/scene/{catalog,moves}.ts`,
  `packages/tools/bin/motion-moves.mjs`, `scripts/duplicate-baseline.json`.
- **Test:** `--anatomy` lists every field with meaning and unit and every part under its kind, each with its sample
  use, and `--json` parses; a move with a gate finding is left out of a query and counted in the summary; a move
  that fits only at another option set is found with those options named; `--design` on a scratch piece asks what
  its `design` says; `--renderer three` leaves out a move that moves `hue`;
  `hop` keeps a `y` shape with rings; `--move y:heavy` puts `drop` first and `--move scaleY:loose` puts `squish`
  first; a move that moves the field with the wrong quality ranks below one with the right quality; a design no move
  fits gives the no-fit answer with the `motion:new` line; `--uses` breaks a tie; the duplicate pairs are a subset of
  the baseline.

### V4. The spec checked by the review (executor, beside V3)

- **Invariant:** §4 The design spec. **Owner:** `packages/stage/src/module.ts` (the `design` export of a stage
  module), `packages/tools/src/scene/{scene,review}.ts` (reading it in a scene module, and the check). It imports
  the shape measure from `moves.ts` and `QUALITIES` from `catalog.ts` and edits neither.
- **Test:** a scratch piece whose `ball.y` falls with a late peak passes `y: "heavy"` and fails `y: "light"` with a
  finding naming the descriptor; a beat-scoped spec is measured in its beat only; a field the scene never moves, an
  unknown target, field, beat and quality are each refused or reported by name.

### A8. Guide (planner)

- `agent-motion.md` "The loop", in this order: the three lines; read `--anatomy` once; write the piece's `design`
  (each target's fields and qualities, by beat where it changes) and, in the report, the parts by kind each line
  needs; ask `--design <file> --target <name>` (and `--far` from the obvious move for ideas); decide per line, in
  order: use a move as it is, use it at the options its row names, combine moves in the scene, or write a move from
  the named parts; review until the spec's findings are gone and the sheet shows the three lines.
  `agent-moves.md`: a move from parts, the coupling rule, no `Math.sin`. A skin section gives the colour and shadow
  rule. Reference regenerated.

### A9. Proof

- **Measure:** a fresh Sonnet worker at medium effort builds one brief from the guide alone: a colour change, a cast
  shadow, a jiggle and a heavy landing. It passes when each step of the goal shows: its piece exports `design`,
  written before its first `motion:moves` query (the lead checks the transcript's order); it asked the catalog with
  `--design` or `--move`; its report names, for each line, which of the four choices it made and why; it moves fields
  rather than `custom` numbers and calls no `Math.sin`, `Math.cos` or `Math.exp` in a move; the duplicate gate finds
  nothing new; and its review is clean, the spec's findings included. Compared with earlier measures on tokens, calls,
  minutes and render rounds.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 6. Team and order

| Wave | Who | Slices | Needs |
| --- | --- | --- | --- |
| 4 | Planner | ADR-186, V0 | waves 1 to 3 |
| 4b | Executor | V1 | V0 |
| 4b | Executor | V2 | V0 |
| 5 | Executor | V3 | V1, V2 |
| 5 | Executor | V4 | V1, V2 |
| 6 | Planner | A8 | V3, V4 |
| 6 | Executor model, fresh | A9, then the cold review | A8 |

V1 and V2 may both change exports; the lead regenerates the generated reference once on combining. One pull
request, after wave 6.

## 7. Risks

- **`definePart` must not change types.** The `WeakMap` keeps every declaration as it is; V2's type test and the
  reference test hold it.
- **Sampled rules hold only over declared samples.** An envelope with a negative rate leaves 0; the samples state the
  domain a part promises.
- **A spec over a whole run mixes beats.** A target that enters, is stressed and leaves has one field shape per beat;
  a spec without a beat measures them together, so the guide asks for beat-scoped specs where a target changes
  character.
- **The quality ranges were set for single moves.** A piece's field is often several moves combined; the spec check
  may need wider ranges, tuned once in `QUALITIES` against the measure's piece.
- **Thresholds are tuned once,** `NO_FIT` and `NEAR_DUPLICATE`, each one constant held by tests on today's moves.
- **Relative colour** needs Chromium 119 or later; other browsers are not tested here.

## 8. Done when

The measure passes, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
