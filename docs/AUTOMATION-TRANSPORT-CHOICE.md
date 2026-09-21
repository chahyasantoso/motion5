# Choosing an automation transport

This repository has two reviewed routes for an implementor with no local checkout. [AI edit](./AI-EDIT-WORKFLOW.md) transports bounded anchored edits as a JSON request. [AI checkpoint](./AI-CHECKPOINT-WORKFLOW.md) transports a stack of unified diffs that declare the bytes they produce. This document owns the question of which one a given piece of work belongs in, so that neither protocol document has to carry an argument about the other.

Neither route is preferred, and neither deprecates the other. They are two transports with different bottlenecks, and picking wrong is expensive in both directions. The short rule is at the bottom, and the reasoning matters more than the rule.

No table here, per [AGENTS.md](../AGENTS.md).

## Authoring cost is where they differ most, and it is not close

AI edit's unit is an anchored replacement: a `find` string that must occur **exactly once** in the original blob, plus its `replace`. That uniqueness requirement is the real cost. Authoring it means holding the original bytes, cutting a candidate anchor, checking its occurrence count, and growing it until it is unique. The payload then carries that grown context twice, once in `find` and once in `replace`. So request size scales with roughly twice the changed region plus twice however much context uniqueness demanded.

In repetitive code that demand is brutal. A test file with twenty structurally identical cases, a barrel of near-identical re-exports, a file with repeated `expect(result.kind).toBe("refused")`: anchors there grow from three lines to twenty, or fail to become unique at all within a sane bound.

A unified diff pays none of that. Its unit is a hunk located by line number with three lines of context, and it does not care whether that context is unique anywhere else in the file, because location is positional rather than textual. Size is roughly one times the changed region.

The flip side is real. A checkpoint needs the full final bytes of every touched file, because the post-image blob ids are the gate, and that means a materialised sandbox mirror. AI edit can be authored from blob reads alone, with no working tree and no local run, which on a small change is genuinely less setup than building a mirror.

## Latency is round trips, not minutes

Queue time dominates, so round trips are the honest unit and wall-clock numbers would be invented.

One AI edit round trip is: push the request-only commit, the preparation job runs, the reporter wakes on the completed run as a separate `workflow_run` consumer so its queue latency stacks on top, the publication commit appears, and required CI then runs on that commit.

A checkpoint round trip is structurally identical: same preparation posture, same reporter, same CI. **For one slice the two are a wash**, and any claim that the checkpoint route is faster on a single small change is wrong.

The difference appears at N dependent slices, and it is not linear. `prepareCandidate()` requires exactly one pending request, and `expected_blobs` pins one blob id per edited path, so the moment a publication lands, every other prepared request touching an overlapping path is stale. N slices serialise into N full round trips **plus N-1 regenerations**, and the regeneration is the expensive part, because anchors must be re-verified against changed blobs.

A checkpoint is one push, one preparation run, one publication producing N commits. The chain verifies internally through `after` and pre-image equality with the predecessor's post-image, so intermediate heads never need to exist. Nothing goes stale mid-stack because nothing waits.

That asymmetry was measured, not predicted. Across [#462](https://github.com/chahyasantoso/motion5/pull/462), eight diffs and two report bundles were held outside the repository and re-cut against `b3dc8d31`, then the branch tip, then `ef506e6d`, because each publication invalidated what was prepared behind it. [ADR-101](./ADR-101-a-stacked-patch-chains-by-content.md) exists to make that one reviewed transaction.

## Where each one hits a wall

AI edit's wall is anchor uniqueness and serialisation, and it is bounded to 1 through 50 edits per request.

The checkpoint route's wall is the candidate envelope. Full final file content travels per commit, so a file touched by five patches in a stack appears five times and the 1,800,000-byte bound arrives fast. A 127-file stack does not fit, full stop. The answer is more, smaller checkpoints, and the validator refuses on budget with that sentence rather than silently chunking.

The second wall is a genuine regression against AI edit rather than a trade: AI edit has `preview` and `validate`, so you can ask what a change would do, get a bounded final diff and per-path measurements as evidence, and never touch target bytes. The checkpoint route has no equivalent. The follow-up shape is a manifest-level `operation` field with empty commit file lists and an `operation_result`; until it exists, a checkpoint's first feedback is its preparation run.

## Failure timing matters more than failure rate

AI edit fails early and locally. A non-unique anchor is refused during authoring, before anything is pushed, and the fix is to grow the anchor. Cheap.

The checkpoint route fails late and remotely. A patch that does not apply, or that applies and produces a blob id other than the declared one, is discovered in the preparation run after a push and a queue wait. The consolation is diagnostic quality: the receipt names the path, the expected id and the observed id, which is far more actionable than a conflict hunk. But the round trip is spent.

Both refuse a stale base before any mutation, and neither ever rebases.

## Which work belongs where

Reach for **AI edit** when the change is small and surgical across a handful of files, when the edited regions sit in distinctive text so anchors stay short, when there is no sandbox mirror and building one costs more than the change itself, when the work is a single slice with nothing stacked behind it, and when a human reviewing an anchored `find` and `replace` genuinely reads more clearly than a diff. For a one-line fix, a corrected assertion, a repointed import, or an ADR sentence, AI edit is the right tool and a checkpoint is ceremony.

Reach for **checkpoints** when the work is a stack, which is the decisive case, because multi-phase slices are what serialisation punishes. Also when it spans many files mechanically, when the edited code is repetitive enough that anchors stop being unique or stop being small, when the work required local verification so a mirror already exists, and when the diff itself is the artifact a reviewer wants to read. Phase work, cross-package renames, and a closed-union migration touching every exhaustive sink are checkpoint territory.

Neither transport takes binary content, renames expressed as renames, mode changes, symlinks, or submodules; both refuse those in code. A generated lockfile is excluded by policy rather than by a gate, since neither validator refuses one by name, so do not read its absence from a diff as something the tooling would have caught. Those stay human or stay in their existing dedicated workflows, which [MAINTENANCE-WORKFLOWS.md](./MAINTENANCE-WORKFLOWS.md) inventories.

**One slice, AI edit. A stack, a checkpoint.** If you find yourself about to prepare a second AI edit request that depends on the first one landing, stop and cut a checkpoint instead.

## What choosing does not change

Both transports keep the same trust posture, and that is the point of building the second one as a sibling rather than an extension: read-only path-filtered preparation, no writer token near candidate content, a reviewed runner pinned by `MOTION5_AUTOMATION_SHA`, publication only from the default-branch reporter, a non-force fast-forward with intent persisted first, durable receipts on `ci-logs`, and `ci: pending` on a confirmed publication because publication is not a CI claim.

The checkpoint route must not grow into a superset of AI edit. A diff is a patch artifact and an anchored edit is a described intention, and the repository is better off owning both narrowly than owning one thing that tries to be both.

## Provenance

This analysis is the comparison study on issue [#466](https://github.com/chahyasantoso/motion5/issues/466#issuecomment-5756716454), recorded here because a decision that lives only in an issue comment is a decision the next implementor will not find. Its measurements of authoring cost and serialisation come from the #462 handoff and from the bounds in the two protocol documents. It is reviewed rather than trusted: it has no run in this repository's suite and no CI evidence, and the bounds it cites should be re-read from the owning scripts at the branch you are on rather than believed from here.
