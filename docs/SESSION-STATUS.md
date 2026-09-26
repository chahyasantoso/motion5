# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-26, Asia/Jakarta.
- **Read against:** `main` at `9d6d8834ac828273259714a74ee3a58b065d26ad`, where [#500](https://github.com/chahyasantoso/motion5/issues/500)'s 3D pole target ([ADR-118](./ADR-118-3d-pole-target.md), #505) landed on top of its pivot offsets ([ADR-117](./ADR-117-3d-pivot-offsets.md)), `fk3d` rest orientation and solved weight ([ADR-116](./ADR-116-fk3d-rest-orientation-and-solved-weight.md)) and the internal 3D seam prototype ([ADR-114](./ADR-114-3d-seam-prototype.md)); nothing 3D is exported from the package.

## Now

- **[#509](https://github.com/chahyasantoso/motion5/issues/509) grouped-only keyframes land with this change:** every authored top-level keyframe entry is a plugin-named group, ungrouped entries refuse as `keyframes-ungrouped-key`, and the v4-to-v5 migrator does not guess ownership ([ADR-121](./ADR-121-grouped-only-keyframes.md)).

## Next in line

- **[#500](https://github.com/chahyasantoso/motion5/issues/500) iterative 3D solving is next:** a 3D FABRIK behind a closed 3D chain-shape union answers long chains and branches, while two-bone rigs keep the closed form and their bytes.

## Open, and not scheduled

- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
