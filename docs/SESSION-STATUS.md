# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-25, Asia/Jakarta.
- **Read against:** `main` at `c9ce26665e8756614fb8f021e253dd631fcd96d7`, where [#500](https://github.com/chahyasantoso/motion5/issues/500)'s `fk3d` rest orientation and per-member solved weight ([ADR-116](./ADR-116-fk3d-rest-orientation-and-solved-weight.md)) landed through #502 on top of the conflicted FABRIK tree compromise of [#490](https://github.com/chahyasantoso/motion5/issues/490) ([ADR-110](./ADR-110-goal-influence-and-conflict-policy.md)), the depth-scaled FABRIK iteration cap of [#491](https://github.com/chahyasantoso/motion5/issues/491) ([ADR-115](./ADR-115-fabrik-iteration-cap-scales-with-serial-depth.md)) and the internal 3D seam prototype ([ADR-114](./ADR-114-3d-seam-prototype.md)); nothing 3D is exported from the package.

## Now

- **[#500](https://github.com/chahyasantoso/motion5/issues/500) 3D pivot offsets land with this change:** `fk3d` claims `x`, `y` and `z`, and `ik3d` solves them exactly through one effective-link owner ([ADR-117](./ADR-117-3d-pivot-offsets.md)).

## Next in line

- **[#500](https://github.com/chahyasantoso/motion5/issues/500) an authored pole target is next:** `ik3d` gains an optional world-space `pole` its elbow bends toward, and a solver that binds none keeps the root-local +z default byte for byte.

## Open, and not scheduled

- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
