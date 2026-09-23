# AI checkpoint workflow

This is the request contract for transporting a reviewed **stack of unified diffs** through CI, for an implementor with no local checkout. It is the sibling of [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md), not its replacement: neither route is preferred, and [AUTOMATION-TRANSPORT-CHOICE.md](./AUTOMATION-TRANSPORT-CHOICE.md) owns which one a given piece of work belongs in. Read that document first if you have not already decided.

The invariant is [ADR-100](./ADR-100-a-patch-declares-the-bytes-it-produces.md): a patch is authority for what changes, and its declared post-image blob ids are authority for what resulted. Stacking is [ADR-101](./ADR-101-a-stacked-patch-chains-by-content.md): a stack chains by content, so its interior needs no commits. The request seal and its bounded assembly range are [ADR-102](./ADR-102-a-request-is-sealed-by-its-manifest.md): patches may arrive across several commits, but the manifest is the only commit that starts a run.

Nothing here is activated merely because this PR passes CI. [ai-checkpoint.yml](../.github/workflows/ai-checkpoint.yml) no-ops while `MOTION5_AUTOMATION_SHA` is unset, and rollback is pointing that variable back. Read the workflow at the exact branch you use. The runner's `checkpointStore()` discovery treats a store without its manifest as no request, and walks the assembly range from the head to `base`, refusing a shallow boundary as `Insufficient fetch depth` rather than as a stale base. The checked-in workflow now triggers only on `.ai/checkpoints/*/manifest.json` and checks out the candidate with `fetch-depth: 30`: patch-only pushes therefore start no run, while the manifest push starts one. A range of up to 24 commits fits that checkout. [ADR-102](./ADR-102-a-request-is-sealed-by-its-manifest.md) records the protocol.

## Ownership

- [checkpoint-policy.mjs](../scripts/checkpoint-policy.mjs) owns the manifest schema, the accepted diff grammar, the path rules, and the chain arithmetic. It is pure: no filesystem, network, Git, or credential access, which is why every refusal it owns is reproducible in a unit test.
- [automation-checkpoint.mjs](../scripts/automation-checkpoint.mjs) owns preparation, independent candidate validation, commit topology, publication, and recovery.
- [automation-receipt.mjs](../scripts/automation-receipt.mjs), [automation-publish.mjs](../scripts/automation-publish.mjs), and [automation-report.mjs](../scripts/automation-report.mjs) are shared with AI edit and are not reimplemented here. `publishCandidate()` in particular is reused unchanged, so intent-before-push, the single non-force ref update, the re-read of the remote head, and the refusal of a divergent branch are inherited rather than copied.

The workflow owns credential placement and event routing. The preparation job has `contents: read`, no writer secret, and `persist-credentials: false` on both checkouts. Publication runs separately, from the default branch, over reviewed code, treating the candidate as bounded data.

## What a checkpoint is, in one paragraph

You build the finished work in a sandbox mirror of the repository. You cut one unified diff per reviewable slice. For every path each slice touches, you record the Git blob id before that slice and after it. You commit the diffs in one or more patch-set-only assembly commits, then commit the manifest last. The manifest seals the request and its arrival starts the run; a store holding patches without a manifest is inert. CI applies the stack in a disposable checkout with no credential, and after each patch it re-hashes every declared path and refuses the run unless the bytes it got are the bytes you declared. The surviving tip is formatted once. The publisher then re-derives your manifest from immutable GitHub data and writes only content whose blob id it has matched against that manifest, as one commit per patch plus at most one formatting commit plus one commit that deletes the store folder. Every checkpoint file, including the manifest, is at most 32,000 bytes.

## The store

`.ai/checkpoints/cpNNN/` holds `manifest.json` and one `NNN-slug.diff` per patch. `cpNNN` is literally `cp` plus three digits. A patch filename is three digits, a hyphen, then a lowercase alphanumeric-and-hyphen slug starting with a letter or digit, then `.diff`, and its three-digit prefix must equal that entry's `seq`.

`.ai` is a protected prefix for this parser and is listed in `.prettierignore`, so a checkpoint cannot mutate the store or a sibling checkpoint, and the formatter cannot rewrite an artifact whose digest is computed over its exact bytes. `.gitattributes` carries `*.diff -text -diff` so that end-of-line normalisation is never applied to bytes that certify themselves.

