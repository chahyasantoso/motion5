# Pull request workflow

## Branches

- `main` is protected, always green, and always releasable in principle.
- Work happens on `feat/`, `fix/`, `test/`, `docs/`, `perf/`, or `chore/` branches.
- Branch names carry the plan id when one applies: `feat/p2-06-graph-binding-transaction`.
- No long-lived integration branches. A phase is a sequence of merges into `main`, not a branch.

## Commits

Conventional commits, imperative mood, lowercase subject.

```text
feat(graph): add undo journal to GraphBinding
fix(runtime): set the disposal guard before notifying subscribers
test(graph): cover rollback of a failed edge replacement
docs(architecture): record the reentrancy refusal rule
chore: apply prettier
```

Scopes match the module layout: `contract`, `domain`, `graph`, `runtime`, `ports`, `adapters`, `react`, `perf`, `ci`.

**Formatting never shares a commit with behavior.** A mechanical reformat is its own commit, ideally its own pull request. See [FORMATTING.md](./FORMATTING.md).

## Sizing

- Target: under twenty semantic files. Generated files and lockfiles do not count.
- Hard signal to stop and re-cut: more than twenty-five commits on the branch, or a second revert of the same slice.
- One pull request establishes one invariant. If the description needs the word "also" twice, split it.

## Description

Use the template in `.github/pull_request_template.md`. It asks for four things and it means all four:

1. **Invariant.** What must be true after this merges that was not guaranteed before.
2. **Evidence.** The test that fails without the change. Name it.
3. **Ownership.** Which owner gained or lost a responsibility, and confirmation that no responsibility now has two owners.
4. **Deletions.** What this removes. A pull request that only adds, during a phase whose exit gate includes removals, is incomplete.

## Review

Reviewers check, in this order:

1. Does an owner get a second implementation of an existing responsibility? If yes, request changes and stop reading.
2. Does the named test actually fail without the change? Reviewers are expected to verify this on non-trivial slices.
3. Is there a new flag, mode, alias, or facade? Any of them is a rejection unless [DECISIONS.md](./DECISIONS.md) is updated in the same pull request.
4. Public API diff: is anything newly exported that should not be, and is the export map still an allow list?
5. Whitespace-insensitive diff: read it with whitespace hidden, so a reformat cannot conceal a behavior change.
6. Are docs, types, and exports updated in this pull request rather than promised in a follow-up?

A review that only says "looks good" on a slice that changes ownership is not a review.

## Merge policy

- Squash merge. The pull request title becomes the commit subject, so it follows the commit convention.
- All required checks green. `continue-on-error` jobs are advisory and never required.
- No merge with a known-failing test marked skipped to get green. Fix it or revert the slice.
- Delete the branch on merge.

## Reverting

Revert early and without ceremony. A revert is cheap; a half-fixed ownership seam living on `main` for a week is not. After a second revert of the same slice, the slice is re-cut rather than retried.

## Status

[SESSION-STATUS.md](./SESSION-STATUS.md) is updated in the pull request that changes the state, not afterward. There is exactly one status file. Handoff notes, review logs, and completion matrices are not created as separate documents.
