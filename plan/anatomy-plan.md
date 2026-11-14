# Anatomy plan: parts, fields and a catalog that measures

**Status:** Proposed, 2026-11-14.
**Base:** `feat/toolkit` at `bad02ccf` (pull request 595, not merged); rebase on `main` once it merges.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md`, `docs/ADR-172-*.md`,
`docs/ADR-173-*.md`, `docs/ADR-176-*.md`, `docs/ADR-184-*.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**An agent making a piece finds the building block it needs by what it does and how it feels, writes a new move
from shared parts instead of hand-written trigonometry, and moves any visible property, colour and shadow included,
with the same rules as position.** A person reading the code finds each layer in its own folder.

What the code lacks today, measured on `feat/toolkit`:
- **Laws:** a damped wave (an envelope times `Math.sin`) is written by hand in `jolt`, `squish`, `spring-settle`,
  `launch`, `hand-wave`, `waddle` and the built-in `shaken`; an arch `sin(πp)` in `bump`, `spring-settle` and
  `hand-wave`; there is no smooth noise; `ballistic`, `spread`, `shockwave` and `implode` are local moves doing
  their own projectile and polar maths.
- **Fields:** no skew (the renderer owns `transform`); colour and shadow only as untyped `custom` numbers, as the
  local `tint` move does.
- **Recipes:** 2 of about 41 moves declare a `recipe`, a hand list the gate checks only for known ids.
- **Catalog:** one flat list in one order; nothing measured to search by, so "heavy" or "near `lob`" cannot be
  asked, and `ballistic` and `lob` sit side by side unnoticed.
- **Layout:** `packages/moves/src` holds 54 files in one folder: fields, laws, moves and composition mixed, while
  `MOVE_PARTS` in `@gerak/tools` is a second, hand-kept list of which of them are parts.

Not planned: the motion atlas (`plan/motion-atlas-plan.md`, deferred until the sameness score below shows the need),
a mask of any shape, a new package.

## 2. Architecture

Five layers. Each uses only those below it, and each has one folder.

| Layer | Answers | Lives in |
| --- | --- | --- |
| Fields | what can change on a target, where it rests, how two answers add, how the review judges it | `packages/moves/src/fields/` |
| Parts | how a number changes over time, knowing nothing of fields, roles or rest | `packages/moves/src/parts/<group>/` |
| Moves | a named behaviour: parts coupled on fields inside one progress, with a role, options, moments and an example | `packages/moves/src/moves/`; an app's own in `apps/<app>/src/moves/` |
| Composition | moves placed in time and across targets: spans, phases, lanes, joining two answers on one target | `packages/moves/src/compose/`; the piece format (cast, story, layouts, carrying) in `@gerak/stage` |
| Pieces | one brief's motion, as content | `apps/pieces/src/` (pieces), `apps/examples/src/` (worked examples the tests read) |

- **A part** takes progress or time and answers a number or a point. It has no role, no rest and no option gate.
- **A move** exists where parts couple inside one progress (a squash because of the landing, at the landing) and an
  option is worth turning in another brief. Parts merely side by side are composition.
- **Composition is library code, a piece is content.** Composition helpers stay in `@gerak/moves` because a plain
  scene with no stage uses `sequence` and `lanes`, and no built-in move imports them; the stage module format stays
  in `@gerak/stage`. Pieces are not a package: they are outputs, kept out of an agent's reading so they are not
  copied.
- **One owner per list.** The parts are what `parts/` exports: the catalog's groups are its folders and each part's
  line is its doc comment. A field's review kind is a column of `VALUE_FIELDS`. What a move is made of is read from
  its source.

### Target layout of `packages/moves/src`

```text
fields/       pose.ts pose3d.ts combine.ts
parts/
  time/           time.ts time-at.ts
  laws/           ease.ts spring.ts keyframes.ts wave.ts arch.ts ballistic.ts
  blends/         mix.ts
  paths/          shapes.ts path.ts along.ts along3d.ts arc-length.ts radial.ts
  follow-through/ trail.ts trail-turn.ts velocity.ts velocity3d.ts speed-of.ts smear.ts smear3d.ts
                  squash-speed.ts shaken.ts
  events/         events.ts
  randomness/     random.ts noise.ts
  camera/         stage3d.ts
moves/        declare.ts, whole.ts (what a modifier carries) and one file per move and modifier
compose/      sequence.ts lanes.ts reversed.ts repeated.ts loop.ts
index.ts      the one entry; no subpath exports
```

`eases` is renamed `laws`, since a wave or an arch is not an ease; `camera` is new.

## 3. Decisions to record (ADR-185)