**The `.ai/checkpoints/` directory does not exist in this repository, and you must not create a placeholder in it.** This is the one place the checkpoint store deliberately differs from `.ai/edits/`, which keeps a `README.md` so its directory survives. Preparation requires `.ai/checkpoints` to contain exactly one entry and for that entry to be your checkpoint folder, and the publisher requires every tree path under `.ai/checkpoints/` to equal exactly the files your manifest declares. A `README.md`, a `.gitkeep`, or a leftover folder therefore refuses future checkpoints by naming the stray path: depending on which check reaches it first you get `Exactly one pending checkpoint is supported` or a complaint that the path is not a checkpoint file. Git does not track empty directories, so the correct state is that the directory is absent until your commit creates it and the consumption commit removes it again.

One pending checkpoint at a time, mirroring AI edit's one pending request. A second folder makes the staleness check ambiguous for no gain. Manifest-first order is strict: if the manifest arrives while a declared patch is missing, the run refuses and names that absent patch file. Repair by deleting the manifest in a new commit, pushing the missing patches, and pushing the manifest again in a new commit. The deletion push matches the manifest-only filter and produces a `nothing is sealed` refusal naming the absent manifest and this repair; patch-only pushes do not start runs, and the final manifest push is the retry trigger. Do not force-update. A stray file is refused by name and repaired by a delete. A partial push stops being corruption and becomes progress.

## The manifest

Exactly five top-level keys, and an unknown key is refused rather than ignored: `version`, `checkpoint`, `base`, `allow`, `patches`.

`version` must be `1`. `checkpoint` must equal the folder name. `base` is the full lowercase 40-character SHA of the commit your stack was cut against and is the boundary of the assembly range, not necessarily the parent of the manifest commit. `allow` is 1 through 10 canonical relative directory prefixes, each ending in `/`, and every path any patch touches must sit under one of them. `patches` is 1 through 20 entries in chain order. The assembly range from `base` to the request head is linear, has at most `MAX_ASSEMBLY_COMMITS = MAX_PATCHES + 4 = 24` commits, and every commit changes only this checkpoint folder.

Each patch entry has exactly seven allowed keys, with `after` the deliberate exception: `seq`, `after`, `file`, `sha256`, `message`, `pre`, `post`. `seq` is the one-based position in the array. `after` is absent on patch one and is exactly `seq - 1` on every later patch. `file` is the patch filename. `sha256` is the SHA-256 hex digest over the exact bytes of that patch file. `message` is the commit subject: one clean line, at most 120 bytes, no CI-skip directive. `pre` and `post` each map 1 through 50 paths to a 40-character lowercase Git blob id, or to `null`.

`pre` and `post` must name the same path set. A path may not be `null` on both sides. So `pre` null is a create, `post` null is a delete, and neither null is a modify, and the parsed diff must agree with that classification.

The chain rule is the one to internalise: for any path a later patch touches, its `pre` must equal the `post` the previous patch that touched it declared. Only the earliest `pre` per path is ever compared against the real repository.

A Git blob id is `git hash-object <file>`. It is not a commit SHA and not a plain content checksum.

## The accepted diff grammar

Protocol v1 accepts a narrow subset on purpose, and refuses the rest by name rather than failing later.

The text must be non-empty LF UTF-8, at most 1,000,000 bytes, free of the prohibited control characters (a horizontal tab is deliberately allowed, since indented source contains them), and must end with a newline. Every file section begins `diff --git a/<path> b/<path>` with both paths identical. Optional `index` lines are accepted. A create carries `new file mode 100644` then `--- /dev/null` and `+++ b/<path>`; a delete carries `deleted file mode 100644` then `--- a/<path>` and `+++ /dev/null`; a modify carries `--- a/<path>` and `+++ b/<path>`. At least one hunk per section, each header matching `@@ -start[,count] +start[,count] @@`, with a body whose `-`, `+`, and context lines account exactly for the declared counts. `\ No newline at end of file` is accepted. Hunks within a section must be ordered and must not overlap.

Refused with an explicit reason: a binary patch, a binary-files summary, a rename, a copy, a similarity or dissimilarity index, a mode change, a submodule update, any mode other than `100644`, a path that differs between the two header sides, and trailing metadata after a section's hunks.

