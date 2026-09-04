# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-04, Asia/Jakarta.
- **Verified on:** `910152c` on `main`, which is [#285](https://github.com/chahyasantoso/motion5/pull/285) merged. Runtime behaviour is unchanged since `ebad1ab`, [#282](https://github.com/chahyasantoso/motion5/pull/282): the slices after it are this file's own shape and one evidence gate, and neither reaches `packages/core/src`.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-066 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** The `AE-` series is gated for uniqueness, [issue #283](https://github.com/chahyasantoso/motion5/issues/283). Nineteen ids were declared in `apply-ai-edit.test.ts`, cited by `docs/AI-EDIT-WORKFLOW.md` and by the header of the script they cover, and absent from the pattern `evidence-case-ids.test.ts` scans, so nothing would have caught a second `AE-7`. The widening needed a third case to have any evidence at all: the collision case iterates the ids the pattern found, so a series the pattern cannot see is green by construction, which is the silence rather than a weak assertion. It earns no ADR, and the guardrail it earns is the last bullet of `GUARDRAILS.md`: an allowlist is the thing that needs a gate.
- **Landed before it.** This file states current state only and a gate refuses growth, [issue #284](https://github.com/chahyasantoso/motion5/issues/284) by [#285](https://github.com/chahyasantoso/motion5/pull/285). Three sections that grew once per slice left it: the per-slice narrative and the run ids into the pull requests that already owned them, the standing rules into [GUARDRAILS.md](./GUARDRAILS.md), and what a live edit costs into [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md), both moves verbatim and in order.

## Next in line

- **`edit(recipe)` skips the apply against a runtime the recipe disposed.** `dispose` inside a recipe clears the open transaction and empties the retained tracks, so the pair comparison in `edit` then differs and `#apply` runs against a disposed runtime, throwing from the liveness check after its effects have been applied. Found by the immediate-verb slice and deliberately not in it: a refusal and a skipped apply are two invariants with two cases.
- **Make the evidence-id gate refuse what it cannot see.** Two halves, and both are decisions rather than widenings, which is why issue #283 did neither. The pattern is a hand-maintained alternation, so the honest gate finds every `PREFIX-n` title in the tree and refuses a prefix the pattern does not name; a naive scan of that shape reads `T4-n` and `T5-n` as ungated series, and those are the locked plan decisions the `T-` paragraph exists to avoid colliding with, so it needs a stated rule for what is a series and what is a plan id. Separately the scan root stops at `packages/core/test`, and `H-4` is declared in `packages/react/test/public-hook-render.test.ts`, so an id can be duplicated across the two packages without the gate seeing it.

## Open, and not scheduled

- Phase 6 packaging is the phase after this one. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns its scope, and nothing here claims any of it has started.

## Where the rest of it lives

Each of these was in this file once. None of them is now, and every one of them had an owner the whole time.

- **A slice's narrative, and its red and green run ids.** The pull request that landed it, and the ADR that decided it. This was duplicated here for two dozen slices, which is what made the file unreadable; the previous revision's own last bullet already said the pull request was the owner.
- **The standing rules, and the working constraints.** [GUARDRAILS.md](./GUARDRAILS.md).
- **What a caller may do to a loaded project, and what each edit costs.** [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- **What every evidence-case-id series covers.** `packages/core/test/unit/scripts/evidence-case-ids.test.ts` is the one owner of that, and the gate that holds the ids to uniqueness.
- **A citation that points here for one of the above.** ADR-057, ADR-061, ADR-062 and ADR-064, and the docblocks of `mount-flush-seed.test.ts` and `declined-build-write-drop.test.ts`, all cite this file for a standing rule or a run id, because this file carried them when those records were written. They are right about the rule and stale about the address: a standing rule is in [GUARDRAILS.md](./GUARDRAILS.md), a fact about what an edit costs is in [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md), and a run id is in the pull request that landed the slice. One forwarding address in the file every reader lands on, rather than six edits to records that are otherwise correct.
- **How to update this file.** [PR-WORKFLOW.md](./PR-WORKFLOW.md) owns the rule, and it is one line long: replace, do not append.
