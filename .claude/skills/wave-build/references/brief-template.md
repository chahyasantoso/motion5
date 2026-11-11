# Brief template

Fill every section. Delete nothing; write "none" where a section is empty. A builder reads only this.

```text
You are a builder on <repository, one line on what it is>. Build slice <id>, "<name>", exactly as briefed.
Work only in your worktree. Read <conventions file> first and follow its rules (<the three or four that bite most>).
Do not read <what would waste its context>. Do not explore beyond the files named here unless something fails.

Before starting: your worktree must contain commit <hash> "<its message>". If `git log --oneline -5` does not show
it, run `git fetch origin` then `git merge --ff-only origin/<wave branch>`. Run <install command> once if needed.

## Context you need
- <file>: <what is in it that this slice uses, in one or two lines>
- <a model to copy the style of>
- <how the slice's work will be checked: the gate, the command>

## Invariant
<What is true when the slice is done, stated so it can be tested. Then the decisions already made: names,
signatures, option names with kind, default and range, file paths, what goes where.>

## Tests (write them first and see them fail)
- <test file>: <the properties to test, concretely>
- <an existing test this slice must update, and how: read lists from the source, never hard-code a count>

## Documents, same slice
- <document>: <which section is this builder's, what to add, what not to touch; warn about mixed line endings>

## Done means
- <the full check command> passes.
- One commit per slice on your worktree branch, message "<exact message>", ending with <attribution line>.
  Stage new files before the check. Do not push, do not open a pull request, do not touch <files other builders or
  the lead own>.

## Report back, briefly
The branch name and commit hash, the last lines of the check, any place you departed from this brief and why, and
anything in the brief that was wrong or missing.
```

## Reviewer brief, in short

```text
You are an independent reviewer for <repository at path>. You have seen neither the plan nor the build. Read-only:
do not edit, commit, stash or switch branches.
Scope: `git diff <base>...HEAD -- <paths>`; ignore <plans, decision records>. Conventions: <file>.
What the change claims to do: <plain list>.
Look hardest at: <edges of declared ranges, a gate that can pass what it should refuse, odd input to commands,
tests that would pass if the code were wrong, documents that claim more than the code does>.
Verify a suspicion where that is cheap. Report at most <n> findings, most severe first: file and line, the defect
in one sentence, the input that produces it, and "confirmed by running", "confirmed by reading" or "suspected".
End with what you could not check. Under <n> words.
```
