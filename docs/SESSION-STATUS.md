# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-05, Asia/Jakarta.
- **Verified on:** `f133624` on `main`, which is [#299](https://github.com/chahyasantoso/motion5/pull/299) merged, plus this slice on top of it. It is the third slice in a row to change `packages/core/src`, after a stretch from `ebad1ab`, [#282](https://github.com/chahyasantoso/motion5/pull/282), through `0e268ad` in which nothing did.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-066 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** A handle read reports the staleness by decision, and the order it reports it in has one owner, [issue #300](https://github.com/chahyasantoso/motion5/issues/300). ADR-056's amendment argued the read half in prose and #298's cases measured it as an aside, so whether `MotionHandle.definition`, `trackIds`, `track` and `tryTrack` answer `StaleMotionHandleError` after `dispose()` by decision or by leftover was open. By decision: the entry the handle captured is gone, so the read is accurate, and a plain disposal error would walk past every narrowing on `StaleHandleError` that record exists for. What was a leftover is the ordering. Three refusals are reachable from one `track(trackId)` call, the Motion, the child name and the child itself, and both lookups nested the resolve inside the qualification inside the delegate, so which one answered first was a fact about argument evaluation rather than a decision, written twice and owned by nothing. `#liveChildNode` owns it now, on the reading ladder beside `#liveId` and deliberately carrying no `#assertLive`, because `live` reads the same members and may never throw. `RA-113` is the red case and `RA-112` owns the contract, green on either side because no behaviour moved.
- **Landed before it.** A handle write reports the disposal rather than the staleness, [issue #298](https://github.com/chahyasantoso/motion5/issues/298). Asking `#assertLive` was every caller's job, so seventeen of the eighteen writing members never did, and because `dispose` empties the retained maps the token lookup missed and each reported the disposal as a stale handle: one condition with two public failure contracts. `#writableEntry`, `#writableMotion` and `#writableId` own that order now, one rung above the resolvers they delegate to, and `#removeTrack`'s own guard is deleted rather than kept beside them. `SH-8` and `RA-111` are the red cases, and [GUARDRAILS.md](./GUARDRAILS.md) gains the rule that a precondition outranking a lookup belongs to the resolver both readers share.

## Next in line

- **A hook that disposes the runtime from inside a commit is named and not covered.** `#apply` applies every effect inside its try, and an effect calls a composition hook, which is caller code and may call `dispose()` before the graph is asked to accept the candidate. The class documents that as out of scope rather than handled, and it is a narrower gap than it was: the three writing rungs and `edit`'s re-ask together mean no caller can enter `#apply` on a runtime that is already disposed, which is a different claim from surviving one that dies halfway through. Nothing is filed for it, and it wants a case before it wants a fix, because what a mid-commit disposal leaves behind is undescribed rather than known to be wrong. Captured 2026-09-05, verified on `f133624` on `main` plus this slice.

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
