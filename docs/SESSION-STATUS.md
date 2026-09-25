# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-25, Asia/Jakarta.
- **Read against:** `main` at `7aa478159c6fb30362d786c57f8195dbc9f33aec`, where the internal 3D seam prototype of [#349](https://github.com/chahyasantoso/motion5/issues/349) ([ADR-114](./ADR-114-3d-seam-prototype.md)), the 2D IK envelope ([ADR-113](./ADR-113-2d-ik-envelope-and-documentation.md)) and the one bone extent of [#482](https://github.com/chahyasantoso/motion5/issues/482) ([ADR-107](./ADR-107-one-solve-result.md)) have landed; nothing 3D is exported from the package.

## Now

- **[#489](https://github.com/chahyasantoso/motion5/issues/489) lands with this change:** every solve reads a goal through `ik-goal-reading.ts`, so an infinite goal coordinate is a direction on the 2D closed form, FABRIK and the internal 3D closed form alike, and a `NaN` one refuses the solve by name rather than publishing `NaN` ([ADR-111](./ADR-111-stability-and-determinism.md), amendment of 2026-09-25).

## Next in line

- **[#490](https://github.com/chahyasantoso/motion5/issues/490) is next:** a conflicted-gated best-of over two compromise rules and two seeds for multi-leaf FABRIK trees, as decided on the issue. No implementation or run on `main` is claimed.

## Open, and not scheduled

- [#491](https://github.com/chahyasantoso/motion5/issues/491) remains open for the FABRIK iteration-cap policy on long serial chains.
- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
