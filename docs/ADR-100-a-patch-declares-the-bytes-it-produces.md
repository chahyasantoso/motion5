# ADR-100: A patch declares the bytes it produces

**Status:** Accepted, 2026-09-21. **Superseded by [ADR-142](./ADR-142-the-ai-edit-checkpoint-and-handover-automation-is-removed.md), 2026-10-23.**

## Context

[AI edit](./AI-EDIT-WORKFLOW.md) transports described intention: anchored `find` occurring exactly once, `replace`
superseding it. Validator adjudicates description completely — anchor either occurs once in original blob or not,
uniqueness decidable in same trusted code performing replacement. Nothing about result left to second
implementation's judgement.

Unified diff is not that artifact. Hunks located by line number + surrounding context, "does this patch apply"
has no single answer: one answer per applier, per fuzz setting, per whitespace mode. Issue
[#466](https://github.com/chahyasantoso/motion5/issues/466) asked reviewed CI route for diff because prepared
work handed off as diff, handoff across
[#462](https://github.com/chahyasantoso/motion5/pull/462) had no such route. Obvious implementation is wrong
one: parse diff in trusted JavaScript, apply hunks, publish result. Reimplements hunk applier — more code than
rest of this transport combined — every defect publishes wrong bytes under reviewed runner's authority.

Alternative: let Git apply patch, correct well-exercised applier repository already depends on. Moves problem,
does not solve. Clean `git apply` exit ≠ patch applied where author meant. Means hunks found matching context
somewhere within applier's search. Context shifted by four lines applies cleanly. Hunk whose context appears
twice applies cleanly against whichever occurrence search reached first. Block duplicated earlier, function with
near-identical sibling, offset landing edit in neighbouring declaration: all exit zero, produce file nobody
intended. Author knows which file meant, patch cannot say so.

Separately, patch artifact committed to this repository = bytes in contributor tree, reviewed runner not
permitted to trust contributor tree. AI edit route already refuses: publisher re-reads request from immutable
GitHub data, re-checks every precondition rather than believing candidate job. Checkpoint gating only on "parser
accepted it and Git applied it" would have no equivalent — both facts produced inside candidate job, by same run
producing artifact.

## Decision

Checkpoint patch = authority for **what changes**. Manifest's declared post-image Git blob ids = authority for
**what resulted**. Both required, second adjudicates.

Three layers own three questions, none answers another's.

[checkpoint-policy.mjs](../scripts/checkpoint-policy.mjs) owns **shape**. Pure: no filesystem, network, Git,
credential. Decides manifest well formed, path one checkpoint may touch, patch text inside accepted protocol v1
grammar. Every refusal here property of bytes alone, decidable without applying anything → decidable in unit
test.

Git owns **applicability** through `git apply --check` then `git apply`, in disposable candidate checkout with no
credential. Not reimplemented, wrapped, second-guessed on question it is good at.

Apply flags `--unidiff-zero --whitespace=nowarn -p1`; `--unidiff-zero` decision this record owns, not invocation
detail, because script cites this record for it. Without flag the two layers accept different patch sets:
`parsePatch` blesses zero-context hunk, `git apply` refuses it `patch does not apply` — precisely late, opaque
failure design exists to remove. Measured before chosen. Across 1,095 real `git diff` apply comparisons `-U0`
through `-U10`, flag produced no regression, all 199 cases it newly allowed were `-U0`. Does not loosen context
checking — reason to fear it: with flag set, hunk whose context lines disagree with file and zero-context
deletion whose removed line disagrees both still refused. Single class left to another layer: zero-context pure
insertion, carrying neither context nor removed line for applier to match; placement is declared post-image's
question by paragraph below, not applier's. Misdeclared insertion refused
`patch N left "path" at <observed> rather than its declared <declared>`, case in committed suite.

Declared post-image owns **result**. For every path patch declares, prepared content read back, hashed with Git's
blob algorithm `sha1("blob " + byteLength + "\0" + bytes)`, compared to `post` entry manifest declared for that
path. Mismatch refused with both ids named: `patch N left "path" at <observed> rather than its declared
<declared>`. Every case above — shifted context, duplicated block, offset into neighbour — produces blob id other
than declared, refused after clean `git apply` rather than published because of one.

What makes layering safe not merely tidy. Parser permitted narrower than Git, not required exactly as strict: its
refusals first filter over shape, not gate on correctness. Two consequences, both deliberate.

Unmarked empty line inside hunk body accepted as empty context line, incrementing before and after count.
Conforming applier writes single space for empty context line, several tools touching diff en route strip that
trailing space. Refusing stripped form refuses patches byte-correct about own content, cosmetically damaged in
way no applier cares about; accepting cannot produce wrong published file — declared post-image still must match.

Hunk coordinates checked for monotonicity + non-overlap, added by quality pass over this change, absent from
first draft. Here because shape property → this layer's question by rule above, and diagnostic worth having:
hunk overlapping predecessor fails locally in pure function naming patch line, instead of opaque applier error
after push and queue wait. No applier this repository uses emits out-of-order or overlapping hunks → check
refuses nothing real `git diff` produces. Defence in depth, better failure locality, not correctness fix — written
here rather than left for later reader to mistake for one.

Publisher trusts artifact bytes for nothing.
[validateCheckpointCandidate](../scripts/automation-checkpoint.mjs) re-derives manifest from immutable GitHub data
at request commit, then for every commit candidate proposes requires sequence, subject, patch path, patch digest,
path set, Git blob id of every file's content to equal reviewed manifest's declaration. Applies no hunk in
credentialed job; writes bytes already matched to already-reviewed declaration. Tampered artifact can therefore
only publish content hashing to something human reviewed — strictly stronger than "candidate job said it was
fine".

Formatting commit is one exception, stated aloud not left inferred. Preparing implementor cannot run Prettier →
formatted bytes have no declared digest, none can be required. Checked as bounded text on path checkpoint leaves
behind, under exact subject `style(checkpoint): normalise cpNNN with the pinned formatter`. Exactly trust posture
AI Edit's candidate files already have, no more no less — reason formatting delta is own commit: folding into
last patch commit leaves one commit whose bytes are not bytes its manifest declared, single property this record
exists to provide.

## What this does not fix, measured rather than assumed

Declared post-image proves resulting bytes, proves nothing about whether bytes correct. Patch that compiles,
applies, hashes as declared, implements wrong behaviour passes every gate here. Review's question, CI's question —
this record claims neither.

Gate only as good as declaration, declaration comes from implementor's sandbox. Implementor who mirrors repo,
makes change they misunderstand, honestly records blob ids → clean publication of misunderstood change. Digest
removes class where published bytes differ from prepared and reviewed bytes. Does not remove class where prepared
bytes were wrong.

`git apply` still applier, behaviour still upstream of result. Changed: its behaviour no longer last word —
surprising application caught rather than trusted.

Formatting commit's bytes remain unverifiable against declaration, by construction. Pinned formatter compromised
at reviewed revision → this design does not detect, neither does AI Edit's.

Publication is not CI claim. Confirmed receipt records `ci: pending` — commit it published not yet tested by
anything.

## Alternatives rejected

**Apply hunks in trusted JavaScript.** Want: removes Git from trusted path, whole transport decidable in unit
tests. Refused: hunk applier substantial subtle code whose defects publish wrong bytes with reviewed runner's
authority, second owner of question Git already owns correctly. Digest gives same assurance without code:
independently computed result compared against independently declared one.

**Trust clean `git apply`, publish.** Refused for opening reason. Zero exit = hunks matched context somewhere,
not where author meant; shifted context, duplicated block, neighbouring-function offset all exit zero.

**Content checksum instead of Git blob id.** Plain SHA-256 over file would work as adjudicator. Refused:
publisher must compare against something computable from Git tree without materialising checkout, implementor can
produce blob id with `git hash-object` not bespoke tool. Git's own object id → declaration, source precondition,
tree entry all same kind of value. Patch file itself digested with SHA-256: artifact not tree content, never
compared with tree entry.

**Declare only pre-images.** Refused, the interesting one. Pre-images alone make transport safe against stale
base — failure issue's design comment led with — say nothing about result. Stale-base check refuses applying to
wrong input, cannot refuse surprising application to right input. Both declared, answer different questions.

**Teach parser applier's zero-context rule instead of passing `--unidiff-zero`.** Refused, closer of two. Keeps
local diagnostic (real gain), pays by encoding reverse-engineered heuristic into one layer that must be
trustworthy. Rule to encode is applier behaviour not property of diff: `git apply` without flag accepts
zero-context hunk covering whole one-line file, refuses zero-context partial change to five-line file. Guess about
that in security boundary worse than widening applicability and leaning on post-image digest — layering this
record argues everywhere else. Parser stays honest about shape instead of impersonating applier.

**Run formatter between patches.** Refused, corrects design posted on issue #466. Patch two declares pre-image as
patch one's post-image, computed in sandbox where Prettier never ran. Formatting patch one first invalidates
declaration patch two depends on, or worse shifts context its hunks match. Stack applied with no formatting
between, surviving tip formatted exactly once. Intermediate commits therefore not required Prettier-clean, nothing
asks: `format:check` runs against branch head = formatted tip.

**Store artifacts under `docs/checkpoints/`,** as issue proposed. Refused for mechanical not aesthetic reasons.
`.ai` already in parser's protected prefixes → checkpoint cannot mutate store or sibling checkpoint.
`.prettierignore` already lists `.ai` → formatter cannot rewrite artifact whose digest computed over exact bytes.
`docs/` has neither, would need both added. `.gitattributes` gains `*.diff -text -diff` in first commit, before
patch file can exist, because `* text=auto eol=lf` is end-of-line normalisation applied to bytes that certify
themselves.

## Consequences

Implementor owes materialised mirror. Post-image blob ids cannot be authored from blob reads alone → checkpoint
requires full final bytes of every touched file existing somewhere implementor can hash.
[AUTOMATION-TRANSPORT-CHOICE.md](./AUTOMATION-TRANSPORT-CHOICE.md) owns when cost worth paying, when AI Edit
cheaper route.

Refusal names both ids. Post-image diagnostic `patch N left "path" at <observed> rather than its declared
<declared>`, base moved under stack `stale pre-image for "path"; the base changed under the patch set`. Either
names path + ids — far more actionable than conflict hunk, compensation for failing late and remotely rather than
early and locally.

Candidate envelope binding limit, not patch size. Full final content travels per commit → path touched by five
patches appears five times, 1,800,000-byte candidate bound arrives sooner than reader of patch sizes expects.
Validator refuses on budget with `The candidate exceeds 1800000 bytes; split the work into more, smaller
checkpoints` rather than silently chunking.

Retained evidence carries own bound + honesty requirement. Combined patch bytes set retains on `ci-logs` may not
exceed 1,000,000; preparation enforces alongside publisher so refusal costs no round trip, publisher keeps own
check because it owns what it writes. Retained chunks sanitised not byte-exact — token-shaped string or control
character redacted out → evidence manifest states `retained_text: sanitised_not_byte_exact`, declared `sha256`
over original bytes stays authority. Reader digesting chunk, finding mismatch, found redaction not wrong
declaration.

Intermediate commits in published stack not Prettier-clean, not defect. Only tip is, only tip checked.

`publishCandidate()` reused unchanged → intent-before-push, single `force: false` ref update, re-read of remote
head, lost HTTP response treated as uncertainty not failure, divergent branch refused: inherited not copied.
Checkpoint cannot regress publication property AI Edit holds, owns none.

One duplication knowing. Artifact reader in [automation-checkpoint.mjs](../scripts/automation-checkpoint.mjs)
copied from AI edit publisher. Belongs in GitHub adapter; lifting there = own slice, not drive-by edit to
credentialed path.

## Evidence

[checkpoint-policy.test.ts](../packages/core/test/unit/scripts/checkpoint-policy.test.ts) covers manifest schema,
accepted grammar, refusals decidable over bytes: unknown manifest key, filename disagreeing with `seq`, traversing
path, path outside `allow`, protected prefix, binary patch, rename, mode change, hunk header disagreeing with
body, CI-skip subject, hunk-coordinate ordering this record adds.

[automation-checkpoint.test.ts](../packages/core/test/unit/scripts/automation-checkpoint.test.ts) covers two
functions it imports, `prepareCheckpoint`, `validateCheckpointCandidate`, against real Git repository: stack
applying with create/modify/delete, each patch gated on declared post-image, formatting delta collapsing into
separate `style(checkpoint)` commit, stale base, moved pre-image, undeclared path, declared post-image patch does
not produce, tampered candidate refused by publisher's independent validation.

Topology now measured not reviewed — earlier revision of this record correctly refused to claim. `buildCommits` +
`reconcileCheckpointIntent` exported as seams, driven through recording writer and scripted read adapter → commit
count, three trailers in order, deletion carried as null blob keeping source mode, consumption commit deleting
exactly store, linear ancestry, twenty-patch stack, recovery of lost HTTP response without replaying patch,
twenty-two-commit walk with refusals: all executed by committed suite.

Still not claimed, named so reader does not infer. `publishCheckpointRun`, `checkpointSnapshot`, artifact reader,
evidence retention, non-force ref update in situ are **reviewed rather than tested**; last inherited from AI edit
route's coverage of shared publisher — argument about shared owner, not measurement of this route.
`automation-receipt.test.ts` does not cover `checkpoint` kind. Those tests owed.

No live run of [ai-checkpoint.yml](../.github/workflows/ai-checkpoint.yml) evidence for anything here. Workflow
no-ops until human moves `MOTION5_AUTOMATION_SHA` to reviewed SHA, rollback points variable back.
[AI-CHECKPOINT-WORKFLOW.md](./AI-CHECKPOINT-WORKFLOW.md) owns activation gate and live exercises still owed.
