# Anatomy plan: parts, fields and a catalog that measures

**Status:** Approved, 2026-11-14, after one round of critique; waves 1 to 3 built. Revised 2026-11-15 with the
motion vocabulary (ADR-186, waves 4 to 6), proposed.
**Base:** `feat/toolkit` at `bad02ccf` (pull request 595, not merged); rebase on `main` once it merges.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md`, `docs/ADR-172-*.md`,
`docs/ADR-173-*.md`, `docs/ADR-176-*.md`, `docs/ADR-184-*.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**An agent making a piece finds the building block it needs by what it does and how it feels, writes a new move
from shared parts instead of hand-written trigonometry, and moves skew, shadow and colour with the same rules as
position.** A person reading the code finds each layer in its own folder, and each brief's work in its own folder.
**An agent designs the motion a brief needs in a vocabulary it can read and ask about (fields, and parts by kind),
and reuses a move only when one already does that design;** the catalog answers a design, not only words.

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

This plan also lays the ground for **installable style kits**, the next plan: a kit carries a style's moves, its
skin tokens and a style card (its qualities as descriptor ranges and its habits), so a person installs it, writes a
new brief with new references, and an agent makes a new piece in that style, which the review checks against the
card. Here: moves that are portable files, a catalog that reads any declared source of moves, and descriptor ranges
in one shape a style card can reuse.

Not planned here: the style kit itself; publishing a move pack; a shared registry; the motion atlas
(`plan/motion-atlas-plan.md`, deferred); a sameness score over agents' pieces (its own plan, about 600k tokens, the
owner's call); colour in 3D (a 3D piece keeps `custom` numbers); `chroma`; a mask of any shape; a new package.

## 2. Architecture

Five layers. Each uses only those below it, and each has one folder; a repo test refuses a file that imports from
a folder of a higher layer.

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
fields/       pose.ts pose3d.ts combine.ts           (the table, the pose types, combine, combine3d, lift2d)
parts/
  time/           time.ts time-at.ts
  laws/           ease.ts spring.ts keyframes.ts wave.ts envelopes.ts ballistic.ts
  blends/         mix.ts mix3d.ts squashed.ts
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

`squashed` leaves `pose.ts` and `squashed3d` leaves `pose3d.ts` for `parts/blends/squashed.ts`; `mixPose3d` and
`mixPoint3d` leave `pose3d.ts` for `parts/blends/mix3d.ts`, so no file in `fields/` imports a part. The group
`eases` becomes `laws`; `camera` and `compose` are new groups; `fields` lists `combine`, `combine3d` and `lift2d`.

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
- **A move is a portable file.** A move outside `@gerak/moves` imports only `@gerak/moves` (all 20 local moves do
  today), so it can be copied into another project or published in a pack as it is.

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
  - `noise1d(seed)`: a function of time in ms answering -1 to 1, smooth (no step over 0.12, a smoothstep's steepest across
    the range, between ms 16 apart at the default `scale` of 400 ms), the same for the same seed.
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
  The move's **primary field** is the one with the greatest offset over its judged kind's default review limit, read
  from the review's own defaults (`DEFAULT_LIMITS.jump`, `SCENE_LIMITS.turn`, `SCENE_LIMITS.ratio`); its descriptors
  are the move's.
- **One search over every declared source.** A project names its sources of moves, in order, in its app's
  `package.json`: `"gerak": { "moves": ["@gerak/moves", "./*/src/moves"], "promoteTo": "<folder or package>" }`.
  A source is a package that exports moves or a folder glob; with none declared, the list above is the default. In
  this repository `apps/pieces/package.json` declares that list and `promoteTo` is `packages/moves/src/moves`; a
  project elsewhere starts with only `@gerak/moves` and promotes into a folder it names, and with no `promoteTo`
  `motion:promote` refuses, naming the setting. Each move is tagged with
  its source: the package's name, `own` for the brief named by `--in <brief>`, or the other brief's folder name. Ids
  are unique within a source; two sources with one id are told apart as `<source>/<id>`. Moves are code meant for
  reuse, unlike pieces, so other briefs' and installed packs' moves are offered like any other; importing a move
  from another source is how it earns promotion.
