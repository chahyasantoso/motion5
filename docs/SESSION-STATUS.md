# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-25, Asia/Jakarta.
- **Read against:** `main` at `7aa478159c6fb30362d786c57f8195dbc9f33aec` plus #489 as handed over, not yet published; the internal 3D seam prototype of [#349](https://github.com/chahyasantoso/motion5/issues/349) ([ADR-114](./ADR-114-3d-seam-prototype.md)), the 2D IK envelope ([ADR-113](./ADR-113-2d-ik-envelope-and-documentation.md)) and the one bone extent of [#482](https://github.com/chahyasantoso/motion5/issues/482) ([ADR-107](./ADR-107-one-solve-result.md)) have landed; nothing 3D is exported from the package.

## Now

- **[#490](https://github.com/chahyasantoso/motion5/issues/490) lands with this change:** conflicted FABRIK trees try a deterministic reach-circle compromise and opposite seed, selecting convergence before residual while preserving non-conflicted baseline identity ([ADR-110](./ADR-110-goal-influence-and-conflict-policy.md)).

## Next in line

- **[#491](https://github.com/chahyasantoso/motion5/issues/491) is next:** FABRIK iteration-cap policy on long serial chains. No implementation or run on `main` is claimed.

## Open, and not scheduled

- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
