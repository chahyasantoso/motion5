# Session status

Current project state only. Replace stale entries rather than append history. The four sections
below are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no
bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the
shape and byte ceiling.

- **Captured:** 2026-09-30, Asia/Jakarta.
- **Read against:** `main` at `74615e9c8d30787f36794f02bf6bc9266ffdb92c`, the squash of
  [PR #532][pr532].

## Now

- **`main` carries the [#530][issue530] pose gap filler pipeline in `apps/pose-gap-filler`:
  MediaPipe adapter, image-space rig and writer, and the `raw` reference ([PR #532][pr532]).**

## Next in line

- **[#530][issue530] replay harness:** recording format, gap detector, `hold`, masks and metrics
  are prepared on `feat/530-gap-filler-phase2`, not merged.

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
[adr130]: ./ADR-130-legal-range-retries-and-serial-hinge-recovery.md
[issue524]: https://github.com/chahyasantoso/motion5/issues/524
[adr131]: ./ADR-131-centred-legal-start-for-mixed-sign-chains.md
[adr132]: ./ADR-132-legal-descent-start-for-constrained-fabrik-misses.md
