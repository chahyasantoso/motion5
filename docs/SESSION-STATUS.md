# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-25, Asia/Jakarta.
- **Read against:** `main` at `f5b34af5ff5827aec38f67ca576a443a9456e268`, where the internal 3D seam prototype of [#349](https://github.com/chahyasantoso/motion5/issues/349) ([ADR-114](./ADR-114-3d-seam-prototype.md)) and the 2D IK envelope ([ADR-113](./ADR-113-2d-ik-envelope-and-documentation.md)) have landed; nothing 3D is exported from the package.

## Now

- **[#482](https://github.com/chahyasantoso/motion5/issues/482) lands with this change:** `fk.compose` reads a bone's extent through `segmentExtent`, the owner every solve reads, so a negative length means a segment with no extent everywhere and a published `-0` keeps its sign ([ADR-107](./ADR-107-one-solve-result.md)).

## Next in line

- **[#489](https://github.com/chahyasantoso/motion5/issues/489) is next:** a non-finite solver goal. No implementation or run on `main` is claimed.

## Open, and not scheduled

- [#490](https://github.com/chahyasantoso/motion5/issues/490) remains open for feasible multi-leaf FABRIK trees settling in local minima of the centroid compromise.
- [#491](https://github.com/chahyasantoso/motion5/issues/491) remains open for the FABRIK iteration-cap policy on long serial chains.
- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