- **An index is a cache, and one function answers queries.** The catalog writes each move's record (id, source,
  role, fields, descriptors, the building blocks it imports, description, import) to a generated file, keyed by a
  hash of the move's source file so only a changed move is sampled again; the file is not committed and is rebuilt
  when missing. Every flag goes through one `query(records, request)`, so a database could later answer behind it
  with no change to the commands.
- **A query, not a dump.** With no query, `motion:moves` prints a summary of at most 20 lines: how many moves per
  role and per source, the qualities `--like` knows, and three example queries. A query prints at most 10 compact
  lines (`--all` lifts the cap), each: id, source, role, fields moved, the first sentence of its description, and
  its import, a path relative to `--in`'s `src/` when given (`import { jolt } from "../../showreel/src/moves/jolt"`)
  or `@gerak/moves` for the library. `-- <id>` prints the full entry: options with ranges, moments, the building
  blocks it imports, its descriptors, its example call and the briefs that import it.
- **Queries, combinable:** `--role <role>`; `--find <words>` (every word in its id, description or option names);
  `--fields x,scale` (moves every one of them); `--like <quality>` (the guide's qualities, each a
  `DescriptorRanges` record, a range per descriptor, in one table in `packages/tools/src/scene/catalog.ts` the guide
  quotes; a style card will use the same shape); `--near <id>` and
  `--far <id>` (by descriptor distance: the sum of squared differences of `peak`, `overshoot`, `rings / 4`,
  `windup` and `settle`, plus 1 when the primary fields differ).
- **Ranked by fit, never by use.** Matches order by how well they fit the query (distance for `--like`, `--near`
  and `--far`; words matched for `--find`), then by id with the source as no factor, so a library move is not
  preferred because it is a library move. How often a move is used shows only in its full entry and in
  `--candidates`, since ranking by use makes every brief pick the same few.
- **Reuse found at writing time.** When the gate (`motion:moves -- --check`, which writing a move ends with) meets a
  move within the duplicate distance of an existing one, library or any brief's, its finding says which and how to import it: "close to `jolt`
  (showreel): import it instead, or change what makes yours differ".
- **Near-duplicates are found.** Two moves with one role and one primary field within distance 0.02 of each other
  are a gate finding naming both, whichever sources they come from. Pairs found today go in
  `scripts/duplicate-baseline.json`, which may only shrink. `motion:promote` refuses a move with a finding; there is
  no override.

## 3b. Decisions to record (ADR-186): the motion vocabulary

The kinds of thing a piece is assembled from, each with a contract a gate checks and one owner:

| Kind | What it is | Contract | Owner |
| --- | --- | --- | --- |
| Field | one named number a target can carry | meaning, unit, rest, how two answers join, least and most, how the review judges it, dimension (2D, 3D or both) | its row of `VALUE_FIELDS` |
| Pose | the fields of one target at one instant | a partial record of fields, `anchor` and `custom` numbers, nothing else | `Pose2d`, `Pose3d` |
| Part | a pure function that shapes change, knowing no target or role | its kind's rule, sampled by the part gate | `definePart`, in its kind's folder |
| Move | parts coupled on fields inside one progress | its role, options with ranges, moments, example; measured shapes | `defineMove` |
| Composition | moves placed in time and across targets | stateless; answers a time, or a pose from poses | `compose/` |
| Shape, quality | a moved field's measured motion; a named range of shapes | measured, never declared | the gate; `QUALITIES` |

