# Session status

Current project state only. Replace stale entries rather than append history. The four sections
below are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no
bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the
shape and byte ceiling.

- **Captured:** 2026-09-28, Asia/Jakarta.
- **Read against:** `main` at `58306050716894306eed93cfae80018f36dd0deb`, the base of
  [PR #526][pr526].

## Now

- **`main` carries the best-completed-pass fix for [#521][issue521] ([ADR-128][adr128]).**

## Next in line

- **[PR #526][pr526] proposes legal joint-space seeding for [#523][issue523];** validate and merge it
  before tackling the remaining local minima separately.

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
