# Handoff to the next session: 3D, in Antigravity

**Written:** 2026-11-14, after pull requests 591 and 592 merged. Delete this file in the pull request that builds the
plan. The branch `feat/3d` holds `plan/3d-plan.md`, proposed and not yet approved, and nothing built.

## Read first, in order

1. `AGENTS.md`: the rules. They bind every agent in this repository, whatever the harness.
2. `docs/SESSION-STATUS.md`: what has landed.
3. `plan/3d-plan.md`: the plan.
4. `.claude/skills/wave-build/SKILL.md` and `references/brief-template.md` beside it: how waves run. It was written for
   Claude Code; read it as a document. The mapping below says what changes.

## Who does what in Antigravity

| Plan's role | Model | Does |
| --- | --- | --- |
| Planner | Gemini 4 Argon | critiques and finishes the plan, writes the decision record, builds wave 1 itself, briefs executors, combines, judges, writes the guide, opens the pull request |
| Executor | Gemini 4 Hydrogen | builds one slice from one short brief, in its own workspace, and reports |
| Measure | Gemini 4 Argon, a fresh agent | makes `avatar-3d` from a short brief and the guide alone; never the planner, who knows the fixes |
| Cold reviewer | Gemini 4 Hydrogen, a fresh agent | reviews the diff read-only and runs what it claims |

- Run the planner as the session that reads this file. Antigravity's Orchestrator pairs a planning model with
  Hydrogen as executor; if you use it, Argon plans and Hydrogen executes, as above.
- **Isolation.** Each executor works in its own copy. If the harness gives no isolated workspace, the planner makes
  one per slice: `git worktree add ../motion5-<slice> -b feat/3d-<slice> feat/3d`. Combine by cherry-picking each
  slice's commits onto `feat/3d`, then remove the worktree. Two executors never touch the same file; the plan's
  team table already splits them so.
- **Briefs.** Fill `brief-template.md`. A Hydrogen executor starts with an empty context: point at files, state every
  fact checked against the tree, make the design choices, give the exact commit message.
- **Cost rows.** Record each wave in `.claude/skills/wave-build/references/lessons.md` with the model names. These are
  the first rows on Gemini models: a new baseline, not comparable with the earlier Opus and Sonnet rows.
- **Attribution.** End commits and the pull request with whatever co-author line the harness uses for its model.

## Start here

1. Critique `plan/3d-plan.md` once against the tree: check every file, function and package it names (the archive
   is `origin/archive/core-plugins`; `@dimforge/rapier3d-deterministic-compat` must exist at the 2D build's version).
   Fix what is wrong, then ask the owner to approve. The owner changes their mind often: rewrite the plan, never
   append to it.
2. Ask the owner to choose the measure's model: a CC0 rigged glTF character with a jaw bone or mouth morph targets.
   Downloading it needs the owner's yes, with the file's name, source and size.
3. Wave 1 is the planner's: ADR-182 (ADR-181 is the last; add it to `docs/ADR-INDEX.md`) and slice T1.
4. When the plan is built and its pull request open, the owner asks Claude Code, in a session of its own, to review
   the work. Leave the pull request's description complete for that: invariants and tests, review findings and what
   was left, which checks ran on which commit, the measure's results and tokens, and what was not verified.

## Lessons that bind this work

- Check every fact a brief states against the tree before sending it.
- A test must be seen failing without its change. Ask each executor for one failing line per new test in its report,
  and try the change reverted yourself for anything that guards a cache or a cost.
- `npm run check` is green before any pull request, run from a clean state when a change adds a build: delete
  `packages/*/dist` first. Save its output to a file and read the exit code; never pipe it before a commit.
- CI's evidence gate fails on any skipped test. Browser tests run in Chromium only, by the owner's choice; never write
  an engine loop that skips. To run that gate locally: set `CI_EVIDENCE_DIR`, `GITHUB_RUN_ID` and
  `GITHUB_RUN_ATTEMPT`, then `node scripts/ci-evidence.mjs discover`, `npm test -- --reporter=default
  --reporter=./scripts/ci-evidence.mjs`, `node scripts/ci-evidence.mjs verify all`.
- A comment is at most 3 lines and 200 characters (`npm run scan:comments`).
- Write text holding backticks or backslashes with a file tool, never a shell heredoc or a script string: a `\b`
  becomes a backspace. Grep a combined diff for control characters before the pull request.
- Run git as plain single commands from the workspace it acts on.
- A JSON file a piece imports needs `with { type: "json" }`; the tools run in Node.
- One pull request per plan, after its last wave. The owner merges by hand; never merge.

## Open items

- `talk.html?piece=<name>` works with a microphone (the owner tried it) for stage modules only; it sends `mouthOpen`.
  A 3D page is not a stage module, so a live 3D avatar calls its clock driver's `send` itself (the plan's guide
  shows how).
- A morph blends cubics paired by order: outlines drawn with the same point count, start and direction never twist.
- Deferred: the `trail` cache (ADR-176), a clip that grows, and a gate that holds the `!` non-null assertion
  (about 170 lines carry one).
