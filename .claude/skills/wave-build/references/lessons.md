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