- **The layers are folders.** As above; `@gerak/moves` keeps one entry point, so no import changes for a scene.
- **Parts are listed from their folder.** `MOVE_PARTS` is generated from the exports of `parts/<group>/` and their
  doc comments; a test refuses a part with no doc comment. The hand list goes.
- **New laws:** `wave(progress, { count, damping })` answers a sine under an exponential decay, 0 at both ends when
  `damping` is above 0; `arch(progress)` answers `sin(πp)`; `ballistic(progress, { dx, dy, apex })` answers the
  point of a throw from an offset to rest under constant gravity at even time steps; `radial(angle, distance)`
  answers a polar offset; `noise1d(seed)` answers a smooth, seeded function of time with values from -1 to 1, the
  same for the same seed.
- **New fields, each a row of `VALUE_FIELDS`:**
  - `skewX`, `skewY`: degrees, rest 0, add, 2D; written into the transform the renderer owns.
  - `shadowX`, `shadowY` (px, rest 0, add) and `shadowBlur` (px, rest 0, add, least 0): written as `drop-shadow()`
    in the `filter` the renderer already owns for `blur`; its colour is the skin's `--gerak-shadow`.
  - `hue` (degrees, rest 0, add, judged as a turn), `lightness` (rest 0, add), `chroma` (rest 1, multiply), `tint`
    (0 to 1, rest 0, add): colour moved relative to the skin's own. The DOM renderer writes them as
    `--gerak-hue`, `--gerak-lightness`, `--gerak-chroma`, `--gerak-tint`; the skin places them with OKLCH relative
    colour and `color-mix(in oklch, …)`, so blends keep their brightness. `@gerak/three` writes them onto a
    material's colour from its colour at bind. Relative colour needs Chromium 119 or later.
  - `ValueField` gains `judged: "position" | "turn" | "ratio"`; `motion:review` reads it instead of matching names,
    so a new field is judged by its row alone.
  - A `custom` name may not equal a field's name.
- **No `recipe`.** `defineMove` loses `recipe`. The catalog shows the parts a move calls, read from its source
  (which `@gerak/moves` exports from `parts/` it imports). ADR-176's recipe clause is superseded.
- **No stored compositions.** No named template of moves ships; compositions stay in pieces.
- **Moves are measured, not described.** The gate samples each move's example and option sets at its 62 steps and
  records, for each field it moves, its peak speed's place in the run (0 to 1), overshoot past rest as a share of
  the travel, rings (crossings of rest after first arrival), wind-up (travel away from the goal at the start, as a
  share) and settle (the share of the run after first arrival until within 2% of rest). These are the move's
  descriptors, written into the catalog record.
- **The catalog searches by them.** `motion:moves` prints one compact line per move by default (id, role, fields
  moved, a gist from the first sentence), the full entry with `-- <id>`, and gains:
  - `--like <quality>` with the qualities of the guide's table (`heavy`, `light`, `quick`, `calm`, `playful`,
    `stiff`, `loose`), each a range of descriptors owned by one table in `packages/tools/src/scene/catalog.ts` that
    the guide quotes;
  - `--near <id>` and `--far <id>`: moves ordered by descriptor distance, same role first;
  - `--fields x,scale`: moves that move those fields.
- **Near-duplicates are found.** A move whose descriptors lie within a set distance of another's, with the same role
  and fields, is a gate finding naming the other; `motion:promote` refuses one.

## 4. Slices

### A0. Decision and architecture (planner)

- ADR-185 and its index line; `docs/ARCHITECTURE.md` §2a becomes the table in §2 above; `docs/MAP.md` gains the
  folders.

### A1. Folders (planner, by script)

- **Invariant:** every file moves to its folder in §2 with no change to behaviour or exports: `index.ts`'s export
  list, every sample and the generated reference's entries are unchanged; `scripts/cycle-baseline.json` and the
  comment baseline take the new paths and do not grow.
- **Owner:** `packages/moves/src`.
- **Test:** the full check; a script compares `motion:sample` of every built-in move's example before and after.

### A2. Parts from their folders

- **Invariant:** as decided; `--parts` prints the same parts as today grouped by folder, plus any new part, with no
  hand list left.
- **Owner:** `packages/tools/src/scene/parts.ts`.
- **Test:** a part added to a folder with a doc comment appears in `--parts` with no other edit; one without a doc
  comment is refused.

### A3. Laws

