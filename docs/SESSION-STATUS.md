# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-24, Asia/Jakarta.
- **Read against:** `main` at `7c9ffc3afc7c9fbfb813df7573d8cf0ad7dcbbf6`; PR #488 is merged and follow-up [#489](https://github.com/chahyasantoso/motion5/issues/489) is open.

## Now

- **The internal 3D seam prototype of [#349](https://github.com/chahyasantoso/motion5/issues/349) is in review, stacked on the 2D IK envelope slice:** [ADR-114](./ADR-114-3d-seam-prototype.md) records the internal `transform3d`, `fk3d`, and `ik3d` modules, the CSS Z-X-Y rotation contract, and the `ik-chain-unsupported` load rule; [ADR-113](./ADR-113-2d-ik-envelope-and-documentation.md) under it records the 2D envelope and documentation. Nothing is exported from the package, and no merge of either is claimed here.

## Next in line

- **[#489](https://github.com/chahyasantoso/motion5/issues/489) is next:** non-finite goal handling and the remaining solver diagnostics follow-up. It is not started, and no implementation or run is claimed.

## Open, and not scheduled

- [#490](https://github.com/chahyasantoso/motion5/issues/490) remains open for feasible multi-leaf FABRIK trees settling in local minima of the centroid compromise.
- [#491](https://github.com/chahyasantoso/motion5/issues/491) remains open for the FABRIK iteration-cap policy on long serial chains.
- [#482](https://github.com/chahyasantoso/motion5/issues/482) remains open for the negative-length disagreement between `fk` and the solves.
- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
