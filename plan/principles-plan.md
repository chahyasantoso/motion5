# Principles and plain moves

## Goal

People and agents making a piece shape any signal with core's motion principles, and use a move package by reading
its README, or write their own moves beside the scene. The code drops the move catalog, parts, roles, style cards,
`@gerak/moves-tools` and the plugin hooks they needed, so there is less to read and nothing to register.

Status: approved 2026-11-18. Starts after `plan/shapes-plan.md` lands, and uses its `Curve` and `Signal`. One branch,
one pull request. `plan/search-plan.md` is withdrawn: there is no catalog left to search.

Read `AGENTS.md` first; every rule there applies.

## Where things stand

- `@gerak/moves` (group `library`) holds:
  - `defineMove`: an `id`, `role`, `description`, an options schema checked at run time, an `example` and `moments`;
  - 19 moves, sharing pose helpers in `moves/whole.ts`;
  - parts declared with `definePart`: `trail`, `trailTurn`, `follow`, `react`, `noise1d`, `squashed`, `squashed3d`,
    `smear`, `smear3d`, `squashFromSpeed`, `shaken`;
  - style cards and qualities (`defineStyle`, `QUALITIES` and the rest).
- `@gerak/moves-tools` ships the commands `moves`, `new-move`, `promote` and `style`, and a review plugin.
  `@gerak/tools` loads plugins through `listCommands`, `installedPackages` and `prepareFinders` in
  `packages/tools/src/scene/review.ts`. The plugin is the only reader of a stage's `design` and `style`.
- `@gerak/tools` also reads moves by name:
  - `virtual:gerak/built-in-moves` and `/__motion/moves` in `packages/tools/src/vite/index.ts`;
  - the code panel's ranges (`rangeForLiteral`), which clamp only when a range exists;
  - `movesFolders` and the brief import lint in `packages/tools/src/scene/briefs.ts`.
- `apps/pieces/package.json` declares `gerak.moves` and `gerak.promoteTo`.
- About 30 piece files import `@gerak/moves`, and 21 declare their own moves with `defineMove`.
- `scripts/pack-check.mjs` imports `LIBRARY_COMMANDS` from `packages/moves-tools/bin/commands.mjs`.
- `@gerak/moves` and `@gerak/moves-tools` together are about 5,770 lines.

## Decisions

### 1. Core holds the motion principles

- New core folder `principles/`, exported from `@gerak/core`. Add it to `FOLDERS` in
  `packages/core/test/core-folders.test.ts`. Its reference page is generated as for every folder.
- Each principle takes a signal and an options object, and returns a signal of the same pose type:
  - every knob is in px, world units, ms, degrees or a share;
  - a default is neutral, or there is none, and nothing is named after a feel;
  - a 3D principle is a separate function with a `3d` suffix, as `mixPose3d` is.

| Principle | 2D | 3D | Built from |
| --- | --- | --- | --- |
| Squash and stretch | `squashStretch(signal, { stretch, max })`: stretch along travel per 1000 px/s up to `max`, area kept | `squashStretch3d` | `velocity` + `smear`; `velocity3d` + `smear3d` |
| Anticipation | `anticipation(signal, { share, amount })`: `amount` of the travel the other way during the first `share` | `anticipation3d` | the `anticipate` move |
| Follow-through | `followThrough(signal, { stiffness, damping })`: each field chases the signal on a spring, turns the short way | `followThrough3d` | `trail`; `trail` + `trailTurn` |
| Overlapping action | `overlap(signal, { lagMs })`: the signal `lagMs` later, held at its start before; any pose type | (same) | `timeAt` |
| Arcs | `arc(signal, { bend })`: `bend` px across the travel at mid-progress, 0 at both ends | `arc3d`, with `bend` an `{ x, y, z }` offset | `arch` |
| Exaggeration | `exaggerate(signal, { amount })`: each field's distance from its rest times `1 + amount` | `exaggerate3d` | `valueField` rests |
| Secondary action | `secondary(primary, respond)`: `respond(velocity)` as a signal | `secondary3d` | `velocity`; `velocity3d` |

- `smear`, `smear3d`, `trail` and `trailTurn` move into the folder, moved not copied, and stay exported.
- `squashFromSpeed` is deleted: no piece calls it, and `smear` answers the same question.
- `core.md` states in three lines:
  - where the principles are;
  - slow in and slow out are the eases, and timing is beats, `span`, `lanes` and `chain`;
  - staging, solid drawing and appeal are not functions.
