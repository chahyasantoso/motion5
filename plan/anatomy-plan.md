# Anatomy plan: parts, fields and a catalog that measures

**Status:** Proposed, 2026-11-14, revised after one round of critique.
**Base:** `feat/toolkit` at `bad02ccf` (pull request 595, not merged); rebase on `main` once it merges.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md`, `docs/ADR-172-*.md`,
`docs/ADR-173-*.md`, `docs/ADR-176-*.md`, `docs/ADR-184-*.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**An agent making a piece finds the building block it needs by what it does and how it feels, writes a new move
from shared parts instead of hand-written trigonometry, and moves skew, shadow and colour with the same rules as
position.** A person reading the code finds each layer in its own folder, and each brief's work in its own folder.

What the code lacks today, on `feat/toolkit`:
- **Laws:** oscillations and envelopes are written by hand with `Math.sin`, `Math.cos` and `Math.exp` in the
  built-in moves `anticipate`, `overshoot`, `nod`, `pulse` and `swing`, and in the local moves `bump`, `hand-wave`,
  `jolt`, `launch`, `spring-settle`, `squish` and `waddle`; each envelope is a different product of the same few
  shapes (`(1-p)^2`, `exp(-kp)`, `1-exp(-kp)`, `sin(πp)`). There is no smooth noise. The local `ballistic` and `lob`
  each work out a throw under gravity.
- **Fields:** no skew (the renderer owns `transform`); colour and shadow only as untyped `custom` numbers, as the
  local `tint` move does.
- **Recipes:** two moves declare a `recipe`, both local (`implode`: `backEase`; `lob`: `squashed`); none built in.
  The gate checks only that the ids exist.
- **Catalog:** one flat list in one order; nothing measured to search by, so "heavy" or "near `lob`" cannot be
  asked, and `ballistic` and `lob` sit side by side unnoticed.
- **Layout:** `packages/moves/src` holds 54 files in one folder, fields, laws, moves and composition mixed, while
  `MOVE_PARTS` in `packages/tools/src/scene/parts.ts` is a second, hand-kept list of the building blocks.
  `apps/pieces/src` holds every piece's files beside the app's players and one shared `moves/` folder; 18 of its 20
  moves serve the showreel brief alone and 2 the penguin, and `export const brief` (declared by 8 files) is a second
  owner of which brief a piece answers. `apps/examples` is a second app of content: nine worked examples that tests
  and `npm run test:frames` read, with no dependency `apps/pieces` lacks.