Refused as a path: anything non-canonical or non-relative, a `.` or `..` component, a backslash, whitespace, a control character, a leading hyphen, anything over 1024 bytes, anything at or below `.git`, `.github/workflows`, `.ai`, or `node_modules`, and anything outside `allow`. A workflow change is authored directly for review and is never transported as a checkpoint.

The safest way to produce a conforming patch is `git diff` between two real commits in your mirror, restricted to the paths of that slice. Do not hand-assemble hunks, and do not concatenate diffs that touch the same path.

**Zero context is accepted, and the declared post-image is what places it.** An earlier revision of this document told you to avoid `-U0` because the parser blessed a zero-context hunk that `git apply` then refused with `patch does not apply`. That divergence is closed: the apply flags carry `--unidiff-zero`, and [ADR-100](./ADR-100-a-patch-declares-the-bytes-it-produces.md) owns the decision and the 1,095-comparison measurement behind it. Default context is still the better habit, for a reason about review rather than applicability, since three lines of context are what a reader uses to see where a hunk lands. The one class the flag leaves for another layer is a zero-context pure insertion, which carries neither a context line nor a removed line for the applier to match, and its placement is adjudicated by the declared post-image instead: a misdeclared insertion is refused with `rather than its declared`. Wrong context lines and a zero-context deletion whose removed line disagrees are both still refused with the flag set.

**A checkpoint cannot create or delete an empty file.** `git diff` for an empty-file creation emits a header and an index line with no hunk at all, and the parser requires at least one hunk per file section, so the patch is refused with `a file section carries no hunk`. Give the file content, or create it in a separate human commit.

## The procedure

1. Read the current head of your branch. That SHA is your `base`. Read the complete files you intend to touch at that exact revision, and the invariant, owner, tests and sister documents that govern them. Your read has a budget and it fails silently; [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md) owns that contract and it applies identically here.
2. Materialise a mirror at `base`. A checkpoint cannot be authored from blob reads alone, because post-image ids require the final bytes to exist somewhere you can hash them. This is the setup cost the transport charges.
3. Do slice one. Record `git hash-object` for every path it touches, before and after. Cut its diff. Do slice two on top of that state and repeat. Slice one's `post` map is literally slice two's `pre` map for any shared path, which is the chain, and the easiest way to get it wrong is to re-cut a later slice against `base` instead of against the state its predecessor produced.
4. Write the manifest. Digest each patch file with SHA-256. Check `seq`, `after`, and the filename prefix agree for every entry.
5. Commit only `.ai/checkpoints/cpNNN/` in one or more patch-set-only assembly commits. Push the patch files first and push the manifest last; the manifest commit starts the run. From `base` to the request head, every commit must have exactly one parent, every own diff must stay inside this checkpoint folder, and the aggregate diff must contain exactly the manifest and declared patches. The range is at most 24 commits. Do not combine source, workflow, or documentation changes with the assembly: a source path anywhere in the range is refused.
6. Do not advance the branch while publication is pending. Wait for the preparation run and then the separate reporting run.
7. Read the receipt comment, open the exact published commits, and verify CI on the final head. Publication is not a CI claim: a confirmed receipt records `ci: pending`.

A refused checkpoint is corrected by deleting an early manifest if necessary, pushing the missing patches, and pushing the manifest again in a new commit. Deleting the manifest itself matches the manifest-only filter and produces a `nothing is sealed` refusal naming the absent manifest and this repair; patch-only pushes do not start runs, and the replacement manifest starts the retry. A stray file is repaired by a delete. Refresh `base` and every pre-image when the assembly itself is stale. A consumed checkpoint has been deleted by the consumption commit, so the next checkpoint starts from the new head. Never retry an uncertain publication by applying the patches again.

## What preparation does, in order

It requires a reviewed 40-hex runner SHA, then lets `checkpointStore()` discover the store entries from the committed tree, requiring every entry to be a regular `100644` blob, applying the per-file transport bound to each entry size, and requiring exactly one checkpoint id. It then uses `sealedRequest()` to parse the manifest, require its checkpoint id to match the stored folder, and apply `sealedStore`. The request head must have a linear assembly range of one-parent commits no longer than 24 commits, each commit's own diff must be confined to this checkpoint folder, and the aggregate base-to-head diff must equal exactly `manifest.json` plus the declared patch files. A history walk that reaches the shallow-clone boundary before `base` is refused as `Insufficient fetch depth`, not reported as a stale base.

