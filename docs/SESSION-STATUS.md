# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-04, Asia/Jakarta.
- **Verified on:** `ebad1ab` on `main`, which is [#282](https://github.com/chahyasantoso/motion5/pull/282) merged. The sha names the last commit that changed `packages/` rather than the head of a branch, because a status file cannot cite the commit it is written in and a docs-only commit verifies no behaviour.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-066 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is the previous revision of this path, at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** The status file states current state only, and a gate refuses growth rather than a paragraph asking for it. Three sections that grew once per slice left it: the per-slice narrative and the red and green run ids into the pull requests and ADRs that already owned them, the standing rules and the working constraints into [GUARDRAILS.md](./GUARDRAILS.md), and what a live edit costs into [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md). Both moves are verbatim and in order, so a rule that pointed at another by position still means what it meant. It earns no ADR; the guardrail it earns is the last bullet of `GUARDRAILS.md`, and it generalises to a rule this project already applies to code: a request to keep something small is not a mechanism. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284).
- **Landed before it.** The formatter no longer receives a path an AI edit request deleted, [issue #281](https://github.com/chahyasantoso/motion5/issues/281), by [#282](https://github.com/chahyasantoso/motion5/pull/282). One list of changed paths was answering two questions: the commit allow-list needs every path the request touched, a deletion included, and Prettier exits non-zero on a path that is not there. The write pass emits a second list holding only the paths that still exist. `AE-17` through `AE-19` are its evidence.

## Next in line

- **Clear `SISTER_DOC_PENDING`.** Four sources are over the 30,000-byte sister-doc trigger and predate the rule, so the read-budget scan names them instead of refusing them. The list is a ratchet: an entry the tree no longer needs is itself a violation, so it fails in both directions. The read-budget slice called this the next one.
- **`edit(recipe)` skips the apply against a runtime the recipe disposed.** `dispose` inside a recipe clears the open transaction and empties the retained tracks, so the pair comparison in `edit` then differs and `#apply` runs against a disposed runtime, throwing from the liveness check after its effects have been applied. Found by the immediate-verb slice and deliberately not in it: a refusal and a skipped apply are two invariants with two cases.
- **Gate the `AE-` evidence ids,** [issue #283](https://github.com/chahyasantoso/motion5/issues/283). The series is declared in `packages/core/test/unit/scripts/apply-ai-edit.test.ts`, cited by `docs/AI-EDIT-WORKFLOW.md` and by the script it covers, and is absent from the pattern `evidence-case-ids.test.ts` scans, so nothing has ever held its ids to uniqueness. That gate's own policy is that a series joins the pattern when it is opened, which makes this a missed widening rather than a decision.

## Open, and not scheduled

- Issue #222's stateful-`Interpolator` alternative is read and refused rather than pending. A record-shaped member with a base and an overlay is further from that adapter than a per-key one was, because the state it keeps is two compiled records inside one `create()` closure, keyed by nothing.
- Phase 6 packaging is the phase after this one. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns its scope, and nothing here claims any of it has started.

## Where the rest of it lives

Each of these was in this file once. None of them is now, and every one of them had an owner the whole time.

- **A slice's narrative, and its red and green run ids.** The pull request that landed it, and the ADR that decided it. This was duplicated here for two dozen slices, which is what made the file unreadable; the previous revision's own last bullet already said the pull request was the owner.
- **The standing rules, and the working constraints.** [GUARDRAILS.md](./GUARDRAILS.md).
- **What a caller may do to a loaded project, and what each edit costs.** [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- **What every evidence-case-id series covers.** `packages/core/test/unit/scripts/evidence-case-ids.test.ts` is the one owner of that, and the gate that holds the ids to uniqueness.
- **A citation that points here for one of the above.** ADR-057, ADR-061, ADR-062 and ADR-064, and the docblocks of `mount-flush-seed.test.ts` and `declined-build-write-drop.test.ts`, all cite this file for a standing rule or a run id, because this file carried them when those records were written. They are right about the rule and stale about the address: a standing rule is in [GUARDRAILS.md](./GUARDRAILS.md), a fact about what an edit costs is in [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md), and a run id is in the pull request that landed the slice. One forwarding address in the file every reader lands on, rather than six edits to records that are otherwise correct.
- **How to update this file.** [PR-WORKFLOW.md](./PR-WORKFLOW.md) owns the rule, and it is one line long: replace, do not append.
