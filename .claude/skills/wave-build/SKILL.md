---
name: wave-build
description: Run a multi-slice piece of work as waves — a lead plans and briefs, cheaper builder agents build slices in parallel, a cold reviewer checks the combined result, and one pull request goes up per wave. Use it whenever a plan has more than two or three slices, when the user asks to save tokens by coordinating cheaper agents, to "run the plan", "do the next wave", "delegate this", or to split work between agents — and at the end of any wave, to record what it cost and what it taught.
---

# Wave build

A wave is a group of slices that can be built at the same time, combined, reviewed once and handed over as one pull
request. You are the lead. Builders are cheaper agents that start with an empty context; the reviewer is one more.

The point of the workflow is cost and independence. A long session pays for its own history on every step, so work
done by a fresh, cheaper agent from a short brief costs a fraction of the same work done by you. And you cannot be the
fresh eye on your own design, so someone who never saw the plan has to read the result.

## Decide whether to delegate a slice

Delegate when the slice can be stated as an invariant, the files it touches and a test that fails first, and when
writing that brief is cheaper than doing the work. Keep for yourself:

- anything that decides the shape of later slices (a type, a rule, a gate): build it first, alone, so builders
  work against something that exists;
- a mechanical change one script can do (a rename): the brief and the diff review cost more than the script;
- judgment about wording, taste or direction;
- work that needs this conversation's history.

A wave may hold only slices you keep. It still gets its own session, one full check and the cold review.

## Plan the wave

1. List the slices and what each depends on. A wave holds only slices that do not need each other's result.
2. Give each file to one builder. If two slices must touch one document, name each one's section in its brief.
3. Look for anything a slice will change that another slice's tests will state: a count, a list of names, a
   snapshot. Have the test read it from the source instead.
4. If a file the wave edits has mixed line endings or pending formatting, normalise it in its own commit first, and
   confirm with `git ls-files --eol` that git reads it as `i/lf`.
5. Commit and push the branch the builders start from, and note its hash.

## Brief a builder

Read `references/brief-template.md` and fill it in. A brief that leaves a design choice open gets a different answer
from each builder, so make the choices: signatures, option names and ranges, file names, the commit message. Say what
not to read. Ask for a report that lists what the brief got wrong.

Launch the wave's builders in one message, each in its own worktree, on the cheapest model that can do the slice.
Do not poll; you are told when each finishes.

## Combine

As each builder reports:

1. Read the diff of its source files, not the files and not the tests first. Check it against the brief's invariant.
2. Take its commits onto the wave branch (cherry-pick), then remove its worktree at once: a leftover checkout can be
   picked up by the test runner or the formatter.
3. Note its tokens, tool calls and time from the completion notice. This is the only time they are shown.

When all are in, run the full check once. If it fails, find which rule above the wave broke before fixing it, and
write that down as a lesson.

## Review cold

Before the pull request, start one reviewer that has seen neither the plan nor the briefs. Give it the diff range,
the conventions file, a plain list of what the change claims to do, and the places you would most doubt. Ask for a
capped list of findings, each with the input that breaks it and whether it was confirmed by running or by reading.
It edits nothing in the repository, but it runs what the change claims: every command a document names, every call
shape a snippet shows, in a scratch folder where a command writes files. Ask it what passes a new gate that should
not.

Before the review, when a slice removed a kind of thing from one document, search its sibling documents for the same
kind by content, not by name.

Triage every finding: fix it, or record why not. Expect the worst one to be in the part you built yourself.

## Hand over

- One pull request per wave, opened only when the wave is combined, checked and reviewed. A plan document rides in
  the first wave's pull request.
- The description states the invariants and their tests, what the review found and what was left, which checks ran
  on which commit, and what was not verified.
- Do not merge unless the user says to for that pull request.

## Record and learn

At the end of every wave, before anything else:

1. Add the wave's rows to the cost table in the plan: who, tokens, tool calls, time, and what you had to fix on
   combining. Your own cost is not shown to you; write "not shown" for the lead's row and do not guess.
2. Append to `references/lessons.md`: what went wrong or right, its cause, and the rule it gives. Change this file's
   steps when a lesson contradicts them; do not let the two disagree.
3. Tell the user, in a few lines, what the wave cost and whether the workflow paid for itself.
4. Decide where the next wave runs; see "Choose the model and the session" below. Do not start a new session
   out of habit.

Read `references/lessons.md` at the start of a wave if you have not run one in this repository before.

## Choose the model and the session

The most capable model is for thinking: the plan, the architecture, the strategy, the briefs and the judgment of
what comes back. It is the conductor. Everything else runs on a cheaper model at medium effort: builders, reviewers,
cold runs, and any session whose work is mostly carrying out a brief.

Before starting a session or an agent, ask in this order:

1. **Is it worth an agent at all?** A handful of tool calls, a script, or anything needing this conversation's
   history is cheaper done here. An agent pays for its own start: the conventions, the plan and the files it must
   read, none of it cached.
2. **Which model?** State it on every start; never let a worker inherit the conductor's model. A session that
   orchestrates agents and writes up results is a worker too.
3. **Fresh session or this one?** A long session is cheap per step while its context is cached and expensive once
   the cache goes cold or the context must be compacted. A fresh session on the conductor's model re-reads
   everything at full price, which is the worst of both. So: stay in the conductor's session for decisions, and
   move execution to a fresh session only on a cheaper model, with a brief that names exactly what to read.
4. **What does the brief cost?** A brief is paid for twice, written by the conductor and read by the worker. Keep it
   to what the worker cannot find by itself, and point at files instead of restating them.

## Adapting it

The names here (worktree, cherry-pick, `npm run check`, pull request) are this repository's. Elsewhere, keep the
shape and swap the parts: an isolated copy per builder, a way to take its work, one full verification per wave, one
independent review, one hand-over. If there are no cheaper agents, the planning, the single owner per file and the
cold review still apply to a single builder.