Then it computes the chain and, for each patch in order, verifies the stored bytes against the declared SHA-256, parses the grammar, reconciles the parsed shape against the manifest entry, and, on the first patch that touches a path, verifies the observed source blob against the declared pre-image.

Then it applies each patch with `git apply --check` followed by `git apply`, and re-reads and re-hashes every declared post path. A mismatch is refused naming both ids. It also refuses any file that changed outside the declaration, so a patch with a side effect is caught rather than published.

Only after the whole stack has applied and been adjudicated does the pinned formatter run, once, over the surviving tip paths. Formatting deliberately does not run between patches: patch two's pre-image was computed in a sandbox where Prettier never ran, so formatting patch one first would invalidate the declaration patch two depends on. Intermediate commits are therefore not required to be Prettier-clean, and nothing asks them to be, because `format:check` runs against the branch head.

The candidate is one JSON envelope, bounded to 1,800,000 bytes, carrying the trusted SHA, the request and source commits, the checkpoint id and digest, one entry per commit with its verified file contents, and either `null` or one formatting entry. Full content travels per commit, so a path touched by five patches appears five times. Crossing the bound is refused with `The candidate exceeds 1800000 bytes; split the work into more, smaller checkpoints`, and the answer is more, smaller checkpoints rather than a larger envelope.

## What publication refuses to take on trust

It verifies repository, workflow path, run, attempt, event, head SHA and same-repository origin against GitHub metadata, and requires the candidate workflow's blob to equal the reviewed runner's. It re-reads the request and source commits as trees, lets `checkpointStore()` rediscover the stored entries and their sizes, uses `sealedRequest()` to validate the manifest and exact store, and independently compares `base...head`. `compareRelation()` classifies `ahead`, `identical`, `behind` and `diverged` exhaustively: `identical` is refused as `the head is the manifest base; nothing was assembled`, while `behind` and `diverged` are refused as `Stale base; the patch set was cut against a commit the head does not descend from`. The accepted `ahead` range must have `ahead_by` at most 24 and linear one-parent ancestry; publication then checks the aggregate base-to-head tree difference and repeats the immutable exact-set checks rather than believing the candidate.

Then, for every commit the candidate proposes, it requires the sequence, the subject, the patch path, the patch digest, the path set, and the **Git blob id of every file's content** to equal what that independently re-derived manifest declared. It does not apply a hunk in the credentialed job. It writes bytes it has already matched to an already-reviewed declaration, which is why a tampered artifact can only publish content that hashes to something a human reviewed.

The formatting commit is the one exception and is stated rather than implied. Its bytes have no declared digest, because the preparing implementor cannot run Prettier, so they are checked only as bounded text on a path the checkpoint leaves behind under the exact subject `style(checkpoint): normalise cpNNN with the pinned formatter`. That is exactly the trust posture AI edit's candidate files already have.

## The commits you get

One commit per patch, in declared order, each carrying the patch's subject and three trailers: `AI-Checkpoint` naming the patch file, `AI-Checkpoint-Patch` carrying `sha256:<digest>`, and `AI-Checkpoint-Set` carrying the manifest digest. Then, only if the formatter changed anything, one commit subject `style(checkpoint): normalise cpNNN with the pinned formatter` carrying `AI-Checkpoint-Set`. Then one commit subject `chore(checkpoint): consume cpNNN` that deletes `manifest.json` and every patch file.

So a clean stack of N patches publishes N+1 commits, or N+2 when formatting changed something. Every publication commit has exactly one parent and the publication chain is a fast-forward; a divergent branch is refused rather than force-pushed or rebased. This publication topology is separate from the multi-commit assembly range that carried the sealed request.

## Failure and recovery

Evidence lives on `ci-logs` at `receipts/checkpoint/<run-id>/<attempt>/`. `receipt.json` is a completed outcome. `intent.json` is a durable uncertain outcome recorded before the push was attempted.

