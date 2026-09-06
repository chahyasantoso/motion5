# AI edit workflow

This document is the contract for [AI edit](../.github/workflows/ai-edit.yml), an anchor-based editor for an implementor without a local checkout. The script owns validation and staging; the workflow owns formatting, publication, and reporting. A successful apply step is not a published commit, and a published commit is not verified CI.

## Protocol version 1

Version 1 is deliberately fail-closed. Unversioned requests and unknown request or edit keys are refused, including misspellings such as `dry_rnu`. Read the script and workflow at the branch you will use: older branches may still run the legacy implementation and ignore unknown keys.

A request has these fields:

- `version`: required, exactly the number `1`.
- `expected_head`: required, the full lowercase commit SHA of the branch snapshot you read before committing the request.
- `expected_blobs`: required, one entry for every distinct edited path, and no other paths. An existing file uses its original Git blob SHA from the contents API at `expected_head`. A file absent in that snapshot uses `null`. This is a Git blob SHA, not a commit SHA or a plain content checksum.
- `message`: required, a nonempty single-line commit subject without control characters or CI-skip directives. Follow [PR-WORKFLOW.md](./PR-WORKFLOW.md).
- `target`: optional positive safe integer naming the issue or pull request for the result. Name it when possible. The fallback is an open PR for the branch; without either, a job summary is the remaining reporting channel and may not be API-readable.
- `dry_run`: optional boolean, default `false`. Validation only, as described below.
- `edits`: required array of 1 through 50 edits.

This is an illustrative request, not a runnable snapshot. Replace the two SHA placeholders with values read from your branch.

```json
{
  "version": 1,
  "expected_head": "<full-commit-sha-before-request>",
  "expected_blobs": {
    "docs/NOTES.md": "<original-git-blob-sha>"
  },
  "message": "docs(notes): clarify ownership",
  "target": 328,
  "dry_run": true,
  "edits": [
    {
      "path": "docs/NOTES.md",
      "find": "Disposal is shared.",
      "replace": "Disposal has one owner."
    }
  ]
}
```

Each edit names `path` and exactly one mode: `find` plus `replace`, `create` with the complete new string content, or `delete: true`. Empty `replace` deletes the anchor. Unknown edit fields and mixed modes are refused. A `create` cannot overwrite an existing or already-staged file.

## Submit one request-only commit

1. Read the current branch head and the complete files at that immutable SHA. Record the original blob SHAs. Read the relevant owner, invariant, tests, and sister documents before choosing anchors.
2. Put all edits for the slice in one request at `.ai/edits/<name>.json`. Use letters, digits, dots, underscores, or hyphens in the filename, starting with a letter or digit. Only one pending JSON request is allowed.
3. Push a commit whose only changed path is that request file. Its single parent must be `expected_head`. Do not combine source changes, other requests, workflow edits, or merge commits with submission.
4. Wait for the result before advancing the branch. The workflow checks out the event SHA, verifies the request-only diff and parent, and checks that the branch still points to that request commit.
5. Read the report and verify CI on the exact published SHA. The workflow rechecks the remote head before publication and uses a normal fast-forward push. A racing update is refused; it never force-pushes or silently rebases the change.

The parent rule avoids a self-referential SHA: `expected_head` names the source snapshot, not the future request commit. All blob preconditions are checked against original bytes before any edits are staged. Multiple edits to one path therefore share its original blob precondition, while their anchors are validated sequentially against the evolving staged content.

After a refusal, reread the current head and refresh the preconditions. Correct the same pending request path in another request-only commit. A request consumed by a successful apply or dry run has been removed, so the next request starts from the new branch head. Never retry an ambiguous publication result blindly.

Manual dispatch names the sole pending request on the selected branch and follows the same snapshot checks. Main, ci-logs, and non-branch refs are refused by the writer. Fork requests are not supported by this same-repository workflow.

## Anchors, staging, and publication

An anchor must match exactly once. Zero or multiple matches are refusals naming the observed count. Read the source first and quote enough context to be unique. A dry run verifies uniqueness against the file on disk; it does not prove that you understood unseen invariants.

Every edit and original-blob precondition is validated before target files are written. A late validation refusal leaves all target files unchanged. Two edits to one file are validated in order against the earlier edit's staged result. Two creates for the same staged file are refused rather than silently overwriting one another.

Filesystem writes are sequential in a disposable runner tree. An I/O error after writing starts can leave that tree partially changed; the report says application failed, not that no file was written. A failed apply step prevents publication. This is atomicity of the published commit, not a claim that multiple filesystem writes form a transaction.

The workflow formats only surviving touched files. Deleted files remain in the commit allow-list but are not formatter inputs. Delete-only requests skip formatter installation. Paths are passed as quoted individual arguments, not whitespace-split command text. Dependency installation disables lifecycle scripts; the complete privileged-runner isolation work is still separate.

Before committing, the workflow checks the staged file list against the touched paths plus the request being consumed. Unexpected files cause refusal. Publication uses the repository PAT so the resulting push can trigger CI; a default GitHub token push would not provide that same follow-on workflow behavior.

## Dry runs and CI

A dry run validates schema, snapshot identity, original blob SHAs, modes, paths, and anchor counts without writing target files or invoking the formatter. It reports planned file operations and sizes measured before formatting. This is not yet a formatted-diff preview or a test run.

A successful dry run consumes its request in a commit with the fixed subject `chore(ai-edit): dry run, nothing applied`. That subject no longer contains `[skip ci]`: an open PR needs required checks on its final head even when only request bookkeeping changed. The ordinary CI event rules still apply; creating a branch alone does not guarantee CI on that branch.

