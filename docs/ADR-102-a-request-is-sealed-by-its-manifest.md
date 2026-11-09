# ADR-102: A request is sealed by its manifest

**Status:** Accepted, 2026-09-23. **Superseded by [ADR-142](./ADR-142-the-ai-edit-checkpoint-and-handover-automation-is-removed.md), 2026-10-23.**

## Context

[ADR-100](./ADR-100-a-patch-declares-the-bytes-it-produces.md) makes patch self-certifying: patch says what
changes, declared post-image Git blob ids say what resulted.
[ADR-101](./ADR-101-a-stacked-patch-chains-by-content.md) makes stack self-consistent: later patch's pre-image
= earlier patch's post-image. Neither decision requires artifacts describing work to arrive in one commit.

Issue [#466](https://github.com/chahyasantoso/motion5/issues/466) exposed why distinction matters. GitHub MCP
tool has undocumented per-call payload ceiling. On 2026-09-22 one `push_files` call carrying nine-file `cp008`
bundle of 96,181 bytes failed, did not land atomically; call carrying `manifest.json` alone succeeded.
Observations establish neither exact ceiling nor safe aggregate size. They establish only that making whole
checkpoint one payload and one commit confuses transport limit with protocol invariant.

Old trigger also treated every path below `.ai/checkpoints/` as request. Makes intermediate commit look
complete though manifest not yet present, gives partial transfer no useful meaning. Request needs one
unmistakable arrival event. Manifest is that event: names patch files, SHA-256 digests, content chain,
pre-images, post-images, checkpoint identity. Before arrival patches are retained bytes, no request exists. At
arrival request complete enough to validate or refuse.

Changes commit topology, not protocol v1. Patches land first, one or more per call, across any number of
commits. Manifest lands last in new commit, that commit starts run. Assembly bounded because range growing
without limit turns payload workaround into ancestry attack. Also constrained because source change must not
ride along with checkpoint just because manifest commit happens to be based on it.

Old single-parent rule = useful shorthand for stronger property: request commit changed only checkpoint store,
its single parent was source against which stack prepared. Once store may assemble over several commits,
shorthand no longer true. Property becomes range property from `manifest.base` to request head: every commit in
range has one parent, every commit's own diff confined to `.ai/checkpoints/<id>/`, aggregate tree difference
from `manifest.base` to head is exactly manifest plus its declared patch files.

Two verifiers because they answer different questions. Preparation has candidate checkout, walks every commit,
checks each commit's confinement and aggregate. Publication starts from request head's tree, overlays only
declared post-images, independently checks compare range shape and aggregate tree difference bounding what it
can emit. Asymmetry deliberate: aggregate equality sufficient for publication's output, per-commit confinement
gives reviewer failure locality and refuses source edit at commit introducing it.

Shallow checkout creates different failure from stale base. Walk reaching shallow boundary before
`manifest.base` → validator cannot prove range, refuses `Insufficient fetch depth`. Must not report stale base
merely because needed history not downloaded. Root reached without meeting `manifest.base`, source change in
range, base farther than bound = stale or invalid assembly.

Transport has second independent bound. Every checkpoint file including `manifest.json` limited to
`MAX_TRANSPORT_BYTES = 32000` bytes. Conservative proposal set, not measurement of GitHub MCP ceiling. Only
measurements available: 2026-09-22 manifest-alone success, 96,181-byte nine-file failure. Measuring actual
ceiling stays follow-up: padded files on throwaway branch, binary-search largest successful call without
risking real checkpoint.

Bundle archive considered, withdrawn. MCP content is JSON string → binary cannot round-trip as reliable
transport primitive. Base64 of deflate reduces bytes only ~40%, constant factor not fix for unknown ceiling.
Zip reader in pure validator adds attack surface, archive destroys reviewability of self-certifying diffs.
Named follow-up shape: `bundle.b64` beside unchanged manifest — one deflate-only single pass refusing zip64,
encryption, duplicate entries, undeclared entries, oversize content.

## Decision

Checkpoint request complete when manifest arrives. Commits carrying its patches = **assembly range**, not unit
of trust. Store holding patches without manifest inert, starts no run. Manifest is seal: instant complete
declared file set exists, validators authorised to adjudicate.

Workflow triggers only on `.ai/checkpoints/*/manifest.json`, not every path under store. Patches land before
manifest, in one or more commits, across any number of transport calls. Manifest must be pushed last.
`checkpointStore()` = shared store-discovery owner for preparation and publication: checks entry type and mode,
applies per-file transport bound to each entry size, requires one checkpoint id. `sealedRequest()` parses
manifest, requires it name that stored checkpoint, applies `sealedStore`. Existing consumption commit still
matches manifest filter, remains skipped by existing `github-actions[bot]` plus `AI-Checkpoint-Set: ` condition
→ consuming store does not start another run.

Assembly range = commits from request head back to `manifest.base`, head inclusive, ending at base boundary.
Max length `MAX_ASSEMBLY_COMMITS = MAX_PATCHES + 4 = 24` commits. Every commit in walk exactly one parent.
Every commit's own diff confined to `.ai/checkpoints/<id>/`. Aggregate diff from `manifest.base` to request head
must equal exactly declared checkpoint files: manifest plus every patch manifest names, no missing file, no
stray file. Source path touched anywhere in range refused even when manifest commit itself clean.

Preparation in `prepareCheckpoint()` uses `checkpointStore()` to discover and bound store, then
`sealedRequest()` to parse manifest, match checkpoint id to stored folder, apply `sealedStore`. Walks candidate
repository history, refuses shallow boundary as `Insufficient fetch depth`, checks each commit with
`confinedAssemblyCommit`, checks aggregate with `assemblyAggregate`, then applies and adjudicates declared
patches as ADR-100 and ADR-101 require. Policy owner
[checkpoint-policy.mjs](../scripts/checkpoint-policy.mjs), where `checkpointStore`, `sealedRequest`,
`assemblyRange`, `confinedAssemblyCommit`, `sealedStore`, `assemblyAggregate`, `transportBound` name separate
properties rather than hiding them in one broad predicate.

Publication independently checks request range through `GET /compare/{base}...{head}`. `compareRelation()`
classifies GitHub status exhaustively: `ahead` = assembly case; `identical` refused as `the head is the
manifest base; nothing was assembled`; `behind`, `diverged` refused as `Stale base; the patch set was cut
against a commit the head does not descend from`; any other status refused. `checkpointSnapshot()` +
`assemblyCompare` then require `ahead_by` ≤ `MAX_ASSEMBLY_COMMITS` and linear sequence of one-parent commits
beginning at `manifest.base`. Publication then diffs base tree against request head tree, requires same exact
aggregate file set. Not trust in preparation walk: credentialed side re-derives range and tree it may emit from
immutable GitHub data.

Every checkpoint file subject to `MAX_TRANSPORT_BYTES = 32000`, manifest included. Both sides enforce through
`checkpointStore()` from tree-entry sizes, before any byte read: preparation from `git ls-tree -l` over
committed head, publication again from immutable GitHub tree. Bound per file, not claim about aggregate MCP
payload ceiling. Observed numbers remain exactly context's: manifest alone succeeded 2026-09-22, 96,181-byte
nine-file call failed. No exact ceiling claimed.

Manifest-first order part of protocol. Manifest arriving while declared patch absent → run refuses, names
missing patch file. Repair = delete manifest, push missing patches, push manifest again in new commit. Deletion
push itself matches manifest-only filter, produces `nothing is sealed` refusal naming absent manifest and this
repair; patch-only pushes start no runs, replacement manifest starts retry. No force update, no reuse of old
trigger. Stray file in checkpoint folder refused by name; cleanup = delete. Partial push stops being corruption,
becomes progress — cannot become request until seal arrives.

Recovery no longer requires request commit's single parent be source. `recover` verifies assembly range from
source to request commit through same bounded compare shape, read by same `assemblyCompare` owner publisher
uses. Confirms publication without replaying patches, even when request assembled over several commits.

Integrity argument unchanged, scope clearer. Manifest's Merkle root over declared SHA-256 patch digests
protects sealed artifact set. Range proves source boundary, makes no-ride-along property of aggregate not one
parent commit. Manifest's arrival proves completeness as instant property. Atomic arrival of store was therefore
never source of integrity, base provability, no-ride-along or completeness — only one way making those
properties easier to infer.

CI workflow wakes on pull-request `synchronize` with `cancel-in-progress: true`. Each assembly update can cancel
predecessor → only tip receives complete suite. CI scheduling behavior, not publication authority, not evidence
live checkpoint ran.

## What this does not change, measured rather than assumed

Protocol v1 unchanged. No new manifest key, no digest change, no change to patch `pre`/`post` declarations.
ADR-100, ADR-101 remain accepted records. This record supersedes only factual sentence in ADR-101 saying
`manifest.base` must equal request commit's single parent; under this decision `manifest.base` is assembly range
boundary.

Manifest still does not prove proposed behavior correct. Merkle root proves declared artifact set, content
chain proves declared intermediate bytes, aggregate proves publication cannot emit undeclared source change.
Review and complete CI suite still decide whether behavior wanted and works. No live workflow run or live
publication claimed here.

32,000-byte per-file value not measured MCP ceiling. Conservative policy proposal from observed success/failure
interval, may be smaller than eventual transport limit. Binary-search measurement above is follow-up, not
evidence for bound.

Range bound = safety and review limit, not claim twenty-four commits review well. Candidate envelope and
retained-evidence bounds stay separate constraints. Splitting checkpoint into more assembly commits does not
remove those bounds; splitting into another sealed request remains repair when complete candidate too large.

Formatter still runs only after entire declared stack applied and adjudicated. Not between assembly commits, not
between patches — formatting intermediate tree invalidates later declared pre-images. Formatting commit remains
separately identified publication step, not part of sealed request's declared patch bytes.

## Alternatives rejected

**Keep whole store in one commit and one push.** Refused: observed MCP payload behavior makes transport fragile
without proving protocol property. Also makes partial transfer look like corruption rather than inert
preparation. Range plus manifest seal preserves trust properties, permits bounded progress.

**Trigger on every path under `.ai/checkpoints/`.** Refused: patches wake runs before complete declaration
exists. Manifest is only arrival event able to say which patch set intended.

**Trust only manifest commit's parent.** Refused: rejects valid multi-commit assembly, confuses one commit's
topology with request's source boundary. Range walk + compare prove stronger property: linear ancestry,
confined per-commit changes, exact aggregate contents.

**Check only aggregate, ignore each commit's own diff.** Refused for preparation: loses failure locality, permits
reviewer to miss which assembly commit introduced source path before aggregate check reports final mismatch.
Publication need not repeat per-commit check — starts from head tree, emits only declared post-images →
independent aggregate check sufficient for its output authority.

**Allow range without maximum.** Refused: unbounded walk makes shallow-history behavior, recovery, review cost
indefinite. `MAX_ASSEMBLY_COMMITS` gives preparation and publication same finite refusal point.

**Treat shallow boundary as stale base.** Refused: missing history not evidence declared base wrong. Distinct
`Insufficient fetch depth` refusal tells operator fetch more history; reached root or source-changing range
remains stale or invalid assembly.

**Zip checkpoint into one binary bundle.** Withdrawn not implemented. MCP content JSON string, binary cannot
safely round-trip; deflate + base64 constant-factor reduction only; zip reader expands pure validator's attack
surface; archive hides reviewable self-certifying diff artifacts. Follow-up explicitly named in Context, not part
of protocol.

**New protocol-v1 manifest key or digest.** Refused: seal is transport and ancestry decision, not manifest schema
change. Existing declared files and digests already provide artifact integrity needed.

## Consequences

Contributor assembles checkpoint incrementally. First commit may hold one or more declared patch files, later
commits more, final commit `manifest.json`. None starts run until manifest commit arrives. Failed call repaired
by continuing assembly rather than reconstructing all-or-nothing payload.

Contributor must not edit patch after digest recorded, must not push manifest before every declared patch
present, must remove manifest arriving too early before repairing store. Missing patch and stray file both
explicit named failures with simple delete-and-retry repair.

Reviewer sees both sealed artifact and route it arrived by. Manifest stays trust boundary for completeness and
content, assembly range supplies base provability and no-ride-along. Source change refused whether appearing in
manifest commit, earlier patch commit, or unrelated commit between them.

Implementation has named ownership rather than one growing validator. `checkpointStore`, `sealedRequest`,
`compareRelation`, `assemblyRange`, `confinedAssemblyCommit`, `sealedStore`, `assemblyAggregate`,
`transportBound` in [checkpoint-policy.mjs](../scripts/checkpoint-policy.mjs) own pure facts. History walk in
`prepareCheckpoint()` owns preparation's local proof. `checkpointSnapshot()` and `assemblyCompare` in
[automation-checkpoint.mjs](../scripts/automation-checkpoint.mjs) own publication's independent compare and tree
proof. Workflow owns manifest-only trigger and candidate checkout depth; CI owns cancellation of superseded
pull-request runs.

Only tip of assembly gets complete CI suite. Intermediate assembly commit may be cancelled, its preparation run
may be inert lacking seal. Intentional: patch store without manifest is progress not completed request,
cancelled predecessor not evidence for tip.

## Activation

Checked-in workflow implements decision: push filter `.ai/checkpoints/*/manifest.json`, candidate checkout
`fetch-depth: 30`. Workflow scenario in `automation-checkpoint.test.ts` asserts both values. Patch-only
assembly commits therefore start no checkpoint run; final manifest commit is sealed request, starts run.
Preparation remains disabled while `MOTION5_AUTOMATION_SHA` unset, publisher's equality check between candidate
and reviewed workflow bytes means checkpoint cannot activate itself.

Live single-patch publication, stacked publication, refusal at each gate, formatting commit, uncertain
publication recovered from intent, cleanup-only classification remain unclaimed. Fixture tests are not those
exercises.

## Evidence

Failing-first evidence = pair of refusals defining invariant. Range whose aggregate diff from `manifest.base` to
request head touches source path must be refused even when every checkpoint file individually valid. Store
carrying patch files without `manifest.json` does not start run under checked-in manifest-only filter. Manifest
deleted as repair → deletion push does trigger run, `checkpointStore()` produces `nothing is sealed` refusal
naming absent manifest and this repair; patch-only pushes do not run, replacement manifest is retry trigger.
These cases distinguish assembly-range protocol from old one-commit trigger.

Remaining regression evidence exercises both sides independently, `checkpoint-policy.test.ts` and
`automation-checkpoint.test.ts`: manifest arriving before one declared patch refused naming that file; deleting
manifest, adding patch, pushing new manifest commit accepted as new trigger; stray checkpoint file refused by
name; shallow walk refused `Insufficient fetch depth`; stale root, source-changing range, range beyond
twenty-four commits refused as distinct assembly failures. Every checkpoint file over 32,000 bytes, manifest
included, refused in preparation and publication.

Publisher-side checks additionally cover compare status other than `ahead`, `ahead_by` over twenty-four,
non-linear commit, compare range not beginning at `manifest.base`, aggregate tree mismatch. Recovery confirms
multi-commit assembly through same compare proof without replaying any patch.

No live workflow, publication, recovery or MCP ceiling measurement claimed here. 2026-09-22 observations are
transport evidence only: manifest-alone call succeeded, 96,181-byte nine-file call failed. Padded-file binary
search on throwaway branch remains follow-up able to measure real per-call ceiling.