A lost HTTP response is treated as uncertainty, not failure. `recover` reads the receipt if one exists and reports it without republishing. Otherwise it reads the intent and reconciles: it checks the branch contains the recorded candidate, verifies the assembly range from the recorded source to the request commit through the same `assemblyCompare` reading the publisher uses, meaning compare status `ahead`, the 24-commit bound and linear one-parent shape, rather than requiring the request commit's parent to be the source, requires the first published commit to retain its `AI-Checkpoint` trailer, reloads the manifest from that path at the immutable request commit, and requires both the manifest digest and its `base` to match what the intent recorded. That can confirm a publication even after the artifact expires. No patch is ever replayed. If reconciliation cannot confirm, the outcome stays `unconfirmed` with `next_action: reconcile_before_retry`, and a human inspects the durable intent before anything is retried.

Retained patch text is sanitised rather than byte-exact. A token-shaped string or a control character is redacted out of the chunks before they are written, while the evidence manifest still carries the `sha256` over the original bytes and says `retained_text: sanitised_not_byte_exact`. Do not digest a retained chunk and conclude the declaration is wrong: the declared digest is the authority and a chunk is a reading aid.

A skipped push is classified rather than guessed at: `cleanup_only` only when the head commit carries the set trailer and has one parent, otherwise `skipped_by_filter`, and neither claims a publication. A failed preparation retains diagnostics and publishes nothing.

## Known limits, stated rather than discovered

There is no `operation: "preview"`. AI edit has preview and validate; this route has neither, and that is a real regression rather than an oversight. It needs its own receipt projection, operation evidence, consume-without-publishing path and cleanup classification, which is roughly the size of everything else here, and no acceptance criterion depends on it. The follow-up shape is a manifest-level `operation` field, empty commit file lists, and an `operation_result`.

Twenty patches, fifty paths, 1,000,000 bytes per patch, 1,500,000 bytes per materialised file, and 1,800,000 bytes per candidate are bounds rather than recommendations. Every checkpoint transport file has the additional 32,000-byte bound, including `manifest.json`; that bound is a conservative proposal, not a measurement of the MCP ceiling. The candidate envelope binds first and binds sooner than patch sizes suggest.

There is a sixth bound, and it is an aggregate rather than a per-item one: the combined bytes of every patch file in a set may not exceed 1,000,000, because the publisher retains that text as evidence on `ci-logs`. So two individually valid 600,000-byte patches clear the per-patch bound and the candidate bound and are still refused with `Retained patch bytes exceed the limit`. Preparation enforces it as well as the publisher, so the refusal arrives before a round trip is spent rather than after one, and the publisher keeps its own check because it owns what it retains.

The parser and the applier accepted different sets of patches until `--unidiff-zero` was added to the apply flags, and that is now closed rather than outstanding. ADR-100 records the decision, the measurement, and why teaching the parser the applier's heuristic was the rejected alternative. What remains is narrowness by design rather than untidiness: the parser is still permitted to be narrower than Git on shape, because ADR-100 gives it shape and gives the declared post-image the result, so a refusal it owns is a property of the bytes and never the last word on correctness.

Binary content, renames expressed as renames, mode changes, symlinks and submodules are refused by the grammar and the path rules. A generated lockfile is a different case and the distinction matters: nothing in this parser refuses `package-lock.json` by name, so an allowlisted lockfile would be accepted as ordinary UTF-8 text. Keeping it out is a policy this document states rather than a gate the code enforces, and dependency maintenance stays in its dedicated human-dispatch route.

The artifact reader in `automation-checkpoint.mjs` is a knowing duplicate of the AI edit publisher's. It belongs in the GitHub adapter and lifting it there is its own slice rather than a drive-by edit to a credentialed path.

## Activation gate

A reviewed rollout requires the default-branch reporter to carry the `"AI checkpoint"` workflow name, the `kind=checkpoint` resolution, and the publish and recover steps, and requires `MOTION5_AUTOMATION_SHA` to name a full immutable commit containing the reviewed workflows, scripts, formatter version and configuration. The candidate workflow's blob must equal that revision's. An unset pin disables preparation entirely.