Real and dry-run request messages both reject `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, `[actions skip]`, and `skip-checks:` directives, case-insensitively. Do not add a skip directive to the submission commit either; that would suppress the workflow before validation could run.

A clean dry run is not permission to apply the same request against a later snapshot. Read the new head and blob metadata, then submit a new request without `dry_run`. The intended anchors may remain identical, but the snapshot precondition must be current.

## Reading the result

The report includes the request commit and, after a confirmed push, the published commit link. It explicitly says that the receipt does not verify CI. Check the published commit rather than the request commit or a previous green run.

Before a publication attempt, a failure report says no publication was attempted. If a local candidate commit exists but the push did not confirm success, the result is publication unconfirmed: inspect the branch before retrying because a failed response can follow a successful remote write.

Selection, snapshot, and setup failures also reach the reporting step. If the request is not readable, the workflow tries the branch's open PR rather than trusting arbitrary malformed data. Multiple requests are refused rather than selected alphabetically. An empty request directory is a quiet no-op, including the push that consumes the last request.

Reporting is still best-effort. A missing target or open PR leaves only a job summary; a failed comment publication can follow a successful code push. Durable request IDs, idempotent receipts, bounded machine-readable diagnostics, and guaranteed API-readable fallbacks are follow-up work in [issue #328](https://github.com/chahyasantoso/motion5/issues/328), not guarantees of this slice.

## Allowed paths and remaining trust boundary

Paths must be canonical relative file paths without whitespace, backslashes, control characters, empty/dot/parent components, or a leading hyphen. Every existing component is checked without following symlinks. Parent directories must already exist. File symlinks, directory symlinks, dangling symlinks, and directory targets are refused. The current protocol does not create directories or edit binary files intentionally.

The paths `.git`, `.ai`, `.github/workflows`, and `node_modules`, including everything beneath them, are forbidden. An edit to the workflow is a normal reviewed PR, not an AI-edit request. The line-oriented touched-file contract is why whitespace paths are rejected instead of being ambiguously split later.

These checks do not turn the writer into a sandbox. It still executes the branch's script and reads the branch's dependency and formatter configuration. Use reviewed same-repository branches only. Isolating a trusted runner revision and withholding write credentials from candidate execution remains required follow-up work; do not claim that workflow-path exclusions alone provide that boundary.

## The read budget

This document owns the rule, [read-budget-scan.mjs](../scripts/read-budget-scan.mjs) owns its numbers and enforcement, and the `read-budget` job runs it against the repository. The amendment to ADR-008 in [DECISIONS.md](./DECISIONS.md) records its rationale.

No file under `packages/core/src` may exceed **60,000 bytes**, including markdown. A file over budget may not be edited by anchor. A contents response can truncate without a reliable marker, so a prefix is not proof that the complete invariant was read. A matching anchor and blob precondition do not establish comprehension of the missing bytes.

A source over **30,000 bytes** keeps its private reasoning in a sibling document: `x.ts` beside `x.md`. Read the document before the source. Four conventions are checked: the source has a `// Docs: ./x.md` line; every level-two document heading names a source declaration; those headings follow declaration order; and a mirrored source carries no private docblock.

Exported API docblocks stay in source because declaration files and editor hover consume them. Comments explaining the next statement also stay. Move private-surface reasoning with the member it describes, including file-local types, non-exported helpers, and private members. The scan proves absence of duplicate private docblocks in source, not that every document paragraph is complete or true; semantic review remains necessary.

A temporary over-budget waiver carries a shrinking ceiling, not permission to grow. A pending sister-document entry must disappear when no longer needed. Neither mechanism is an excuse to raise the budget. A slice crossing a threshold owes its split or sister document in the same change, and both source and sibling markdown count toward the read budget.

## Tests and operating cost

The `AE-` cases in [apply-ai-edit.test.ts](../packages/core/test/unit/scripts/apply-ai-edit.test.ts) run the shipped script as a subprocess against planted trees. They preserve the anchor, staging, create/delete, and formatter-list contracts while adding schema, stale-input, skip-directive, path, and partial-write evidence. AE-14 intentionally changes the dry-run subject contract so it no longer skips CI. Their IDs remain governed by the existing evidence-case uniqueness gate.

Run `npx vitest run packages/core/test/unit/scripts/apply-ai-edit.test.ts` with the repository's Node 24 toolchain and dependencies. Subprocess tests do not prove GitHub event routing, PAT scope, actual formatter installation, comment permissions, or final CI triggering; those require a live workflow exercise and exact-SHA evidence in the implementation PR.

Batch a slice into one request. Dry runs cost an additional Actions round trip and are useful when validating uncertain anchors, but their success is not a full-suite result. AI edit never runs the complete test suite: CI remains the owner of correctness on the published commit. Keep unrelated formatting in its own commit; the writer's touched-file formatting is normalization of the files explicitly requested, not permission to reformat the repository.

The bot author plus `AI-Edit-Request:` trailer prevents consumption commits from recursively applying another request. Selection reads the directory, not the push event's changed-file arrays, because Git data API commits may omit those arrays. Keep a live API-made-commit exercise whenever changing either rule.

This is standing infrastructure, not a temporary migration. Keep permissions narrow, never print credentials, and treat the YAML and script as privileged code requiring review. Historical implementation details live in Git; this contract describes the protocol in this branch, not a promise that it has landed on main.
