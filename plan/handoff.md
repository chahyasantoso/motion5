# Handoff: the split, mid-flight

For whoever continues `plan/split-plan.md` in any harness (Claude Code, Antigravity, another agent tool). Read this,
then `AGENTS.md`, then `plan/split-plan.md` sections 4 to 7. Delete this file in the commit that finishes the plan.

## Where it stands

- Branch `feat/split`, pushed. One pull request for the whole plan, opened after wave 6; the owner merges by hand.
  Never merge.
- Waves 1 and 2 are done and green (`npm run check` and `npm run pack:check`):
  - S0: every `packages/*/package.json` declares `"gerak": { "group" }`; `scripts/boundary-scan.mjs` refuses an import of
    a higher group against `scripts/group-baseline.json`, which may only shrink. ADR-189 records the split.
  - S1a, S1b, S1c: `@gerak/core` (packages/core) owns the primitives (fields, time, blend, ease, envelope, events,
    geometry, measure, path, utility). Core primitives carry no part contract. The catalog lists library parts only.
- Wave 3 is done and green: S1d (time helpers in two shapes: `Timing` with `.of`, `loop`, `chain`, `lanes` with
  `by`; `window`, `lane`, `laneTime` removed), S2 (the skeleton binding is its own package `@gerak/rig-three`, modules,
  not pure, so rig stays pure; three no longer imports rig), S3 (path geometry in core: `pathFrom`, shape paths,
  `arcPath`, `transformPath`, `resamplePath`, `reversePath`, `pathBounds`, `pathArea`, `isClosedPath`, `pathLength`;
  one owner for `unreachable` and `clamp`; `npm run scan:duplicates` with `scripts/function-duplicate-baseline.json`).
- `scripts/group-baseline.json` holds one line, tools imports moves, which S4 removes.

## How the work runs

Two roles. The **lead** (the stronger model) plans, writes each builder's brief, combines, runs the full check, and
talks to the owner. **Builders** (a cheaper model, each in its own git worktree or checkout) build one slice from a
short brief. Map them to whatever agents the harness has.

- A brief names: the starting commit; the files that matter and what is in them; the invariant and the decisions
  already made (names, signatures, paths); the tests to write first; the exact commit messages; what not to touch; and
  "report what the brief got wrong and a not-verified list". `.claude/skills/wave-build/` holds the full method and a
  brief template; its rules apply in any harness.
- Two builders never edit the same file, except `packages/core/src/index.ts`, where each adds only its own block.
- Builders commit regenerated `docs/guide/agent-reference.md` and `docs/MAP.md` alone and last; the lead drops those
  commits and regenerates once (`npm run reference -- --write`, `npm run map -- --write`).
- Combining: cherry-pick each builder's commits onto `feat/split`, read its "not verified" list, delete
  `packages/*/dist`, run `npm run check` (save output to a file, test the exit code) and `npm run pack:check`, push.
- A lead edit to a baseline (`scripts/*-baseline.json`) is its own commit. Baselines only shrink.
- On Windows, write text that holds backslashes or backticks with a file tool, not a shell heredoc.

## What is left

| Wave | Slices | Notes |
| --- | --- | --- |
| 4 | S4 | the library's commands into `@gerak/moves/cli`; `@gerak/tools` stops importing moves (its baseline line goes, the group baseline is then empty); rig's `joints` command |
| 5 | S5a, then S5b | docs per package, read-whole `core.md` and `stage.md` (≤20 KB), guide moved, `gerak init` writes `AGENTS.md` |
| 6 | S6, S7 | core-only install gate; NADI proof against the 110.6k-token plain HTML/JS baseline; a cold review of the whole diff |

Then the pull request: invariants and tests, review findings and what was left, which checks ran on which commit, what
was not verified.

## Decisions the owner made (do not reopen)

- Core = primitives no project would want its own version of; modules = opt-in maths (rig, physics, rapier); library =
  parts and moves that carry a choice, qualities, styles and their commands. Imports only go down.
- `packages/` stays flat; the group is a manifest field.
- There is no compose layer: time helpers live in core's `time/`, two shapes (`Timing` with `.of`, or time → time) plus
  `sequence`. A timing with a set feel is a library part of kind `time`.
- Docs ship inside each package. Search (`plan/search-plan.md`) and harvest wait until the split is merged.
- Every measure of gerak runs a plain HTML/JS agent on the same brief beside it; gerak must beat it.
