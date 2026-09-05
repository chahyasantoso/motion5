# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-05, Asia/Jakarta.
- **Verified on:** `766580f` on `main`, which is [#311](https://github.com/chahyasantoso/motion5/pull/311) merged, plus [#315](https://github.com/chahyasantoso/motion5/pull/315) and this slice stacked on it in that order.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-069 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** A direct write is a boundary too, [issue #305](https://github.com/chahyasantoso/motion5/issues/305) and ADR-069. `#writeValues`, `#recompileKeyframes`, `#setTrigger` and `#setStagger` each call an injected seam and then mutate the retained pair in place, and none reaches `#commit`, so ADR-067's deferral could not see them: a seam that disposed left an entry in a map the teardown had just cleared, with `dispose()` returning early ever after so nothing would clear it and nothing would release the Track the escalation built. Tier 2 reported `GraphRuntime is disposed.` from the layer that noticed; tier 0 reported nothing at all and answered success. One condition, two contracts. All four now run at the same in-flight depth a commit uses: the write completes its phase, skips its flush, and reports `ProjectRuntime is disposed.` once, with the release drained at the boundary afterwards. `#committing` becomes `#inFlight` because five members read it, the raise and the drain move into one `#boundary` member rather than four copies of `#apply`'s `finally`, and `#writeValues` loses its inline flush to `#invalidateOne`, which owns the skip and the report in one statement. Sharing the counter widens `schema-commit-reentrant` to a structural verb called from inside those seams, which `RA-125` pins as a decision. `LV-15` through `LV-17` and `RA-123` through `RA-125`.
- **Landed before it.** A source region is addressed by its own subject, [issue #314](https://github.com/chahyasantoso/motion5/issues/314). Five evidence cases sliced from one member's name to the _next_ member's name, and the lower bound had already fired: a private name matches every call site, so `LV-5` and `PK-17` were reading a fifteen-member window and measuring a one-owner claim across two owners. `packages/core/test/helpers/source-region.ts` is the one owner now, `region`'s second bound is deleted rather than discouraged, every claim is kept, and the gate is `source-region-anchors.test.ts`.

## Next in line

- **The settle phase of `#apply` has no error boundary.** [Issue #306](https://github.com/chahyasantoso/motion5/issues/306). `#mountNode` can throw and four of the steps are seams, so a throw escapes after the graph accepted, with no revert list and nothing to unwind what the phase had already produced. ADR-067 and ADR-069 both rely on that phase completing, which is what promotes it from an assumption to a requirement, and it now has two records depending on it rather than one. It reserves `RA-126` onward.

## Open, and not scheduled

- **An in-place write from a hook is discarded by the commit that called it.** [Issue #309](https://github.com/chahyasantoso/motion5/issues/309). The same four paths #305 names, and a different mechanism: they never reach `#commit`, so ADR-068's guard cannot see them, and `#adoptMaps` discards what one of them wrote from inside a hook while the mask, the patched timeline and the seam call all stand. `overlay` and `liveWrite` go with it, and a cleared overlay over a still-patched timeline is the freeze ADR-066 refuses.
- **A flush from inside a commit publishes against the graph it is replacing.** [Issue #310](https://github.com/chahyasantoso/motion5/issues/310). `seek`, `invalidate` and both live writes end at their own `invalidate`, and `#refuseInsideRecipe` cannot see a commit, so from a hook the batch is derived from the graph the commit is about to replace. `samePatch` then drops the commit's own publication rather than adding to it, which is run 33712936651's mechanism from the other side. ADR-069 sharpened it rather than touching it: a direct write called from a commit hook now raises the in-flight depth to two, so this is the one reachable path on which that depth is greater than one.
- Phase 6 packaging is the phase after this one. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns its scope, and nothing here claims any of it has started.

## Where the rest of it lives

Each of these was in this file once. None of them is now, and every one of them had an owner the whole time.

- **A slice's narrative, and its red and green run ids.** The pull request that landed it, and the ADR that decided it. This was duplicated here for two dozen slices, which is what made the file unreadable; the previous revision's own last bullet already said the pull request was the owner.
- **The standing rules, and the working constraints.** [GUARDRAILS.md](./GUARDRAILS.md).
- **What a caller may do to a loaded project, and what each edit costs.** [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- **What every evidence-case-id series covers.** `packages/core/test/unit/scripts/evidence-case-ids.test.ts` is the one owner of that, and the gate that holds the ids to uniqueness.
- **A citation that points here for one of the above.** ADR-057, ADR-061, ADR-062 and ADR-064, and the docblocks of `mount-flush-seed.test.ts` and `declined-build-write-drop.test.ts`, all cite this file for a standing rule or a run id, because this file carried them when those records were written. They are right about the rule and stale about the address: a standing rule is in [GUARDRAILS.md](./GUARDRAILS.md), a fact about what an edit costs is in [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md), and a run id is in the pull request that landed the slice.
- **How to update this file.** [PR-WORKFLOW.md](./PR-WORKFLOW.md) owns the rule, and it is one line long: replace, do not append.
