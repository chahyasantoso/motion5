# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-06, Asia/Jakarta.
- **Verified on:** `e0b5ad2` on `main`, with [#321](https://github.com/chahyasantoso/motion5/pull/321) and [#322](https://github.com/chahyasantoso/motion5/pull/322) squash-merged. The issue #306 work below is on its own branch and is not claimed shipped.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-070 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** Reentrancy refusal precedes entry resolution on the in-place write paths, [issue #309](https://github.com/chahyasantoso/motion5/issues/309), [PR #322](https://github.com/chahyasantoso/motion5/pull/322), and [ADR-070's amendment](./ADR-070-one-reentrancy-rung.md). `#writeValues` resolves lazily after the shared rung; keyframe entry points refuse before lookup. Evidence: `RA-136` through `RA-139`. The PR owns the narrative and measured red/green results.
- **Landed before it.** One shared callback-reentrancy rung, [issue #310](https://github.com/chahyasantoso/motion5/issues/310) and [ADR-070](./ADR-070-one-reentrancy-rung.md). Publishing and mounting verbs refuse callback re-entry through `#refuseReentrant`; the commit's private mount and flush remain legal. `#inFlight` stays a counter. Evidence: `RA-131` through `RA-135`.

## Next in line

- **Settle completion and post-commit failure preservation are implemented on this branch, not merged.** [Issue #306](https://github.com/chahyasantoso/motion5/issues/306), [PR #323](https://github.com/chahyasantoso/motion5/pull/323), ADR-071. Every settle step is attempted, then the non-disposed, nonempty publication, and failures are reported together without rolling back the accepted pair. `RA-126` through `RA-130` and the adjacent boundary cases own the evidence. Review and CI completion precede a merge; the PR owns their live status.

## Open, and not scheduled

- **Deferred teardown can replace the outcome it follows.** [Issue #312](https://github.com/chahyasantoso/motion5/issues/312). A throwing release still runs outside the settlement collector; its cleanup completeness and error precedence remain separate from #306.

- **A failing seam in a direct write leaves the retained entry moved and the compiled Track neither committed nor rolled back.** [Issue #313](https://github.com/chahyasantoso/motion5/issues/313). The third and last mechanism on the same four members, after the disposal #305 answered and the adoption #309 answered, and the one neither the boundary nor the rung can see: `#writeValues`' escalation and `#recompileKeyframes`' `staged.commit()` both run after the retained entry has moved, on paths that never reach `#apply`. Two of the four ask a seam after the point of no return and two ask it before, for one condition, so a `stageTrack` or a `commit()` that throws leaves the retained entry claiming a rebase, an overlay and a `liveWrite` the composition never took, and a staged Track nothing holds. It reorders the tails #309 changed the signature of, so it lands after it.
- Phase 6 packaging is the phase after this one. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns its scope, and nothing here claims any of it has started.

## Where the rest of it lives

Each of these was in this file once. None of them is now, and every one of them had an owner the whole time.

- **A slice's narrative, and its red and green run ids.** The pull request that landed it, and the ADR that decided it. This was duplicated here for two dozen slices, which is what made the file unreadable; the previous revision's own last bullet already said the pull request was the owner.
- **The standing rules, and the working constraints.** [GUARDRAILS.md](./GUARDRAILS.md).
- **What a caller may do to a loaded project, and what each edit costs.** [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- **What every evidence-case-id series covers.** `packages/core/test/unit/scripts/evidence-case-ids.test.ts` is the one owner of that, and the gate that holds the ids to uniqueness.
- **A citation that points here for one of the above.** ADR-057, ADR-061, ADR-062 and ADR-064, and the docblocks of `mount-flush-seed.test.ts` and `declined-build-write-drop.test.ts`, all cite this file for a standing rule or a run id, because this file carried them when those records were written. They are right about the rule and stale about the address: a standing rule is in [GUARDRAILS.md](./GUARDRAILS.md), a fact about what an edit costs is in [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md), and a run id is in the pull request that landed the slice.
- **How to update this file.** [PR-WORKFLOW.md](./PR-WORKFLOW.md) owns the rule, and it is one line long: replace, do not append.
