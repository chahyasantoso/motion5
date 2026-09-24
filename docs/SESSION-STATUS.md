# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-24, Asia/Jakarta.
- **Read against:** `main` at `0f75d101`; phase 3 ([#484](https://github.com/chahyasantoso/motion5/pull/484)) is merged as [ADR-108](./ADR-108-constrained-2d-solving.md).

## Now

- **Opt-in IK solve inspection for [#349](https://github.com/chahyasantoso/motion5/issues/349) is in review:** authored static `inspect` enables the declared fixed-shape `inspection` output without changing unopted patches, as [ADR-109](./ADR-109-opt-in-solve-inspection.md) records. The pull request carries the exact commits, tests, scans, and corpus measurement; no merge is claimed here.

## Next in line

- **The mutation baseline [#419](https://github.com/chahyasantoso/motion5/issues/419) remains next:** the `mutate` list names `graph-runtime-state.ts` and `ports/scheduler.ts` on `main`, [#445](https://github.com/chahyasantoso/motion5/pull/445) adds `report.ts`, `registry-phase.ts` and `publish-request.ts` while `diagnostic-report.ts` leaves the list with the module it named, the modules both halves of [#443](https://github.com/chahyasantoso/motion5/issues/443) created are otherwise still absent from it, and [#462](https://github.com/chahyasantoso/motion5/pull/462)'s union work has since added `patch-render.ts` and `lang/exhaustive.ts` to the set a baseline would have to cover, with `outcome.ts` now at `lang/outcome.ts`. No Stryker run is reported before or after any of that widening, so `break` at 65.42 is an honestly stale number rather than a measured one. The next slice measures it and re-pins the thresholds in the pull request that measures them; [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) owns that rule and says never to move a threshold to keep a run green. Not started, and no run is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- [Issue #411](https://github.com/chahyasantoso/motion5/issues/411) stays open on a recorded refusal rather than a fix: a drain replays at the frame it deferred, so the assertion it recommends cannot distinguish the two implementations it is about. `deferred-frame-loss.test.ts` says what each of its cases actually pins, and #417's unreached-frame case is the witness it asked for.
- [Issue #349](https://github.com/chahyasantoso/motion5/issues/349) holds the 2D IK/FK contract study; phases 1 to 3 landed as [ADR-106](./ADR-106-one-owner-per-ik-solve-question.md), [ADR-107](./ADR-107-one-solve-result.md) and [ADR-108](./ADR-108-constrained-2d-solving.md), and remaining phases stay planned there. [#482](https://github.com/chahyasantoso/motion5/issues/482) owns the negative-length disagreement between `fk` and the solves.
- Packaging follows the current work. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