Not planned here: the motion atlas (`plan/motion-atlas-plan.md`, deferred); a sameness score over agents' pieces
(its own plan, about 600k tokens, the owner's call); colour in 3D (a 3D piece keeps `custom` numbers); `chroma`; a
mask of any shape; a new package.

## 2. Architecture

Five layers. Each uses only those below it, and each has one folder.

| Layer | Answers | Lives in |
| --- | --- | --- |
| Fields | what can change on a target, where it rests, how two answers join, how the review judges it | `packages/moves/src/fields/` |
| Parts | how a number, point or pose changes over time, with no role, rest contract or option gate | `packages/moves/src/parts/<group>/` |
| Moves | a named behaviour: parts coupled on fields inside one progress, with a role, options, moments and an example | `packages/moves/src/moves/`; a brief's own in `apps/pieces/<brief>/src/moves/` |
| Composition | moves placed in time and across targets: phases, lanes, reshaped time | `packages/moves/src/compose/`; the piece format (cast, story, layouts, carrying) in `@gerak/stage` |
| Pieces | one brief's motion, as content | `apps/pieces/<brief>/`, the worked examples included |

- **A move** exists where parts couple inside one progress (a squash because of the landing, at the landing) and an
  option is worth turning in another brief. Parts merely side by side are composition.
- **Composition is library code, a piece is content.** Composition helpers stay in `@gerak/moves` because a plain
  scene with no stage uses `sequence` and `lanes`, and no built-in move imports them. Pieces are not a package.
- **One owner per list.** The building blocks are the exports of `parts/` and `compose/` and the functions of
  `fields/`, grouped by folder, each described by its own doc comment. A field's review kind is a column of
  `VALUE_FIELDS`. What a move is made of is read from its source. A piece's brief is its folder.

### `packages/moves/src`

```text
fields/       pose.ts pose3d.ts combine.ts           (the table, the pose types, combine, lift2d)
parts/
  time/           time.ts time-at.ts
  laws/           ease.ts spring.ts keyframes.ts wave.ts envelopes.ts ballistic.ts
  blends/         mix.ts squashed.ts
  paths/          shapes.ts path.ts along.ts along3d.ts arc-length.ts radial.ts
  follow-through/ trail.ts trail-turn.ts velocity.ts velocity3d.ts speed-of.ts smear.ts smear3d.ts
                  squash-speed.ts shaken.ts
  events/         events.ts
  randomness/     random.ts noise.ts
  camera/         stage3d.ts
moves/        declare.ts, whole.ts and one file per move and modifier
compose/      sequence.ts lanes.ts reversed.ts repeated.ts loop.ts
index.ts      the one entry; no subpath exports
```

`squashed` leaves `pose.ts` for `parts/blends/`. The group `eases` becomes `laws`; `camera` and `compose` are new
groups, `fields` lists `combine` and `lift2d`.

### `apps/pieces`

```text
<brief>/
  src/              the brief's pieces and components; src/moves/ its own moves
  references/       its own assets: models, recordings, drawings
  <name>.html       a piece's own page, when it has one
src/                the players every brief uses: stage, live, talk
references/         assets more than one brief uses (the dragonling, talk.json)
stage.html live.html talk.html index.html
test/               every test of the app, the worked examples' included
```

A brief is any folder at the top of `apps/pieces` that holds a `src/`, except the app's own `src/`; the names
`src`, `references`, `test`, `dist` and `node_modules` are not briefs. A piece's page is served at
`/<brief>/<name>.html`.

The briefs: `showreel` (`showreel`, `showreel-b` to `showreel-f`), `night` (`night-a` to `night-f`), and one each
for `penguin`, `shop`, `kelvin`, `avatar-3d`, `dragon-intro`, `saved`, `nowplaying`, `tempo`, and the nine worked
examples (`timing`, `catch`, `card`, `splash`, `pile`, `principles`, `principles3d`, `character3d`, `overlay3d`).

- **The folder is the brief.** `export const brief` goes; piece names stay unique across briefs, so
  `stage.html?piece=<name>` is unchanged, and two pieces with one name are refused naming both.
- **A brief's moves live with it.** A piece importing a move from another brief's `src/moves/` is what
  `motion:moves -- --candidates` lists for promotion into `@gerak/moves`.
- **An agent works in one folder,** `apps/pieces/<brief>/`; the guide test still refuses naming a worked example.

## 3. Decisions to record (ADR-185)

- **The layers are folders,** as above; `@gerak/moves` keeps one entry point, so no scene changes its imports.
- **The building blocks are listed from their folders.** `motion:moves -- --parts` prints every function exported
  from `fields/`, `parts/<group>/` and `compose/`, grouped by folder, with the first sentence of its doc comment, as
  the reference generator reads it per export. A test refuses an exported function with none. The hand list goes.
- **New parts, each pure:**
  - `wave(progress, count, phase = 0)`: `sin(2π · (count · progress + phase))`, `phase` in turns.
  - `envelopes.ts`: `taper(progress, power)` is `(1-p)^power`; `decay(progress, rate)` is `exp(-rate · p)`;
    `attack(progress, rate)` is `1 - exp(-rate · p)`; `arch(progress)` is `sin(π · p)`. A move multiplies them; every
    envelope above is a product of these.
  - `ballistic(progress, { dx, dy, apex })`: the point of a throw from `(dx, dy)` to `(0, 0)` under constant gravity
    at even time steps, its highest point `apex` px above the higher end.
  - `radial(angle, distance)`: the polar offset `{ x, y }`, angle in degrees clockwise from right.
  - `noise1d(seed)`: a function of time in ms answering -1 to 1, smooth (no step over 0.05 between ms 16 apart at the
    default `scale` of 400 ms), the same for the same seed.
- **New 2D fields, each a row of `VALUE_FIELDS` and of `POSE_2D_NUMBERS`:**
  - `skewX`, `skewY`: degrees, rest 0, add, judged as a turn. The transform is translate, then rotation, then skew,
    then scale.
  - `shadowX`, `shadowY`: px, rest 0, add, judged as a position; `shadowBlur`: px, rest 0, add, least 0, judged as
    a position. `filter` is written when any of `blur`, `shadowX`, `shadowY`, `shadowBlur` is off rest, as
    `blur()` then `drop-shadow(x y blur var(--gerak-shadow, rgb(0 0 0 / 0.35)))`, each only when its fields move.
  - `hue`: degrees, rest 0, add, judged as a turn; `lightness`: rest 0, add, from -1 to 1, judged as a ratio;
    `tint`: rest 0, add, least 0, judged as a ratio, the share mixed toward the skin's `--gerak-tint-to`. The DOM
    renderer writes `--gerak-hue`, `--gerak-lightness`, `--gerak-tint` and clears each at rest. The skin uses them
    with fallbacks, e.g. `background: oklch(from color-mix(in oklch, #f53, var(--gerak-tint-to, white)
    calc(var(--gerak-tint, 0) * 100%)) calc(l + var(--gerak-lightness, 0)) c calc(h + var(--gerak-hue, 0)))`; the
    guide gives this rule once. Relative colour needs Chromium 119 or later; browser tests use `withPage`.
  - `ValueField` gains `judged: "position" | "turn" | "ratio"`, and `motion:review` reads it instead of matching
    names; `custom` numbers stay ratios.
  - 3D poses gain none of these.
- **No `recipe`.** `defineMove` loses `recipe`. The catalog lists the building blocks a move's source imports from
  `@gerak/moves`. ADR-176's recipe clause is superseded and marked so in `docs/ADR-INDEX.md`.
- **No stored compositions.** No named template of moves ships.
- **Moves are measured.** The gate samples each move's example and option sets at its 62 steps. For each field it
  moves, `offset` is the value's distance from rest, and:
  - a field is **travelling** when it starts or ends off rest, **oscillating** when it starts and ends at rest;
  - `peak`: the progress of its greatest speed;
  - `overshoot`: travelling, the greatest offset past rest on the far side as a share of the start's offset;
    oscillating, 0;
  - `rings`: the crossings of rest after the first (travelling) or all of them (oscillating);
  - `windup`: travelling, the greatest move away from rest before the main move, as a share; oscillating, 0;
  - `settle`: the share of the run from the first crossing of rest (travelling) or the greatest offset
    (oscillating) until the offset stays within 2% of its greatest.
  The move's **primary field** is the one with the greatest offset over its judged kind's default review limit
  (`jump` 30 px, `turn` 150, `ratio` 1.5); its descriptors are the move's.
- **The catalog searches by them.** `motion:moves` prints one compact line per move (id, role, fields, the first
  sentence of its description) and the full entry with `-- <id>`, and gains `--like <quality>`, `--near <id>`,
  `--far <id>` (for the loop's step 1, ideas that differ) and `--fields x,scale`. `--like` takes the qualities of the
  guide's table, each a range of descriptors in one table in `packages/tools/src/scene/catalog.ts` that the guide
  quotes. Distance is the sum of squared differences of `peak`, `overshoot`, `rings / 4`, `windup` and `settle`,
  plus 1 when the primary fields differ.
- **Near-duplicates are found.** Two moves with one role and one primary field within distance 0.02 of each other
  are a gate finding naming both. Pairs found today go in `scripts/duplicate-baseline.json`, which may only shrink.
  `motion:promote` refuses a move with a finding; there is no override.

## 4. Slices

### A0. Decision and architecture (planner)

- ADR-185 and its index line; ADR-176's recipe clause marked superseded in the index; `docs/ARCHITECTURE.md` §2a
  becomes the table in §2; `docs/MAP.md` gains both layouts.

### A1. Folders of `@gerak/moves` (planner, by script)

- **Invariant:** every file moves to its folder with `git mv` and no other change; `squashed` moves to
  `parts/blends/squashed.ts`; `index.ts`'s export list, the generated reference's entries and every sample are
  unchanged; the cycle and comment baselines take the new paths and do not grow; `promote.ts` writes to
  `src/moves/`.
- **Owner:** `packages/moves/src`, `packages/tools/src/scene/promote.ts`.
- **Check:** the full check, and the lead samples every built-in move's example before and after and compares them
  (a one-off check named in the pull request, since nothing behaves differently to test).

### A1b. Pieces by brief (executor)

- **Invariant:** the files of §2's `apps/pieces` layout are where it says, by `git mv`, in one commit; tools and
  tests follow in another. `motion:new`, `motion:new --move <id> --brief <brief>`, `motion:import-svg`,
  `motion:live`, `motion:moves` (local moves and `--candidates`), the Vite plugin's move list, `loadStageModule`,
  `stage.html?piece=` and `npm run test:frames` find pieces and moves in brief folders. `export const brief` and its
  reader are gone. Every piece's `motion:review` findings and every test's outcome are the same before and after.
- **Owner:** `apps/pieces` (with `vite.config.ts`), `apps/examples` (removed), the root `package.json` workspaces
  and `package-lock.json`, `packages/tools/src/scene/{new,catalog,import-svg}.ts`, `packages/tools/src/page/live.ts`,
  `packages/tools/src/vite/index.ts`, `packages/tools/bin/motion-frames-check.mjs`, `scripts/repo-map.mjs`,
  `README.md`, `docs/MAP.md`, `docs/guide/*` paths, and the tests naming either app's paths
  (`packages/tools/test/{scene,motion-new}.test.ts`, `test/repo/{agent-guide,source-region-anchors,
  workspace-source-aliases}.test.ts`).
- **Test:** a scratch brief scaffolded by `motion:new` plays on `stage.html` and its move is listed; a piece
  importing another brief's move is a candidate; a duplicate piece name is refused naming both paths.

### A2 then A6. Building blocks from folders; no recipe (one executor, in that order)

- **A2 invariant:** as decided; `--parts` prints every block today's list has, each under its folder's group, and
  the new parts; no hand list is left. **Owner:** `packages/tools/src/scene/parts.ts`. **Test:** a function added to
  a folder with a doc comment is listed with no other edit; one without is refused.
- **A6 invariant:** as decided; `lob` lists `squashed` and `implode` lists `backEase`, read from their imports.
  **Owner:** `packages/moves/src/moves/declare.ts`, `packages/tools/src/scene/{catalog,moves}.ts`.

### A3. Laws (executor)

- **Invariant:** as decided, each part pure and exact at its ends. **Owner:** `parts/laws/{wave,envelopes,
  ballistic}.ts`, `parts/paths/radial.ts`, `parts/randomness/noise.ts`, and `index.ts`, which no other slice of
  wave 2 edits.
- **Test:** `wave` with integer `count` crosses 0 `2 · count - 1` times inside (0, 1); each envelope's closed form at
  0, 0.5 and 1; `ballistic`'s second difference of y is constant across steps and its top is `apex` above the higher
  end; `noise1d` within -1 to 1, smooth as stated, the same for the same seed and different for another.

### A5. Fields (executor)

- **Invariant:** as decided. **Owner:** `packages/moves/src/fields/pose.ts` (no new export from `index.ts`),
  `packages/dom/src/render.ts`, `packages/tools/src/scene/review.ts` (the `judged` read).
- **Test:** `combine` adds `hue`; a `hue` step from 179 to -179 is judged as 2 degrees and one from 0 to 160 is
  flagged at the default `--turn`; `skewX` lands between the rotation and the scale in the transform; a pose with
  only `shadowX` writes a `filter` with `drop-shadow` and no `blur()`; each field cleared at rest; a browser test
  reads a skinned member's computed colour at `tint` 0, 0.5 and 1 and finds the middle between the ends in OKLCH.

### A4. Moves on parts (executor, after A1b, A3 and A5)

- **Invariant:** `anticipate`, `overshoot`, `nod`, `pulse`, `swing` and the showreel's and penguin's `bump`,
  `hand-wave`, `jolt`, `launch`, `spring-settle`, `squish` and `waddle` call `wave` and the envelopes in place of
  `Math.sin`, `Math.cos` and `Math.exp`, matching their samples at every example and option set within 1e-9; `lob`
  and `ballistic` call `ballistic`, matching within 1e-6 or named with every piece using them reviewed clean; the
  local `tint` moves the `tint` field; then a `custom` name equal to a field's name is refused.
- **Owner:** `packages/moves/src/moves/`, `apps/pieces/{showreel,penguin}/src/moves/`, `fields/pose.ts` (the
  refusal).
- **Test:** sample comparison per move; a repo test that no file in a `moves/` folder calls `Math.sin`, `Math.cos`
  or `Math.exp`.

### A7. Descriptors and the catalog (executor, after A6)

- **Invariant:** as decided; the default catalog is shorter in bytes than today's for the same moves. **Owner:**
  `packages/tools/src/scene/moves.ts` (descriptors), `catalog.ts` (search, the quality table), `promote.ts` (the
  refusal), `scripts/duplicate-baseline.json`.
- **Test:** hand-built moves with known peak, overshoot, rings, wind-up and settle; a travelling and an oscillating
  field; `--like`, `--near`, `--far`, `--fields` on hand-built moves whose descriptors the test sets; a copy of a
  move under a new id is a finding; a pair in the baseline is not, and the baseline cannot gain one. The quality
  table's ranges are the builder's choice, recorded in that one table.

### A8. Guide (planner)

- `agent-motion.md` "The loop": step 1 uses `--far` from the obvious move, step 5 searches by `--like` and
  `--fields`, and work stays in `apps/pieces/<brief>/`; `agent-moves.md` writes a move from parts with the coupling rule
  and no `Math.sin`; a skin section gives the colour and shadow rule; the reference regenerated.

### A9. Proof

- **Measure:** a fresh Sonnet worker at medium effort builds one brief from the guide alone: a colour change, a cast
  shadow, a jiggle and a heavy landing. It passes when it moves the fields rather than `custom` numbers, calls no
  `Math.sin`, `Math.cos` or `Math.exp` in a move, its review is clean, and its interview names what it searched the
  catalog for.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 5. Team and order

| Wave | Who | Slices | Needs |
| --- | --- | --- | --- |
| 1 | Planner | A0, A1 | nothing |
| 1b | Executor | A1b | A1 |
| 2 | Executor | A2 then A6 | A1 |
| 2 | Executor | A3 | A1 |
| 2 | Executor | A5 | A1 |
| 3 | Executor | A4 | A1b, A3, A5 |
| 3 | Executor | A7 | A6 |
| 4 | Planner | A8 | all |
| 4 | Executor model, fresh | A9 | A8 |

One pull request, after wave 4.

## 6. Risks

- **A1 and A1b move many files.** Each is a `git mv` commit with no other change, then a commit of paths, checked
  by samples and reviews before and after.
- **Relative colour** needs Chromium 119 or later; other browsers are not tested here.
- **Descriptors are new measures.** The quality table and the duplicate distance are tuned once, in one table, and
  the baseline keeps today's pairs from blocking the gate.

## 7. Done when

The measure passes, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
