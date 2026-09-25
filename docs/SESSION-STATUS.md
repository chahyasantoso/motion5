# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-25, Asia/Jakarta.
- **Read against:** `main` at `42c723226ed044b11e2441b06c8c7019ae4ed885`, where the conflicted FABRIK tree compromise of [#490](https://github.com/chahyasantoso/motion5/issues/490) ([ADR-110](./ADR-110-goal-influence-and-conflict-policy.md)) and the depth-scaled FABRIK iteration cap of [#491](https://github.com/chahyasantoso/motion5/issues/491) ([ADR-115](./ADR-115-fabrik-iteration-cap-scales-with-serial-depth.md)) have landed on top of the internal 3D seam prototype ([ADR-114](./ADR-114-3d-seam-prototype.md)); nothing 3D is exported from the package.

## Now

- **[#500](https://github.com/chahyasantoso/motion5/issues/500) rest orientation and solved weight lands with this change:** an `fk3d` bone composes its authored local rest orientation when unsolved and the short-arc quaternion blend toward its solved triple by its own `weight` when solved, and every rig that loaded before composes the same bytes ([ADR-116](./ADR-116-fk3d-rest-orientation-and-solved-weight.md)).

## Next in line

- **[#500](https://github.com/chahyasantoso/motion5/issues/500) 3D pivot offsets are next:** `fk3d` claims `x`, `y` and `z`, and `ik3d` solves them exactly. No implementation or run on `main` is claimed.

## Open, and not scheduled

- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
