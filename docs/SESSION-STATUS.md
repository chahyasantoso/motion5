# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-18, Asia/Jakarta.
- **Read against:** `6cc4e1fd57722889380e0bbded3b4c4eaa568dd7`, which is the head this rewrite was verified at rather than the head it publishes on; that one belongs to its own pull request, with the exact CI and operation evidence. See ADR-095.

## Now

- **Both halves of the runtime redesign are on `main`, and the live area is the quality pass over them:** [#443](https://github.com/chahyasantoso/motion5/issues/443) landed in two halves, so the whole `runtime` folder now states its refusals, results, lifecycle, live writes, authored edits, commit effects, host seams, capability handles, publisher outcomes, registry phase, ordered steps and publication requests as branded unions read by total switches, ADR-094 records it, and no export of `packages/core` moved. Open in review on top of that is one pass closing three findings against it, each of which was one question with two answers. `report.ts` declares `describeWithCauses` beside the imported `describeError` its leaf case delegates to, so the folder no longer holds two functions of one name and no diagnostic message moves. `undeliverable` keeps the handover failure of the newest report the trace retains, so a nested sink failure is no longer overwritten by the outer one unwinding behind it. `deferredScheduler` answers one identity for one condition: a port that runs the callback inline and then throws its own error is answered with the refusal, carrying that error as its `cause`. The status gate reads one normalised subject in both the entry count and the label rule, so a label hidden behind an HTML comment or a character reference is refused rather than rendered. `adr-integrity.test.ts` gives ADR-093's one-file-per-number invariant a mechanism and resolves every relative record link in `docs/`. ADR-095 and ADR-096 record the decisions, with markers on ADR-085, ADR-089, ADR-091, ADR-093 and ADR-094, and the record corrections [#441](https://github.com/chahyasantoso/motion5/issues/441) asked for are in `docs/README.md` and ADR-092. It is not merged, and the runs that measured it belong to that pull request.

## Next in line

- **The mutation baseline [#419](https://github.com/chahyasantoso/motion5/issues/419) is owed and nothing else is queued:** the `mutate` list names `graph-runtime-state.ts` and `ports/scheduler.ts` on `main`, [#445](https://github.com/chahyasantoso/motion5/pull/445) adds `report.ts`, `registry-phase.ts` and `publish-request.ts` while `diagnostic-report.ts` leaves the list with the module it named, the modules both halves of [#443](https://github.com/chahyasantoso/motion5/issues/443) created are otherwise still absent from it, and no Stryker run is reported before or after any of that widening, so `break` at 65.42 is an honestly stale number rather than a measured one. The next slice measures it and re-pins the thresholds in the pull request that measures them; [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) owns that rule and says never to move a threshold to keep a run green. Not started, and no run is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- [Issue #411](https://github.com/chahyasantoso/motion5/issues/411) stays open on a recorded refusal rather than a fix: a drain replays at the frame it deferred, so the assertion it recommends cannot distinguish the two implementations it is about. `deferred-frame-loss.test.ts` says what each of its cases actually pins, and #417's unreached-frame case is the witness it asked for.
- [Issue #349](https://github.com/chahyasantoso/motion5/issues/349) holds the 2D IK/FK contract study that precedes any separate 3D plugin.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
