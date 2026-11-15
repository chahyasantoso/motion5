# Handoff to the next session: the installable plan, in Claude Code

**Written:** 2026-11-15, after the style plan merged (pull request 597). Delete this file in the pull request that
builds the plan. The branch `feat/installable`, from `main` at `a249afe8`, holds `plan/installable-plan.md`, approved
after one round of critique, and nothing built.

## Read first, in order

1. `AGENTS.md`: the rules.
2. `docs/SESSION-STATUS.md`: what has landed.
3. `plan/installable-plan.md`: the plan, approved. Start wave 1.
4. `.claude/skills/wave-build/SKILL.md` and `references/brief-template.md`: how waves run. Use the skill.
5. `docs/ADR-179-*.md` (the clause this plan supersedes) and `docs/ADR-187-*.md`.

## Who does what

| Plan's role | Model and effort | Does |
| --- | --- | --- |
| Planner | the session that reads this file | S0, S3b and the install gate itself, briefs, combines, judges, opens the pull request |
| Executor | Sonnet, medium effort | one slice from one brief, in its own worktree (`isolation: "worktree"`), then reports |
| Measure | Sonnet, medium effort, a fresh agent | builds `launch-night` in a scratch project from the shipped guide alone |
| Cold reviewer | Sonnet, medium effort, a fresh agent | reviews the diff read-only and runs what it claims |

State `model` and `effort` on every agent start.

## Facts this plan rests on

- `packages/tools/package.json` is `private`, version `0.0.0`, exports `./src/*/index.ts` (`page`, `scene`, `vite`),
  peers `playwright-core` and `vite`. 19 `bin/motion-*.mjs` files each call `registerSourceLoader()`
  (`scripts/source-loader.mjs`) and import `../src/**/*.ts`.
- The root `package.json` holds 18 `motion:*` scripts; 44 files mention `npm run motion:`.
- `scripts/installable-packages.mjs` lists nine packages in dependency order; `scripts/build.mjs` builds each with its
  `tsconfig.build.json`; `scripts/pack-check.mjs` installs tarballs outside the repository (`peerVersions` covers
  react, react-dom, three, typescript and two types packages).
- `DEFAULT_ROOT` and `DEFAULT_SOURCE` are in `packages/tools/src/page/page.ts`; `fromCaller` reads `INIT_CWD`.
  `page.ts` and `live.ts` call Vite's `createServer({ root })` with no `configFile`.
- `apps/pieces/{stage,live,talk}.html` load `/src/*-main.ts(x)`; `apps/pieces/src/stage-module.ts` globs
  `/*/src/*.ts`; `apps/pieces/vite.config.ts` holds `motionLivePlugin`, source aliases and `optimizeDeps`.
- `carried` in `@gerak/stage` carries a member between layout boxes (`docs/guide/agent-layout.md`).
- Style cards: a brief's `style.ts`, `lively` shares per field, checked by `motion:review` and `motion:style`.

## Lessons that bind this work

- A test must be seen failing. A builder reports one failing line per new test; for a test whose failure only came
  from a missing module, the lead breaks the behaviour once and sees it fail. Break code by copying the file aside
  and restoring it, never with `git stash`.
- Run a tool on real pieces, not only its tests: in the style plan the measure itself exposed a measuring bug. A
  measure that passes against a defective rule proves nothing; fix, re-measure, run it again.
- A worktree agent may start from another branch: every brief carries the `git merge --ff-only origin/<branch>` line
  and the `git reset --hard` fallback. `npm ci` there may rewrite `package-lock.json`; the builder reverts it.
- Text with backslashes or backticks goes in through the file tool; a `\n` in a heredoc-fed script turns into a real
  line break inside a string (it happened again in the style plan).
- A builder may commit a stray file (`fail.txt` once): check `git show --stat` on every cherry-pick.
- `npm run check` green before the pull request; save its output to a file and read the exit code.
- `docs/SESSION-STATUS.md` has an 8000-byte ceiling; keep it short (it is about 2.3 KB now).
- Cost lines in `references/lessons.md` only for a slice outside 70k to 260k tokens; tell the owner each wave's cost.
  The style plan's measures cost 87k to 90k tokens; its builders 99k to 142k.
- One pull request per plan, after its last wave. The owner merges by hand; never merge.

## Open items

- Recorded limits from the style plan: the duplicate-part rule compares a part's first sample; each list item counts
  as one motion; liveliness is one threshold; the stage loader's glob ignores the reserved list.
- Deferred: the `trail` cache (ADR-176), a clip that grows, a gate for the `!` non-null assertion.
