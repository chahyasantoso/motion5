# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-05, Asia/Jakarta.
- **Verified on:** `e3ee26f` on `main`, which is [#304](https://github.com/chahyasantoso/motion5/pull/304) merged, plus this slice on top of it. It is the fifth slice in a row to change `packages/core/src`.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-068 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** One commit at a time, [issue #307](https://github.com/chahyasantoso/motion5/issues/307) and ADR-068. Every composition hook is caller code, so one can call a structural entry point on the runtime whose commit it is part of. `#commit` found no open transaction, applied immediately nested inside the outer `#apply`, and staged from the retained pair, which does not carry the outer commit's staged change: both commits adopted their own pair, the outer one won, and the inner change was lost from the graph and from both maps while its Track stayed compiled, registered with its Motion and mounted, with nothing left that would ever dispose it. Refused rather than merged: a commit in flight holds its pair in a local and has already applied effects derived from it, so it cannot honour what `#open` means, and reusing that field would give one accessor two incompatible meanings. One guard, in the one member every structural verb reaches, read after the recipe check so a recipe opened inside a hook stages as usual and is refused once when it applies. `#committing` stays a depth. `RA-118` through `RA-121` are red, `RA-122` is the accepting direction and green on both sides.
- **Landed before it.** A commit boundary owns the teardown a hook asked for, [issue #303](https://github.com/chahyasantoso/motion5/issues/303) and ADR-067. `dispose()` released the graph and the composition where it was called, so a hook that disposed mid-commit left the rollback handing a torn-down host the inverses of effects it had just applied, and `Error: GraphRuntime is disposed.` reached the caller. It now owns the decision to release rather than the release: it refuses from the line it was called on, and `#teardown` runs once at `#apply`'s `finally`, after the rollback and after the settle phase, which is deliberately unguarded because half a phase with no revert leaks a staged Track. `RA-114` through `RA-117`.

## Next in line

- **A hook that disposes from a direct write leaves a disposed runtime holding entries.** [Issue #305](https://github.com/chahyasantoso/motion5/issues/305). `#writeValues`, `#recompileKeyframes`, `#setTrigger` and `#setStagger` each call an injected hook and then mutate the retained pair in place, and none reaches `#commit`, so ADR-067's boundary does not see them. A hook that disposes leaves an entry in a map the teardown just cleared, `dispose()` returns early ever after so nothing will clear it, and the compiled Track behind it is never disposed. It also contradicts the invariant `edit` cites in writing. The mechanism exists: ADR-067's deferral is meant to be widened by wrapping a second boundary in it rather than by copying a guard into four members. What is open is what those paths answer, because each returns a `PatchBatch` a caller reads. Captured 2026-09-05, verified on `b1f9e59` plus this slice.

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
