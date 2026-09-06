# AI edit workflow

This branch contains the gated, two-runner implementation of [AI edit](../.github/workflows/ai-edit.yml). It is not activated merely because its PR passes CI. The default-branch [reporter](../.github/workflows/archive-ci-logs.yml), a reviewed immutable runner revision, appropriate credentials, and live routing evidence are separate rollout requirements. Earlier branches can still contain the legacy privileged writer. Read the workflow at the exact branch you use.

## Ownership and invariant

An attempted edit, a prepared candidate, a published commit, and verified CI are different facts. No comment may promote one into another.

- [apply-ai-edit.mjs](../scripts/apply-ai-edit.mjs) owns protocol validation and staging before disposable filesystem writes.
- [automation-receipt.mjs](../scripts/automation-receipt.mjs) owns canonical request identity, receipt states, diagnostic limits, and rendering.
- [automation-publish.mjs](../scripts/automation-publish.mjs) owns preparation orchestration, independent candidate validation, publication intent, and remote commit reconciliation.
- [automation-report.mjs](../scripts/automation-report.mjs) owns GitHub metadata, immutable evidence persistence, diagnostic retrieval, and bot-owned comment projections.

The workflow owns credential placement and event routing. Candidate processing has read-only permissions and no writer secret. Publication runs separately from the default branch, executes only reviewed code, and treats candidate output as bounded data. This boundary covers this route, not every historical maintenance workflow in the repository.

## Protocol version 1

Requests are JSON files under `.ai/edits/`. Unknown request and edit fields, unsupported versions, stale snapshots, ambiguous anchors, unsafe paths, and CI-skip subjects are refused.

A request requires `version: 1`, `expected_head`, `expected_blobs`, `message`, and `edits`. `expected_head` is the full lowercase source commit SHA read before submission, not the future request commit. `expected_blobs` names every distinct edited path exactly once, using its original Git blob SHA or `null` for an absent file. A Git blob SHA is not a commit SHA or a plain content checksum.

`edits` contains 1 through 50 entries. Each entry specifies `path` and exactly one operation: `find` plus `replace`, `create` with complete text, or `delete: true`. Anchors must be nonempty and occur exactly once. Multiple edits to one file share its original blob precondition and apply sequentially to staged content. Empty replacement removes an anchor. Creates cannot overwrite an existing or already-staged file.

