# Session status

Current state only: where the work is, what the next implementor picks up, and what is open. The four sections below are the whole file, and it is **rewritten rather than appended to** -- an entry replaces the entry it makes stale instead of sitting beside it.

`packages/core/test/unit/scripts/session-status-shape.test.ts` holds this file to that section list and to a byte ceiling, so a log that starts growing here fails `CI` on its heading before it fails on its size. [Issue #284](https://github.com/chahyasantoso/motion5/issues/284) is why that gate exists: this file reached 99,180 bytes while its own first paragraph called it deliberately small, because every pull request is asked to update the status and "update" reads as "append" when nothing refuses a second entry.

Nothing else in this repository may claim what has landed. A plan, an audit, or an ADR describes intent unless this file says it shipped.

- **Captured:** 2026-09-06, Asia/Jakarta.
- **Verified on:** `49f30a4` on `main`, after [#325](https://github.com/chahyasantoso/motion5/pull/325) and [#326](https://github.com/chahyasantoso/motion5/pull/326) were merged in order. The issue #317 work below is on its own branch and is not claimed shipped.
- **Phase:** live editing of a loaded project. Every decision ADR-028 through ADR-070 records is shipped. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) is what a caller may do with that and what each edit pays for, and [GUARDRAILS.md](./GUARDRAILS.md) is the standing rules a slice is held to.
- **Earlier history:** the long-form narrative through 2026-09-03 is this path at `ebad1ab`. It is not copied into `archived/`, because git already holds it whole: read this path at that ref.

## Now

This section names the slice that just landed and the one before it. A third entry is the thing this file stopped being.

- **Just landed.** Direct-write staging refusal is distinct from accepted finalization, [issue #313](https://github.com/chahyasantoso/motion5/issues/313), [PR #326](https://github.com/chahyasantoso/motion5/pull/326). Accepted direct writes complete finalization, re-seek, and publication attempts; refused stages do not adopt candidate definitions. The PR owns the exact guarantees, limits, and measured evidence.
- **Landed before it.** One teardown owner attempts every independent release and preserves the operation already unwinding, [issue #312](https://github.com/chahyasantoso/motion5/issues/312), [PR #325](https://github.com/chahyasantoso/motion5/pull/325). Direct failures remain reportable and release diagnostics are bounded. The PR owns the detailed evidence.

## Next in line

- **Source-evidence correctness is being implemented on its own branch, not merged.** [Issue #317](https://github.com/chahyasantoso/motion5/issues/317), [PR #327](https://github.com/chahyasantoso/motion5/pull/327). One test helper owns syntax projections, declaration bounds, and direct-call locations; existing owning tests keep their claims. The PR owns implementation status and red/green run evidence.

## Open, and not scheduled

- Phase 6 packaging is the phase after this one. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns its scope, and nothing here claims any of it has started.

## Where the rest of it lives

Each of these was in this file once. None of them is now, and every one of them had an owner the whole time.

- **A slice's narrative, and its red and green run ids.** The pull request that landed it, and the ADR that decided it. This was duplicated here for two dozen slices, which is what made the file unreadable; the previous revision's own last bullet already said the pull request was the owner.
- **The standing rules, and the working constraints.** [GUARDRAILS.md](./GUARDRAILS.md).
- **What a caller may do to a loaded project, and what each edit costs.** [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- **What every evidence-case-id series covers.** `packages/core/test/unit/scripts/evidence-case-ids.test.ts` is the one owner of that, and the gate that holds the ids to uniqueness.
- **A citation that points here for one of the above.** ADR-057, ADR-061, ADR-062 and ADR-064, and the docblocks of `mount-flush-seed.test.ts` and `declined-build-write-drop.test.ts`, all cite this file for a standing rule or a run id, because this file carried them when those records were written. They are right about the rule and stale about the address: a standing rule is in [GUARDRAILS.md](./GUARDRAILS.md), a fact about what an edit costs is in [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md), and a run id is in the pull request that landed the slice.
- **How to update this file.** [PR-WORKFLOW.md](./PR-WORKFLOW.md) owns the rule, and it is one line long: replace, do not append.
