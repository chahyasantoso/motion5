# Session status

Current project state only. Replace stale entries rather than append history. The four sections
below are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no
bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the
shape and byte ceiling.

- **Captured:** 2026-09-28, Asia/Jakarta.
- **Read against:** `main` at `741fd5a48a317f1ab4349de89b5ac00283667541`, where [#518][pr518]
  landed [ADR-126][adr126] and [#514][issue514] closed.

## Now

- **[#519][issue519] lands with this change ([ADR-127][adr127]).**

## Next in line

- **The next work is the #514 follow-up (no fitting open issue):** investigate random-axis hinge
  seeding and mixed-sign local optima.

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

[pr516]: https://github.com/chahyasantoso/motion5/pull/516
[adr125]: ./ADR-125-public-3d-api.md
[issue500]: https://github.com/chahyasantoso/motion5/issues/500
[issue514]: https://github.com/chahyasantoso/motion5/issues/514
[adr126]: ./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md
[pr518]: https://github.com/chahyasantoso/motion5/pull/518
[issue328]: https://github.com/chahyasantoso/motion5/issues/328
[issue519]: https://github.com/chahyasantoso/motion5/issues/519
[adr127]: ./ADR-127-fabrik-settles-on-two-rounding-passes.md
