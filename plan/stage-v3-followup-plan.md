# Stage v3 follow-up

## Goal

Agents making a piece in a project from `gerak init` get a type check that runs, beat changes that never show two
shots at once, and review findings that name what to fix, so a piece costs fewer tokens and rounds; the owner reads
one NADI measure that says whether gerak now beats a plain HTML/JS agent.

Status: proposed. Base: `refactor/points-and-reference` at `5219a5c5` (PR 600 merged); branch
`feat/stage-v3-followup`. `main` is still behind that base; merging it there is the owner's call, not this plan's.

## Where things stand

- Stage v3 is merged (ADR-190): one member list, list poses `(index, count) => pose` and `each`, compiled visibility,
  `frame` and `check`, a DOM renderer that skips hidden members, `@gerak/stage/render` and `/dom` entries.
- The guide states how the DOM renderer draws (`packages/stage/docs/stage.md`, "How the DOM renderer draws") and the
  page tools' size and server (`packages/tools/docs/commands.md`).
- NADI measure on 2026-11-18, fresh Sonnet medium agents, installed tarballs: plain HTML 94.1k tokens / 4.5 min, gerak
  v3 160.5k / 8.8 min. The v3 agent read 7 built source files for behaviour the guide now states.
- Budgets PR 600 missed: `packages/stage/src` 1716 lines (target 1300); an author reads `stage.md` 10.4 KB plus
  `reference/author.md` 8.9 KB (target 14 KB together).

## Decisions

### 1. Beat windows include their start and exclude their end

A member on `a: [0, 1000]` shows for `0 <= ms < 1000`; a window whose end reaches `durationMs` still holds past it.
Adjacent beats then hand over with neither overlap nor gap. Owners: `packages/stage/src/run/compile.ts` (windows) and
`run/timeline.ts` (`inside`); review's outside-stretch wording in `packages/tools/src/scene/review.ts` follows. Test
first: at the shared ms of two adjacent beats exactly one member shows; `frame.test.ts`'s inclusive-end assertions
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

### 4. An author reads at most 14 KB

The builder spec types an author never names (`Meta`, `Modifiers`, `Spec`, `ActorSpec`, `ListSpec`, `GroupSpec`,
`Members`) leave the root export, kept inside `author/`; `reference/author.md` then lists what a piece writes. Measure
`stage.md` plus `reference/author.md` after `npm run reference -- --write`; trim prose in `stage.md` only where a
sentence repeats the reference.

### 5. The source budget is re-set, not chased

`compile.ts` validation is most of the 1716 lines and stays. The plan's budget becomes "no growth from 1716";
`npm run metrics` or a line count in the pull request reports it.

## Execution

One session, one commit per decision, in the order above (1 changes behaviour, so it lands and is checked first).
Then `npm run check` with no `packages/*/dist`, `npm run pack:check`, `performance/stage-benchmark.mjs --compare
performance/stage-baseline.json`, and one cold review on Sonnet that sees neither plan nor history.

Last, the NADI measure: build tarballs with `node scripts/pack-check.mjs --keep`, move its `project` out, delete its
`pieces` and `gerak` field, run `npx gerak init`, `git init`; one fresh Sonnet agent at medium effort there and one
plain HTML/JS agent in an empty folder, both with the 2026-11-18 prompts (the NADI brief text is in that session's
transcript). Report tokens, calls, time, files read and defects by eye from the same six frames; interview the gerak
agent for every fact it learned outside the guide and state each one in the guide. One pull request.

## Not in this plan

Recipes or camera helpers in the docs; Three.js stages; the search plan (`plan/search-plan.md`), still next in line.
