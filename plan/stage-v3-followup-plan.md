# Stage v3 follow-up

## Goal

Agents making a piece in a project from `gerak init` get a type check that runs, beat changes that never show two
shots at once, and review findings that name what to fix, so a piece costs fewer tokens and rounds; the owner reads
one NADI measure that says whether gerak now beats a plain HTML/JS agent.

Status: approved 2026-11-18. Base: `refactor/points-and-reference` at `5219a5c5` (PR 600 merged); branch
`feat/stage-v3-followup`. `main` is still behind that base; merging it there is the owner's call, not this plan's.

## Where things stand

- Stage v3 is merged (ADR-190): one member list, list poses `(index, count) => pose` and `each`, compiled visibility,
  `frame` and `check`, a DOM renderer that skips hidden members, `@gerak/stage/render` and `/dom` entries.
- The guide states how the DOM renderer draws (`packages/stage/docs/stage.md`, "How the DOM renderer draws") and the
  page tools' size and server (`packages/tools/docs/commands.md`).
- NADI measure on 2026-11-18, fresh Sonnet medium agents, installed tarballs: plain HTML 94.1k tokens / 4.5 min, gerak
  v3 160.5k / 8.8 min. The v3 agent read 7 built source files for behaviour the guide now states.
- `packages/stage/src` is 1716 lines, most of it `compileStage` re-checking builder output; an author reads
  `stage.md` 10.4 KB plus `reference/author.md` 8.9 KB.

## Decisions

### 1. Beat windows include their start and exclude their end

A member on `a: [0, 1000]` shows for `0 <= ms < 1000`; a window whose end reaches `durationMs` still holds past it.
Adjacent beats then hand over with neither overlap nor gap. A beat of zero length (`[500, 500]`) is refused by
`compileStage` as an `invalid` beats error. Owners: `packages/stage/src/run/compile.ts` (windows) and
`run/timeline.ts` (`inside`); review's outside-stretch wording in `packages/tools/src/scene/review.ts` follows. Test
first: at the shared ms of two adjacent beats exactly one member shows, and a zero-length beat fails to compile; `frame.test.ts`'s inclusive-end assertions
change with it, and the stage guide's `.on(...)` line says the new rule. Pieces whose sheets change at a beat end are
named in the pull request.

### 2. `gerak init` writes the `tsconfig.json`

`init` writes `tsconfig.json` beside `package.json` (strict, `moduleResolution: "Bundler"`, `lib` `ES2022` and `DOM`,
`noEmit`, `skipLibCheck`, `include: ["<pieces>/*/src"]`) and refuses, as for its other files, when one exists. The
long tsconfig sentence in `stage.md` step 4 shrinks to "`npx tsc --noEmit` passes". `pack:check`'s core-only project
runs `npx tsc --noEmit` after `init` and after `new`.

### 3. A final-hold finding names what still changes

`short-hold` in `packages/tools/src/page/check.ts` carries the targets that changed in the last `hold` ms, and the
scene-file review does the same, so "the final pose holds only 16 ms" becomes "`camera` still changes 16 ms before
the end". The `gerak sample` hint in `commands.md` goes.

### 4. Every type an author meets is documented

No type that appears in a signature an author reads leaves the reference: hiding one sends agents to
`node_modules` source. Reading cost falls by clearer `stage.md` prose only. `test/repo/agent-reference.test.ts` gains
the rule: every type named in `reference/author.md` signatures has its own entry in a stage reference page.

### 5. `compileStage` checks only what types cannot

Cast objects come from the `m.*` builders, so `compileStage` stops re-checking their shape (`kind`, `meta` being an
object, `watch` a boolean, pivot numbers, content kinds). It keeps every check a type cannot express: duplicate names
across groups, dots in names, reversed stretches, beats past `durationMs` and of zero length, morph piece counts, a
`pick` answer outside `names`, non-finite `rest` and `frame` numbers, and readout and path answers checked when they
run. A hand-built cast object then fails with a plain error; the stage tests that smuggle one change to expect it.
The line count of `packages/stage/src` before and after is in the pull request.

## Execution

One session, one commit per decision, in the order above (1 changes behaviour, so it lands and is checked first).
Then `npm run check` with no `packages/*/dist`, `npm run pack:check`, `performance/stage-benchmark.mjs --compare
performance/stage-baseline.json`, and one cold review on Sonnet that sees neither plan nor history.

Last, the NADI measure: build tarballs with `node scripts/pack-check.mjs --keep`, move its `project` out, delete its
`pieces` and `gerak` field, run `npx gerak init`, `git init`; one fresh Sonnet agent at medium effort there and one
plain HTML/JS agent in an empty folder, both with the prompts in `plan/measure-nadi.md`, whose rows the result joins. Report tokens, calls, time, files read and defects by eye from the same six frames; interview the gerak
agent for every fact it learned outside the guide and state each one in the guide. One pull request.

## Not in this plan

Recipes or camera helpers in the docs; Three.js stages; the search plan (`plan/search-plan.md`), still next in line.
