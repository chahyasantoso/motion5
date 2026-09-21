# ADR-100: A patch declares the bytes it produces

**Status:** Accepted, 2026-09-21

## Context

[AI edit](./AI-EDIT-WORKFLOW.md) transports a described intention: an anchored `find` that must occur exactly once, and the `replace` that supersedes it. The validator can adjudicate that description completely, because an anchor either occurs once in the original blob or it does not, and uniqueness is decidable in the same trusted code that performs the replacement. Nothing about the result is left to a second implementation's judgement.

A unified diff is not that kind of artifact. Its hunks are located by line number with surrounding context, and the question "does this patch apply" has no single answer: it has an answer per applier, per fuzz setting, per whitespace mode. Issue [#466](https://github.com/chahyasantoso/motion5/issues/466) asked for a reviewed CI route for a diff because prepared work is handed off as a diff, and the handoff across [#462](https://github.com/chahyasantoso/motion5/pull/462) had no such route. The obvious implementation is the wrong one: parse the diff in trusted JavaScript, apply the hunks, and publish the result. That reimplements a hunk applier, which is more code than the rest of this transport combined, and every defect in it is a defect that publishes wrong bytes under a reviewed runner's authority.

The alternative is to let Git apply the patch, which is a correct and well-exercised applier that this repository already depends on. That moves the problem rather than solving it. A clean `git apply` exit does not mean the patch applied where its author meant. It means the hunks found matching context somewhere within the applier's search. Context that shifted by four lines applies cleanly. A hunk whose context appears twice in the file applies cleanly against whichever occurrence the search reached first. A block duplicated earlier in the file, a function with a near-identical sibling, an offset that lands the edit in a neighbouring declaration: all of these exit zero and produce a file nobody intended. The author knows which file they meant, and a patch has no way to say so.

Separately, a patch artifact committed to this repository is bytes in a contributor tree, and the reviewed runner is not permitted to trust a contributor tree. The AI edit route already refuses to: its publisher re-reads the request from immutable GitHub data and re-checks every precondition rather than believing what the candidate job reported. A checkpoint that gated only on "the parser accepted it and Git applied it" would have no equivalent, because both of those facts are produced inside the candidate job, by the same run that produced the artifact.

## Decision

A checkpoint patch is authority for **what changes**. Its manifest's declared post-image Git blob ids are authority for **what resulted**. Both are required, and the second adjudicates.

Three layers own three different questions, and none of them answers another's.

[checkpoint-policy.mjs](../scripts/checkpoint-policy.mjs) owns **shape**. It is pure: no filesystem, no network, no Git, no credential. It decides whether a manifest is well formed, whether a path is one a checkpoint may touch, and whether the patch text is inside the accepted protocol v1 grammar. Every refusal here is a property of the bytes alone, decidable without applying anything, which is why it is decidable in a unit test.

Git owns **applicability**, through `git apply --check` and then `git apply`, in a disposable candidate checkout with no credential. It is not reimplemented, wrapped, or second-guessed on the question it is good at.

The declared post-image owns **the result**. For every path a patch declares, the prepared content is read back and hashed with Git's blob algorithm, `sha1("blob " + byteLength + "\0" + bytes)`, and compared to the `post` entry the manifest declared for that path. A mismatch is refused with both ids named: `patch N left "path" at <observed> rather than its declared <declared>`. Every case in the paragraphs above, shifted context, a duplicated block, an offset into a neighbour, produces a blob id other than the declared one and is therefore refused after a clean `git apply` rather than published because of one.

This is what makes the layering safe rather than merely tidy. The parser is permitted to be narrower than Git and is not required to be exactly as strict, because its refusals are a first filter over shape and not the gate on correctness. Two consequences follow, and both are deliberate.

An unmarked empty line inside a hunk body is accepted as an empty context line, incrementing both the before and the after count. A conforming applier writes a single space for an empty context line, and several tools that touch a diff on its way through a system strip that trailing space. Refusing the stripped form would refuse patches that are byte-correct about their own content while being cosmetically damaged in a way no applier cares about, and accepting it cannot produce a wrong published file, because the declared post-image still has to match.

Hunk coordinates are checked for monotonicity and non-overlap, and that check was added by the quality pass over this change rather than being present in the first draft. It is here because it is a shape property, which makes it this layer's question by the rule above, and because the diagnostic is worth having: a hunk that overlaps its predecessor fails locally in a pure function that can name the patch line, instead of failing as an opaque applier error after a push and a queue wait. No applier this repository uses emits out-of-order or overlapping hunks, so the check refuses nothing a real `git diff` produces. It is defence in depth and better failure locality, not a correctness fix, and it is written down here rather than left for a later reader to mistake for one.

The publisher trusts the artifact's bytes for nothing. [validateCheckpointCandidate](../scripts/automation-checkpoint.mjs) re-derives the manifest from immutable GitHub data at the request commit, then for every commit the candidate proposes it requires the sequence, the subject, the patch path, the patch digest, the path set, and the Git blob id of every file's content to equal what that reviewed manifest declared. It does not apply a hunk in the credentialed job; it writes bytes that have already been matched to an already-reviewed declaration. A tampered artifact can therefore only publish content that hashes to something a human reviewed, which is a strictly stronger property than "the candidate job said it was fine".

The formatting commit is the one exception, and it is stated out loud rather than left for a reader to infer. The preparing implementor cannot run Prettier, so the formatted bytes have no declared digest and none can be required. They are checked as bounded text on a path the checkpoint leaves behind, under the exact subject `style(checkpoint): normalise cpNNN with the pinned formatter`. That is exactly the trust posture AI Edit's candidate files already have, no more and no less, and it is the reason the formatting delta is its own commit: folding it into the last patch commit would leave one commit whose bytes are not the bytes its manifest declared, which is the single property this record exists to provide.

## What this does not fix, measured rather than assumed

A declared post-image proves the resulting bytes, and it proves nothing about whether those bytes are correct. A patch that compiles, applies, hashes as declared and implements the wrong behaviour passes every gate here. That is review's question and CI's question, and this record does not claim either.

The gate is only as good as the declaration, and the declaration comes from the implementor's sandbox. An implementor who mirrors the repository, makes a change they misunderstand, and honestly records its blob ids gets a clean publication of a change they misunderstood. What the digest removes is the class of failure where the published bytes differ from the bytes that were prepared and reviewed. It does not remove the class where the prepared bytes were wrong.

`git apply` is still the applier, so its behaviour is still upstream of the result. What changed is that its behaviour is no longer the last word: a surprising application is caught rather than trusted.

The formatting commit's bytes remain unverifiable against a declaration, by construction. If the pinned formatter is compromised at the reviewed revision, this design does not detect it, and neither does AI Edit's.

Publication is not a CI claim. A confirmed receipt records `ci: pending`, because the commit it published has not yet been tested by anything.

## Alternatives rejected

**Apply the hunks in trusted JavaScript.** The reason to want this is that it removes Git from the trusted path and makes the whole transport decidable in unit tests. It is refused because a hunk applier is a substantial amount of subtle code whose defects publish wrong bytes with a reviewed runner's authority, and because it would be a second owner of a question Git already owns correctly. The digest gives the same assurance without the code: an independently computed result is compared against an independently declared one.

**Trust a clean `git apply` and publish.** Refused for the reason this record opens with. A zero exit means the hunks matched context somewhere, not that they matched where the author meant, and every one of shifted context, a duplicated block and a neighbouring-function offset exits zero.

**Declare a content checksum instead of a Git blob id.** A plain SHA-256 over the file would work as an adjudicator, and it was refused because the publisher has to compare against something it can compute from a Git tree without materialising a checkout, and because the implementor can produce a blob id with `git hash-object` rather than a bespoke tool. Using Git's own object id means the declaration, the source precondition and the tree entry are all the same kind of value. The patch file itself is digested with SHA-256, because it is an artifact rather than tree content and is never compared with a tree entry.

**Declare only pre-images.** Refused, and this is the interesting one. Pre-images alone make the transport safe against a stale base, which is the failure the issue's design comment led with, and they say nothing about the result. A stale-base check refuses applying to the wrong input; it cannot refuse a surprising application to the right input. Both are declared, and they answer different questions.

**Run the formatter between patches.** Refused, and this corrects the design posted on issue #466. Patch two declares its pre-image as patch one's post-image, computed in a sandbox where Prettier never ran. Formatting patch one first invalidates the declaration patch two depends on, or worse, shifts the context its hunks match. The stack is applied with no formatting in between and the surviving tip is formatted exactly once. Intermediate commits are therefore not required to be Prettier-clean and nothing asks them to be: `format:check` runs against the branch head, which is the formatted tip.

**Store the artifacts under `docs/checkpoints/`,** as the issue proposed. Refused for mechanical reasons rather than aesthetic ones. `.ai` is already in the parser's protected prefixes, so a checkpoint cannot mutate the store or a sibling checkpoint. `.prettierignore` already lists `.ai`, so the formatter cannot rewrite an artifact whose digest is computed over its exact bytes. `docs/` has neither property and would need both added. `.gitattributes` gains `*.diff -text -diff` in the first commit, before a patch file can exist, because `* text=auto eol=lf` is end-of-line normalisation applied to bytes that certify themselves.

## Consequences

The implementor owes a materialised mirror. Post-image blob ids cannot be authored from blob reads alone, so a checkpoint requires the full final bytes of every touched file to exist somewhere the implementor can hash them. [AUTOMATION-TRANSPORT-CHOICE.md](./AUTOMATION-TRANSPORT-CHOICE.md) owns when that cost is worth paying and when AI Edit is the cheaper route.

A refusal names both ids. The post-image diagnostic is `patch N left "path" at <observed> rather than its declared <declared>`, and a base that moved under the stack is `stale pre-image for "path"; the base changed under the patch set`. Either one names the path and the ids, which is a far more actionable failure than a conflict hunk, and it is the compensation for failing late and remotely rather than early and locally.

The candidate envelope is the binding limit, not the patch size. Full final content travels per commit, so a path touched by five patches in a stack appears five times, and the 1,800,000-byte candidate bound arrives sooner than a reader of the patch sizes expects. The validator refuses on budget with the sentence `The candidate exceeds 1800000 bytes; split the work into more, smaller checkpoints` rather than silently chunking.

Intermediate commits in a published stack are not Prettier-clean, and that is not a defect. Only the tip is, and only the tip is checked.

`publishCandidate()` is reused unchanged, so intent-before-push, the single `force: false` ref update, the re-read of the remote head, treating a lost HTTP response as uncertainty rather than failure, and refusing a divergent branch are inherited rather than copied. A checkpoint cannot regress a publication property that AI Edit holds, because it does not own one.

One duplication is knowing. The artifact reader in [automation-checkpoint.mjs](../scripts/automation-checkpoint.mjs) is copied from the AI edit publisher. It belongs in the GitHub adapter, and lifting it there is its own slice rather than a drive-by edit to a credentialed path.

## Evidence

[checkpoint-policy.test.ts](../packages/core/test/unit/scripts/checkpoint-policy.test.ts) covers the manifest schema, the accepted grammar, and the refusals that are decidable over bytes: an unknown manifest key, a filename disagreeing with its `seq`, a traversing path, a path outside `allow`, a protected prefix, a binary patch, a rename, a mode change, a hunk header disagreeing with its body, a CI-skip subject, and the hunk-coordinate ordering this record adds.

[automation-checkpoint.test.ts](../packages/core/test/unit/scripts/automation-checkpoint.test.ts) covers the two functions it imports, `prepareCheckpoint` and `validateCheckpointCandidate`, against a real Git repository: a stack applying with a create, a modify and a delete with each patch gated on its declared post-image, the formatting delta collapsing into a separate `style(checkpoint)` commit, a stale base, a moved pre-image, an undeclared path, a declared post-image the patch does not produce, and a tampered candidate refused by the publisher's independent validation.

Not claimed, and stated here because an independent pass over this change measured it rather than taking the inventory's word. The committed suite does not exercise `buildCommits`, `publishCheckpointRun`, `recoverCheckpointRun`, or `publishCandidate`, so the commit topology, the trailers, the non-force ref update, intent reconciliation and the skipped-run classification are **reviewed rather than tested**. `automation-receipt.test.ts` does not cover the `checkpoint` kind. The publication properties this record leans on are inherited from the AI edit route's own coverage of the shared publisher, which is an argument rather than a measurement of this route. Those tests are owed, and the gap is named here so a reader does not infer coverage from a topology described in prose.

No live run of [ai-checkpoint.yml](../.github/workflows/ai-checkpoint.yml) is evidence for anything here either. The workflow no-ops until a human moves `MOTION5_AUTOMATION_SHA` to a reviewed SHA, and rollback is pointing that variable back. [AI-CHECKPOINT-WORKFLOW.md](./AI-CHECKPOINT-WORKFLOW.md) owns the activation gate and the live exercises that are still owed.