- **A part's kind is its folder.** `packages/moves/src/parts/<kind>/`, one kind per file, replacing the topic
  groups:

  | Kind | Signature | Rule the part gate samples | Parts today |
  | --- | --- | --- | --- |
  | `time` | builds, reads or reshapes a `Time` | progress stays 0 to 1 | `span`, `window`, `windowed`, `atProgress`, `liveAt`, `elapsedOf`, `withProgress`, `timeAt` |
  | `ease` | progress to progress | 0 at 0, 1 at 1 | `ease.*`, `backEase`, `springEase` |
  | `envelope` | progress to an amount | never below 0; its declared values at 0 and 1 | `taper`, `decay`, `attack`, `arch` |
  | `oscillation` | progress to a swing | within its declared bound; its declared crossings of 0 | `wave`, `shaken` |
  | `dynamics` | a closed-form physical answer | finite; at rest when it starts at rest | `spring` |
  | `path` | progress or share and geometry to a point or pose | at its declared ends | `ballistic`, `along`, `along3d` |
  | `geometry` | points, curves and lenses to points or turns | finite for finite input | `toCubics`, `toCubics3d`, `radial`, `aim`, `orbit`, `project3d` |
  | `blend` | a, b and a share to the type of a | a at share 0, b at 1 | `mix`, `mixAngle`, `mixPoint`, `mixPose`, `mixPose3d`, `mixPoint3d` |
  | `coupling` | an amount or a speed to a pose | at rest when the amount or speed is 0 | `squashed`, `squashed3d`, `squashFromSpeed`, `smear`, `smear3d` |
  | `signal` | time and events to a value | the same when sought out of order as when played to | `follow`, `react`, `tally`, `trail`, `trailTurn`, `velocity`, `velocity3d`, `keyframes`, `noise1d` |
  | `utility` | anything else that is pure | none sampled | `seeded`, `mergeEvents`, `isMotionEvent` |

- **`definePart(contract, fn)`** returns `fn` itself with its contract attached, as `defineMove` does, so no call
  site changes; the contract holds the facts its kind's rule needs (an envelope's values at 0 and 1, an
  oscillation's bound). The part gate samples every exported part against its folder's rule; a part outside a kind
  folder is refused.
- **A field row is its contract.** `VALUE_FIELDS` rows gain `meaning` (one sentence), `unit` (`px`, `deg`, `scale`,
  `share`, `order` or `number`) and `dimension` (`2d`, `3d`, `both`). **Each renderer owns what it writes:** the DOM
  renderer and `@gerak/three` each export the fields they write and the fields they leave unwritten with a reason; a
  test refuses a field of a renderer's dimension that is in neither.
- **The vocabulary is one readable thing.** `motion:moves -- --anatomy` prints the fields grouped by what they change
  with their meanings, the parts grouped by kind with their call shapes and first sentences, and the shape words with
  the qualities; `--json` gives the same data, which the design query and a later style card read.
- **Shapes per field.** The gate keeps every moved field's shape, not only the primary field's; `--near`, `--far`,
  `--like` and the duplicate check compare field by field, a field one move moves and the other does not counting as
  far.
- **The catalog answers a design.** `--move <field>[:<quality>]` (repeatable) and `--uses <kind or part>` describe
  the motion an agent designed; every move is scored on the fields it shares, each shared field's fit to its quality,
  and, weakest, the parts or kinds it uses. Each row says what matched and what did not; when no move scores well,
  the answer says so, names the design's parts and kinds, and gives the `motion:new -- --move` line.

## 4. Slices

### A0. Decision and architecture (planner)

- ADR-185 and its index line; ADR-176's recipe clause marked superseded in the index; `docs/ARCHITECTURE.md` §2a
  becomes the table in §2; `docs/MAP.md` gains both layouts.

### A1. Folders of `@gerak/moves` (planner, by script)

- **Invariant:** every file moves to its folder with `git mv`, changing only import paths; `squashed`,
  `squashed3d`, `mixPose3d` and `mixPoint3d` are cut into `parts/blends/` with their bodies unchanged; `index.ts`
  exports the same names in the same order, so the generated reference is unchanged; every sample is unchanged; the
  cycle and comment baselines take the new paths and do not grow; `promote.ts` writes a promoted move to
  `src/moves/`; a repo test refuses an import from a higher layer's folder (fields, then parts, then moves and
  compose), and fails if `mix3d.ts` is put back in `fields/`.
