# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-05, Asia/Jakarta.
- **Verified on:** `4f3e64c` on `main`, which is ADR-070 shipped and [issue #310](https://github.com/chahyasantoso/motion5/issues/310) closed, with this slice stacked on it.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-070 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** A reentrancy refusal out-ranks the entry it resolves, [issue #309](https://github.com/chahyasantoso/motion5/issues/309) and ADR-070's amendment. ADR-070's rung already refused all four in-place write paths, so the three consequences that issue is named for -- a retained definition the composition has moved past, a cleared overlay over a still-patched timeline, and a deleted `liveWrite` -- were already unreachable rather than repaired, and what was left was the order. `#writeValues` took a resolved entry, an argument expression is evaluated before the member that would refuse it, and `#setKeyframe` and `#removeKeyframe` resolved one line early, so a write aimed at the node an in-flight commit was compiling read `Unknown graph node "x"`, which is false, because that node exists and is compiled in a map the caller cannot see, and one through a retired handle read a staleness that is true of the handle and is not why the call may not run. `#writeValues` takes a thunk and resolves inside its boundary, the two recompile entry points ask the rung one line up, and tier 0's order is now all four members'. Zero copies of a condition added, one parameter's type changed, one existing call moved twice, and the invariant that lets `#adoptMaps` assign unconditionally is written down for the first time. `RA-138` is the one red case; `RA-136`, `RA-137` and `RA-139` are green on both sides with the file saying why. `RA-136` through `RA-139`.
- **Landed before it.** One rung for a callback's reentrancy, [issue #310](https://github.com/chahyasantoso/motion5/issues/310) and ADR-070. `seek`, `invalidate`, both live writes and both authored-property recompiles end at `#graph.invalidate(...)`, and the rung refusing them inside a recipe read `#open`, which is `undefined` by construction throughout `#apply`. So a hook a commit called could publish: its seeds were resolved against the graph the commit had not replaced yet, a `seek` on the node being replaced published the displaced Track's values because `staged.commit()` is a settle step, and `samePatch` then dropped a candidate, so the publication in front took the commit's own flush rather than adding to it and `addTrack`'s caller read a graph that changed and a `touched` list that published nothing. `#refuseInsideRecipe` becomes `#refuseReentrant` and gains one line: "a recipe is open" and "a commit is in flight" are one rung at the same ten call sites rather than two guards ordered ten times, and the refusal is ADR-068's `schema-commit-reentrant` unchanged, so nothing anchored on that string moved. The condition set grew and the call site set did not, so `mount` and `unmount` from a hook are covered for free, which removes one reachable cause of a throwing settle step without touching #306's boundary. `#inFlight` is provably zero or one again and stays a counter. One added line in one member. `RA-131` through `RA-135`.

## Next in line

- **The settle phase of `#apply` has no error boundary.** [Issue #306](https://github.com/chahyasantoso/motion5/issues/306). `#mountNode` can throw and four of the steps are seams, so a throw escapes after the graph accepted, with no revert list and nothing to unwind what the phase had already produced. ADR-067 and ADR-069 both rely on that phase completing, which is what promotes it from an assumption to a requirement, and it now has two records depending on it rather than one. It reserves `RA-126` onward.

## Open, and not scheduled

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
