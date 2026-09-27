# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-27, Asia/Jakarta.
- **Read against:** `main` at `6f598965074d50c5c90271ff4d8087620e487fbc`, where [#500](https://github.com/chahyasantoso/motion5/issues/500)'s 3D goal influence and end-effector orientation ([ADR-124](./ADR-124-3d-goal-influence-and-end-effector-orientation.md), #515) landed on the 3D tree solve, joint limits, inspection, pole, offsets and rest orientation, and the `packages/three` workspace was added.

## Now

- **[#500](https://github.com/chahyasantoso/motion5/issues/500)'s public 3D API lands with this
  change ([ADR-125](./ADR-125-public-3d-api.md), #516):** the 3D plugin subpaths, the executed 3D
  guide, the `@motion5/three` renderer adapter, and the playground's 2D and 3D FABRIK stages with
  DOM and three.js tabs; #500 closes with it.

## Next in line

- **[#514](https://github.com/chahyasantoso/motion5/issues/514) is next in line:** limited FABRIK
  chains in both dimensions trap on a seed-side bound and stop short of reachable goals.

## Open, and not scheduled

- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