`message` must be a nonempty single line without control characters or CI-skip directives. Real and dry-run requests both reject `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, `[actions skip]`, and `skip-checks:`, case-insensitively. Submission commits must not use those directives either.

`dry_run` is an optional boolean. `target` remains an optional positive issue or PR number for schema compatibility, but the trusted reporter does not use it as publication authority. It resolves an open same-repository PR through verified GitHub run and commit metadata. Missing or ambiguous PR associations leave durable branch-run evidence instead of choosing an arbitrary destination.

## Bounded paths and data

Paths must be canonical relative file paths without whitespace, backslashes, control characters, empty/dot/parent components, or a leading hyphen. The publisher additionally bounds path length to 1,024 characters. Every existing component is checked without following symlinks. Parent directories must already exist. File symlinks, directory symlinks, dangling symlinks, and directory targets are refused. The protocol does not create directories or intentionally edit binary files.

The paths `.git`, `.ai`, `.github/workflows`, and `node_modules`, including everything beneath them, are forbidden edit targets. Workflow changes are authored directly for review, never transported as AI-edit operations. Whitespace paths are refused rather than ambiguously split by the line-oriented touched-file contract.

The canonical request identity is bounded to 1,500,000 bytes and 32 nesting levels. Candidate JSON is bounded to 1,800,000 bytes, each candidate text file to 1,500,000 bytes, and the artifact download to 2,000,000 bytes. Incomplete tree or content responses are refused; a prefix is not a validated snapshot.

## Submit one request-only commit

1. Read the current head and complete files at that immutable revision. Record every original blob SHA. Read the relevant invariant, owner, tests, and sister documents before choosing anchors.
2. Put the bounded edits in one request at `.ai/edits/<name>.json`. Names use letters, digits, dots, underscores, and hyphens, starting with a letter or digit. Only one pending JSON request is allowed.
3. Commit only that request. Its sole parent must be `expected_head`. Do not combine source edits, workflow changes, or other requests with submission.
4. Wait for the candidate run and the separate reporting run. Do not advance the branch while publication is pending. Snapshot checks are repeated independently before publication.
5. Inspect the durable outcome and exact published commit. Check CI on that commit, not the submission commit or an older green head.

A refused request can be corrected in a new request-only commit after refreshing its source and blob preconditions. A consumed request has been removed, so a subsequent request starts from the new head. Never retry an uncertain publication by blindly applying its edits again.

Manual dispatch names the sole pending request on the selected branch. It follows the same snapshot checks. Main, ci-logs, non-branch publication targets, and fork-origin runs are refused. The bot author plus `AI-Edit-Request:` trailer still prevents consumption pushes from recursively applying another request. Replacing this lifecycle classification belongs to the later API-loop slice; the subject is not evidence that CI completed.

## Isolated preparation

The candidate job checks out the reviewed runner and exact request commit into separate directories, with Git credential persistence disabled. It executes the validator from the reviewed revision, not the contributor tree. The validator receives no publication credential.

Prettier is installed outside the candidate tree at the exact version declared by the reviewed runner, with lifecycle scripts disabled. Formatting uses reviewed JSON options and built-in parser inference, never candidate-owned formatter configuration or plugins. Only surviving touched files are formatted. Deletions appear in the candidate allow-list but not the formatter input.

Validation completes before target writes begin. Filesystem writes in the disposable tree are sequential: an application failure can leave that tree partially changed. A formatter failure can likewise follow successful local writes. Neither failure produces a candidate artifact or published commit. This is publication atomicity, not a multi-file filesystem transaction.

Successful preparation uploads only `candidate.json`, named by run ID and attempt. Its versioned envelope records trusted runner SHA, source SHA, request commit, canonical request digest, and bounded file contents. It contains no shell commands, credentials, caller-selected branch, or comment destination. The publisher streams one bounded archive member rather than extracting arbitrary paths or executing artifact files.

## Independent publication and recovery

The default-branch publisher verifies repository, workflow path, run, attempt, event, head SHA, and same-repository origin against GitHub metadata. For successful candidates, it also compares the candidate workflow blob with the reviewed runner, verifies the request-only tree change, reads the original request, and checks source blob preconditions, allowed paths, regular-file modes, and artifact identity.

Publication creates a bounded Git tree and deterministic candidate commit whose sole parent is the request commit. It never checks out or executes candidate files in the credentialed job. The narrow ref update uses the publication PAT so a resulting push can trigger follow-on CI. PAT presence does not itself prove those checks were triggered.

The publisher stores `intent.json` before attempting the non-force branch update. A divergent branch is refused, not force-pushed or semantically rebased. A failed response does not prove the push failed: the publisher re-reads the remote ref and checks whether it contains the candidate. Confirmed publication records that exact SHA with CI pending, never CI success.

Evidence lives on `ci-logs` at `receipts/<kind>/<run-id>/<attempt>/`. An existing file is accepted only if its bytes match; conflicting history is refused. Separate attempts have separate paths. Evidence writes can retry after re-reading their branch; semantic edits are not replayed.

`receipt.json` is the completed outcome. `intent.json` is the durable uncertain outcome when publication cannot be established. `manifest.json` is the fallback for an adapter failure before publication intent exists. These are operation records, not another project-status database.

A failed comment after confirmed publication is recovered from the retained receipt without requiring the candidate artifact or publishing again. If only intent survived, recovery checks candidate reachability on the target branch, candidate and source parents, the original request bytes and canonical digest, and the commit trailers. Verified reachability can produce a confirmed receipt even after the artifact expires. Without that evidence, intent remains explicitly unconfirmed.

Recovery never runs the formatter, creates a candidate, or updates a development ref. A fresh fallback job retries evidence recovery after early reporter setup or execution failure; it has no publication PAT. If a primary publication attempt failed but fallback reporting succeeds, the primary workflow failure remains visible rather than being converted to green.

GitHub availability, the reviewed revision remaining readable, and working evidence-branch permissions are prerequisites. If both primary and fallback reporting fail, the workflow remains failed rather than inventing a durable-success claim. The run ID and attempt identify the expected evidence directory for investigation.

## CI evidence and comments

Completed CI and Recovery audit runs are reported for success, failure, cancellation, timeout, and other explicit conclusions. There is no branch filter silently excluding feature PRs. CI's tested head is populated only when its workflow matches the reviewed head-checkout configuration. Recovery audit can execute other trees, so its tested revision is not invented from its event head.

Failed-job log retrieval has three bounded attempts. Failure becomes `unavailable`, not archived CLI error output. Successful empty output is `empty`. Retained diagnostics are sanitized, UTF-8-safe, split into 24,000-byte chunks, and limited to 1,000,000 retained bytes with explicit truncation metadata. A subprocess transport limit of 8,000,000 bytes can instead make diagnostics unavailable. Redaction recognizes common credential forms; it cannot guarantee detection of arbitrary secrets.

`diagnostics.json` lists chunk paths and retains a standalone escaped excerpt. The comment links to it without duplicating complete logs. Failure markers are preferred over a prefix of passing output. Retained excerpts are escaped again before rendering, so stored text cannot inject markup or mentions.

The reporter maintains one bot-owned summary per PR, receipt kind, and workflow. Human comments with a matching marker are never updated. Run and attempt ordering prevent older completions from replacing newer same-head evidence. The current PR head is checked before and immediately before the comment write. Reporters are serialized. GitHub has no conditional comment-update API: a branch can still move during the write, so each comment identifies its exact commit and the reporter distinguishes historical completion rather than promising atomic head-and-comment updates.

## Dry runs and remaining capabilities

Protocol-v1 dry runs validate without changing target files. They are not formatted-diff previews. They produce an empty candidate and consume the request with `chore(ai-edit): dry run, nothing applied`, without a CI-skip directive. Required PR evidence must still arrive on that final head.

Formatted previews, allowlisted targeted validation, dependency maintenance, and lifecycle redesign remain the later API-loop slice. No arbitrary command strings or privileged maintenance operations were added here. Touched-file normalization accompanies the requested change; unrelated formatting remains separate.

## Activation gate

A reviewed rollout must merge the reporter to the default branch and set `MOTION5_AUTOMATION_SHA` to a full immutable commit containing the reviewed workflows, scripts, formatter version, and configuration. The candidate workflow must match that revision. An unset pin disables preparation and reporting; it does not fall back to the legacy privileged writer.

Verify the existing `ci-logs` branch is writable by the reporter, the publication PAT is appropriately scoped, and a generated commit receives follow-on CI. Exercise successful apply, dry-run consumption, refusal, formatter failure, ambiguous publication, failed comment recovery, rerun, stale completion, and missing diagnostics through actual events. Record exact commit, run, and attempt links in the PR. Fixture tests do not substitute for these exercises, and passing PR CI does not mean default-branch activation occurred.

## The read budget

This document owns the source read-budget contract; [read-budget-scan.mjs](../scripts/read-budget-scan.mjs) owns its numbers and enforcement. No file under `packages/core/src`, including markdown, may exceed 60,000 bytes. An over-budget file may not be edited by anchor. A contents response can truncate without a reliable marker, and a matching anchor or exact blob SHA does not prove the missing invariant was read.

A source over 30,000 bytes keeps private reasoning in a sibling document, `x.ts` beside `x.md`. Read the document before the source. The source has a `// Docs: ./x.md` line; every level-two document heading names a source declaration; those headings follow declaration order; and mirrored source carries no private docblock. Exported API docblocks remain in source because declarations and editor hover consume them. Comments explaining the next statement remain too.

A temporary waiver carries a shrinking ceiling, not permission to grow. A pending sister-document entry must disappear when no longer needed. A slice crossing a threshold owes its split or sister document in the same change. The scan measures structure, not semantic understanding of private reasoning.

## Regression evidence

The AE cases in [apply-ai-edit.test.ts](../packages/core/test/unit/scripts/apply-ai-edit.test.ts), [automation-receipt.test.ts](../packages/core/test/unit/scripts/automation-receipt.test.ts), [automation-adapters.test.ts](../packages/core/test/unit/scripts/automation-adapters.test.ts), and [automation-recovery.test.ts](../packages/core/test/unit/scripts/automation-recovery.test.ts) cover their respective owners. Coverage includes injected publication/report failures, concrete API and evidence-storage checks, artifact-independent reconciliation, and disposable Git repositories using the installed formatter while candidate-owned scripts and configuration would throw if executed. Workflow-text assertions check configuration, not production event routing.

Run the existing full Vitest suite with Node 24. Keep exact-SHA CI results and red/green limitations in the PR. Keep shipped project state only in `SESSION-STATUS.md`.
