# AI edit workflow

This branch contains the gated, two-runner implementation of [AI edit](../.github/workflows/ai-edit.yml). It is not activated merely because its PR passes CI. The default-branch [reporter](../.github/workflows/archive-ci-logs.yml), a reviewed immutable runner revision, appropriate credentials, and live routing evidence are separate rollout requirements. Earlier branches can still contain the legacy privileged writer. Read the workflow at the exact branch you use.

## Ownership and invariant

An attempted edit, a prepared candidate, a published commit, and verified CI are different facts. No comment may promote one into another.

- [automation-operation.mjs](../scripts/automation-operation.mjs) owns the fail-closed operation schema, normalized preview preparation, targeted validation, and bounded operation evidence.
- [apply-ai-edit.mjs](../scripts/apply-ai-edit.mjs) owns low-level edit validation and staging before disposable filesystem writes. The orchestrator hands it a normalized edit-only request; it is not a general operation CLI.
- [automation-receipt.mjs](../scripts/automation-receipt.mjs) owns canonical request identity, receipt states, diagnostic limits, and rendering.
- [automation-publish.mjs](../scripts/automation-publish.mjs) owns preparation orchestration, independent candidate validation, publication intent, and remote commit reconciliation.
- [automation-report.mjs](../scripts/automation-report.mjs) owns GitHub metadata, immutable evidence persistence, diagnostic retrieval, and bot-owned comment projections.

The workflow owns credential placement and event routing. Candidate processing has read-only permissions and no writer secret. Publication runs separately from the default branch, executes only reviewed code, and treats candidate output as bounded data. This boundary covers this route, not every historical maintenance workflow in the repository.

## Protocol version 1

Requests are JSON files under `.ai/edits/`. Unknown request and edit fields, unsupported versions, stale snapshots, ambiguous anchors, unsafe paths, and CI-skip subjects are refused.

Every request requires `version: 1`, `expected_head`, `expected_blobs`, and `message`. Apply and preview additionally require `edits`; validation instead requires `paths` and `checks` and prohibits `edits`. `operation` is one of `apply`, `preview`, and `validate`. An omitted operation preserves apply, except the existing `dry_run: true` spelling selects preview. Never supply both `operation` and `dry_run`. Unknown operations, including maintenance and shell commands, are refused. `expected_head` is the full lowercase source commit SHA read before submission, not the future request commit. `expected_blobs` names every distinct edited or validated path exactly once, using its original Git blob SHA. Only apply and preview may use `null` for an absent file; validation requires existing files. A Git blob SHA is not a commit SHA or a plain content checksum.

`edits` contains 1 through 50 entries. Each entry specifies `path` and exactly one operation: `find` plus `replace`, `create` with complete text, or `delete: true`. Anchors must be nonempty and occur exactly once. Multiple edits to one file share its original blob precondition and apply sequentially to staged content. Empty replacement removes an anchor. Creates cannot overwrite an existing or already-staged file.

