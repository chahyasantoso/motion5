---
name: wave-build
description: Run a multi-slice piece of work as waves — a lead plans and briefs, cheaper builder agents build slices in parallel, a cold reviewer checks the combined result, and one pull request goes up per plan. Use it whenever a plan has more than two or three slices, when the user asks to save tokens by coordinating cheaper agents, to "run the plan", "do the next wave", "delegate this", or to split work between agents — and at the end of any wave, to record what it cost and what it taught.
---

# Wave build

A wave is a group of slices that can be built at the same time, combined and checked once. You are the lead.
Builders are cheaper agents that start with an empty context; the reviewer is one more.

The point is cost and independence. A long session pays for its own history on every step, so work done by a fresh,
cheaper agent from a short brief costs a fraction of the same work done by you. And you cannot be the fresh eye on
your own design.

## Choose the model and the session

The most capable model conducts: the plan, the architecture, the briefs and the judgment of what comes back. It stays
in one session. Everything else runs on a cheaper model at medium effort. Before starting an agent, ask:

1. **Is it worth an agent?** A handful of tool calls, a script, or anything needing this conversation's history is
   cheaper done here. A mechanical rename is one script, not a brief.
2. **Which model?** State it on every start. Pick by how many files the slice touches, not how hard it sounds.
3. **Here or a fresh session?** Start workers straight from the conductor, whose context is cached. Never open a
   fresh session on the conductor's model to carry out a brief.
4. **What does the brief cost?** It is paid twice. Keep to what the worker cannot find; point at files.

## Plan the wave

1. List the slices and their dependencies. A wave holds only slices that do not need each other's result. Build
   anything that decides later slices' shape (a type, a rule, a gate) yourself, first.
2. Give each file to one builder. When two slices read one record, name the package that owns its type.
3. List every count, list or name a slice changes that another slice's tests read; have tests read it from source.
4. Normalise a file with mixed line endings in its own commit first; `git ls-files --eol` must say `i/lf`.
5. Commit and push the starting branch; the brief names its hash.

## Brief a builder

Fill in `references/brief-template.md`. Make the design choices: signatures, names, files, commit messages. Check
every fact a brief states about existing code (a field's meaning, a declared range) against the tree first. Write
constraints as constraints, never as advice. Say what not to read, and which gate a new folder will meet.

Every brief tells the builder to:
- commit after its first working version, so a usage limit loses less (resume a stopped agent by message);
- save `npm run check` output to a file and test its exit code, never pipe it before a commit;
- write text holding backticks or backslashes with the file tool, never in a shell string or heredoc;
- run every script that reads paths after a move, not only the check;
- report what the brief got wrong and a "not verified" list.

Launch a wave's builders in one message, each in its own worktree. Do not poll.

## Combine

1. Read the "not verified" list first: it is your to-do list. Then the diff of source files, against the invariant.
2. Cherry-pick its commits, then remove its worktree at once.
3. Drop any option no test drives; it is a feature nobody chose.
4. For a change that should not show, compare samples and frames before and after.
5. Look at a tool's output on a real page, not only its tests.
6. Run the full check once, from a clean state when the change adds a build: no `dist` the check could lean on. One purpose per shell call; never move git state in a call that runs tests.

## Review cold

When packages or tools change, start one reviewer that has seen neither plan nor briefs: give it the diff range, the
conventions, what the change claims and where you doubt. It edits nothing but runs every command and snippet the
change names, keeps notes in a scratch file, and answers "what passes the gate that should not". Expect the worst
finding in your own slice. Before it, search sibling documents by content for any kind of thing a slice removed.
Triage every finding: fix it or record why not.

## Hand over

- One pull request per plan, after its last wave, unless the user asks for one per wave.
- It states invariants and tests, review findings and what was left, which checks ran on which commit, and what was
  not verified. Say when the cold review was skipped.
- Never merge unless the user says so for that pull request.

## Measure

A measure repeats the same task each time, runs alone in a fresh worker on the same model as its earlier rows (never
the conductor, whatever its cache would save: it knows the fixes), and its interviews are read for the question
every agent shares. Before acting on a plan's fallback, read what the agents say they read.

## Record and learn

At the end of every wave:

1. Add one row to the cost table in `references/lessons.md`. The lead's cost is not shown to it: write "not shown".
2. Turn each lesson into one line in the step above it applies to, or drop it. Change a line a lesson contradicts.
   The inbox in `references/lessons.md` holds at most five lessons not yet placed; history stays in git.
3. Tell the user in a few lines what the wave cost and whether the workflow paid for itself.

## Adapting it

The names here (worktree, cherry-pick, `npm run check`) are this repository's. Elsewhere keep the shape: an isolated
copy per builder, a way to take its work, one full verification, one independent review, one hand-over.
