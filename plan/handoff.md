# Handoff to the next session: the toolkit plan, in Claude Code

**Written:** 2026-11-14, after pull requests 593 (3D) and 594 (2D over 3D) merged. Delete this file in the pull
request that builds the plan. The branch `feat/toolkit`, from `main` at `6079f613`, holds `plan/toolkit-plan.md`,
approved after one round of critique, and nothing built.

## Read first, in order

1. `AGENTS.md`: the rules.
2. `docs/SESSION-STATUS.md`: what has landed.
3. `plan/toolkit-plan.md`: the plan. Its goal says why: the overlay measure passed every check and still plays at
   about 20 fps by its sixth second.
4. `.claude/skills/wave-build/SKILL.md` and `references/brief-template.md`: how waves run. Use the skill.

## Who does what

| Plan's role | Model and effort | Does |
| --- | --- | --- |
| Planner | the session that reads this file | builds wave 1 (ADR-184, K1), briefs, combines, writes the guide (K7), judges, opens the pull request |
| Executor | Sonnet, medium effort | builds one slice from one brief, in its own worktree (`isolation: "worktree"`), and reports |
| Measure | Sonnet, medium effort, a fresh agent | rebuilds `dragon-intro` from the same brief and the guide alone |
| Cold reviewer | Sonnet, medium effort, a fresh agent | reviews the diff read-only and runs what it claims |

State `model` and `effort` on every agent start. The four wave-2 executors run at once; the plan's team table
already gives each its own files (K3 alone touches the root `package.json`).

## Start here

1. Wave 1 is the planner's: ADR-184 (ADR-183 is the last; add it to `docs/ADR-INDEX.md`), then K1: `tally` and the
   `MotionEvent` fields `z` and `other` in `packages/moves/src/events.ts`. Commit and push before briefing wave 2;
   each brief names that commit.
2. Wave 2: four briefs from `brief-template.md` (K2 with K6, K3, K4, K5). Check every fact a brief states against
   the tree first.
3. Wave 3: the guide (K7); remove `apps/pieces/dragon-intro.html` and `apps/pieces/src/dragon-intro*` after K2's
   review flags it as growing (the plan's test); then the measure with the overlay plan's brief for `dragon-intro`
   (in `plan/overlay-plan.md`, slice O7) plus the toolkit plan's added bars; then the cold review.
4. After the measure, run `npm run motion:fps -- dragon-intro.html --to 10000 --show` yourself and report its
   windows to the owner; 55 fps in every window is the bar.

## Facts this plan rests on

- `dragon-intro`'s scene cost per frame, measured by calling `scene(liveAt(ms), cues)` every 16 ms from 0 to
  10000 in one Node process: mean 0.1 ms at 0.5 to 1 s, 10 ms at 3 s, 35 ms at 5.6 to 6.1 s, 62 ms at 9.2 to 9.7 s.
  The causes, in `apps/pieces/src/dragon-intro-scene.ts`: the caption sums a `follow` from the talk's start in
  48 ms steps (`TALK_STEP`, hard-coded `TALK_TOTAL`), and each "+1" label reads `sim.at(timeAt(time, hit))`, a seek
  back. K2's growth rule must flag exactly this.
- The page tools install a paused clock in `packages/tools/src/page/page.ts` (`clock.install`, `pauseAt`); K3 adds
  the opt-out.
- A `MotionEvent` has `x` and `y` (pointer px) and no `z`; physics contacts carry only `target` and `at` today.
- Text reveal already exists in `@gerak/stage` (`words`, `letters`, text that follows time, ADR-177); no caption
  helper is planned. No eyelid helper either: `attach` is the general form.

## Lessons that bind this work

- A test must be seen failing. A builder reports one failing line per new test; for any test whose failure was not
  shown, the lead breaks the code once and sees it fail. Last round a browser test passed while measuring nothing:
  its scene computed `time / 1000` on a `Time` object (`NaN`), so the box never moved. A scene's milliseconds are
  `elapsedOf(time.clock)`; `time.progress` runs 0 to 1.
- Sample the values behind any frame a worker names as proof (`npm run motion:sample -- <scene> --at <ms>`): a
  measure once named shut-jaw frames as open.
- A worktree agent may start from `main`, not the branch: every brief carries the `git merge --ff-only
  origin/<branch>` line. `npm install` there rewrites `package-lock.json`; the builder reverts it. After
  cherry-picking, `git worktree remove --force` may say "Directory not empty": run `git worktree prune`.
- Grep each combined diff for control characters; write text with backticks or backslashes with a file tool.
- `npm run check` green before the pull request; save its output to a file and read the exit code.
- A 3D scene exports `limits` for its 3D targets (`turn: 30`, a jump about a fifth of the subject); the review's
  defaults are for px.
- Cost lines in `references/lessons.md` only for a wave outside its ranges or a new kind of worker; tell the owner
  each wave's cost in a few lines. The overlay's Sonnet measure cost 214k tokens, 106 calls, 22 minutes: the
  comparison the toolkit's measure is judged against.
- Prettier ignores `apps/pieces/references/*.json`, which tools write.
- One pull request per plan, after its last wave. The owner merges by hand; never merge.

## Open items

- Deferred: measured marks on a model (points found by vertex colour or material, written beside the joint table)
  until a second model needs one; `dragonling.eyes.json` is that data for now.
- Deferred from earlier: the `trail` cache (ADR-176), a clip that grows, and a gate for the `!` non-null assertion.
