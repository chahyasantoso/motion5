# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-05, Asia/Jakarta.
- **Verified on:** `766580f` on `main`, which is [#311](https://github.com/chahyasantoso/motion5/pull/311) merged, plus this slice on top of it. It is the first slice in six to change no file under `packages/core/src` at all.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-068 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** A source region is addressed by its own subject, [issue #314](https://github.com/chahyasantoso/motion5/issues/314). Five evidence cases pinned a member by slicing from its name to the _next_ member's name, so a rename or a reorder that changes no behaviour would have turned them red, and a member declared between the two would have widened the window in silence. The lower bound had already fired: a private name matches every call site too, and `#handle` calls `#writeValues` while being declared earlier, so `LV-5` and `PK-17` were reading a fifteen-member window that contained `#apply` and `#invalidateOne` -- a claim about one invalidate owner, measured across two. `code` was declared four times and `region` three, so `packages/core/test/helpers/source-region.ts` is now the one owner and `region`'s second bound is deleted rather than discouraged. `LV-5`, `PK-17`, `PK-18`, `LV-14`, `SH-7`, `PK-10` and `RA-113` keep every claim and change only their address; `RA-113`'s span becomes one assertion per rung and gains the accepting direction it implied. No file under `packages/core/src` changes. The gate is `source-region-anchors.test.ts`, and the rule is in [TESTING-STRATEGY.md](./TESTING-STRATEGY.md).
- **Landed before it.** A commit in flight refuses re-entry, [issue #307](https://github.com/chahyasantoso/motion5/issues/307) and ADR-068. Every composition hook is caller code, so one can call a structural entry point on the runtime whose commit it is part of: `#commit` found no open transaction, staged from a retained pair that does not carry the outer commit's change, and had its adoption overwritten, leaving a compiled, registered and mounted node that no map and no graph node referred to and nothing would ever dispose. Refused at the one member every structural verb reaches, read after the recipe check, because a commit in flight has already applied effects derived from its pair and cannot honour what `#open` means. `#committing` stays a depth. `RA-118` through `RA-122`.

## Next in line

- **A hook that disposes from a direct write leaves a disposed runtime holding entries.** [Issue #305](https://github.com/chahyasantoso/motion5/issues/305). `#writeValues`, `#recompileKeyframes`, `#setTrigger` and `#setStagger` each call an injected hook and then mutate the retained pair in place, and none reaches `#commit`, so ADR-067's boundary does not see them. A hook that disposes leaves an entry in a map the teardown just cleared, `dispose()` returns early ever after so nothing will clear it, and the compiled Track behind it is never disposed. It also contradicts the invariant `edit` cites in writing. The mechanism exists: ADR-067's deferral is meant to be widened by wrapping a second boundary in it rather than by copying a guard into four members. What is open is what those paths answer, because each returns a `PatchBatch` a caller reads. Re-verified on `766580f`, and it lands on top of the slice above: #314 re-anchored the two cases whose address it moves a statement inside of, so it edits a claim rather than an address.

## Open, and not scheduled

- **The settle phase of `#apply` has no error boundary.** [Issue #306](https://github.com/chahyasantoso/motion5/issues/306). Nothing to do with liveness: `#mountNode` can throw and four of the steps are seams, so a throw escapes after the graph accepted with no revert list. ADR-067 relies on that being a contract, which is why it is filed rather than absorbed.
- **An in-place write from a hook is discarded by the commit that called it.** [Issue #309](https://github.com/chahyasantoso/motion5/issues/309). The same four paths #305 names, and a different mechanism: they never reach `#commit`, so ADR-068's guard cannot see them, and `#adoptMaps` discards what one of them wrote from inside a hook while the mask, the patched timeline and the seam call all stand. `overlay` and `liveWrite` go with it, and a cleared overlay over a still-patched timeline is the freeze ADR-066 refuses.
- **A flush from inside a commit publishes against the graph it is replacing.** [Issue #310](https://github.com/chahyasantoso/motion5/issues/310). `seek`, `invalidate` and both live writes end at their own `invalidate`, and `#refuseInsideRecipe` cannot see a commit, so from a hook the batch is derived from the graph the commit is about to replace. `samePatch` then drops the commit's own publication rather than adding to it, which is run 33712936651's mechanism from the other side.
- Phase 6 packaging is the phase after this one. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns its scope, and nothing here claims any of it has started.

## Where the rest of it lives

Each of these was in this file once. None of them is now, and every one of them had an owner the whole time.

- **A slice's narrative, and its red and green run ids.** The pull request that landed it, and the ADR that decided it. This was duplicated here for two dozen slices, which is what made the file unreadable; the previous revision's own last bullet already said the pull request was the owner.
- **The standing rules, and the working constraints.** [GUARDRAILS.md](./GUARDRAILS.md).
- **What a caller may do to a loaded project, and what each edit costs.** [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- **What every evidence-case-id series covers.** `packages/core/test/unit/scripts/evidence-case-ids.test.ts` is the one owner of that, and the gate that holds the ids to uniqueness.
- **A citation that points here for one of the above.** ADR-057, ADR-061, ADR-062 and ADR-064, and the docblocks of `mount-flush-seed.test.ts` and `declined-build-write-drop.test.ts`, all cite this file for a standing rule or a run id, because this file carried them when those records were written. They are right about the rule and stale about the address: a standing rule is in [GUARDRAILS.md](./GUARDRAILS.md), a fact about what an edit costs is in [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md), and a run id is in the pull request that landed the slice.
- **How to update this file.** [PR-WORKFLOW.md](./PR-WORKFLOW.md) owns the rule, and it is one line long: replace, do not append.