- **Invariant:** as decided, each law pure and exact at its ends.
- **Owner:** `packages/moves/src/parts/laws/`, `paths/radial.ts`, `randomness/noise.ts`; `index.ts` exports.
- **Test:** `wave` is 0 at 0 and 1 with `damping` above 0 and crosses 0 `2 × count` times; `arch` peaks at 0.5;
  `ballistic`'s vertical acceleration is constant across steps and its top is at `apex`; `noise1d` is continuous
  (no step over a bound between adjacent ms), within -1 to 1, and the same for the same seed.

### A4. Moves on parts

- **Invariant:** `shaken`, `drop`, `hop` and the local `jolt`, `squish`, `spring-settle`, `launch`, `hand-wave`,
  `waddle`, `bump`, `ballistic`, `lob`, `spread`, `shockwave` and `implode` call the new parts in place of their own
  trigonometry and projectile maths; each one's samples at its example and option sets match before and after
  within 1e-6, or the change is named and the review of every piece using it is clean. The local `tint` moves the
  `tint` field instead of a `custom` number.
- **Owner:** `packages/moves/src/moves/`, `apps/pieces/src/moves/`.
- **Test:** a before-and-after sample comparison per move; no `Math.sin`, `Math.cos` or `Math.exp` left in a move
  file (a repo test over `moves/` folders).

### A5. Fields

- **Invariant:** as decided; skew, shadow and colour fields rest, add and are judged by their rows; the DOM renderer
  writes them and clears them when absent; `@gerak/three` writes the colour fields on a material.
- **Owner:** `packages/moves/src/fields/pose.ts`, `packages/dom/src/render.ts`, `packages/three/src/pose3d.ts`,
  `packages/tools/src/scene/review.ts` (the `judged` read).
- **Test:** `combine` adds `hue` and multiplies `chroma`; a `hue` step from 179 to -179 is judged as 2 degrees; the
  DOM writes `skewX` into the transform with the turn and scale, and `drop-shadow` beside `blur` in one `filter`; a
  browser test reads the computed colour of a skinned member at `tint` 0, 0.5 and 1 and finds the midpoint between
  the ends in OKLCH; a `custom` named `hue` is refused.

### A6. No recipe

- **Invariant:** as decided; the catalog lists the parts a move's source calls; the two moves that declared a
  recipe still list the same parts.
- **Owner:** `packages/moves/src/moves/declare.ts`, `packages/tools/src/scene/catalog.ts`, `moves.ts`.

### A7. Descriptors and the catalog

- **Invariant:** as decided; the default catalog is shorter in bytes than today's for the same moves; `--like heavy`
  ranks `drop` above `pop`; `--near ballistic` names `lob` first; the gate reports a copy of a move under a new id as
  a near-duplicate.
- **Owner:** `packages/tools/src/scene/moves.ts` (descriptors), `catalog.ts` (search and the quality table).
- **Test:** descriptors of hand-built moves with known overshoot, rings and wind-up; each flag above.

### A8. Guide (planner)

- `agent-motion.md` "The loop" step 5 searches by quality and fields; `agent-moves.md` writes a move from parts,
  with the coupling rule; a skin section names the colour and shadow variables; reference regenerated.

### A9. Proof

- **Measure:** a fresh Sonnet worker at medium effort builds one piece from a brief that asks for a colour change,
  a cast shadow, a jiggle and a heavy landing, from the guide alone. It passes when it uses the fields rather than
  `custom` numbers, writes no trigonometry in a move, its review is clean, and its interview names what it searched
  the catalog for.
- **Sameness, first run:** two briefs, two fresh workers each, four pieces. Score each pair by shared moves and by
  descriptor distance of the motions used. This is the baseline the atlas decision will need; about 600k tokens, so
  the owner decides whether it runs here or in its own plan.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 5. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Planner | A0, A1 | every later slice edits the moved files |
| 2 | Executor | A2 and A6 | tools' catalog and `declare.ts`, one owner for the record |
| 2 | Executor | A3 | new parts, `index.ts` exports |
| 2 | Executor | A5 | fields, both renderers, the review's read |
| 3 | Executor | A4 | needs A3's parts |
| 3 | Executor | A7 | needs A6's record |
| 4 | Planner | A8 | what the measure reads |
| 4 | Executor model, fresh | A9 measure, cold review | |

One pull request, after wave 4.

## 6. Risks

- **A1 touches every import path inside `@gerak/moves`.** One scripted commit, with no other change, checked by
  samples before and after.
- **Relative colour support:** Chromium 119 or later; other browsers are not tested here.
- **Descriptor thresholds:** the quality ranges and the duplicate distance are guesses until the first measure; the
  table is one place to tune.
- **Rewriting moves can shift a piece:** A4 compares samples and reviews every piece that imports a changed move.

## 7. Done when

The measure passes, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
