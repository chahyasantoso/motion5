# ADR-112: A handover applies whole or not at all

**Status:** Proposed in [#488](https://github.com/chahyasantoso/motion5/pull/488), 2026-09-24,
stacked on #349 phase 6 (ADR-111) in the same pull request. Closes
[#487](https://github.com/chahyasantoso/motion5/issues/487) when merged; no merge is claimed here.

## Context

Issue #487 is infrastructure for a human who has access to Codespaces, not an AI automation
workflow. The intended procedure is deliberately small: download a handover zip, put it in the
dedicated folder, run one command, and have the command scan the folder, extract the zip, apply the
patches, and remove the folder contents only after success. The contract needs to make that
procedure safe without making the human understand the AI checkpoint transport. The human-facing
contract is [HANDOVER-FORMAT.md](./HANDOVER-FORMAT.md); this record owns why its application is
atomic.

This is infrastructure, and AGENTS.md asks that it land separately from the #349 behavior work.
Pull request #488 carries both, the phase 6 commits first and these after them, so the two stay
separable commit by commit even though they share one review. ADR-111 is phase 6's record, so
this record takes ADR-112. The #349 phase 7 plan had earmarked 112 for its
envelope record; whichever lands second takes the next free number, and `adr-integrity` refuses
a collision either way.

The following measurements were taken in the sandbox on 2026-09-24 against main snapshot
`7e6f4edc` and the sample `motion5-349-handover-p6-cp001.zip`.

**The patch series was sufficient.** Running `git am -3 p6/patches/*.patch` on a repository
built from the main snapshot applied all three commits cleanly. The resulting blob ids equalled
the final `post` ids that the sample's `p6/cpstore/cp001/manifest.json` declared for all nine of
nine touched paths. The application source can therefore remain the authored format-patch
series, with post-image ids as a gate after every patch.

**The bundle was not portable as received.** `git bundle verify work.bundle` failed with
`Repository lacks these prerequisite commits: 24e14071c39c...`. The sandbox's local mirror had
the same tree as `7e6f4edc` but a different commit id. A bundle names commit prerequisites, not
just a tree, so a bundle cut from that local base was unusable to a consumer holding the
declared base.

**The sample had no owner for its layout.** It had no manifest. Its shape was whatever the
sandbox build script copied: `tools/`, `p6/{cpstore,patches,corpus,probe}`, `NOTES.md`,
`harness-baseline.sum`, and `work.bundle`. A consumer could not distinguish required input from
supporting evidence, could not detect a missing or stray file, and could not reject a future
layout without inventing a second version.

**The same change had two unlinked representations.** The sample carried both a format-patch
series and checkpoint diffs, but nothing stated that they agreed. Two representations without a
comparison are two owners of the change, so a consumer could apply bytes that the other
representation did not certify.

## Decision

The invariant is: **a handover changes the checkout only after its complete archive, base, patch
chain, and every declared post-image have passed validation in a disposable worktree; otherwise
the checkout and the inbox zip remain unchanged.** The patch series is the single owner of what
changes; notes, a checkpoint store, a bundle, and opaque evidence are declared components with
narrower roles.

### The inbox and human command

The repository-root `.handover/` directory is gitignored and is the inbox. `npm run patches`
finds exactly one zip there. An empty inbox returns `nothing-to-do` with exit status 0. More
than one zip returns `ambiguous-inbox`; any non-zip entry returns `foreign-entry`. The command
has `--dry-run` for the same pipeline without the final fast-forward and `--keep` for retaining
an archive after a successful apply.

Preflight refuses a missing committer identity, detached HEAD, an operation in progress (`am`,
rebase, merge, cherry-pick, or revert), and a dirty tree including untracked files. The human
must commit or stash with `git stash -u`; the command never hides those changes as part of its
recovery. The inbox itself is excluded from the dirty-tree check by pathspec rather than trusted
to `.gitignore`: the first handover lands on a checkout that does not carry the ignore rule yet,
where the zip is an untracked file, and relying on the rule refused exactly that handover.
`discoverInbox` already owns what may sit in the inbox, so the exclusion hides nothing the check
was for.

### The v1 archive and manifest

The archive has exactly one top-level folder whose name equals `handover.json`'s `name`. The
listing is read before extraction. It allows at most 2,000 entries and 64 MiB uncompressed, only
regular files and directories, no symlinks or special entries, and only path segments matching
`[A-Za-z0-9_.@+-]`. Absolute paths, backslashes, dot segments, empty segments, and files outside
the one root are refused. The extracted file set must equal the listing.

The manifest has exactly the keys `format`, `version`, `name`, `issue`, `base`, `patches`, and
`components`. Format `motion5-handover` and version `1` are required; an unknown format or
version is refused by name rather than guessed. Every patch has exactly `seq`, `file`, `sha256`,
`pre`, and `post`. Its sequence number and four-digit filename agree, its digest covers the
patch bytes, and its pre and post maps cover the same paths with full blob ids or null.

The chain reuses `checkpointChain()` from `checkpoint-policy.mjs`, so the existing maximum of 20
patches and 50 paths is inherited rather than restated by a second owner. The first patch's pre
image for each path equals the base's blob, and each later pre image equals the preceding post
image. `base-disagrees` is the refusal when the checkout's base bytes do not match that first
pre image. Commit subjects are not duplicated in the manifest because the patch file owns commit
metadata.

Components form a closed union: exactly one Markdown `notes` file is required; at most one
`checkpoint` folder named `cpNNN` and at most one `.bundle` file may be present; and `opaque`
components may carry extracted material that the consumer never executes. The manifest must
declare every stored file and every declaration must be present. A checkpoint is derived from
the series: its own manifest and declared diff digests must match, its base must be the handover
base, and its final post-image map must equal the series tip. This comparison is the one owner
of agreement; the checkpoint is never applied instead of the series.

### Validation and application

The producer and consumer share `inspectArchive`. It checks the listing, extraction, manifest,
exact contents, patch SHA-256 digests, checkpoint agreement, and bundle header before repository
validation. A bundle is accepted only when it has exactly one prerequisite and that prerequisite
is the handover base. The producer refuses `--bundle` when `--from` is not the base, which
prevents a sandbox-only commit id from being shipped as a portable prerequisite.

Repository validation proves the base by commit where the checkout holds it and by content
where it does not. A held base commit must be an ancestor of HEAD and carry every first pre-image.
Paths changed in the checkout since that base are allowed through `git am --3way`, but are
reported as `reconciled` for human review rather than being silently treated as the author's
post-image. A base commit the checkout does not hold is proved by content: HEAD must carry every
first pre-image, nothing is reconciled, and every post-image is compared; otherwise the refusal is
`base-missing`, naming the first differing path. The fallback exists because of a measurement
rather than a preference: this very slice is stacked on the unpublished #349 phase 6 series,
whose commit ids exist only in the sandbox that produced it and are different again after a
human's `git am`, so a commit-only rule would refuse every stacked handover while the bytes it
needs are present. Content is the rule the checkpoint route already chains by
([ADR-101](./ADR-101-a-stacked-patch-chains-by-content.md)), and it is strictly stronger per path
than the ancestry check, because every post-image is then compared. A declared bundle is also
checked with Git.

The series is applied patch by patch with `git am --3way` in a detached `git worktree` of HEAD in a
temporary directory. After each patch, every declared post blob is read back from that worktree.
Only when every patch passes does the real checkout run `git merge --ff-only` to the temporary tip.
Nothing holds the checkout while the series is proved, so a fast-forward that fails because HEAD
moved is the refusal `head-moved`, and one that fails because the tree was edited in the meantime is
`dirty-tree`; both leave the checkout as the other process left it and keep the zip. An edit the
fast-forward does not touch, such as a new file beside the series, is carried by Git as it would be
by any `merge --ff-only`: the series lands on its proved tip and the edit survives. Refusing or
rolling back a proved publication because another writer touched something else was rejected,
because it would discard or undo bytes the command does not own. A lock was considered and not
taken: Git's own index lock already makes the fast-forward atomic, and a second lock would be a
second owner of that question that a crash can leave behind. A conflict aborts the temporary
`git am`, leaves the real checkout untouched, keeps the inbox zip, and retains the extracted series
so the printed recovery command can run `git am --3way` with all patches, resolve and stage
conflicts, then use `git am --continue` or `git am --abort`.

`describeRefusal` is the single owner of refusal words and `describeOutcome` is the single owner
of outcome words and exit status. Their closed switches cover inbox discovery, refusal kinds,
outcome kinds, component kinds, and zip entry kinds exhaustively. The separate format, apply,
pack, and CLI modules therefore do not grow competing interpretations of a failure.

### Producer and ownership

The producer command is `node scripts/handover.mjs pack --issue <n> --from <rev> [--to <rev>]
[--base <sha>] --notes <file> --out <name>.zip [--checkpoint <dir>] [--bundle] [--opaque
<path>]...`. It creates a versioned archive and inspects its own output with the consumer's
inspection pipeline. `--base` permits a sandbox commit id with the same tree as the intended
base to declare the intended GitHub commit. It does not turn an unrelated tree into the same
base.

The patch series is the only change owner. The checkpoint component is an [AI checkpoint
transport view](./AI-CHECKPOINT-WORKFLOW.md) and is validated against the series. Applying
checkpoint diffs with `git apply` is not an alternative, because it loses the authored commit
sequence and authorship that `git am` preserves.

### What a patch and a recipient may not decide

Every commit `git am` makes is read back: the paths it touched must be declared by its manifest
entry (`undeclared-change` otherwise), because a digest proves which patch was packed and not that
the manifest describes it. The commit is proved to exist first. `git am --3way` exits zero without
committing when a patch's change is already in the tree, and reading `HEAD^..HEAD` then read
whichever commit came before: an unrelated one was reported as an undeclared change, and one on the
same path as a clean application of zero commits. A patch that makes no commit now stops the series
as `already-applied`, naming the patch, with the checkout and the zip unchanged. Skipping it and
carrying on was rejected, because a partly present series is exactly the state a human has to look
at, and a handover that reports success for bytes it did not write is not whole. The apply commands
run with an empty scratch `core.hooksPath`, `--whitespace=nowarn` and `--no-gpg-sign`, so repository
hooks, `apply.whitespace` and `commit.gpgSign` cannot run code or refuse a valid handover. After the
fast-forward the inbox state is a closed union (`emptied`, `kept`, `cleanup-failed`) so a cleanup
failure never reads as "nothing changed". The producer refuses a range whose start is not an
ancestor of its end, an empty commit, a gitlink (its id names a commit in another repository, while
every image the format declares is a blob, so the consumer proved it absent at the very base it was
cut from), and an output path inside the checkout, and copies the archive out only after its own
inspection passes. `core.autocrlf` was considered and not pinned: it changed no blob id when
measured, and the post-image comparison catches any divergence.

## Rejected

**The unversioned sample as format v0.** This would make the copied sandbox layout a second
owner and leave missing-versus-foreign files undefined. The sample is repacked through `pack`
instead of being accepted as an implicit version.

**Applying checkpoint diffs.** The checkpoint is an AI transport representation. `git apply`
would lose commit authorship and sequence, while the patch series already applies cleanly and
carries the post-image assertions. The checkpoint can certify the series but cannot replace it.

**Deleting the inbox after a conflict.** A conflict is precisely the case where the human needs
the zip and extracted patches for recovery. Cleanup is restricted to `applied`, and `--keep`
gives an explicit successful-retention choice.

**A pure-Node zip reader.** The repository already relies on `unzip` in
`scripts/automation-checkpoint.mjs`. Replacing that existing dependency with a new reader would
add another archive parser and another security surface without a measured need.

**Fake Git ports for pipeline tests.** A fake of `git am` tests the fake rather than the atomic
property. The pipeline is tested with real temporary Git repositories; pure format decisions
remain in the pure module.

**A separate `inspect` command.** `--dry-run` already runs the complete inspect, validate,
apply, and post-image pipeline without changing the checkout. A second command would create a
second user surface and another owner of what inspection means.

## Consequences

A human has one durable procedure and receives a named outcome rather than a half-applied
checkout. The inbox is safe to leave in place after every failure, and the worktree fast-forward
makes the last publication step all-or-nothing from the checkout's perspective. The archive
listing and exact manifest membership make the handover reviewable and reject zip bombs, path
tricks, unknown layouts, and silent omissions before patch application.

The design carries a modest temporary-worktree cost and retains no partial commits in the real
checkout. A branch that changed since the base can be reconciled by Git's three-way merge, but
those paths are explicitly reported for review. A post-image mismatch is not repaired
automatically; it requires a new handover because the archive failed to describe its own bytes.

The optional checkpoint and bundle are useful evidence only under their declared contracts. A
checkpoint must agree with the patch series, and a bundle must be cut from the declared base. A
sandbox whose base commit id differs from the intended base can still produce patches with
`--base`, but it cannot produce a valid bundle for that range.

The implementation has no run in this repository's CI yet. Typecheck was not run in the sandbox
because TypeScript was unavailable. Sandbox tests ran under Node 22 with a vitest shim, not
vitest; those facts limit the evidence and are not claims of repository CI coverage.

## Evidence

The 2026-09-24 measurements above are the load-bearing evidence for the design: three
format-patch commits applied cleanly, nine of nine declared touched paths reached their final
post ids, the sample bundle named an unavailable mirror prerequisite, the sample had no
manifest, and its two representations had no agreement statement.

The cases are the `HO-` series. `HO-1` through `HO-14` in
`packages/core/test/unit/scripts/handover-format.test.ts` hold the pure layer: the listing
parser and its count check, every unsafe entry kind, the manifest schema and version refusal,
the chain, exact contents, checkpoint agreement, the bundle prerequisite, inbox discovery, and a
word for every refusal kind. `HO-15` through `HO-30` in
`packages/core/test/unit/scripts/handover-apply.test.ts` build real temporary repositories, pack
with the producer and apply with the consumer: whole application and cleanup, the dry run and
`--keep`, a conflict that leaves checkout and inbox untouched, reconciliation on a newer branch,
every preflight and base refusal, tampered, undeclared, unversioned, linked and future archives,
a series that applies onto undeclared bytes, the three inbox states, the bundle rule, checkpoint
agreement end to end, every outcome's words and exit status, and the command line.

The review of #488 added `HO-31` to `HO-34` in the same file: a patch already on the branch stops
as `already-applied` whether the commit before it is related or not, `pack` refuses a gitlink and
writes no archive, a checkout whose HEAD moves or whose tree is edited before the fast-forward is
refused as `head-moved` or `dirty-tree` with the zip kept and no worktree left, while an
unrelated edit survives an applied fast-forward, and the first
handover applies on a checkout without the ignore rule while an untracked file elsewhere is still
refused. Each is killed by removing its fix: the pathspec exclusion, the commit check, the
`head-moved` and `dirty-tree` mapping, and the gitlink refusal.

In the sandbox all 30 original cases passed, and each of these mutations was killed by at least one
case: skipping the post-image comparison, applying on a dry run, emptying the inbox under `--keep`,
skipping the patch digest, skipping the dirty-tree refusal, discarding the extracted series on a
conflict, treating every path as unreconciled, skipping the extraction-equals-listing check,
admitting a stray file, skipping checkpoint tip agreement, admitting a second bundle prerequisite,
admitting any path segment, and skipping the base pre-image comparison. The last two survivors of
the first mutation round, extraction-equals-listing and a second bundle prerequisite, were what
added the smuggling case to `HO-21` and the two-prerequisite case to `HO-12`.

The consumer and producer both call `inspectArchive`, so a producer cannot silently create an
archive the consumer would reject. No live CI run is claimed until one exists.