- **Owner:** `packages/moves/src`, `packages/tools/src/scene/promote.ts`, `test/repo/` (the layer test).
- **Check:** the full check, and the lead samples every built-in move's example before and after and compares them
  (a one-off check named in the pull request, since nothing behaves differently to test).

### A1b. Pieces by brief (executor)

- **Invariant:** the files of §2's `apps/pieces` layout are where it says, by `git mv`, in one commit; tools and
  tests follow in another. `motion:new`, `motion:new --move <id> --in <brief>`, `motion:import-svg`,
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
  importing another brief's move is a candidate; a duplicate piece name is refused naming both paths; a repo test
  refuses a file in any brief's `src/moves/` that imports anything but `@gerak/moves`.

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
  and `ballistic` call `ballistic`, converting their `apex` (a Bézier control height) to the
  part's true peak so their samples match within 1e-9; the local `tint` stays a ramp of a named custom number, since
  five showreel pieces mix their own named colours with it, and its description points to the `tint` field for new
  colour work; a `custom` name equal to a field's name is refused where `applyValue` checks custom names.
- **Owner:** `packages/moves/src/moves/`, `apps/pieces/{showreel,penguin}/src/moves/`, `packages/dom/src/render.ts`
  (the refusal).
- **Test:** sample comparison per move; a repo test that no file in a `moves/` folder calls `Math.sin`, `Math.cos`
  or `Math.exp`.

### A7. Descriptors and the catalog (executor, after A1b and A6)

- **Invariant:** as decided. **Owner:** `packages/tools/src/scene/moves.ts` (descriptors), `catalog.ts` (sources
  from `package.json`, the index, `query`, ranking, the summary, the quality table), the gate (the duplicate
  finding), `promote.ts` (`promoteTo` and the refusal), `scripts/duplicate-baseline.json`,
  `packages/tools/bin/motion-moves.mjs`, `apps/pieces/package.json` (its `gerak` entry).
- **Test:**
  - descriptors of hand-built moves with known peak, overshoot, rings, wind-up and settle, one travelling field and
    one oscillating;
  - sources: a scratch project declaring a package source and a folder source finds moves from both, tagged; with no
    `gerak` entry it reads the default list; two sources sharing an id are listed as `<source>/<id>`; `promoteTo`
    is where `motion:promote` writes;
  - the index: a second query samples nothing; editing one move resamples that move alone; a deleted index is
    rebuilt;
  - a scratch library move, own move and other brief's move are each found by `--find`, `--role`, `--fields`,
    `--like`, `--near` and `--far`, tagged with their source, with an import that compiles from `--in`'s brief;
  - two moves fitting a query equally come in id order whatever their sources, and use never changes the order;
  - the summary has at most 20 lines and a query at most 10 without `--all`;
  - a copy of another brief's move under a new id is a finding naming that brief's move and its import; a pair in
    the baseline is not, and the baseline cannot gain one.
  - The quality table's ranges are the builder's choice, recorded in that one table.

### V0. Parts by kind (planner, by script)

- **Invariant:** every part moves with `git mv` into `parts/<kind>/` as the table says, a file holding two kinds cut
  in two with bodies unchanged (`events.ts`: signals and utilities; `along3d.ts`: `toCubics3d` to geometry); only
  import paths change; `index.ts` exports the same names in the same order; every move's samples are unchanged; the
  layer test and `moveParts()` groups follow the new folders.
- **Owner:** `packages/moves/src/parts/`, `packages/tools/src/scene/parts.ts` (`PART_GROUPS` becomes the kinds).

### V1. Fields as contracts (executor)

- **Invariant:** as decided; every row has `meaning`, `unit` and `dimension`; the DOM renderer and `@gerak/three`
  each export what they write and what they leave unwritten, with a reason.
- **Owner:** `packages/moves/src/fields/pose.ts`, `packages/dom/src/render.ts`, `packages/three/src/pose2d.ts`,
  `pose3d.ts`, a repo test.
