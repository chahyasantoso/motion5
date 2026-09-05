# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-05, Asia/Jakarta.
- **Verified on:** `b1f9e59` on `main`, which is [#302](https://github.com/chahyasantoso/motion5/pull/302) merged, plus this slice on top of it. It is the fourth slice in a row to change `packages/core/src`.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-067 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** A commit boundary owns the teardown a hook asked for, [issue #303](https://github.com/chahyasantoso/motion5/issues/303) and ADR-067. Every composition hook is caller code, so any of them can call `dispose()` from inside the commit it is part of, and `dispose()` released the graph and the composition where it was called. So the rollback handed a torn-down host the inverses of effects it had just applied, every effect after the disposing one built against a host nothing would ask again, and `Error: GraphRuntime is disposed.` reached the caller: #288's defect one indirection further in. From a settle step it was worse, because that phase runs outside the try, so the throw escaped with the commit already adopted and no rollback list at all. `dispose()` now owns the decision to release rather than the release: it refuses from the line it was called on, and `#teardown` runs once at `#apply`'s `finally`, after the rollback and after the settle phase, so the unwind always reaches a live graph. The settle loop is deliberately unguarded, because a settle step has no revert and half a phase leaks a staged Track. `#liveOf` gains one term so the window is not observable as a live runtime. `RA-114`, `RA-115` and `RA-117` are red, `RA-116` is the lie detector for the deferral.
- **Landed before it.** A handle read reports the staleness by decision, and the order it reports it in has one owner, [issue #300](https://github.com/chahyasantoso/motion5/issues/300). Whether `MotionHandle.definition`, `trackIds`, `track` and `tryTrack` answer `StaleMotionHandleError` after `dispose()` by decision or by leftover was open, and it is by decision: the entry the handle captured is gone, and a plain disposal error would walk past every narrowing on `StaleHandleError` ADR-056 exists for. What was a leftover is the ordering, because three refusals are reachable from one `track(trackId)` call and both lookups nested the resolve inside the qualification inside the delegate. `#liveChildNode` owns it now, on the reading ladder and carrying no `#assertLive`. `RA-113` is the red case and `RA-112` owns the contract.

## Next in line

- **A hook that disposes from a direct write leaves a disposed runtime holding entries.** [Issue #305](https://github.com/chahyasantoso/motion5/issues/305). `#writeValues`, `#recompileKeyframes`, `#setTrigger` and `#setStagger` each call an injected hook and then mutate the retained pair in place, and none reaches `#commit`, so ADR-067's boundary does not see them. A hook that disposes leaves an entry in a map the teardown just cleared, `dispose()` returns early ever after so nothing will clear it, and the compiled Track behind it is never disposed. It also contradicts the invariant `edit` cites in writing. The mechanism exists: ADR-067's deferral is meant to be widened by wrapping a second boundary in it rather than by copying a guard into four members. What is open is what those paths answer, because each returns a `PatchBatch` a caller reads. Captured 2026-09-05, verified on `b1f9e59` plus this slice.

## Open, and not scheduled

- **The settle phase of `#apply` has no error boundary.** [Issue #306](https://github.com/chahyasantoso/motion5/issues/306). Nothing to do with liveness: `#mountNode` can throw and four of the steps are seams, so a throw escapes after the graph accepted with no revert list. ADR-067 relies on that being a contract, which is why it is filed rather than absorbed.
- **`#commit` has no reentrancy guard, only a recipe guard.** [Issue #307](https://github.com/chahyasantoso/motion5/issues/307). A hook that calls a structural entry point re-enters `#apply`, stages from a pair lacking the outer commit's change, and has its adoption overwritten: a lost update, with a compiled and mounted node nothing refers to. ADR-067's `#committing` makes the state observable, so what is left is the decision.
- Phase 6 packaging is the phase after this one. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns its scope, and nothing here claims any of it has started.

## Where the rest of it lives

Each of these was in this file once. None of them is now, and every one of them had an owner the whole time.

- **A slice's narrative, and its red and green run ids.** The pull request that landed it, and the ADR that decided it. This was duplicated here for two dozen slices, which is what made the file unreadable; the previous revision's own last bullet already said the pull request was the owner.
- **The standing rules, and the working constraints.** [GUARDRAILS.md](./GUARDRAILS.md).
- **What a caller may do to a loaded project, and what each edit costs.** [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- **What every evidence-case-id series covers.** `packages/core/test/unit/scripts/evidence-case-ids.test.ts` is the one owner of that, and the gate that holds the ids to uniqueness.
- **A citation that points here for one of the above.** ADR-057, ADR-061, ADR-062 and ADR-064, and the docblocks of `mount-flush-seed.test.ts` and `declined-build-write-drop.test.ts`, all cite this file for a standing rule or a run id, because this file carried them when those records were written. They are right about the rule and stale about the address: a standing rule is in [GUARDRAILS.md](./GUARDRAILS.md), a fact about what an edit costs is in [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md), and a run id is in the pull request that landed the slice.
- **How to update this file.** [PR-WORKFLOW.md](./PR-WORKFLOW.md) owns the rule, and it is one line long: replace, do not append.