`message` must be a nonempty single line without control characters or CI-skip directives. Real and dry-run requests both reject `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, `[actions skip]`, and `skip-checks:`, case-insensitively. Submission commits must not use those directives either.

`dry_run` is an optional boolean. `target` remains an optional positive issue or PR number for schema compatibility, but the trusted reporter does not use it as publication authority. It resolves an open same-repository PR through verified GitHub run and commit metadata. Missing or ambiguous PR associations leave durable branch-run evidence instead of choosing an arbitrary destination.

## Bounded paths and data

Paths must be canonical relative file paths without whitespace, backslashes, control characters, empty/dot/parent components, or a leading hyphen. The publisher additionally bounds path length to 1,024 characters. Every existing component is checked without following symlinks. Parent directories must already exist. File symlinks, directory symlinks, dangling symlinks, and directory targets are refused. The protocol does not create directories or intentionally edit binary files.

The paths `.git`, `.ai`, `.github/workflows`, and `node_modules`, including everything beneath them, are forbidden edit targets. Workflow changes are authored directly for review, never transported as AI-edit operations. Whitespace paths are refused rather than ambiguously split by the line-oriented touched-file contract.

The canonical request identity is bounded to 1,500,000 bytes and 32 nesting levels. Combined original target text is bounded to 1,500,000 bytes. Candidate JSON is bounded to 1,800,000 bytes, each candidate text file to 1,500,000 bytes, and the artifact download to 2,000,000 bytes. Incomplete tree or content responses are refused; a prefix is not a validated snapshot.

## Submit one request-only commit

1. Read the current head and complete files at that immutable revision. Record every original blob SHA. Read the relevant invariant, owner, tests, and sister documents before choosing anchors.
2. Put the bounded edits in one request at `.ai/edits/<name>.json`. Names use letters, digits, dots, underscores, and hyphens, starting with a letter or digit. Only one pending JSON request is allowed.
3. Commit only that request. Its sole parent must be `expected_head`. Do not combine source edits, workflow changes, or other requests with submission.
4. Wait for the candidate run and the separate reporting run. Do not advance the branch while publication is pending. Snapshot checks are repeated independently before publication.
5. Inspect the durable outcome and exact published commit. Check CI on that commit, not the submission commit or an older green head.

A refused request can be corrected in a new request-only commit after refreshing its source and blob preconditions. A consumed request has been removed, so a subsequent request starts from the new head. Never retry an uncertain publication by blindly applying its edits again.

Manual dispatch names the sole pending request on the selected branch. It follows the same snapshot checks. Main, ci-logs, non-branch publication targets, and fork-origin runs are refused. The bot author plus `AI-Edit-Request:` trailer still prevents consumption pushes from recursively applying another request. This legacy recursion suppression is not a validation result; the subject is not evidence that CI completed.

## Isolated preparation

The candidate job checks out the reviewed runner and exact request commit into separate directories, with Git credential persistence disabled. It executes the validator from the reviewed revision, not the contributor tree. The validator receives no publication credential.

Prettier is installed outside the candidate tree at the exact version declared by the reviewed runner, with lifecycle scripts disabled. Formatting uses reviewed JSON options and built-in parser inference, never candidate-owned formatter configuration or plugins. Both formatting and checking receive the same per-file options, including the original validated repository-relative filepath: a parser name alone does not preserve filename-dependent printing such as TypeScript versus TSX generic-arrow commas. This filename is printer context, not permission to discover candidate configuration. Only surviving touched files are formatted. Deletions appear in the candidate allow-list but not the formatter input.

Validation completes before target writes begin. Filesystem writes in the disposable tree are sequential: an application failure can leave that tree partially changed. A formatter failure can likewise follow successful local writes. Neither failure produces a candidate artifact or published commit. This is publication atomicity, not a multi-file filesystem transaction.

Successful preparation uploads only `candidate.json`, named by run ID and attempt. Its versioned envelope records trusted runner SHA, source SHA, request commit, canonical request digest, and bounded file contents. It contains no shell commands, credentials, caller-selected branch, or comment destination. The publisher streams one bounded archive member rather than extracting arbitrary paths or executing artifact files.

## Independent publication and recovery

The default-branch publisher verifies repository, workflow path, run, attempt, event, head SHA, and same-repository origin against GitHub metadata. For successful candidates, it also compares the candidate workflow blob with the reviewed runner, verifies the request-only tree change, reads the original request, and checks source blob preconditions, allowed paths, regular-file modes, and artifact identity.

Publication creates a bounded Git tree and deterministic candidate commit whose sole parent is the request commit. It never checks out or executes candidate files in the credentialed job. The narrow ref update uses the publication PAT so a resulting push can trigger follow-on CI. PAT presence does not itself prove those checks were triggered.

The publisher stores `intent.json` before attempting the non-force branch update. A divergent branch is refused, not force-pushed or semantically rebased. A failed response does not prove the push failed: the publisher re-reads the remote ref and checks whether it contains the candidate. Confirmed publication records that exact SHA with CI pending, never CI success.

Evidence lives on `ci-logs` at `receipts/<kind>/<run-id>/<attempt>/`. An existing file is accepted only if its bytes match; conflicting history is refused. Separate attempts have separate paths. Evidence writes can retry after re-reading their branch; semantic edits are not replayed.

`receipt.json` is the completed operation outcome. `intent.json` is the durable uncertain outcome when publication cannot be established. `manifest.json` records either the fallback for an adapter failure before publication intent exists or an explicitly classified cleanup-only lifecycle run. A cleanup manifest carries `classification: "cleanup_only"`, the skipped run conclusion, its truthful `not_attempted`/`not_run` outcome, and `operation_receipt` linking the confirmed operation. It never claims CI success or replaces required CI. These are operation records, not another project-status database.

A failed comment after confirmed publication is recovered from the retained receipt without requiring the candidate artifact or publishing again. If only intent survived, recovery checks candidate reachability on the target branch, candidate and source parents, the original request bytes and canonical digest, and the commit trailers. Verified reachability can produce a confirmed receipt even after the artifact expires. Without that evidence, intent remains explicitly unconfirmed.

Recovery never runs the formatter, creates a candidate, or updates a development ref. A fresh fallback job retries evidence recovery after early reporter setup or execution failure; it has no publication PAT. If a primary publication attempt failed but fallback reporting succeeds, the primary workflow failure remains visible rather than being converted to green.

GitHub availability, the reviewed revision remaining readable, and working evidence-branch permissions are prerequisites. If both primary and fallback reporting fail, the workflow remains failed rather than inventing a durable-success claim. The run ID and attempt identify the expected evidence directory for investigation.

## CI evidence and comments

Completed CI and Recovery audit runs are reported for success, failure, cancellation, timeout, and other explicit conclusions. There is no branch filter silently excluding feature PRs. CI's tested head is populated only when its workflow matches the reviewed head-checkout configuration. Recovery audit can execute other trees, so its tested revision is not invented from its event head.

Failed-job log retrieval has three bounded attempts. Failure becomes `unavailable`, not archived CLI error output. Successful empty output is `empty`. Retained diagnostics are sanitized, UTF-8-safe, split into 24,000-byte chunks, and limited to 1,000,000 retained bytes with explicit truncation metadata. A subprocess transport limit of 8,000,000 bytes can instead make diagnostics unavailable. Redaction recognizes common credential forms; it cannot guarantee detection of arbitrary secrets.

`diagnostics.json` lists chunk paths and retains a standalone escaped excerpt. The comment links to it without duplicating complete logs. Failure markers are preferred over a prefix of passing output. Retained excerpts are escaped again before rendering, so stored text cannot inject markup or mentions.

The reporter maintains one bot-owned summary per PR, receipt kind, and workflow. Human comments with a matching marker are never updated. Run and attempt ordering prevent older completions from replacing newer same-head evidence. The current PR head is checked before and immediately before the comment write. Reporters are serialized. GitHub has no conditional comment-update API: a branch can still move during the write, so each comment identifies its exact commit and the reporter distinguishes historical completion rather than promising atomic head-and-comment updates.

### Verified cleanup-only reporting

After the issue #335 runner is reviewed and activated, the publication owner recognizes a skipped push as cleanup-only only with verified repository/run/attempt/workflow metadata, an unchanged reviewed workflow blob, and exactly one completed skipped preparation job. It requires a single parent, the original successful operation run on that parent and branch, a matching confirmed publication receipt and canonical request digest, the independently revalidated preview/validation snapshot, and a complete tree proving that only the request was removed. Commit subjects and bot-looking authors are not proof. Content or mode changes, unknown metadata, manual dispatches, missing evidence, and failed runs do not qualify.

Classification examines at most 20 original operation attempts, including older attempts with retained receipts. Unavailable or oversized proof leaves ordinary reporting active rather than suppressing an unexplained outcome. Verified cleanup persists its own manifest without entering comment ordering, so it cannot overwrite the confirmed operation projection even though its run ID is newer. Primary publication and artifact-independent recovery share this classification; evidence-storage failures remain failures. Historical evidence is never rewritten. Existing stale projections are not claimed repaired automatically by deploying prevention logic.

[automation-cleanup.test.ts](../packages/core/test/unit/scripts/automation-cleanup.test.ts) covers confirmed preview and validation followed by skipped cleanup on the same head, recovery, genuine failed runs, unverifiable identities, adjacent changes, and persistence failure. These are adapter fixtures, not proof of live activation. Required PR CI and the broader issue #328 lifecycle/refusal/recovery exercises are unchanged.

## Formatted preview and targeted validation

These operations require a reviewed and activated slice 4 runner. An older pin still implements the older dry-run contract; a passing PR does not change the pin. [API-CAPABILITIES.md](./API-CAPABILITIES.md) is the concise navigation map.

A preview uses the same bounded edits and original blob preconditions as apply. It applies and formats in the disposable uncredentialed candidate tree, then emits an empty publication file list. The contributor branch receives only request cleanup. `operation.json` records the source and request SHAs, trusted runner, canonical request digest, proposed-content digest, final UTF-8 byte sizes, creates/deletes/modifications, and per-path checks. `tested_sha` is null for a proposed tree, not falsely set to a commit that lacks those changes.

The final unified diff is bounded to 1,000,000 bytes; oversized output is refused, never presented as a complete prefix. Durable evidence splits the sanitized diff into UTF-8-safe chunks no larger than 24,000 bytes. `operation.json` lists every chunk, original and retained digests and byte counts, and whether redaction changed the bytes. Read all chunks. Retained redacted output is evidence, not a patch to apply verbatim. Redaction does not promise detection of arbitrary secrets.

Validation accepts 1 through 50 unique existing paths and a nonempty unique `checks` array drawn from `format` and `read-budget`. Each path needs its source blob SHA. It executes no user-provided command, script, formatter configuration, or plugin. `format` uses reviewed built-in parser inference; unsupported file types are explicitly not applicable. `read-budget` checks targeted core file sizes and applicable source/sister-document structure through the trusted scanner policy. It is not the full repository scan. Paths outside core source and deleted non-document preview files are explicitly not applicable, never called passed. A changed or deleted sister document also checks its surviving source partner, so a document-only edit cannot hide a broken mirror.

Validation records `tested_sha` as the exact source commit. Failed targeted checks remain `failure` in the result even when preparation and request cleanup succeed. No target bytes are changed by validation. Both operations say `required_ci: "not_replaced"`: their results are fast feedback, not required CI or merge authorization. Inspect the cleanup receipt and the checks on that final head. Refresh the head and original blob preconditions before a separate apply request.

Example templates below require real complete source and blob SHAs, not the placeholder strings.

```text
{
  "version": 1,
  "operation": "preview",
  "expected_head": "<40-character source SHA>",
  "expected_blobs": {"docs/example.md": "<original Git blob SHA>"},
  "message": "docs(example): clarify usage",
  "edits": [{"path": "docs/example.md", "find": "old text", "replace": "new text"}]
}
```

```text
{
  "version": 1,
  "operation": "validate",
  "expected_head": "<40-character source SHA>",
  "expected_blobs": {"packages/core/src/index.ts": "<original Git blob SHA>"},
  "message": "chore(validation): inspect source checks",
  "paths": ["packages/core/src/index.ts"],
  "checks": ["format", "read-budget"]
}
```

## Disabled maintenance and remaining lifecycle limits

Dependency maintenance is refused even with a PAT. A future reviewed operation must bound package/version inputs, disable lifecycle scripts, allow only exact manifest-plus-lockfile outputs, preserve credential isolation, and prove CI on its generated commit. No arbitrary command interface or temporary privileged automation is introduced. [MAINTENANCE-WORKFLOWS.md](./MAINTENANCE-WORKFLOWS.md) owns the slice 5 capability inventory, supported human-dispatch routes, replacement requirements, and retirement prerequisites. Inventory completion does not authorize removal: usage review, live replacement validation, and separately confirmed deletion remain required.

Request preparation still uses the existing bot-author/trailer recursion suppression; this change does not alter its workflow condition. The reviewed issue #335 reporter separately verifies cleanup-only lifecycle evidence before withholding a comment update. Neither mechanism is a CI-skip directive or a substitute for required evidence. Preparation lifecycle redesign and the full failure/recovery activation matrix remain separate acceptance work under issue #328. Touched-file normalization accompanies the requested change; unrelated formatting stays separate.

## Activation gate

A reviewed rollout must merge the reporter to the default branch and set `MOTION5_AUTOMATION_SHA` to a full immutable commit containing the reviewed workflows, scripts, formatter version, and configuration. The candidate workflow must match that revision. An unset pin disables preparation and reporting; it does not fall back to the legacy privileged writer.

Verify the existing `ci-logs` branch is writable by the reporter, the publication PAT is appropriately scoped, and a generated commit receives follow-on CI. Exercise successful apply, dry-run consumption, refusal, formatter failure, ambiguous publication, failed comment recovery, rerun, stale completion, and missing diagnostics through actual events. Record exact commit, run, and attempt links in the PR. Fixture tests do not substitute for these exercises, and passing PR CI does not mean default-branch activation occurred.

## The read budget

This document owns the source read-budget contract; [read-budget-scan.mjs](../scripts/read-budget-scan.mjs) owns its numbers and enforcement. No file under `packages/core/src`, including markdown, may exceed 60,000 bytes. An over-budget file may not be edited by anchor. A contents response can truncate without a reliable marker, and a matching anchor or exact blob SHA does not prove the missing invariant was read.

A source over 30,000 bytes keeps private reasoning in a sibling document, `x.ts` beside `x.md`. Read the document before the source. The source has a `// Docs: ./x.md` line; every level-two document heading names a source declaration; those headings follow declaration order; and mirrored source carries no private docblock. Exported API docblocks remain in source because declarations and editor hover consume them. Comments explaining the next statement remain too.

