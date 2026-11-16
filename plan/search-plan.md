# Search plan: find before you build

**Status:** Waiting for `plan/split-plan.md`; to be revised onto its library before it starts.
**Base:** `feat/installable` at `2e1117a4` (pull request 598, not merged).
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ADR-185-*.md`, `docs/ADR-187-*.md`, `docs/ADR-188-*.md`,
`.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**An agent making any motion piece, in any project, plans it, lists what the plan needs, looks each need up with one
command, uses what gerak has, and builds only what is missing, as a part or move the next search finds.** gerak gets
one index of everything an agent can use, built from the declarations themselves, and the general parts agents keep
rebuilding by hand.

Why: on 2026-11-16 the same 20 s brief (NADI) cost a gerak agent 187.5k tokens and 11 min, and a plain HTML/JS agent
110.6k and 6 min. The gerak agent rebuilt arcs, smooth lines, a camera, count-ups, fly-ins and seeded scatter by hand.
`arcCubics` and an SVG path parser existed but were private; `seeded`, `smudge`, `pulse`, `trace` and `lanes` were
public but not found, because search covers moves only, by exact substring.

**Done when:** the search test passes (section 6), and on NADI and one brief that is not a showreel, a gerak agent
costs fewer tokens than a plain HTML/JS agent on the same brief, with no more defects. If gerak still costs more with
this plan built, the pull request says so and recommends narrowing gerak to its checking tools.

**Budgets, so the loop does not cost more than it saves:** `PLAN.md` at most 40 lines; `gerak find` prints at most
5 hits, one line each with its import; the proof reports the plan-and-find tokens apart from the build's.

## 2. Architecture

| Thing | What it is | Lives in | Owner |
| --- | --- | --- | --- |
| A record | one usable library thing: a part (a timing included, kind `time`), move or quality | its declaration | the declaring package or brief |
| `does`, `tags` | a one-line purpose and at least three tag words, required on every record | the declaration | the declaration |
| A row | a record as data, typed `Row` with `kind: RowKind` | `packages/tools/src/scene/rows.ts` | `rows.ts` |
| Rows from source | every record read from declarations | `rowsFromSource(root)` | `rows.ts` |
| Rows from a build | the same rows written at build, read installed | `dist/gerak-index.json` per package | the build, by `rowsFromSource` |
| A brief's rows | read from its folders per search, cached by content hash | `<project>/node_modules/.cache/gerak/` beside `moves.json` | the catalog's cache |
| Search | `gerak find <words> [filters]` over one row array | `packages/tools/src/scene/find.ts` | `find` |
| A plan | storyboard, then the needs table | `<pieces>/<brief>/PLAN.md` | the agent |

- **One reader, two producers.** `find` reads a `Row[]`; source-reading and the shipped JSON are two producers of it,
  and a test says they agree for every package.
- `RowKind` is a closed union, `part | move | quality`, with the part's kind and the move's role as their own fields;
  core's fields and time helpers are read whole and are not rows; `find` and the build read it with an exhaustive `switch`.
