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

## 2026-11-11, the second proof and the rebuilt showreel (gerak)

Costs: four cold Sonnet runs at medium effort, 295 k tokens, about 2.3 min each, started by the conductor with no
session between. Two Opus workers at medium effort: 141 k tokens for a free-form piece, 198 k tokens and 15 min for
its rebuild. One run of the full check after each batch; one failed on a source map the new folder was missing from.

- **Starting workers straight from the conductor cost less than a session that starts them.** The conductor's
  context was cached; a relay session would have re-read the plan and the skill to do the same launches.
- **A rule stated as a rule was followed; the same rule stated as advice was not.** "Every motion with a name must
  be a move" gave seven written moves. "Where nothing fits, write a move" gave none. Write a brief's constraints as
  constraints.
- **Asking an agent to choose against its first thought moved the motion and not the look.** The step named motion
  only, and three runs kept one palette. A divergence step changes only what it names.
- **A usage limit stopped a worker twice in one day; resuming by message worked both times.**
- **A new source folder needs its line in the map before the check.** When a brief lets a worker create a folder,
  say which gate will ask about it, or add the line when combining.
- **The safety check on two workers' reports was unavailable.** The conductor read each commit's file list before
  taking it. Do that for any report that arrives so marked.

## 2026-11-12, values waves 1 and 2 (gerak)

Costs: the conductor built the first slice. Opus at medium effort, 156 k tokens and 9.5 min, for a renderer that
touched 28 files; Sonnet at medium effort, 87 k tokens and 3.2 min, for four modifiers; a cold review by Sonnet,
120 k tokens, ten findings, seven fixed. Three runs of the full check on combining where one was planned.

- **A rename in one slice broke the other slice's test.** One worker renamed a move's answer field; the other's new
  test read the old name. The earlier rule covered counts and lists. Rule: when planning a wave, list every name a
  slice renames or removes, and tell the other workers not to read it.
- **A worker's "not verified" list is the conductor's to-do list.** The renderer's worker noted that always writing
  opacity would show elements a stylesheet hides. It had not been asked to decide that, and the brief was wrong;
  the fix was the conductor's. Read that section first.
- **Frames before and after are a cheap check for a change that should not show.** Sixty-two frames over twelve
  pieces, compared by bytes, took two commands. Bytes differ for changes no eye can see, so a difference still has
  to be looked at; until a pixel comparison exists, look at the few that differ.
- **Samples before and after prove a call-shape change.** Six pieces sampled at thirty-seven moments were the same
  to the byte after the modifiers changed shape, which the worker had not checked.
- **A pull request with no package or tool code skipped the cold review.** Pieces, plans and guides were merged on
  the full check alone. Rule: review cold when packages or tools change; say in the pull request when it was skipped.
- **Pick the worker's model by how many files the slice touches, not by how hard it sounds.** The renderer was not
  subtle, but it changed every caller; the stronger worker found callers and documents the brief had missed.
- **A usage limit stopped the reviewer; a message resumed it, a third time.** It reread from the start, since its
  notes had not been saved. Ask a reviewer to keep notes in a scratch file as it goes.

- **A check piped into `tail` reports `tail`'s exit, not the check's.** `npm run check | tail && git commit` committed and pushed a typecheck failure. Rule: save the check's output to a file and test its exit code before any commit.

## 2026-11-12, values wave 3 (gerak)

- **Look at the tool's output, not only its tests.** The frame picker passed its tests and gave every frame of the timing page to six letters; one look at the sheet showed it. A tool that summarises motion is checked by reading what it produces on a real page.
- **A reviewer finds what a builder's own tests share with its code.** The span read elapsed and its tests built times whose elapsed matched progress, so an eased time slipped through both.

## 2026-11-12, values wave 4 and the standing measure (gerak)

- **A measure needs the same task each time.** The plan said to rewrite the first rebuild; that would not compare with
  it. The conductor briefed a fresh rebuild from the original, with the earlier app moves allowed, so reuse counts.
- **Two slices in one worker blur the measure.** The token count includes the parts list as well as the rebuild.
  Next time the measure runs alone, in its own worker.
- **A worker's gap list is a backlog.** The top gap was an error message that named one fix and not the other; it
  took one line to fix.
