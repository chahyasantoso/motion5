# Session status

Current project state only. Replace stale entries rather than append history. The four sections
below are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no
bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the
shape and byte ceiling.

- **Captured:** 2026-10-02, Asia/Jakarta.
- **Read against:** `main` at `95e08e10722a31696c4da5e235325780f9b50ee8`, the squash of
  [PR #538][pr538].

## Now

- **`main` carries the [#530][issue530] pose gap filler in `apps/pose-gap-filler`: adapter, `raw`
  reference, gap detector, replay harness, `hold`, `chain-kalman`, the image and world rigs with
  the camera fit, the trusted-landmark stabilizer, and the comparison record that reads `INN: open`
  ([PR #532][pr532], [PR #533][pr533], [PR #535][pr535], [PR #536][pr536], [PR #537][pr537],
  [PR #538][pr538]).**

## Next in line

- **[#540][issue540] synthetic human rig:** a live source selector with looped synthetic takes,
  so the page runs with no MediaPipe download and no camera, is prepared on
  `feat/540-phase0-source-modes` and not merged; [SYNTHETIC-HUMAN.md](./SYNTHETIC-HUMAN.md) records
  its scope. The learned prior, [#539][issue539], is measured against that simulator.

## Open, and not scheduled

- [#328][issue328] remains open for activation and
  failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before
  any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and
  activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.

[issue514]: https://github.com/chahyasantoso/motion5/issues/514
[adr126]: ./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md
[pr518]: https://github.com/chahyasantoso/motion5/pull/518
[issue328]: https://github.com/chahyasantoso/motion5/issues/328
[issue519]: https://github.com/chahyasantoso/motion5/issues/519
[adr127]: ./ADR-127-fabrik-settles-on-two-rounding-passes.md
[issue521]: https://github.com/chahyasantoso/motion5/issues/521
[adr128]: ./ADR-128-fabrik-publishes-its-best-completed-pass.md
[issue523]: https://github.com/chahyasantoso/motion5/issues/523
[pr526]: https://github.com/chahyasantoso/motion5/pull/526
[issue527]: https://github.com/chahyasantoso/motion5/issues/527
[pr528]: https://github.com/chahyasantoso/motion5/pull/528
[pr529]: https://github.com/chahyasantoso/motion5/pull/529
[issue530]: https://github.com/chahyasantoso/motion5/issues/530
[pr532]: https://github.com/chahyasantoso/motion5/pull/532
[pr533]: https://github.com/chahyasantoso/motion5/pull/533
[pr535]: https://github.com/chahyasantoso/motion5/pull/535
[pr536]: https://github.com/chahyasantoso/motion5/pull/536
[pr537]: https://github.com/chahyasantoso/motion5/pull/537
[pr538]: https://github.com/chahyasantoso/motion5/pull/538
[issue539]: https://github.com/chahyasantoso/motion5/issues/539
[issue540]: https://github.com/chahyasantoso/motion5/issues/540
[adr130]: ./ADR-130-legal-range-retries-and-serial-hinge-recovery.md
[issue524]: https://github.com/chahyasantoso/motion5/issues/524
[adr131]: ./ADR-131-centred-legal-start-for-mixed-sign-chains.md
[adr132]: ./ADR-132-legal-descent-start-for-constrained-fabrik-misses.md