- Test first, one test per function with a straight-line signal. Examples:
  - `overlap` holds the start before `lagMs`;
  - `arc` is 0 at both ends and `bend` at the middle;
  - `exaggerate` with `amount: 0` changes nothing;
  - `followThrough` ends on the signal's end;
  - `squashStretch` keeps area.

### 2. `@gerak/moves` becomes a plain move package

- A move is a function from typed options to a `Signal`, for example `drop(options)`. Defaults live in the function;
  there is no options schema.
- Removed:
  - `defineMove` and every move type;
  - roles, `moments` and examples;
  - `definePart` and the part contract;
  - style cards and qualities;
  - the `anticipate` and `arc` moves, which core's `anticipation` and `arc` replace.
- Kept as plain functions: the other 17 moves, and `follow`, `react`, `noise1d`, `squashed`, `squashed3d` and
  `shaken`. A part with loose settings is built from its settings, as `plan/shapes-plan.md` decides for curves.
- `packages/moves/README.md`: two sentences on what the package is for, then one line per export.
- Test first: each kept move, sampled at progress 0, 0.5 and 1, gives the values it gave through `defineMove`.

### 3. `@gerak/moves-tools` and the plugin hooks go

- Delete `packages/moves-tools`.
- In `@gerak/tools`, delete:
  - the command and review plugin hooks in `listCommands`, `installedPackages` and `prepareFinders`, and
    `ReviewFinder`;
  - the built-in moves module, the `/__motion/moves` route and `movesFolders` with the brief lint;
  - the move ranges in `rangeForLiteral`.
- `design` and `style` leave `StageOptions`, `Stage`, `compileStage` and `SceneModule`. `delivered` and `launch-day`
  drop theirs.
- `apps/pieces/package.json` drops `gerak.moves` and `gerak.promoteTo`.
- In the same commit as the deletion, update `scripts/`:
  - `pack-check.mjs`, which otherwise fails to load: its `LIBRARY_COMMANDS` import and the three checks that read it
    (core-only `gerak --help`, its library-command refusals, and `gerak --help lists moves`), the library install set,
    and the core+library checks;
  - `installable-packages.mjs`, `repo-map.mjs` and `cycle-scan.mjs`;
  - the baselines, which may only shrink.
- Tests whose gate is deleted go in the same commit as the gate. Every other test that names moves is updated, not
  deleted.

### 4. Pieces keep their look

- A piece's own `defineMove` file becomes a plain factory of the same name. Its `description` becomes the first line
  of the doc comment.
- A style card a piece used becomes a plain object passed to `cssVariables`.
- A call `drop(options, time)` becomes `drop(options)(time, events)`. A move with fixed options is built once.

### 5. Record and docs

- `docs/ADR-192-principles-and-plain-moves.md` records Decisions 1 to 4. It supersedes, each in part:
  - ADR-189's library clauses, plugins and search;
  - ADR-168's "no wrapper that takes a move";
  - ADR-149, ADR-172, ADR-185's catalog, ADR-186 and ADR-187.

  Grep `docs/ADR-INDEX.md` for any other record that names `defineMove`, parts, roles or style cards. Then run
  `npm run adr-index:write`.
- Every doc naming `defineMove`, `definePart`, `gerak moves`, `new-move`, `promote`, `gerak style`, style cards or
  parts is rewritten or loses that line. That covers the guide, `core.md`, `commands.md`, the make-motion skill,
  `README.md`, `docs/MAP.md`, `docs/ARCHITECTURE.md` and the roadmap's "Done and not done" table.
- Delete `plan/search-plan.md`, and rewrite `docs/SESSION-STATUS.md`.

## Execution

1. **Baseline,** as `plan/shapes-plan.md` takes it: frames of every page under `apps/pieces`, each piece's
   `gerak review` output, and every command's output on `tempo`, `card` and `overlay3d`.
2. Decisions 1, then 2 with 4, then 3, then 5. `npm run check` is green after each.
3. Compare against the baseline. Only these differences are allowed, and the pull request names each one:
   - the design and style findings of `delivered` and `launch-day`;
   - the frames of pieces that used `anticipate` or `arc`, with before and after sheets;
   - the deleted commands.

   Anything else is a defect.
4. In the pull request, report:
   - `npm run check` with no `packages/*/dist`;
   - `npm run pack:check`;
   - the stage benchmark;
   - the comparison;
   - `npm run metrics`;
   - the line count of `packages/` before and after;
   - one cold review by an agent that has not read this plan.

## Not in this plan

3D objects in a stage (`plan/stage-3d-plan.md`); a second move package; recipes in the docs.
