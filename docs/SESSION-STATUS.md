# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-18, Asia/Jakarta.
- **Inspected main:** `c967af4c5e297a68f2d4d37fe013d7436faa0d7c`, after [#444](https://github.com/chahyasantoso/motion5/pull/444). Exact CI and operation evidence belong to their PRs.

## Now

- **The last of the runtime folder is open in review as closed values, and its decision record is the last thing it owed:** [#443](https://github.com/chahyasantoso/motion5/issues/443) lands in two halves and the first is on `main`. [#444](https://github.com/chahyasantoso/motion5/pull/444) carried all eight steps of the project runtime's own conversion, so `refusal.ts`, `results.ts`, `project-phase.ts`, `value-state.ts`, `authoring-edit.ts`, `commit-plan.ts`, `run-plan.ts`, `project-ports.ts` and `project-handles.ts` state that runtime's refusals, decoded results, lifecycle, live writes, authored edits, commit effects, host seams and capability handles as branded unions read by total switches, and no export of `packages/core` moved. What is not on `main` is [#445](https://github.com/chahyasantoso/motion5/pull/445), which holds steps 9 through 13 and converts the rest of the folder. `publisher-outcome.ts` and `publisher-reach.ts` replace three Sets, a Map, four copies of one `isRecord` guard and three error classes with one `NodeOutcome` per node, one `SourceValues` per source and one `PublishFailure`, and carve `flush` into five named members. `registry-phase.ts` replaces three booleans and four batch fields with one phase whose `collecting` variant carries the tick, the seeds and both buffers, so opening and closing a batch are one assignment each. `report.ts` and `publish-request.ts` retire `rollback.ts`, `diagnostic-report.ts` and `value-batch.ts` for one owner of ordered steps, one builder of the four-field batch, one `ReportTrace` in place of two nullable slots and one request in place of an optional frame. `diagnostics.ts` retains in a ring, so the cheapest surface in the folder stopped paying `Array.prototype.shift()` per diagnostic on a full buffer. One behaviour changes and it is stated: `PatchRegistry.closeBatch` reported the first subscriber failure and discarded the rest, and it now collects and reports once, so two failures are one `AggregateError` in occurrence order and a single failure keeps its identity. ADR-094 records the slice, with **Refined by** markers on ADR-071's `rollback.ts` ownership sentence, ADR-079's value-batch factories paragraph and ADR-091's `DiagnosticRetention` and `diagnostic-report.ts` sentences. It is not merged, and the runs that measured it belong to that pull request.

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
