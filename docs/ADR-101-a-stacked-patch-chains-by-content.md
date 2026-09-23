# ADR-101: A stacked patch chains by content

**Status:** Accepted, 2026-09-21

## Context

[ADR-100](./ADR-100-a-patch-declares-the-bytes-it-produces.md) decides that a patch declares the bytes it produces. That is sufficient for one patch and insufficient for a stack, because a stack has a second question: what does patch two apply to?

The failure this answers was measured rather than imagined. Across [#462](https://github.com/chahyasantoso/motion5/pull/462), eight diffs and two report bundles were held outside the repository and re-cut against `b3dc8d31`, then the branch tip, then `ef506e6d`, because each publication invalidated what was prepared behind it. The mechanism is not incidental to AI Edit, it is a direct consequence of two of its properties that are each correct on their own. `prepareCandidate()` requires exactly one pending request, and `expected_blobs` pins one original blob id per edited path. So the moment a publication lands, every other prepared request touching an overlapping path is stale, and the fix is not a retry: the anchors must be re-verified against the changed blobs before the request can be pushed again. N dependent slices therefore cost N full round trips plus N-1 regenerations, and the regeneration is the expensive part.

The naive fix is to let a stack declare a base commit per patch. It does not work, and the reason is worth stating because it looks like it should. A base commit SHA names a commit that must exist. Patch two's base would be the commit patch one produces, and that commit does not exist when the stack is prepared, has no predictable id, and cannot be predicted: the publisher assembles it with its own author, committer and date, and the tree it writes depends on the formatting decision taken at the tip. A stack whose interior declarations name commits therefore cannot be authored at all without first publishing its own interior, which is the serialization the stack exists to avoid.

The second naive fix is to declare nothing and rely on sequence. `after: 1` on patch two says only that it is intended to follow patch one. It is a statement about ordering, not about state, so it is satisfied by a stack whose second patch was cut against something else entirely. That is precisely the case a stack has to refuse, because the hunks in patch two were positioned against bytes that the interior of the stack is supposed to have produced, and if those bytes are different the hunks land somewhere their author never saw. `git apply` will frequently accept that, for all the reasons ADR-100 opens with.

## Decision

A stack chains by content, not by commit. Every patch declares a `pre` and a `post` Git blob id for every path it touches, and for every path after the first patch that names it, the declared pre-image must equal the predecessor's declared post-image.

[checkpointChain](../scripts/checkpoint-policy.mjs) is the arithmetic, and it is pure. It walks the patches in manifest order, maintaining a `base` map and a `tip` map. The first patch to name a path records `base[path] = pre[path]`, which is the value the real repository will be checked against. A later patch naming an already-seen path must satisfy `pre[path] === tip[path]`, or the manifest is refused before anything is read, applied or pushed: `patch N contradicts the post-image of "path"`. Either way, `tip[path] = post[path]`. What the function returns is the stack's two boundaries, the base pre-images it depends on and the tip post-images it promises, plus the sorted path set.

Three properties follow, and they are the whole of the decision.

**The interior needs no commits.** A content chain is a statement about blobs, and blobs are content-addressed, so patch two's precondition is satisfiable by describing what patch one produces without patch one having been committed anywhere. That is what makes a stack authorable in one sandbox and publishable in one transaction of N commits. Nothing goes stale mid-stack because nothing waits: the interior is verified against itself, purely, before the first byte is read from a checkout.

**The stack has exactly one contact with the real repository, and it is the base.** Only `base` is checked against the source tree, both by preparation reading the candidate checkout and independently by the publisher reading the source commit's tree from GitHub. The former statement that `manifest.base` must equal the request commit's single parent is superseded by [ADR-102](./ADR-102-a-request-is-sealed-by-its-manifest.md): `manifest.base` is the boundary of a bounded assembly range. Then each base path's observed blob must equal its declaration, or `stale pre-image for "path"; the base changed under the patch set`. A stack of twenty patches is therefore as expensive to verify against reality as a stack of one, and no more exposed to drift.

**A chain break is caught in the cheapest place available.** A contradiction inside the manifest is pure arithmetic over declarations, so it is refused by a unit-testable function with no Git, no network and no checkout. A contradiction between the manifest and reality needs a tree read and is refused before any mutation. A contradiction between a patch and what it actually produces needs an apply and is refused by ADR-100's post-image gate. Three costs, three layers, each refusing what it is able to refuse first.

`after` survives alongside the content chain, and it is deliberately not a hash. It is an integer naming the expected predecessor sequence: absent on patch one, exactly `N-1` on patch N, alongside a `seq` that must equal its one-based manifest position and a filename whose three-digit prefix must equal that `seq`. This is redundant with manifest order on purpose. Order in a JSON array is invisible in review and trivially disturbed by an edit that reorders two entries while leaving both internally valid; a declared sequence makes the intended order a reviewable, checkable property of each entry rather than an emergent property of the file. Three independent statements of one ordering, refused when they disagree, is the closed-union discipline [ADR-092](./ADR-092-reading-a-closed-union-is-exhaustive.md) asks for applied to a sequence.

A path may not be `null` in both `pre` and `post`, which closes the shape into exactly three cases read exhaustively rather than by a predicate chain: `pre === null` is a create, `post === null` is a delete, neither is a modify. `reconcilePatch` requires the parsed diff to agree with that classification and with the declared path set, so a manifest that calls a path a create and a patch that modifies it is refused rather than reconciled.

Recovery inherits the chain rather than re-deriving it. `reconcileCheckpointIntent` walks at most twenty-two one-parent commits from the branch head, requires the exact `AI-Checkpoint-Set: <digest>` trailer on each, requires the first published commit to retain its `AI-Checkpoint: <path>` trailer, reloads the manifest from that path at the immutable request commit, and requires both `checkpointDigest(manifest)` and `manifest.base` to match what the intent recorded. That is enough to confirm a publication whose HTTP response was lost, without replaying a patch. No patch is ever replayed, because a content chain that verified once is a fact about bytes rather than an operation to repeat.

## What this does not fix, measured rather than assumed

The chain proves internal consistency and says nothing about whether the stack is a good decomposition. Twenty patches that each apply and chain correctly can still be an unreviewable sequence of arbitrary slices.

A content chain does not make a stack cheaper to transport. It makes it possible to transport in one round trip, and it makes it more expensive per byte: full final content travels per commit, so a path touched by five patches appears five times in the candidate. The binding limit is the 1,800,000-byte candidate envelope, and a stack that crosses it is refused with instructions to split rather than being chunked. A 127-file stack does not fit, and the answer is more, smaller checkpoints.

The one-pending-checkpoint rule mirrors AI Edit's one-pending-request rule and is a real restriction, not an oversight. Two pending folders make the staleness check ambiguous for no gain, so `.ai/checkpoints` must have exactly one child.

Twenty patches and fifty paths are bounds, not measurements of what reviews well.

Nothing here addresses the absence of a preview operation, which is a genuine regression against AI Edit and is recorded as such in [AUTOMATION-TRANSPORT-CHOICE.md](./AUTOMATION-TRANSPORT-CHOICE.md) rather than being quietly omitted.

## Alternatives rejected

**A base commit SHA per patch.** Refused because the interior commits do not exist at authoring time and their ids are not predictable, as the context sets out. This is the alternative that looks correct and is structurally impossible.

**Sequence alone, with `after` as the only link.** Refused because it is a claim about intent rather than state, and the state is what the hunks were positioned against.

**A hash chain over patch digests, so each patch names its predecessor's SHA-256.** This was attractive because it is a familiar shape and makes tampering with an interior patch detectable. It is refused because it proves the wrong thing: it pins the sequence of artifacts rather than the sequence of tree states, so it would accept a stack whose second patch was cut against different bytes provided the first patch's file was unmodified. Tampering is already covered, because every patch's digest and the manifest's own digest are both verified against immutable GitHub data. The chain has to be over content, because content is what a hunk depends on.

**Apply the stack, then declare only the final tip.** Refused because it collapses N commits into one and discards the reason for a stack: each patch is a reviewable slice with its own subject, and a single squashed commit is a different artifact that AI Edit already transports. It would also lose the per-patch post-image gate, leaving one adjudication over the tip instead of N over the interior, so a patch that applied surprisingly in the middle would be invisible as long as the tip happened to match.

**Allow more than one pending checkpoint per run.** Refused, mirroring AI Edit. A second folder makes the staleness question ambiguous and buys nothing that a second round trip does not.

## Consequences

The implementor's authoring loop is fixed by this decision and is worth stating concretely: mirror the base, apply slice one, record every touched path's blob id with `git hash-object`, apply slice two on top of that state, record again, and the `post` map of slice one is literally the `pre` map of slice two. [AI-CHECKPOINT-WORKFLOW.md](./AI-CHECKPOINT-WORKFLOW.md) owns the procedure and the exact manifest fields.

Publication produces one commit per patch, in declared order, each carrying `AI-Checkpoint`, `AI-Checkpoint-Patch` and `AI-Checkpoint-Set` trailers, then at most one `style(checkpoint)` formatting commit, then one `chore(checkpoint): consume cpNNN` commit that deletes the store folder. That is `patches + 1` commits, or `patches + 2` when the formatter changed anything.

Review order follows the layering. Read [checkpoint-policy.mjs](../scripts/checkpoint-policy.mjs) first, since every gate is a consequence of it, then `prepareCheckpoint` for the apply-and-adjudicate order, then `validateCheckpointCandidate` for what the credentialed side refuses to take on trust, then `buildCommits` for the commit topology.

A stack is refused as a whole or published as a whole. There is no partial publication, because the chain's validity is a property of the sequence and not of any prefix of it.

## Evidence

[checkpoint-policy.test.ts](../packages/core/test/unit/scripts/checkpoint-policy.test.ts) covers the chain arithmetic directly: a two-patch stack whose second pre-image equals the first post-image, a contradiction refused with the path named, the `seq`, `after` and filename agreement rules, the both-null refusal, the fifty-path bound at both enforcement points, per map and again over the union of a stack, and `reconcilePatch` disagreeing with a manifest shape.

[automation-checkpoint.test.ts](../packages/core/test/unit/scripts/automation-checkpoint.test.ts) covers the chain through `prepareCheckpoint` against a real Git repository: a two-patch stack with a create, a modify and a delete preparing one candidate commit per patch, and a stale base and a moved pre-image both refused before any mutation.

The recovery path described above is now measured, which an earlier revision of this record recorded as owed. `reconcileCheckpointIntent` is exported as a seam and driven through a scripted read adapter: it confirms a publication whose HTTP response was lost without replaying a patch, walks twenty-two one-parent commits inside budget and refuses a twenty-third, and refuses a chain missing the set trailer on any commit, a first commit missing its `AI-Checkpoint` trailer, a manifest whose `base` disagrees with the intent, and a branch that does not contain the recorded candidate.

Still not claimed: no live exercise of a stacked publication exists, and neither test file is evidence that the workflow has run. [AI-CHECKPOINT-WORKFLOW.md](./AI-CHECKPOINT-WORKFLOW.md) owns the activation gate and names the live exercises that remain owed.