Still owed, and not claimed as done: a live single-patch publication, a live stacked publication, a live refusal at each gate, a live formatting commit, a live uncertain publication recovered from intent, and a live cleanup-only classification, each recorded with its exact commit, run and attempt in the pull request. Fixture tests are not those exercises, and a passing PR does not move the pin.

## Worked example

Two slices against `base`, adding a module and then a test that imports it. Placeholders must be replaced with real 40-character ids; the digests are over the exact bytes of the patch files you commit.

`.ai/checkpoints/cp001/manifest.json`

```text
{
  "version": 1,
  "checkpoint": "cp001",
  "base": "<40-character parent commit SHA>",
  "allow": ["packages/core/src/", "packages/core/test/"],
  "patches": [
    {
      "seq": 1,
      "file": "001-add-clock-port.diff",
      "sha256": "<64-hex digest of 001-add-clock-port.diff>",
      "message": "feat(core): add the clock port",
      "pre": {"packages/core/src/clock.ts": null},
      "post": {"packages/core/src/clock.ts": "<blob id after slice one>"}
    },
    {
      "seq": 2,
      "after": 1,
      "file": "002-cover-clock-port.diff",
      "sha256": "<64-hex digest of 002-cover-clock-port.diff>",
      "message": "test(core): cover the clock port",
      "pre": {
        "packages/core/src/clock.ts": "<blob id after slice one>",
        "packages/core/test/unit/clock.test.ts": null
      },
      "post": {
        "packages/core/src/clock.ts": "<blob id after slice two>",
        "packages/core/test/unit/clock.test.ts": "<blob id after slice two>"
      }
    }
  ]
}
```

Note the chain: `packages/core/src/clock.ts` carries the same id as patch one's `post` and patch two's `pre`, and only patch one's `pre` for that path, `null`, is ever compared against the real repository. Patch two's entry for the test file is `null` on the `pre` side because slice two creates it.

## Regression evidence

[checkpoint-policy.test.ts](../packages/core/test/unit/scripts/checkpoint-policy.test.ts) owns the pure layer: the manifest schema, the grammar, the path rules, the chain arithmetic, and the named refusals.

[automation-checkpoint.test.ts](../packages/core/test/unit/scripts/automation-checkpoint.test.ts) owns preparation and candidate validation against real Git repositories with the pinned formatter, including a stacked create, modify and delete, per-patch post-image gating, the separate formatting commit, a stale base, a moved pre-image, an undeclared path, a wrong post-image, and a tampered candidate.

What is measured and what is not, named rather than left to inference. The assembly-range checks are measured against real Git repositories in [automation-checkpoint.test.ts](../packages/core/test/unit/scripts/automation-checkpoint.test.ts) and as pure rules in [checkpoint-policy.test.ts](../packages/core/test/unit/scripts/checkpoint-policy.test.ts): a multi-commit assembly is accepted, a source change anywhere in the range is refused even when reverted before the seal, a range one past its bound is refused while the bound itself is accepted, a manifest-first partial store names the missing patch and then heals by the repair it names, a stray file is refused by name, a shallow boundary is refused as `Insufficient fetch depth` while a deeper clone of the same range is accepted, and the publisher's own compare-and-aggregate reading refuses the same shapes from scripted GitHub data. The workflow test pins the manifest-only filter, `fetch-depth: 30`, and a depth greater than `MAX_ASSEMBLY_COMMITS`; a live GitHub event-routing run is not claimed. The existing topology evidence remains about publication commits: patches + 2 commits with a formatting commit and patches + 1 without, all three trailers in declared order, a deletion carried as a null blob that keeps its source mode, and a consumption commit deleting exactly the store. A live MCP ceiling measurement is not claimed; the 32,000-byte per-file policy is checked from committed tree-entry sizes on both sides.

Still reviewed rather than measured, and read the following as intended behaviour to verify against the first live publication: `publishCheckpointRun`, `checkpointSnapshot`, the artifact reader, evidence retention and the non-force ref update in situ, and the skipped-run classification. `automation-receipt.test.ts` does not cover the `checkpoint` kind. No live workflow run, publication, cleanup-only classification or recovery exists.

Run the full Vitest suite with Node 24. Keep exact-SHA results and red or green limitations in the pull request, and keep shipped project state only in [SESSION-STATUS.md](./SESSION-STATUS.md).
