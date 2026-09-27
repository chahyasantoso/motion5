# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-27, Asia/Jakarta.
- **Read against:** `main` at `7ee6980a35ed321d3a812991a166a85d956cf5b1`, where [#500](https://github.com/chahyasantoso/motion5/issues/500)'s 3D joint limits ([ADR-123](./ADR-123-3d-joint-limits.md), #513) landed on the 3D FABRIK tree solve ([ADR-122](./ADR-122-3d-fabrik-tree-solve.md)), grouped-only keyframes ([ADR-121](./ADR-121-grouped-only-keyframes.md)), the opt-in 3D inspection ([ADR-120](./ADR-120-3d-opt-in-inspection.md)), pole target, pivot offsets, `fk3d` rest orientation and the 3D seam prototype ([ADR-114](./ADR-114-3d-seam-prototype.md)); nothing 3D is exported from the package.

## Now

- **[#500](https://github.com/chahyasantoso/motion5/issues/500) 3D goal influence and end-effector orientation land with this change:** `influence` on an addressed `fk3d` leaf weighs the tree compromise through the 2D goal owner, and `orient` turns the leaf toward its goal's orientation after the position solve without moving its tip, re-limited by its joint ([ADR-124](./ADR-124-3d-goal-influence-and-end-effector-orientation.md)).

## Next in line

- **[#500](https://github.com/chahyasantoso/motion5/issues/500) the public 3D API is next:** package subpath exports for `transform3d`, `fk3d` and `ik3d`, ADR-114 and its successors accepted as the public contract, an executed 3D guide, a playground demo and a renderer adapter proof outside core.

## Open, and not scheduled

- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
