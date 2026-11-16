# Split plan: core, modules and library

**Status:** In progress, 2026-11-16: waves 1 to 3 done (S0 to S3); wave 4 (S4) next.
**Base:** `main` at `2a2021c6` (installable tools merged).
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md`, `docs/ADR-185-*.md`, `docs/ADR-187-*.md`,
`docs/ADR-188-*.md`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A person or agent installs gerak's core, reads one short reference whole, and makes, plays and checks a piece with
nothing else; when a piece needs bones, bodies or a shared vocabulary of moves and styles, they install that module or
the library and its own docs and commands arrive with it.** The code is split so that line is visible and enforced:
core holds what cannot differ between projects, modules hold opt-in capabilities, the library holds what can.

Why: today `@gerak/moves` mixes the kernel every package needs (fields, time, events) with parts, moves, compose and
styles, `@gerak/tools` depends on every package, and one 88 KB reference covers all of it. On the NADI brief a gerak
agent cost 187.5k tokens against a plain HTML/JS agent's 110.6k; it read 17 KB of guide, grepped the reference, opened
package source, and still missed `lanes`, `trace`, `seeded` and `smudge`.

**Done when:** a project with only the core install set (section 3) runs `gerak init`, `new`, `review` and `frames`
from tarballs with no module or library package present; the boundary scan refuses any import across the line the wrong
way; every package ships its own docs; `npm run check` is green; and a fresh agent builds NADI with core only, its
tokens, time and defects reported against the 110.6k plain baseline. That measure informs the search plan; it does not
gate this one.

## 2. The rule

| Group | Holds | Test |
| --- | --- | --- |
| **Core** | primitives: definitions and maths that cannot differ between projects, and the mechanisms that attach a look | a piece may need it, and no project would want its own version |
| **Modules** | opt-in capabilities that are still pure maths | only pieces with bones or bodies need it |
| **Library** | parts and moves that carry a choice, qualities, styles, and the tools for them | a project could want its own version |

Imports only go down: library may import modules and core; modules import core; core imports nothing of the other two.
The boundary scan enforces it. `@gerak/stage`'s skins, layouts and outlines are core: they are how a look is attached
and measured, not a look. Moves such as `trace` and `smudge` are library: a core-only piece gets the same effect from
the core fields (`drawn`, `blur`) and writes its own motion, a trade-off taken on purpose. Squash and stretch, smear, follow-through (`follow`, `trail`) and wander (`noise1d`) are
parts that carry a choice, so they are library; `cubicOut`, a sine wave and `velocity` are not, so they are core.

## 3. Layout, install sets and owners

`packages/` stays flat, as in Remotion, TanStack and Babel; the group is a list, not a folder.

```text
packages/                 group     holds
  core/     @gerak/core     core      primitives: fields, Pose2d/Pose3d, combine, rotation maths, Time, clocks, the
                                      time helpers in one `time` folder (span, chain, lanes, loop, sequence, repeated,
                                      reversed, timeAt), blend and keyframes, the standard eases and springs, basic
                                      envelopes and waves, geometry and paths, measures (velocity, speedOf, tally),
                                      events, seeded random, clamp, unreachable
  stage/    @gerak/stage    core      the piece contract: cast, beats, skins, scene, layouts, carried, outlines
  player/   @gerak/player   core      the clock that plays a scene
  dom/      @gerak/dom      core      the DOM renderer
  react/    @gerak/react    core      the React renderer
  three/    @gerak/three    core      the Three.js renderer (no rig)
  tools/    @gerak/tools    core      the gerak command, the core commands, the pages
  rig/      @gerak/rig      modules   bones, chains, joints, IK; pure
  rig-three/ @gerak/rig-three modules the glTF skeleton binding (three an optional peer); not pure
  physics/  @gerak/physics  modules   2D bodies and worlds
  rapier/   @gerak/rapier   modules   the Rapier engine
  moves/    @gerak/moves    library   definePart and the part kinds, parts that carry a choice (coupling, follow,
                                      trail, react, noise1d), defineMove, the named moves, qualities, descriptors,
                                      style cards; depends on rig (rope); pure
  moves-tools/ @gerak/moves-tools library the library's commands and review finder; not pure
