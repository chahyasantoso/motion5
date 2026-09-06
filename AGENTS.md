# Agent instructions

This file is for an AI implementor working on motion5. A human contributor wants [the README](README.md) and [the documentation map](docs/README.md).

## Read these first, in this order

1. [docs/SESSION-STATUS.md](docs/SESSION-STATUS.md) is the only document allowed to claim what has landed. Every plan, ADR, and architecture note describes intent unless it says otherwise. It states current state only, in four sections, and you **rewrite** it rather than appending to it: replace the entry your slice makes stale instead of adding one beside it. A gate holds it to that section list and to a byte ceiling, so a fifth section and a returning log both fail `CI`.
2. [docs/GUARDRAILS.md](docs/GUARDRAILS.md) for the standing rules and the working constraints every slice is held to, and [docs/LIVE-EDIT-COST.md](docs/LIVE-EDIT-COST.md) for what a caller may do to a loaded project and what each edit pays for. The status file carried both until issue #284 and carries neither now.
3. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for who owns what.
4. [docs/PR-WORKFLOW.md](docs/PR-WORKFLOW.md) for what a complete change looks like: invariant, evidence, ownership, public surface, deletions, status.
5. [docs/CI-WORKFLOW.md](docs/CI-WORKFLOW.md) and [docs/FORMATTING.md](docs/FORMATTING.md) for the gates you have to pass.

## The rules that get broken most

Write the invariant first, name the single owner, add the test that fails without the change, and keep the slice vertical. Two owners for one question is the defect this project cares about most.

Status is replaced, never accumulated. `docs/SESSION-STATUS.md` is the file you are most likely to break that rule in, because every pull request is asked to update it, and the honest edit is usually a deletion and a rewrite rather than a new bullet. State the project as it is now and remove the entry that is no longer it. A rule you earned goes in `docs/GUARDRAILS.md`, a red or green run id goes in your pull request body, and neither goes in the status file. It reached 99,180 bytes the other way, while its own first sentence called it small.

Keep unrelated formatting in a separate commit. AI edit normalizes only the files explicitly requested; that is not permission for a repository-wide formatting pass in a behavior change.

Author no markdown tables anywhere. Prettier rewrites their alignment to widths you cannot predict, and the drift is invisible to you while being fatal to `format:check`.

Prettier is pinned at the version in `package.json`, `printWidth` is 100, quotes are double, trailing commas are everywhere, and `proseWrap` is `preserve`. Because prose is never rewrapped, keep a paragraph on one line or break it yourself at or under 100 columns. Prettier also formats the contents of a fenced code block whose language it recognises, so a `json`, `ts`, or `yaml` sample is held to the same standard as a real file. Tag a block `text` when it genuinely is not source.

Do not copy anything from the predecessor repository. Recreate the contract from first principles.

## If you have no local checkout

Working through the GitHub API alone, you cannot run `npm`, `prettier`, or the tests, and rewriting a large file through the contents API tends to fail part-way. Use the supported bounded request protocol instead of claiming local checks were run.

Read [docs/AI-EDIT-WORKFLOW.md](docs/AI-EDIT-WORKFLOW.md) at your branch before submitting. Protocol v1 requires `version: 1`, `expected_head` naming the snapshot you read, and `expected_blobs` containing every edited path's original Git blob SHA (or `null` if absent). Unknown keys, unversioned requests, stale inputs, unsafe paths, and CI-skip directives are refused. Older branches may still ignore unknown fields, so do not assume the protocol exists without checking.

Drop one JSON request at `.ai/edits/<name>.json` in a commit that changes only that request. Its single parent must be `expected_head`; do not combine code or workflow changes with submission. The workflow checks out the exact request commit, validates the source snapshot, applies the edits, formats surviving touched files, removes the request, and publishes with a normal fast-forward push. A branch that advances is refused, not force-pushed or silently rebased.

Read the published commit link and verify CI on that exact SHA. The trusted reporter resolves the PR from GitHub metadata; `target` is not publication authority. With the reviewed slice 4 runner activated, `operation: "preview"` (or `dry_run: true`) reports the formatted diff and final sizes while publishing only request cleanup. `operation: "validate"` runs explicitly allowlisted targeted checks, not required PR CI. Older pins retain the older dry-run contract. Refresh the head and blob preconditions before a separate apply. [docs/API-CAPABILITIES.md](docs/API-CAPABILITIES.md) distinguishes API-supported, human-dispatch-only, and unactivated operations.

Candidate execution and credentialed publication use separate jobs and reviewed runner code. Workflow changes and runner-pin updates require review; the PAT does not authorize new maintenance capabilities. See the contract for supported paths, retry rules, bounded evidence, and remaining live activation exercises.

### Your read has a budget, and it fails silently

A truncated contents read is indistinguishable from a whole one. There is no error, no marker, and no second call that returns the part the first one dropped, so a file past the response cap hands you a prefix and lets you believe it is the file. An anchor placed in that prefix can contradict an invariant written in the bytes you never received, which is the failure this budget exists to prevent rather than a readability preference.

Two numbers follow from it, and both are checked. No file under `packages/core/src` may exceed **60,000 bytes**, markdown included. A source over **30,000 bytes** keeps its private reasoning in a sibling document, `x.ts` beside `x.md`, so the member list arrives whole in one read even on a day the source does not.

The `read-budget` job in `CI` enforces them, and `node scripts/read-budget-scan.mjs` is the command it runs; scanner unit tests run in the single full suite. You cannot run it and you cannot detect the condition it measures, which is exactly why the numbers are written here instead of living only in `scripts/read-budget-scan.mjs`. What you can do is act on them before the gate does: a slice that pushes a file past either number owes the split or the sister doc in the same request, and a preview from an activated slice 4 runner reports final formatted byte sizes and applicable safety checks, so the check costs one round trip rather than a failed merge. Do not attribute that capability to an older runner pin.

[docs/AI-EDIT-WORKFLOW.md](docs/AI-EDIT-WORKFLOW.md) owns the rule, the mirror conventions a sister doc has to satisfy, and the one thing you may not do to a file that is over budget, which is edit it by anchor. An exact blob SHA does not replace reading the complete invariant.

Do not open a pull request that mixes that infrastructure with behavior, and do not widen a slice past the file count its own body claims.