- **Test:** a row without a meaning fails to type-check; the coverage test fails when a renderer drops a field from
  both of its lists.

### V2. Parts with contracts (executor)

- **Invariant:** as decided; every exported part is declared with `definePart` in its kind's folder; the part gate
  runs in `npm run check`.
- **Owner:** `packages/moves/src/parts/**` (the declarations, no behaviour), `definePart` beside `defineMove`,
  `packages/tools/src/scene/parts.ts` (the gate and the listing by kind).
- **Test:** one test per kind with a part that breaks its rule (an envelope below 0, an ease missing 1, a blend not
  at `b` at 1, a signal that differs when sought); every current part passes; listing order and samples unchanged.

### V3. The vocabulary and the design query (executor, after V1 and V2)

- **Invariant:** as decided. **Owner:** `packages/tools/src/scene/{catalog,moves}.ts`,
  `packages/tools/bin/motion-moves.mjs`, `scripts/duplicate-baseline.json`.
- **Test:** `--anatomy` lists every field with its meaning and every part under its kind, and `--json` parses;
  `hop` keeps a `y` shape with rings; `--move y:heavy --move scaleY:loose` ranks a hand-built falling squash first
  and says why each row matched; a design no move fits gives the "no move does this" answer with its parts and the
  `motion:new` line; the duplicate check compares per field and the baseline is rebuilt for it.

### A8. Guide (planner)

- `agent-motion.md` "The loop": after the three lines, the agent reads `--anatomy` once and writes each line's
  motion as fields and parts by kind; then asks the catalog with `--move` and `--uses` (and `--far` from the obvious
  move for ideas); reuses a move only when a row matches the design, and otherwise writes one from the parts it
  named. `agent-moves.md` writes a move from parts with the coupling rule and no `Math.sin`; a skin section gives the
  colour and shadow rule; the reference regenerated.

### A9. Proof

- **Measure, two fresh Sonnet workers at medium effort, one brief:** a colour change, a cast shadow, a jiggle and a
  heavy landing. One works from the whole guide and catalog; the other from the guide with the vocabulary only
  (`--anatomy`, writing its own moves; the catalog's move search not offered). Each passes when it moves fields
  rather than `custom` numbers, calls no `Math.sin`, `Math.cos` or `Math.exp` in a move, its review is clean, and
  its report shows its design in fields and parts written before any move was chosen. They are compared on review
  findings, render rounds, tokens and minutes, moves reused and written, and how different the two pieces are.
- **Cold review:** a fresh executor-model agent reviews the diff and runs what it claims.

## 5. Team and order

| Wave | Who | Slices | Needs |
| --- | --- | --- | --- |
| 1 | Planner | A0, A1 | nothing |
| 1b | Executor | A1b | A1 |
| 2 | Executor | A2 then A6 | A1b (both edit `catalog.ts`) |
| 2 | Executor | A3 | A1b |
| 2 | Executor | A5 | A1b |
| 3 | Executor | A4 | A1b, A3, A5 |
| 3 | Executor | A7 | A1b, A6 |
| 4 | Planner | ADR-186, V0 | waves 1 to 3 |
| 4b | Executor | V1 | V0 |
| 4b | Executor | V2 | V0 |
| 5 | Executor | V3 | V1, V2 |
| 6 | Planner | A8 | V3 |
| 6 | Executor model, fresh, two workers | A9, then the cold review | A8 |

One pull request, after wave 6.

## 6. Risks

- **A1 and A1b move many files.** Each is a `git mv` commit with no other change, then a commit of paths, checked
  by samples and reviews before and after.
- **Relative colour** needs Chromium 119 or later; other browsers are not tested here.
- **`definePart` changes every part's declared type** to the function and its contract; the generated reference's
  signatures must read as before, which V2 checks.
- **Signals need events to be sampled;** the part gate gives each signal a small fixed event list.
- **Descriptors are new measures.** The quality table and the duplicate distance are tuned once, in one table, and
  the baseline keeps today's pairs from blocking the gate.

## 7. Done when

The measure passes, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
