# Lessons

Append one entry per wave, newest last. Each lesson: what happened, why, and the rule it gives. When a rule here is
proved wrong, say so in a new entry and change `SKILL.md` to match.

## 2026-11-11, authoring waves 1 to 3 (gerak)

Costs: wave 2, two builders, 186 k tokens, 5 min, three fixes over four check runs on combining. Wave 3, two
builders, 173 k tokens, 3 min, no fixes, one check run. Cold review, 92 k tokens, 1.5 min, twelve findings, seven
fixed.

- **Builders started from the wrong commit.** A new worktree was cut from the default branch, not the wave's
  branch, in every run. Rule: the brief names the starting commit by hash and how to fast-forward to it.
- **One builder's tests stated a count the other builder changed.** Five built-in moves became nine. Rule: a test
  reads such a list from the source; the lead looks for these couplings when planning the wave.
- **A builder rewrote a whole document to add a few lines.** The file had mixed line endings and the builder's tool
  normalised it, which also guaranteed a conflict. Rule: normalise first, in its own commit; warn in the brief.
- **Leftover worktrees failed the full check.** The test runner found a second copy of every test under
  `.claude/worktrees`. Rule: remove a worktree as soon as its commits are taken; make the runner and git ignore the
  folder.
- **A helper was written twice.** Two files by one builder carried the same small function. Cheap to fix on
  combining; not worth a rule beyond reading the diff.
- **Builder reports found real gaps.** Asked what the brief got wrong, builders reported a gate that flagged
  answers whose fields came and went, and an example that could not satisfy the gate. Rule: always ask.
- **The lead's own slice had the worst defect.** The cold review found that the gate, built by the lead, could be
  passed by leaving a field out. Rule: the lead's work is reviewed cold like anyone's; point the reviewer at "can
  the gate pass what it should refuse".
- **A mechanical rename was cheaper done by the lead with one script** than by a builder with a brief and a
  175-file diff to review. Rule: script it yourself.
- **A usage limit stopped the reviewer midway.** Its work was saved and a message resumed it. Rule: resume, do not
  restart.
- **Shell quoting ate edits.** Backticks and `\n` inside an inline `node -e` were interpreted by the shell. Rule:
  write multi-line edits as a script file and run that.
- **The long lead session is the largest cost.** By wave 3 the lead's context held two days of work. Rule: a new
  session per wave, with the plan, the status file and the cost table as its memory.

## 2026-11-11, authoring wave 4 (gerak)

Costs: one slice, the guide, written by the lead in a new session; no builder. Cold review, 88 k tokens, 17 tool
calls, 1.9 min, twelve findings: five fixed, four left and recorded, three no defect. One run of the full check
before the review and one after.

- **A new session per wave worked.** The lead started from the plan, the status file and a brief, and needed
  nothing from the earlier sessions. Keep the rule.
- **The reviewer found the leak in a page the lead never opened.** The lead cleaned the page it rewrote and grepped
  the others for file names only; a sibling page still carried a removed example's numbers whole. Rule: when a
  slice removes a kind of thing from one document, the lead searches every sibling document for the same kind, by
  content and not by name, before the review.
- **The new test could be passed by what it should refuse.** It matched scene file names, so a guide naming an
  example's component passed. The fix reads the folder instead of a list. Rule, again: ask the reviewer what
  passes the gate that should not, and prefer a test that reads the tree to one that states a list.
- **A reviewer that runs commands is worth more than one that reads.** Told to run every command the guide names,
  in a scratch folder, it confirmed call shapes and a three-move `combine` by sampling. This contradicted "it reads
  only", and `SKILL.md` now says it edits nothing in the repository but runs what the change claims.
- **"Mixed line endings" was every line CRLF plus one stray carriage return inside a line.** Replacing CRLF left git
  still reading the file as binary. Rule: check with `git ls-files --eol` before and after; anything but `i/lf`
  is not done.
- **A heredoc is not a script file.** The earlier rule said to write edits as a script and run it; written through
  a shell heredoc, the script still lost its backslashes, three times. Rule: write the script with the file tool,
  never through the shell, when it holds a backslash.
- **The lead stashed its own work by a stray command chained after a test run,** and popped it at once. Nothing was
  lost. Rule: one purpose per shell call, and no command that moves git state in a call that runs tests.
- **The lead's own cost is not shown to it.** Only a subagent's completion notice carries tokens and time. Rule:
  the cost row says "not shown" for the lead; the user reads it from the session.
- **A wave of one slice by the lead still pays for the review and nothing else.** There was no brief to write and
  nothing to combine. The workflow's saving here was the reviewer's independence, not its price.

## 2026-11-11, where waves 4 and 5 ran (gerak)

- **Fresh sessions on the conductor's model emptied the owner's five-hour quota.** Waves 4 and 5 each started a new
  session that inherited the most capable model, re-read the plan, the skill and the guides uncached, and then did
  work that was mostly carrying out a brief. Wave 5 stopped at the limit with five cold agents running. The earlier
  rule, "a new session per wave", was too blunt: it counted the old session's history and ignored the new one's
  cold start and its model. Rule: the most capable model conducts and stays in one session; execution moves to a
  fresh session only on a cheaper model at medium effort, and every start names its model.
- **The owner set the roles.** The conductor thinks, plans and judges; workers are a cheaper model at medium
  effort. Weigh an agent's cold start and the brief's cost before spawning one.

## 2026-11-11, authoring wave 5, the proof (gerak)

Costs: five cold Sonnet runs and their interviews, 383 k tokens, 95 tool calls, about 12 minutes; the first four runs'
cost before the limit is not shown. The lead worked on Sonnet at medium effort for the second half.

- **A usage limit stopped five agents at once.** Each had written its scene and committed nothing. Four were resumed
  by message and finished; one had written nothing and was started again. Rule: resume by message, and tell a cold
  agent to commit early, after its first working scene, so a stop loses less.
- **The proof failed, and the cause was not the one the plan feared.** The fallback assumed agents copy a worked
  example; none opened one. They converged because the brief and the catalog offer one obvious answer. Rule: before
  acting on a plan's fallback, read what the agents say they read.
- **One unclear argument cost every agent a wrong render.** All five passed a stretch's length where `span` wants the
  scene's. Rule: read the interviews for the question the five share; it is the cheapest fix in the wave.
- **An interview in the same session was cheap and specific.** Each answer cost about a thousand tokens and named a
  tool, a line and a number. Keep it.
- **A review path argument was wrong in the lead's own call.** The lead passed a file path where `motion:review`
  wants a page name with `--root`, and read five sheets of the index page. Rule: run one before running five.
