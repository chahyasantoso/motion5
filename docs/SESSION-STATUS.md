# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-04, Asia/Jakarta.
- **Verified on:** `bbbb314` on `main`, which is [#297](https://github.com/chahyasantoso/motion5/pull/297) merged, plus this slice on top of it. It is the second slice in a row to change runtime behaviour, after a stretch from `ebad1ab`, [#282](https://github.com/chahyasantoso/motion5/pull/282), through `0e268ad` in which nothing reached `packages/core/src` at all: that stretch was this file's own shape, two evidence gates, and prose.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-066 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** A handle write reports the disposal rather than the staleness, [issue #298](https://github.com/chahyasantoso/motion5/issues/298). ADR-056 decided that a disposed runtime outranks a stale handle and named `TrackHandle.remove` as where that shows, and it showed there because `#removeTrack` asked `#assertLive` itself. Asking it was every caller's job, so seventeen of the eighteen handle members that write never did, and because `dispose` empties the retained maps the token lookup missed and each of them reported the disposal as `StaleTrackHandleError` or `StaleMotionHandleError`: one condition with two public failure contracts, and a caller invited to re-resolve a handle against a project that no longer exists. Three members now own that order, `#writableEntry`, `#writableMotion` and `#writableId`, one rung above the resolvers they delegate to, so every writing path asks liveness before the lookup while every reading member keeps the stale-handle family ADR-056 asked callers to catch. `#removeTrack`'s own guard is deleted rather than kept beside them. `SH-8` and `RA-111` are the red cases, each a writers-and-readers partition of the member record its own file already owns, and [GUARDRAILS.md](./GUARDRAILS.md) gains the rule that a precondition outranking a lookup belongs to the resolver both readers share.
- **Landed before it.** `edit(recipe)` answers a runtime the recipe disposed, [issue #288](https://github.com/chahyasantoso/motion5/issues/288). `edit` asserted liveness on entry, handed control to a recipe ADR-064's amendment deliberately leaves able to call `dispose()`, and then wrote, so the assertion was stale at the write. A recipe that staged nothing was already correct, answered by identity because `dispose` clears the retained maps in place; a recipe that staged something first was not, and it was worse than a wrong message. The derivation read the staged copy against a map `dispose` had just emptied, so every track in the project read as newly added: one `addTrack` bought a `compileTrack` for all of them, `replaceGraph` then refused on `GraphRuntime`'s own liveness check, and the rollback handed the composition a `disposeTrack` for each on the way out, with `Error: GraphRuntime is disposed.` reaching the caller in place of the recipe's answer. `edit` now re-asks liveness after the recipe returned and before the write, and answers rather than refuses, because a recipe tearing the project down from its own `catch` is the path `dispose` stays reachable for. It also routes through `#commit` instead of `#apply`, which makes that member's claim to be the one path to the graph true and leaves the liveness answer one reader. `RA-109` is the red case, `RA-110` pins the rejected refusal, and [GUARDRAILS.md](./GUARDRAILS.md) gains the rule that a precondition asserted before a callback is not a precondition on what follows it.

## Next in line

- **A read through a handle still reports a disposed runtime as a stale handle.** `definition`, `requires`, `trackIds`, `track` and `tryTrack` answer `StaleTrackHandleError` or `StaleMotionHandleError` on a disposed runtime, and #298's slice pinned that in `SH-8` and `RA-111` rather than leaving it undecided: ADR-056's amendment argues the read is telling the truth, because the entry the handle captured is gone, and that widening it would push a bare `Error` past every narrowing that record asked callers to write. What is genuinely open is which side `MotionHandle.track` and `tryTrack` belong on, because they resolve a handle rather than write through one, and no case draws that line today. Captured 2026-09-04, verified on `bbbb314` on `main` plus #298's slice.

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
