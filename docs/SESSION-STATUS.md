# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-04, Asia/Jakarta.
- **Verified on:** `5d67749` on `main`, which is [#295](https://github.com/chahyasantoso/motion5/pull/295) merged, plus this slice's test-file cleanup on top of it. Runtime behaviour is unchanged since `ebad1ab`, [#282](https://github.com/chahyasantoso/motion5/pull/282): the slices after it are this file's own shape, two evidence gates, and prose, and none of them reaches `packages/core/src`.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-066 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** The signal seams reference the shipped members, [issue #260](https://github.com/chahyasantoso/motion5/issues/260). `immediate-verb-refusal.test.ts` declared `SignalSeam` and `SignalMotionOption` locally, under a docblock promising the commit that landed the source would delete them, and both `ProjectRuntime.signal` and `ProjectRuntimeOptions.signalMotion` have been real members since ADR-064's amendment. The aliases were not merely dead indirection: `signalling()` cast to a hand-written `signal` shape and the rig cast its options through a hand-written `signalMotion` shape, so `typecheck` checked both against the alias rather than against the declared member, and a signature change on either could not have turned this file red. Both aliases and both casts are deleted and the seam assertion stays, on `editing()`'s rule that failing-first means a failing assertion rather than a call that could not run. No behaviour and no new case: `RA-83` owns `signal` in both directions and is unchanged, and what the slice buys is measured by `quality` instead.
- **Landed before it.** The alternation's ordering has one owner and a true reason, [issue #294](https://github.com/chahyasantoso/motion5/issues/294). Fourteen series paragraphs in `evidence-case-ids.test.ts` each claimed its own place in the pattern was forced, because an alternation offering the single letter first would match it and then fail, and `AE-` inherited the claim as the one widening with no ordering hazard to avoid. Every alternative is followed by the same hyphen-and-digits suffix, so the engine retries the next alternative at the same position and `CF-3` matches whichever way round `C` and `CF` are written: all sixteen two-letter-and-initial pairs the pattern carries are free. The fifteen claims are deleted and one paragraph beside the pattern owns the ordering, so a series paragraph now says what its series owns and nothing about where it sorts. Comment and status only, no behaviour, and it earns no ADR: the gate's own header owns the pattern.

## Next in line

- **`edit(recipe)` skips the apply against a runtime the recipe disposed.** `dispose` inside a recipe clears the open transaction and empties the retained tracks, so the pair comparison in `edit` then differs and `#apply` runs against a disposed runtime, throwing from the liveness check after its effects have been applied. Found by the immediate-verb slice and deliberately not in it: a refusal and a skipped apply are two invariants with two cases.

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
