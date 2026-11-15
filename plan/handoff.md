# Handoff to the next session: the style plan, in Claude Code

**Written:** 2026-11-15, after the anatomy plan was built (pull request 596, open; 595, the toolkit, merged). Delete
this file in the pull request that builds the plan. The branch `feat/style-kits`, from `feat/anatomy` at `8b514ba5`,
holds `plan/style-plan.md`, revised after one round of critique and not yet approved, and nothing built.

## Read first, in order

1. `AGENTS.md`: the rules.
2. `docs/SESSION-STATUS.md`: what has landed.
3. `plan/style-plan.md`: the plan. Ask the owner to approve it before wave 1; if 596 has merged by then, rebase
   `feat/style-kits` on `main` first.
4. `.claude/skills/wave-build/SKILL.md` and `references/brief-template.md`: how waves run. Use the skill.
5. `docs/ADR-185-*.md` and `docs/ADR-186-*.md`: the layers, the part kinds and the vocabulary this plan builds on.

## Who does what

| Plan's role | Model and effort | Does |
| --- | --- | --- |
| Planner | the session that reads this file | S0 and S4 itself, briefs, combines, judges, opens the pull request |
| Executor | Sonnet, medium effort | one slice from one brief, in its own worktree (`isolation: "worktree"`), then reports |
| Measure | Sonnet, medium effort, a fresh agent | builds `launch-day` in the `showreel` kit from the guide alone |
| Cold reviewer | Sonnet, medium effort, a fresh agent | reviews the diff read-only and runs what it claims |

State `model` and `effort` on every agent start. The slices run one after another (the plan's table says why).

## Start here

1. S0 is the planner's: ADR-187 (ADR-186 is the last; `npm run adr-index:write` regenerates the index; mark ADR-185
   superseded in part with a `**Superseded in part by ...**` line under its status), then move the quality table into
   `packages/moves/src/style/qualities.ts` by script with bodies unchanged. Sample every built-in move before and after
   (a script outside the repo, 62 steps over each example) and compare; the generated reference must not change.
   Commit and push before briefing S1; each brief names that commit.
2. S1 to S3: one brief each from `brief-template.md`; check every fact a brief states against the tree first.
3. S4: run `motion:kit new showreel --from showreel`, narrow the card by the plan's test, write the habits and the
   guide page.
4. S5: the measure, then the cold review, then the pull request.

## Facts this plan rests on

- `QUALITIES`, `DescriptorRanges`, `qualityOf` and `outsideRanges` are in `packages/tools/src/scene/catalog.ts`;
  `Descriptors` and `describeOffsets` in `moves.ts`; `offsetsOf` and the design check in `review.ts`;
  `readDesign` and `intentsOf` in `design.ts`. The descriptors are `peak`, `overshoot`, `rings`, `windup`, `settle`.
- `moveParts()` lists only parts exported from `@gerak/moves`' entry (a TypeScript-checker scan); `partContract` reads
  the one registry in `packages/moves/src/parts/contract.ts`.
- `briefs.ts` owns where pieces are (`RESERVED_FOLDERS`, `briefFolders`, `pieceFiles`, `movesFolders`).
  `test/repo/brief-moves.test.ts` refuses a brief move importing anything but `@gerak/moves`; S1 widens it to the
  folder's own parts.
- The showreel brief (`apps/pieces/showreel/`) has 18 moves and pieces with `many` lists; none exports `design`.
- The design check takes per-beat intents and list items (`word` for every item, `word.3` for one).

## Lessons that bind this work

- A test must be seen failing. A builder reports one failing line per new test; for any test whose failure was not
  shown, the lead breaks the code once and sees it fail. Break code by copying the file aside and restoring it, never
  with `git stash` (a stash with nothing to save makes the next pop reach for an unrelated stash).
- Look at a tool's output on real moves and pieces, not only its tests: the anatomy plan's scoring was wrong in the
  plan itself, and only running it on the catalog showed it.
- A worktree agent may start from another branch: every brief carries the `git merge --ff-only origin/<branch>` line
  and the `git reset --hard` fallback. `npm ci` there may rewrite `package-lock.json`; the builder reverts it.
- Text with backslashes or backticks goes in through the file tool; a `\n` in a heredoc-fed script has twice turned
  into a real line break inside a test string.
- Browser tests run beside scratch folders other tests create; a test that reads the tree skips a file that vanishes,
  and a browser test sets its page in place rather than loading a module a reloading dev server can replace.
- `npm run check` green before the pull request; save its output to a file and read the exit code.
- `docs/SESSION-STATUS.md` has an 8000-byte ceiling a test holds.
- Cost lines in `references/lessons.md` only for a slice outside 70k to 260k tokens; tell the owner each wave's cost
  in a few lines. The anatomy measure cost 99k tokens, 36 calls, 3.6 minutes.
- One pull request per plan, after its last wave. The owner merges by hand; never merge.

## Open items

- The anatomy plan's recorded limits: the stage loader's glob ignores the reserved list; shapes come from a move's
  example run only; `rings` counts crossings, so a bounce touching rest reads 0; the index file is written unlocked.
- Deferred from earlier: the `trail` cache (ADR-176), a clip that grows, a gate for the `!` non-null assertion.