```

- **The groups:** each package's manifest declares `"gerak": { "group" }`, beside the pure layer the same field
  already declares, so the group ships with the package; the boundary scan refuses a package with none. Each
  package's `README.md` opens with its group.
- **The core install set:** `@gerak/core`, `stage`, `player`, `dom`, `react`, `tools`, with peers `react`, `react-dom`,
  `vite`, `playwright-core`. `@gerak/three` is core but optional, for 3D pieces.
- **Paths do not change:** every workspace stays `packages/<name>`; scripts, aliases and globs keep their form, and
  the new package `core` is one more name in them.
- **The library's commands ship beside it:** `@gerak/moves-tools` (library, not pure, so `@gerak/moves` stays pure)
  holds the catalog (`gerak moves`), `promote`, `style`, `new-move` and review's design and style finder, and imports
  what it shares with core commands (brief folders, reading a scene module) from `@gerak/tools`, a downward import.

| Question | Owner |
| --- | --- |
| What a field is, how values combine, what time is | `@gerak/core` |
| How time is arranged: the `Timing` shape and the time helpers | `@gerak/core`'s `time` folder; a timing that carries a choice is a library part of kind `time` |
| Euler, matrix and quaternion maths | `@gerak/core`, moved from rig |
| What a primitive is | `@gerak/core`: documented by its doc comment, read whole, never registered |
| What a part is, and the closed set of part kinds | `@gerak/moves`; promoted brief parts land here, never in core |
| What a move is (`defineMove`), what a quality and a style are | `@gerak/moves` |
| Which commands `gerak` runs | `listCommands()` in `@gerak/tools`: its own list plus each installed package's declared list |
| Which findings `gerak review` reports | `@gerak/tools`'s review, which calls each installed package's declared finder through one `ReviewFinder` type |
| A package's docs | that package, in its `docs/` |

## 4. Decisions to record (ADR-189)

- **Three groups, imports only downward,** as in section 2. Supersedes ADR-185's layers inside `@gerak/moves` and
  ADR-187's "a brief imports `@gerak/moves`": a brief imports core, and a module or the library only if installed.
- **`@gerak/core` is new** and takes from `@gerak/moves` its fields, `parts/time` and `compose/` merged into one `time` folder, and the primitives: `parts/blend`,
  `parts/ease`, `parts/dynamics`, `parts/envelope`, `parts/oscillation`, `parts/geometry`, `parts/path`, `parts/utility`,
  and from `parts/signal` only `keyframes`, `velocity`, `velocity3d`, `speedOf` and `tally`; plus `unreachable`. Core
  drops their `definePart` registrations. `parts/coupling`, `follow`, `trail`, `trailTurn`, `react`, `noise1d` and
  `definePart` stay in `@gerak/moves`. From
  `@gerak/rig/src/frame/frame3d.ts` it takes exactly what core uses: `Euler3d`, `Vec3`, `Matrix3`, `Quaternion`,
  `ZERO_EULER`, `IDENTITY_MATRIX3`, `LOCAL_X3`, `matrixFromEuler3d`, `eulerFromMatrix3d`, `multiplyMatrix3`,
  `multiplyVector3`, `transposeMatrix3`, `canonicalDegrees`, `rotationAboutAxis3d`, the `*3` vector functions,
  `axisX3`, `quaternionFromEuler3d`, `matrixFromQuaternion`, `slerpQuaternion`, with `readNumber` and `isRecord` as
  internals. Pivot offsets, effective links, world frames, swing and twist and `blendOrientation3d` stay in rig, which
  imports the rest from core. A symbol moves when core code uses it, and the S1a builder lists any the rule adds.
- **Core is fixed.** A core export must come from one of its folders: `fields`, `time`, `blend`, `ease`,
  `envelope`, `geometry`, `path`, `measure`, `events`, `utility`, and the stage's contract; a test reads `@gerak/core`'s index and refuses an export from anywhere else.
- **There is no compose layer.** Composition and time parts are one thing, a time in and a time out, so `compose/`
  joins core's `time` folder and the word leaves the code, the guide and the catalog. This ends ADR-185's fourth layer
  (`compose/` above `moves/`). `anticipate` and `overshoot`, which take a move as a function of time, stay library
  moves. A timing that carries a choice (a set feel, a set rhythm) is a library part of kind `time`, declared and
  found like any part.
- **Time helpers have two shapes,** held by one exported type, `Timing<A> { of(time: Time, ...args: A): Time }`: a
  plain time in, time out (`reversed`, `repeated`, `timeAt`), or a `Timing` built once from its settings; and
  `sequence`, the one picker, which answers the phase playing. A test reads core's `time` exports and refuses any
  function or value of another shape. A helper with settings is a `Timing`: `span(from, to).of(time, ease?)`, `lanes(lengths, stagger, options).of(time, index)`,
  `loop(ms, { yoyo? }).of(time)`, `chain(lengths, { gap?, overlap? })` returning spans. `lanes` takes `by: number[]`,
  one value per item (a distance, an x), and starts the items in its order, beside `from`. `window`, `windowed`, `lane`
  and `laneTime` are removed; `createLoopCycle` is the player's frame-driven loop, moved beside its one user,
  `@gerak/dom`'s drivers, internal there and out of the reference, and is no scene helper. `story` stays the stage's named beats, built on `span`.
- **Private geometry becomes core,** moved, never copied: `pathFrom` (`parsePathData`), `rectPath`, `circlePath`,
  `ellipsePath`, `polygonPath` (`outlinesOf`), `arcPath` (`arcCubics`), `linePath`, `transformPath`, `resamplePath`,
  `reversePath` (the stage's `splitTo`, `reversed`), `pathBounds` (the dom's `strokeBox` and import-svg's `boundsOf`),
  `pathArea`, `isClosedPath`, `pathLength` (`arcLength`). `gerak import-svg` and the stage's outline matching import them.
- **One owner for shared helpers:** `unreachable` and `clamp` from `@gerak/core`, every copy removed; the stage's `lerp`
  becomes `mix`. A duplicate scan joins `npm run check`: two top-level functions of one name in two packages whose bodies,
  with comments and whitespace removed, hash alike, are a finding; its baseline may only shrink.
- **The skeleton binding leaves the core renderer:** `@gerak/three/skeleton` becomes `@gerak/rig-three`. `@gerak/tools`
  drops its `rig` and `three` dependencies; `gerak joints` reads a glTF file without rig and stays a core command.
- **Groups are a field, not folders.** `packages/` stays flat; each manifest's `gerak.group` names its group, and the
  boundary scan refuses a package with none and an import upward, against `scripts/group-baseline.json`.
- **Commands plug in.** A package declares `"gerak": { "commands": "<its cli module>", "review": "<module>" }` (for the
  library, `@gerak/moves-tools`);
  `listCommands()` reads its own list and each installed package's; `gerak --help` is tested with and without the
  library installed. A library command run without the library is "unknown command".
- **Each package ships its own docs** in `docs/`, listed in `files`. Generated pages come from each export's doc comment,
  grouped by source folder in a fixed order, each group opened by a hand-written `docs/<group>.intro.md`; the gate checks
  them as it checks the reference today. `@gerak/core/docs/core.md` and `@gerak/stage/docs/stage.md` are the read-whole
  pages: a table of contents, then every group, at most 20 KB each, a test holding the size. One page per group, with an
  index, comes from the same generator for people.
- **`gerak init` writes `AGENTS.md`** naming the two read-whole pages and, for each installed module or library
  package, one line naming its page; nothing for one not installed. `@gerak/tools` ships no guide.

## 5. Where today's guide goes

| Today in `docs/guide/` | Goes to |
| --- | --- |
| `agent-motion.md` (the loop, the stage module, composing, traps) | `@gerak/stage/docs/` (loop, module, traps); `@gerak/core/docs/` (composing, as the `time` group) |
| `agent-reference.md` | generated per package |
| `agent-events.md`, `agent-layout.md`, `agent-inputs.md` | `@gerak/stage/docs/` |
| `agent-outside.md` | `@gerak/dom/docs/` |
| `agent-3d.md` | `@gerak/three/docs/` |
| `agent-artwork.md`, `live.md` | `@gerak/tools/docs/` |
| `agent-rigs.md` | `@gerak/rig/docs/` |
| `agent-physics.md` | `@gerak/physics/docs/` |
| `agent-moves.md`, `agent-principles.md`, `agent-style.md`, `agent-reel.md` | `@gerak/moves/docs/` |

`docs/guide/` keeps the human `README.md` and `getting-started.md`, pointing into the packages.

## 6. Slices

### S0. Decision and the layout (planner)

Done. ADR-189 and its index line; ADR-185 and ADR-187 marked superseded in part. `"gerak": { "group" }` in every
package manifest (`@gerak/core` declares `core` when S1a creates it). The existing boundary scan
(`scripts/boundary-scan.mjs`, in `npm run check`) refuses a package with no group and an import of a higher group;
today's nine upward pairs are `scripts/group-baseline.json`, which may only shrink: a line the tree no longer holds is
refused until removed. No package moves.

### S1a. Rotation maths into core (executor)

`@gerak/core` created with the rotation maths of section 4; rig imports it; `scan:cycles` green.

### S1b. Kernel and parts into core (lead script)

`scripts/split-core.mjs`, run once and deleted in the same commit, moves the folders of section 4 with their tests,
`parts/time/` and `compose/` into the one `time` folder (`compose/loop.ts`, the player's frame-driven loop, into
`@gerak/dom` beside its one user, the drivers), strips the `definePart` registrations from what it moves, and rewrites
every import in packages, apps, briefs, docs and templates from `@gerak/moves` to `@gerak/core`. Before and after,
`gerak moves --json` prints the same records, and `gerak moves --parts` the same less exactly the moved primitives,
which the commit message lists; the commit holds the move alone.

Done as decided, with these placements: springs (`parts/dynamics`) in core `ease/`, `wave` in core `envelope/`,
`keyframes` in `blend/`, the measures and `tally` (cut from `events.ts`, where `follow` and `react` stay) in `measure/`,
the event list in `events/`; `shaken`, used only by library moves, stays in `@gerak/moves`; `isTokenName` moved to
`@gerak/stage`, which owns tokens, and `@gerak/moves` imports it. The group baseline holds two lines: three imports
rig (S2) and tools imports moves (S4).

### S1c. Fix-up (executor, after S1b)

What the script could not do: re-exports `@gerak/moves` must stop making, cycles, the part gate reading only the library's
parts, the core-export test of section 4; the catalog's `compose` group (`packages/tools/src/scene/parts.ts` and its
test) and the `compose` row of `test/repo/moves-layers.test.ts` removed, since the folder no longer exists. `npm run
check` green.

### S1d. Arranging time (executor, after S1c, beside S2 and S3)

Section 4's `Timing` type and its shape test in `@gerak/core`'s `time` folder; `lanes(...).of`, `lanes`' `by`, a scene
`loop(ms, { yoyo })`, `chain`; `window`, `windowed`, `lane`, `laneTime` removed and their uses rewritten (about 20 files:
11 briefs, `packages/moves` tests, `agent-motion.md`, `agent-reference.md`). The word "compose" for this goes from
`agent-motion.md` (its "Composing" section becomes "Arranging time"), `docs/ARCHITECTURE.md`'s layer table,
`docs/MAP.md`, `scripts/repo-map.mjs` and `docs/SESSION-STATUS.md`; "compose" as the verb for rotations stays. Tests
sample each new helper at its edges (start, end, gap, overlap, a zero-length lane, equal `by` values, a yoyo turn); each
rewritten brief's frames compare equal before and after; the shape test is shown failing on a helper of a third shape.

### S2. Modules clean (executor, after S1c)

`@gerak/physics` and `@gerak/rapier` depend on core only; `@gerak/three/skeleton` becomes `@gerak/rig-three`; rig
depends on core only; `@gerak/moves` declares rig. The boundary baseline loses those lines.

### S3. Geometry into core and one owner (executor, after S1c, beside S2)

Section 4's private geometry and one-owner moves, with their tests, and the duplicate scan.

### S4. Tools split (executor, after S1d, S2 and S3)

`@gerak/moves-tools` with the catalog, `promote`, `style`, `new-move` and review's design and style finder;
`@gerak/tools` with the core commands (`joints` among them), the pages, `listCommands()` and the `ReviewFinder` call, and
no dependency on a library or module package; the live editor finds built-in moves through a virtual module that is
empty without the library; the group baseline empty.

### S5a. Generated docs per package (executor, after S4)

The reference generator run per package into its `docs/`, by source folder, with the intro files; the gate per package.

### S5b. Guide moved, read-whole pages, init (executor, after S5a)

The guide pages moved by script as in section 5 and their links rewritten; `core.md` and `stage.md` with their size
tests; `gerak init`'s `AGENTS.md` with and without a module installed; `@gerak/tools`'s `guide/` removed; the shipped-docs
link test per package.

### S6. Install gates (planner)

`pack:check` gains a core-only project: the core install set alone, `node_modules/@gerak/` holding nothing else,
`gerak init`, `new`, a 3 s piece using `span`, `chain`, `lanes`, `mix`, `ease` and `arcPath`, `review` clean, `frames` rendering, `--help`
with no library command. A second project with core and library: `gerak moves`, `style check`, review's design findings.

### S7. Proof (planner, fresh agents, cold review)

A fresh Sonnet agent builds NADI from core-only tarballs, reading `AGENTS.md`; tokens, time, tool calls, files read and
defects reported against the 110.6k plain HTML/JS baseline, and its interview read for what it rebuilt by hand. A cold
review of the diff.

## 7. Team and order

| Wave | Who | Slices | Needs |
| --- | --- | --- | --- |
| 1 | Planner | S0 | nothing |
| 2 | Executor; lead; executor | S1a, then S1b, then S1c | S0 |
| 3 | Executors | S1d; S2; S3 | S1c |
| 4 | Executor | S4 | wave 3 |
| 5 | Executors | S5a, then S5b | S4 |
| 6 | Planner, fresh agents | S6, S7 | S5b |

One pull request, after wave 6. Executors are Sonnet at medium effort, in their own worktrees.

## 8. Deferred

- **Search** (`plan/search-plan.md`): `gerak find` over the library and the brief records, revised to sit on this split
  as a library command in `@gerak/moves-tools`. Next.
- **Harvest:** a library command that turns a piece's own helpers into declared parts and moves by type and by sampling,
  matches them against existing records, and proves by sampling every member before and after that nothing changed.
  After search.
- Brief folders mirroring the library (`src/parts/<kind>/`, a brief's own timings in `src/parts/time/`, `fields/`): with
  search.

## 9. Risks

- **S1b rewrites imports across most of the repository;** it is one scripted commit, the catalog's records compared
  before and after.
- **Core grows past one read:** about 45 primitives plus about 15 promoted geometry functions; if `core.md` will not fit 20 KB, the
  size test fails and the lead reports which group to move rather than raising the cap.
- **Plug-in commands and review finders are a second way things appear;** one function owns each list, tested with and
  without the library.
- **The groups are not visible in the folder tree;** each manifest's group, each README's first line and the boundary scan carry
  them instead.
- **`@gerak/moves` carries node code for its commands;** it stays behind the `cli` entry, and a test refuses a `node:`
  import reachable from the main entry, so a browser bundle never pulls it in.
- **Briefs in `apps/pieces` import across the line;** the S1b script rewrites them and the boundary scan checks them.
- **Core-only gerak may still cost more than plain code;** S7 reports it plainly, and the search plan decides from it.
- **Cost:** about 8 executor slices (90k to 260k each), the S1b script, the proof build (about 190k) and the review.