- A row: `id`, `kind`, `group` (part kind or move role), `does`, `tags`, `signature`, `import`, `sample`, `changes`,
  `renders`, `measured` and `uses` (both from the catalog's existing move records), `source`.

## 3. Decisions to record (ADR-190)

- **One index, generated, never edited.** Every `defineMove`, `definePart` and quality declares `does` and `tags` (a count of at least three; wording is the lead's review). The gates refuse a record
  without them, as warnings until S2 lands and as refusals in S2's last commit.
- **`gerak find` is the one lookup.** Score per word: 3 for a tag, 2 for the id, 1 for `does`; a word matches after a
  suffix stemmer in `find.ts` (lowercase; strips `ing`, `ed`, `es`, `s`); any word scores; ties by kind order then id.
  Filters `kind:`, `group:`, `changes:`, `renders:`, `quality:`, `in:<brief>`. No hit prints: "none: write it in
  `<brief>/src/parts/<kind>/` with `definePart`, `does` and `tags`; it will be found next time." `gerak moves --find`,
  `--parts` and `--anatomy` are removed; `gerak moves <id>`, `--check`, `--design`, `--style` and the measured queries
  stay.
- **A brief's parts sit in kind folders,** `src/parts/<kind>/`, refused elsewhere, as in `@gerak/moves`. This amends
  ADR-187's "There is no separate kit folder" only in that. A brief's own timings are parts of kind `time`; a brief's
  own `fields/` waits until two briefs need it.
- **Plan, needs, find, build.** Before scene code an agent commits `PLAN.md`: the storyboard, then
  `| need | plan line | query | result |`. A need is one capability the plan requires, written as what it does ("a
  number that counts up in Indonesian format"), not how and not a thing; one row per capability. `result` is a record
  id or the id of the record it built. `gerak new` writes the empty table beside a new brief. `gerak review` on a piece
  adds one finding when its brief has no `PLAN.md` or a need with an empty result; nothing more.
- **No compose rows.** The split merges composition into core's `time` folder, read whole; only library timings,
  parts of kind `time`, are rows.
- **Promotions move, never copy.** `gerak import-svg` and the stage's outline matching import the moved parts.
- **One owner for shared helpers.** `clamp` stays in `@gerak/rig` and `@gerak/moves` registers that same function as
  a utility part; `unreachable` is exported by `@gerak/rig`, and every package that keeps a copy (dom, moves, rapier,
  rig, stage, tools) imports it, adding `@gerak/rig` to its dependencies where missing; path bounds become one
  `pathBounds`; the stage's private `lerp` becomes `mix`. A duplicate scan (same name and same body in two packages)
  joins `npm run check` with a baseline that may only shrink.
- **New library parts come from needs.** A need ending in a custom build in two or more briefs' `PLAN.md` is promoted;
  nothing is added for one brief.

## 4. Slices

### S0. Decision, schema, the failing search test (planner)

ADR-190 and its index line. `Row`, `RowKind`, and `does`/`tags` on `defineMove`, `definePart` and qualities, the gate
warning. `test/search/needs.json`: about 30 needs in agents' own words from the NADI and launch-night interviews and
S1, each with the id it must find in the top 3, using the names this plan fixes (S3a, S5); a name changes only in the
slice that changes it. A test reading it, failing while `find` does not exist.

### S1. Needs survey (planner, one fresh Sonnet agent, plan only)

An animated revenue chart and a logo reveal from a supplied SVG, each as `PLAN.md` only, no code, in a scratch
project. Its needs, with NADI's, feed `needs.json` and S5's list.

### S2. Fill the records (executors, parallel by folder)

`does` and `tags` on every part, move and quality in `@gerak/moves`; the gate turned to refusal last. Folders:
`style`, `parts`, `moves`.

### S3a. Promoted geometry (executor)

Into `@gerak/moves/src/parts/geometry/`, moved with their tests: `pathFrom(d)` (`parsePathData`); `rectPath`,
`circlePath`, `ellipsePath`, `polygonPath` (`outlinesOf`); `arcPath` (`arcCubics`); `linePath`; `transformPath` (the
matrix stays inside); `resamplePath`, `reversePath` (the stage's `splitTo`, `reversed`); `pathBounds`, `pathArea`,
`isClosedPath`. `pathLength` (`arcLength`) registered where it is. `mixBox` public in `@gerak/stage`.

### S3b. One owner (executor, beside S3a, disjoint files)

`clamp`, `unreachable`, the stage's `lerp`, the duplicate scan and its baseline.

### S4a. Rows and `find` (executor, after S0)

`rows.ts` with both producers and the test that they agree, the brief scan and its cache, ranking, filters, the no-hit
message, `pack:check` running `gerak find arc` from the tarball. The search test passes for every need whose record
exists.

### S4b. Removals (executor, after S4a)

`--find`, `--parts` and `--anatomy` out of `catalog.ts` (the builder lists the regions removed: `matchesWords`,
`request.find`, the part and anatomy printers, their usage lines and tests) and every mention of them in guides and the
skill.

### Checkpoint (planner, before S5)

One fresh Sonnet agent builds NADI with gerak from installed tarballs, guide as it stands plus a one-line "run
`gerak find` before writing a helper". Compared with the 110.6k baseline. If the gap has not narrowed, the lead reports
to the owner before S5, S6 and S7.

### S5. New parts (executor, after S1 and S3a)

Only parts S1 and NADI show in two or more briefs; expected among them `smoothThrough`, `countUp`, `formatNumber`, a
camera with `parallax`, `flyIn`, `ripple`; each with `does`, `tags` and a sample.

### S5b. Brief kind folders (executor, after S5)

Brief parts into `src/parts/<kind>/` by script, the catalog and gates refusing a part outside a kind folder, records
compared before and after.

### S6. Guide (planner)

`agent-motion.md` opens with the loop: plan, needs, `gerak find` per need, build what is missing as a record in the
brief, then the scene, with a `PLAN.md` example of at most 40 lines. `agent-reel.md` points at it.

### S7. Proof (planner, fresh Sonnet agents, cold review)

The search test green. NADI and the chart brief, each built by a fresh plain HTML/JS agent and a fresh gerak agent from
installed tarballs: four builds. Tokens (plan-and-find apart), time, tool calls and defects compared; interviews read
for what each rebuilt by hand. A second brief only if the result is ambiguous. A cold review of the diff.

## 5. Team and order

| Wave | Who | Slices | Needs |
| --- | --- | --- | --- |
| 1 | Planner; one fresh agent | S0; S1 | nothing |
| 2 | Executors | S3a; S3b; S4a | S0 |
| 3 | Executors | S2 (by folder); S4b | S3a, S4a |
| — | Planner, one fresh agent | Checkpoint | wave 3 |
| 4 | Executors | S5, then S5b | S1, checkpoint |
| 5 | Planner | S6 | S5b |
| 6 | Planner, fresh agents | S7 | all |

One pull request, after wave 6. Executors are Sonnet at medium effort, in their own worktrees.

## 6. The search test

`test/search/needs.json` holds needs as agents wrote them, each with the record ids that answer it. A need passes when
one expected id is in `gerak find`'s top 3, over this repository's rows and over an installed project's. The list only
grows: every proof interview adds the needs its agent wrote.

## 7. Risks

- **Tags we write may not match how agents ask;** the test is fed from agents' own wording, and S7 adds to it.
- **The plan-and-find loop costs tokens;** the budgets cap it, and S7 reports it apart.
- **Moving briefs' parts** touches many files; it is one scripted commit, records compared before and after.
- **Even with search, gerak may not beat plain code.** The checkpoint shows it early; the pull request says it plainly.
- **Cost:** about 9 executor slices (90k to 260k each), the survey (about 40k), the checkpoint (about 190k), S7's four
  builds (about 600k).
