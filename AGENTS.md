# Agent instructions

This file is for an AI implementor working on motion5. A human contributor wants [the README](README.md) and [the documentation map](docs/README.md).

## Read these first, in this order

1. [docs/SESSION-STATUS.md](docs/SESSION-STATUS.md) is the only document allowed to claim what has landed. Every plan, ADR, and architecture note describes intent unless it says otherwise.
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for who owns what.
3. [docs/PR-WORKFLOW.md](docs/PR-WORKFLOW.md) for what a complete change looks like: invariant, evidence, ownership, public surface, deletions, status.
4. [docs/CI-WORKFLOW.md](docs/CI-WORKFLOW.md) and [docs/FORMATTING.md](docs/FORMATTING.md) for the gates you have to pass.

## The rules that get broken most

Write the invariant first, name the single owner, add the test that fails without the change, and keep the slice vertical. Two owners for one question is the defect this project cares about most.

Formatting never shares a commit with behavior.

Author no markdown tables anywhere. Prettier rewrites their alignment to widths you cannot predict, and the drift is invisible to you while being fatal to `format:check`.

Prettier is pinned at the version in `package.json`, `printWidth` is 100, quotes are double, trailing commas are everywhere, and `proseWrap` is `preserve`. Because prose is never rewrapped, keep a paragraph on one line or break it yourself at or under 100 columns. Prettier also formats the contents of a fenced code block whose language it recognises, so a `json`, `ts`, or `yaml` sample is held to the same standard as a real file. Tag a block `text` when it genuinely is not source.

Do not copy anything from the predecessor repository. Recreate the contract from first principles.

## If you have no local checkout

Working through the GitHub API alone, you cannot run `npm`, `prettier`, or the tests, and rewriting a large file through the contents API tends to fail part-way. That is a known condition rather than a broken setup, and it has a supported answer.

Drop one JSON request at `.ai/edits/<name>.json` on your branch. It names the exact text to replace, per file. The push triggers **AI edit**, which applies the edits, runs the pinned Prettier on the files it touched, commits with the repository's personal access token, and comments the result back to the issue or pull request you named.

Read [docs/AI-EDIT-WORKFLOW.md](docs/AI-EDIT-WORKFLOW.md) before you write one. It is the whole contract, including the anchor rule that decides whether your request is applied or refused, and the reasons to batch a slice into a single request rather than sending one edit at a time.

Do not open a pull request that mixes that infrastructure with behavior, and do not widen a slice past the file count its own body claims.