A standalone comment in mirrored source carries no citation: no `ADR-nnn`, no evidence case id, no issue or pull request number. A citation is provenance, provenance is member-level rationale, and the sister document owns it. A comment trailing a statement on the same line keeps its exemption, and an exported or public docblock keeps its citations because the declaration file and editor hover consume it. A pair that still owes the move carries a shrinking pending entry rather than a waiver, and an entry the tree no longer needs fails the scan by itself.

A temporary waiver carries a shrinking ceiling, not permission to grow. A pending sister-document entry must disappear when no longer needed. A slice crossing a threshold owes its split or sister document in the same change. The scan measures structure, not semantic understanding of private reasoning.

## Regression evidence

The AE cases in [apply-ai-edit.test.ts](../packages/core/test/unit/scripts/apply-ai-edit.test.ts), [automation-receipt.test.ts](../packages/core/test/unit/scripts/automation-receipt.test.ts), [automation-adapters.test.ts](../packages/core/test/unit/scripts/automation-adapters.test.ts), and [automation-recovery.test.ts](../packages/core/test/unit/scripts/automation-recovery.test.ts) cover their respective owners. Coverage includes injected publication/report failures, concrete API and evidence-storage checks, artifact-independent reconciliation, and disposable Git repositories using the installed formatter while candidate-owned scripts and configuration would throw if executed. Workflow-text assertions check configuration, not production event routing.

[automation-operation.test.ts](../packages/core/test/unit/scripts/automation-operation.test.ts) proves the formatted-preview regression; [automation-operation-policy.test.ts](../packages/core/test/unit/scripts/automation-operation-policy.test.ts) covers allowlisted operations, exact-source validation, preview/apply equivalence, refusal boundaries, bounded diffs, and durable redacted evidence. [automation-format-filepath.test.ts](../packages/core/test/unit/scripts/automation-format-filepath.test.ts) compares real apply/preview bytes and targeted validation against the pinned Prettier CLI for both `.ts` and `.tsx`, including canonical and noncanonical inputs, untouched targets, read-only evidence, and hostile or incompatible candidate formatting configuration. These are isolated preparation regressions, not live runner activation evidence.

Run the existing full Vitest suite with Node 24. Keep exact-SHA CI results and red/green limitations in the PR. Keep shipped project state only in `SESSION-STATUS.md`.
