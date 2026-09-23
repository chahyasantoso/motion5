# ADR-102: A request is sealed by its manifest

**Status:** Accepted, 2026-09-23

## Context

[ADR-100](./ADR-100-a-patch-declares-the-bytes-it-produces.md) makes a patch self-certifying: the patch says what changes, and its declared post-image Git blob ids say what resulted. [ADR-101](./ADR-101-a-stacked-patch-chains-by-content.md) makes a stack self-consistent: each later patch's pre-image is the earlier patch's post-image. Neither decision requires the artifacts that describe the work to arrive in one commit.

Issue [#466](https://github.com/chahyasantoso/motion5/issues/466) exposed why that distinction matters. The GitHub MCP tool has an undocumented per-call payload ceiling. On 2026-09-22, one `push_files` call carrying a nine-file `cp008` bundle of 96,181 bytes failed and did not land atomically, while a call carrying `manifest.json` alone succeeded. Those observations establish neither the exact ceiling nor a safe aggregate size. They establish only that making the whole checkpoint one payload and one commit confuses a transport limit with a protocol invariant.

The old trigger also treated every path below `.ai/checkpoints/` as a request. That makes an intermediate commit look complete even though its manifest is not yet present, and it gives a partial transfer no useful meaning. The request needs one unmistakable arrival event. The manifest is that event: it names the patch files, their SHA-256 digests, their content chain, their pre-images and post-images, and the checkpoint identity. Before it arrives, patches are retained bytes and no request exists. When it arrives, the request is complete enough to validate or refuse.

This changes the commit topology, not protocol v1. Patches land first, one or more per call and across any number of commits. The manifest lands last in a new commit, and that commit starts the run. The assembly is bounded because a range that can grow without limit would turn a payload workaround into an ancestry attack. It is also constrained because a source change must not ride along with the checkpoint just because the manifest commit happens to be based on it.

The old single-parent rule was a useful shorthand for a stronger property: the request commit changed only the checkpoint store and its single parent was the source against which the stack was prepared. Once the store may be assembled over several commits, the shorthand is no longer true. The property becomes a range property from `manifest.base` to the request head. Every commit in that range has one parent, every commit's own diff is confined to `.ai/checkpoints/<id>/`, and the aggregate tree difference from `manifest.base` to the head is exactly the manifest plus its declared patch files.

There are two verifiers because they answer different questions. Preparation has the candidate checkout and can walk every commit, so it checks each commit's confinement and the aggregate. Publication starts from the request head's tree and overlays only the declared post-images, so it independently checks the compare range's shape and the aggregate tree difference that bounds what it can emit. The asymmetry is deliberate: aggregate equality is sufficient for publication's output, while per-commit confinement gives a reviewer failure locality and refuses a source edit at the commit that introduced it.

A shallow checkout creates a different failure from a stale base. If the walk reaches the shallow boundary before it reaches `manifest.base`, the validator cannot prove the range and refuses with `Insufficient fetch depth`. It must not report stale base merely because the needed history was not downloaded. A root commit reached without meeting `manifest.base`, a source change in the range, or a base farther away than the bound is a stale or invalid assembly instead.

The transport has a second, independent bound. Every checkpoint file, including `manifest.json`, is limited to `MAX_TRANSPORT_BYTES = 32000` bytes. This is a conservative proposal set, not a measurement of the GitHub MCP ceiling. The only measurements available are the 2026-09-22 manifest-alone success and the 96,181-byte nine-file failure. Measuring the actual ceiling remains a follow-up: use padded files on a throwaway branch and binary-search the largest successful call without risking a real checkpoint.

Finally, a bundle archive was considered and withdrawn. MCP content is a JSON string, so binary content cannot round-trip as a reliable transport primitive. Base64 of deflate reduces bytes by only about 40%, a constant factor rather than a fix for an unknown ceiling. A zip reader in the pure validator would add attack surface, and an archive destroys the reviewability of self-certifying diffs. The named follow-up shape is `bundle.b64` beside an unchanged manifest: one deflate-only single pass that refuses zip64, encryption, duplicate entries, undeclared entries and oversize content.

## Decision

A checkpoint request is complete when its manifest arrives. The commits that carried its patches are an **assembly range**, not the unit of trust. A store holding patches without a manifest is inert and starts no run. A manifest is the seal: it is the instant at which the complete declared file set exists and the validators are authorised to adjudicate it.

The workflow triggers only on `.ai/checkpoints/*/manifest.json`, not on every path under the store. Patches therefore land before the manifest, in one or more commits and across any number of transport calls. The manifest must be pushed last. `checkpointStore()` is the shared store-discovery owner for preparation and publication: it checks entry type and mode, applies the per-file transport bound to each entry size, and requires one checkpoint id. `sealedRequest()` parses the manifest, requires it to name that stored checkpoint, and applies `sealedStore`. The existing consumption commit still matches the manifest filter, and it remains skipped by the existing `github-actions[bot]` plus `AI-Checkpoint-Set: ` condition, so consuming the store does not start another run.

The assembly range is the commits from the request head back to `manifest.base`, inclusive of the head and ending at the base boundary. Its maximum length is `MAX_ASSEMBLY_COMMITS = MAX_PATCHES + 4 = 24` commits. Every commit in the walk must have exactly one parent. Every commit's own diff must be confined to `.ai/checkpoints/<id>/`. The aggregate diff from `manifest.base` to the request head must equal exactly the declared checkpoint files: the manifest and every patch named by the manifest, with no missing file and no stray file. A source path touched anywhere in the range is refused even when the manifest commit itself is clean.

Preparation in `prepareCheckpoint()` uses `checkpointStore()` to discover and bound the store, then `sealedRequest()` to parse the manifest, match its checkpoint id to the stored folder, and apply `sealedStore`. It walks the candidate repository history, refuses a shallow boundary as `Insufficient fetch depth`, checks each commit with `confinedAssemblyCommit`, checks the aggregate with `assemblyAggregate`, and then applies and adjudicates the declared patches as ADR-100 and ADR-101 require. The policy owner is [checkpoint-policy.mjs](../scripts/checkpoint-policy.mjs), where `checkpointStore`, `sealedRequest`, `assemblyRange`, `confinedAssemblyCommit`, `sealedStore`, `assemblyAggregate` and `transportBound` name the separate properties rather than hiding them in one broad predicate.

Publication independently checks the request range through `GET /compare/{base}...{head}`. `compareRelation()` classifies the GitHub status exhaustively: `ahead` is the assembly case; `identical` is refused as `the head is the manifest base; nothing was assembled`; `behind` and `diverged` are refused as `Stale base; the patch set was cut against a commit the head does not descend from`, and any other status is refused. `checkpointSnapshot()` and `assemblyCompare` then require an `ahead_by` no greater than `MAX_ASSEMBLY_COMMITS` and a linear sequence of one-parent commits beginning at `manifest.base`. Publication then diffs the base tree against the request head tree and requires the same exact aggregate file set. This is not trust in the preparation walk: the credentialed side re-derives the range and the tree it is allowed to emit from immutable GitHub data.

Every checkpoint file is subject to `MAX_TRANSPORT_BYTES = 32000`, including the manifest. Both sides enforce it through `checkpointStore()` from tree-entry sizes, before any byte is read: preparation from `git ls-tree -l` over the committed head, and publication again from the immutable GitHub tree. The bound applies per file, not as a claim about the aggregate MCP payload ceiling. The observed numbers remain exactly those in the context: manifest alone succeeded on 2026-09-22 and a 96,181-byte nine-file call failed. No exact ceiling is claimed.

Manifest-first order is part of the protocol. If the manifest arrives while a declared patch is absent, the run refuses and names the missing patch file. Repair is deletion of the manifest, pushing the missing patches, and pushing the manifest again in a new commit. The deletion push itself matches the manifest-only filter and produces a `nothing is sealed` refusal naming the absent manifest and this repair; patch-only pushes do not start runs, and the replacement manifest starts the retry. There is no force update and no attempt to reuse the old trigger. A stray file in the checkpoint folder is refused by name; cleanup is a delete. A partial push stops being corruption and becomes progress, because it cannot become a request until the seal arrives.

Recovery no longer requires the request commit's single parent to be the source. `recover` verifies the assembly range from the source to the request commit through the same bounded compare shape, read by the same `assemblyCompare` owner the publisher uses. It confirms a publication without replaying patches, even when the request was assembled over several commits.

The integrity argument is unchanged but its scope is clearer. The manifest's Merkle root over the declared SHA-256 patch digests protects the sealed artifact set. The range proves the source boundary and makes no-ride-along a property of the aggregate, not of one parent commit. The manifest's arrival proves completeness as an instant property. Atomic arrival of the store was therefore never the source of integrity, base provability, no-ride-along or completeness; it was only one way to make those properties easier to infer.

The continuous-integration workflow wakes on pull-request `synchronize` with `cancel-in-progress: true`. Each assembly update can therefore cancel its predecessor, and only the tip receives a complete suite. That is CI scheduling behavior, not publication authority and not evidence that a live checkpoint has run.

## What this does not change, measured rather than assumed

Protocol v1 does not change. There is no new manifest key, no digest change, and no change to the patch `pre` and `post` declarations. ADR-100 and ADR-101 remain accepted records. This record supersedes only the factual sentence in ADR-101 that says `manifest.base` must equal the request commit's single parent; under this decision, `manifest.base` is the boundary of the assembly range.

The manifest still does not prove that the proposed behavior is correct. Its Merkle root proves the declared artifact set, the content chain proves the declared intermediate bytes, and the aggregate proves that publication cannot emit an undeclared source change. Review and the complete CI suite still decide whether the behavior is wanted and works. No live workflow run or live publication is claimed by this record.

The 32,000-byte per-file value is not a measured MCP ceiling. It is a conservative policy proposal derived from the observed success and failure interval, and it may be smaller than the eventual transport limit. The binary-search measurement described above is a follow-up rather than evidence for this bound.

The range bound is a safety and review limit, not a claim that twenty-four commits review well. The candidate envelope and retained-evidence bounds remain separate constraints. Splitting a checkpoint into more assembly commits does not remove those bounds, and splitting into another sealed request remains the repair when the complete candidate is too large.

The formatter still runs only after the entire declared stack has been applied and adjudicated. It does not run between assembly commits or between patches, because formatting an intermediate tree would invalidate later declared pre-images. The formatting commit remains a separately identified publication step and is not part of the sealed request's declared patch bytes.

## Alternatives rejected

**Keep the whole store in one commit and one push.** Refused because the observed MCP payload behavior makes the transport fragile without proving a protocol property. It also makes a partial transfer look like corruption rather than inert preparation. A range plus a manifest seal preserves the trust properties while permitting bounded progress.

**Trigger on every path under `.ai/checkpoints/`.** Refused because patches would wake runs before the complete declaration exists. The manifest is the only arrival event that can say which patch set is intended.

**Trust only the manifest commit's parent.** Refused because it rejects valid multi-commit assembly and confuses one commit's topology with the request's source boundary. The range walk and compare prove the stronger property: linear ancestry, confined per-commit changes, and exact aggregate contents.

**Check only the aggregate and ignore each commit's own diff.** Refused for preparation because it loses failure locality and permits a reviewer to miss which assembly commit introduced a source path before the aggregate check reports the final mismatch. Publication does not need to repeat that per-commit check because it starts from the head tree and emits only declared post-images; its independent aggregate check is sufficient for its output authority.

**Allow a range without a maximum.** Refused because an unbounded walk makes shallow-history behavior, recovery and review cost indefinite. `MAX_ASSEMBLY_COMMITS` gives both preparation and publication the same finite refusal point.

**Treat a shallow boundary as stale base.** Refused because missing history is not evidence that the declared base is wrong. The distinct `Insufficient fetch depth` refusal tells the operator to fetch more history, while a reached root or a source-changing range remains a stale or invalid assembly.

**Zip the checkpoint into one binary bundle.** Withdrawn rather than implemented. MCP content is a JSON string and binary cannot safely round-trip; deflate plus base64 is only a constant-factor reduction; a zip reader expands the pure validator's attack surface; and an archive hides the reviewable, self-certifying diff artifacts. The follow-up is explicitly named in Context and is not part of this protocol.

**Make the manifest carry a new protocol-v1 key or digest.** Refused because the seal is a transport and ancestry decision, not a manifest schema change. Existing declared files and digests already provide the artifact integrity needed here.

## Consequences

A contributor can assemble a checkpoint incrementally. The first commit may contain one or more declared patch files, later commits may contain more, and the final commit contains `manifest.json`. None of those commits starts a run until the manifest commit arrives. A failed call can therefore be repaired by continuing the assembly rather than reconstructing an all-or-nothing payload.

The contributor must not edit a patch after its digest is recorded, must not push the manifest before every declared patch is present, and must remove a manifest that arrived too early before repairing the store. A missing patch and a stray file are both explicit, named failures with a simple delete-and-retry repair.

The reviewer now sees both the sealed artifact and the route by which it arrived. The manifest remains the trust boundary for completeness and content, while the assembly range supplies base provability and no-ride-along. A source change is refused whether it appears in the manifest commit, an earlier patch commit, or an unrelated commit between them.

The implementation has named ownership rather than one growing validator. `checkpointStore`, `sealedRequest`, `compareRelation`, `assemblyRange`, `confinedAssemblyCommit`, `sealedStore`, `assemblyAggregate` and `transportBound` in [checkpoint-policy.mjs](../scripts/checkpoint-policy.mjs) own the pure facts. The history walk in `prepareCheckpoint()` owns preparation's local proof. `checkpointSnapshot()` and `assemblyCompare` in [automation-checkpoint.mjs](../scripts/automation-checkpoint.mjs) own publication's independent compare and tree proof. The workflow owns the manifest-only trigger and the candidate checkout depth; CI owns cancellation of superseded pull-request runs.

Only the tip of an assembly gets a complete CI suite. An intermediate assembly commit may be cancelled, and its preparation run may be inert because it does not contain the seal. This is intentional: a patch store without a manifest is progress, not a completed request, and a cancelled predecessor is not evidence for the tip.

## Activation

The checked-in workflow implements this decision: its push filter is `.ai/checkpoints/*/manifest.json`, and the candidate checkout uses `fetch-depth: 30`. The workflow scenario in `automation-checkpoint.test.ts` asserts both values. Patch-only assembly commits therefore do not start a checkpoint run; the final manifest commit is the sealed request and starts the run. Preparation remains disabled while `MOTION5_AUTOMATION_SHA` is unset, and the publisher's equality check between candidate and reviewed workflow bytes means a checkpoint cannot activate itself.

A live single-patch publication, stacked publication, refusal at each gate, formatting commit, uncertain publication recovered from intent, and cleanup-only classification remain unclaimed. Fixture tests are not those exercises.

## Evidence

The failing-first evidence is the pair of refusals that defines the invariant. A range whose aggregate diff from `manifest.base` to the request head touches a source path must be refused, even when every checkpoint file is individually valid. A store carrying patch files without `manifest.json` does not start a run under the checked-in manifest-only filter. If the manifest is deleted as repair, the deletion push does trigger a run and `checkpointStore()` produces a `nothing is sealed` refusal naming the absent manifest and this repair; patch-only pushes do not run, and the replacement manifest is the retry trigger. These cases distinguish the assembly-range protocol from the old one-commit trigger.

The remaining regression evidence exercises both sides independently, in `checkpoint-policy.test.ts` and `automation-checkpoint.test.ts`: a manifest arriving before one declared patch is refused naming that file; deleting the manifest, adding the patch and pushing a new manifest commit is accepted as a new trigger; a stray checkpoint file is refused by name; a shallow walk is refused as `Insufficient fetch depth`; and a stale root, a source-changing range and a range beyond twenty-four commits are refused as distinct assembly failures. Every checkpoint file over 32,000 bytes, including the manifest, must be refused in preparation and publication.

The publisher-side checks additionally cover compare status other than `ahead`, `ahead_by` over twenty-four, a non-linear commit, a compare range that does not begin at `manifest.base`, and an aggregate tree mismatch. Recovery confirms a multi-commit assembly through the same compare proof without replaying any patch.

No live workflow, publication, recovery or MCP ceiling measurement is claimed here. The 2026-09-22 observations are transport evidence only: a manifest-alone call succeeded and a 96,181-byte nine-file call failed. The padded-file binary search on a throwaway branch remains the follow-up that can measure the real per-call ceiling.
