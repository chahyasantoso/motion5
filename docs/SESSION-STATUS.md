# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-26, Asia/Jakarta.
- **Read against:** `main` at `ef47ba597a7119024dc9f0c7be7797a76b3ef80e`, where [#509](https://github.com/chahyasantoso/motion5/issues/509)'s grouped-only keyframes ([ADR-121](./ADR-121-grouped-only-keyframes.md), #511) landed on [#500](https://github.com/chahyasantoso/motion5/issues/500)'s opt-in 3D inspection ([ADR-120](./ADR-120-3d-opt-in-inspection.md)), pole target, pivot offsets, `fk3d` rest orientation and the 3D seam prototype ([ADR-114](./ADR-114-3d-seam-prototype.md)); nothing 3D is exported from the package.

## Now

- **[#500](https://github.com/chahyasantoso/motion5/issues/500) iterative 3D solving lands with this change:** `ik3d` answers any chain of `fk3d` members, two-bone rigs keep the closed form and their bytes, and every other chain takes 3D FABRIK with roll reconstructed by minimal swing from rest ([ADR-122](./ADR-122-3d-fabrik-tree-solve.md)).

## Next in line

- **[#500](https://github.com/chahyasantoso/motion5/issues/500) 3D joint limits are next:** a closed per-member limit union enforced inside the solve by one owner, reporting `limited` with `atBound`.

## Open, and not scheduled

- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
