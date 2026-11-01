# ADR-101: A stacked patch chains by content

**Status:** Accepted, 2026-09-21. **Superseded by [ADR-142](./ADR-142-the-ai-edit-checkpoint-and-handover-automation-is-removed.md), 2026-10-23.**

## Context

[ADR-100](./ADR-100-a-patch-declares-the-bytes-it-produces.md) decides patch declares bytes it produces. Enough for one patch, not stack: stack has second question — what does patch two apply to?

Failure measured, not imagined. Across [#462](https://github.com/chahyasantoso/motion5/pull/462), eight diffs + two report bundles held outside repo, re-cut against `b3dc8d31`, then branch tip, then `ef506e6d` — each publication invalidated what was prepared behind it. Mechanism not incidental to AI Edit: direct consequence of two properties, each correct alone. `prepareCandidate()` requires exactly one pending request; `expected_blobs` pins one original blob id per edited path. Publication lands → every other prepared request touching overlapping path stale; fix not retry — anchors re-verified against changed blobs before request pushed again. N dependent slices → N full round trips + N-1 regenerations; regeneration expensive part.

Naive fix: stack declares base commit per patch. Fails; reason worth stating because it looks like it should work. Base commit SHA names commit that must exist. Patch two's base = commit patch one produces: absent when stack prepared, no predictable id, cannot be predicted — publisher assembles it with own author, committer, date; tree it writes depends on formatting decision at tip. Stack whose interior declarations name commits cannot be authored without first publishing own interior — serialization stack exists to avoid.

Second naive fix: declare nothing, rely on sequence. `after: 1` on patch two says only it is intended to follow patch one — ordering, not state; satisfied by stack whose second patch cut against something else entirely. Exactly case stack must refuse: hunks in patch two positioned against bytes interior supposed to produce; different bytes → hunks land where author never looked. `git apply` frequently accepts that, for all reasons ADR-100 opens with.

## Decision

Stack chains by content, not commit. Every patch declares `pre` + `post` Git blob id for every path touched; for every path after first patch naming it, declared pre-image must equal predecessor's declared post-image.

[checkpointChain](../scripts/checkpoint-policy.mjs) is arithmetic, pure. Walks patches in manifest order, maintaining `base` + `tip` maps. First patch naming path records `base[path] = pre[path]` — value real repo checked against. Later patch naming seen path must satisfy `pre[path] === tip[path]`, else manifest refused before anything read, applied, pushed: `patch N contradicts the post-image of "path"`. Either way `tip[path] = post[path]`. Returns stack's two boundaries — base pre-images it depends on, tip post-images it promises — plus sorted path set.

Three properties follow; whole of decision.

**The interior needs no commits.** Content chain statement about blobs; blobs content-addressed → patch two's precondition satisfiable by describing what patch one produces, patch one committed nowhere. Makes stack authorable in one sandbox, publishable in one transaction of N commits. Nothing goes stale mid-stack: nothing waits — interior verified against itself, purely, before first byte read from checkout.

**The stack has exactly one contact with real repository: the base.** Only `base` checked against source tree: preparation reading candidate checkout, independently publisher reading source commit's tree from GitHub. Former statement that `manifest.base` must equal request commit's single parent superseded by [ADR-102](./ADR-102-a-request-is-sealed-by-its-manifest.md): `manifest.base` is boundary of bounded assembly range. Each base path's observed blob must equal declaration, else `stale pre-image for "path"; the base changed under the patch set`. Twenty-patch stack as expensive to verify against reality as one-patch stack, no more exposed to drift.

**A chain break caught in cheapest place available.** Contradiction inside manifest = pure arithmetic over declarations → refused by unit-testable function, no Git, no network, no checkout. Contradiction manifest vs reality needs tree read → refused before mutation. Contradiction patch vs what it produces needs apply → refused by ADR-100's post-image gate. Three costs, three layers, each refusing what it can first.

`after` survives beside content chain, deliberately not hash: integer naming expected predecessor sequence — absent on patch one, exactly `N-1` on patch N, beside `seq` equal to one-based manifest position and filename whose three-digit prefix equals that `seq`. Redundant with manifest order on purpose: JSON array order invisible in review, trivially disturbed by edit reordering two entries while both internally valid; declared sequence makes intended order reviewable, checkable property of each entry, not emergent property of file. Three independent statements of one ordering, refused when disagreeing — closed-union discipline [ADR-092](./ADR-092-reading-a-closed-union-is-exhaustive.md) asks for, applied to sequence.

Path may not be `null` in both `pre` + `post`: shape closes into exactly three cases read exhaustively, not predicate chain — `pre === null` create, `post === null` delete, neither modify. `reconcilePatch` requires parsed diff agree with classification + declared path set → manifest calling path create and patch modifying it refused, not reconciled.

Recovery inherits chain, not re-derives it. `reconcileCheckpointIntent` walks at most twenty-two one-parent commits from branch head, requires exact `AI-Checkpoint-Set: <digest>` trailer each, requires first published commit retain its `AI-Checkpoint: <path>` trailer, reloads manifest from that path at immutable request commit, requires `checkpointDigest(manifest)` + `manifest.base` match intent record. Enough to confirm publication whose HTTP response lost, no patch replay. No patch ever replayed: content chain verified once = fact about bytes, not operation to repeat.

## What this does not fix, measured rather than assumed

Chain proves internal consistency; says nothing about stack being good decomposition. Twenty patches each applying and chaining correctly can still be unreviewable sequence of arbitrary slices.

Content chain does not make stack cheaper to transport. Makes one round trip possible, more expensive per byte: full final content travels per commit → path touched by five patches appears five times in candidate. Binding limit 1,800,000-byte candidate envelope; stack crossing it refused with split instructions, not chunked. 127-file stack does not fit; answer: more, smaller checkpoints.

One-pending-checkpoint rule mirrors AI Edit's one-pending-request rule; real restriction, not oversight. Two pending folders → ambiguous staleness check, no gain; `.ai/checkpoints` must have exactly one child.

Twenty patches, fifty paths: bounds, not measurements of what reviews well.

Nothing here addresses absent preview operation — genuine regression against AI Edit, recorded as such in [AUTOMATION-TRANSPORT-CHOICE.md](./AUTOMATION-TRANSPORT-CHOICE.md), not quietly omitted.

## Alternatives rejected

**A base commit SHA per patch.** Refused: interior commits absent at authoring time, ids not predictable, per context. Looks correct, structurally impossible.

**Sequence alone, `after` as only link.** Refused: claim about intent, not state; state is what hunks positioned against.

**A hash chain over patch digests, each patch naming predecessor's SHA-256.** Attractive: familiar shape, interior tampering detectable. Refused: proves wrong thing — pins sequence of artifacts, not tree states; accepts stack whose second patch cut against different bytes provided first patch's file unmodified. Tampering already covered: every patch digest + manifest digest verified against immutable GitHub data. Chain must be over content, because content is what hunk depends on.

**Apply stack, then declare only final tip.** Refused: collapses N commits into one, discards reason for stack — each patch reviewable slice with own subject; squashed commit different artifact AI Edit already transports. Also loses per-patch post-image gate: one adjudication over tip instead of N over interior → patch applying surprisingly mid-stack invisible as long as tip matches.

**Allow more than one pending checkpoint per run.** Refused, mirroring AI Edit. Second folder → ambiguous staleness question, buys nothing second round trip does not.

## Consequences

Authoring loop fixed by this decision, concretely: mirror base, apply slice one, record every touched path's blob id with `git hash-object`, apply slice two atop that state, record again; `post` map of slice one = literally `pre` map of slice two. [AI-CHECKPOINT-WORKFLOW.md](./AI-CHECKPOINT-WORKFLOW.md) owns procedure + exact manifest fields.

Publication: one commit per patch, declared order, each carrying `AI-Checkpoint`, `AI-Checkpoint-Patch`, `AI-Checkpoint-Set` trailers; then at most one `style(checkpoint)` formatting commit; then one `chore(checkpoint): consume cpNNN` commit deleting store folder. `patches + 1` commits, or `patches + 2` when formatter changed anything.

Review order follows layering: [checkpoint-policy.mjs](../scripts/checkpoint-policy.mjs) first — every gate consequence of it — then `prepareCheckpoint` for apply-and-adjudicate order, then `validateCheckpointCandidate` for what credentialed side refuses on trust, then `buildCommits` for commit topology.

Stack refused whole or published whole: no partial publication, chain validity property of sequence, not any prefix.

## Evidence

[checkpoint-policy.test.ts](../packages/core/test/unit/scripts/checkpoint-policy.test.ts) covers chain arithmetic directly: two-patch stack whose second pre-image equals first post-image; contradiction refused with path named; `seq`, `after`, filename agreement rules; both-null refusal; fifty-path bound at both enforcement points, per map + over stack union; `reconcilePatch` disagreeing with manifest shape.

[automation-checkpoint.test.ts](../packages/core/test/unit/scripts/automation-checkpoint.test.ts) covers chain through `prepareCheckpoint` against real Git repo: two-patch stack with create, modify, delete preparing one candidate commit per patch; stale base and moved pre-image both refused before mutation.

Recovery path now measured, earlier revision recorded as owed. `reconcileCheckpointIntent` exported as seam, driven through scripted read adapter: confirms publication whose HTTP response lost, no patch replay; walks twenty-two one-parent commits inside budget, refuses twenty-third; refuses chain missing set trailer on any commit, first commit missing its `AI-Checkpoint` trailer, manifest whose `base` disagrees with intent, branch not containing recorded candidate.

Still not claimed: no live exercise of stacked publication; neither test file evidence workflow has run. [AI-CHECKPOINT-WORKFLOW.md](./AI-CHECKPOINT-WORKFLOW.md) owns activation gate, names live exercises still owed.
