# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-29, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after Slice 7 pose-gap-filler aggregate migration.

## Now

- **Pose-gap-filler aggregate migration:** migrated `apps/pose-gap-filler/src/rig/` to 5-track aggregate
  architecture (`root`, `body`, `goals`, `solve`, `pose`), whole-table batch writes (`input.values.set`),
  and ID-based solved limb row selection with closed discriminated union. Retired 14 pending test suites
  (79 -> 65 pending entries).

## Next in line

- **Three.js aggregate skeleton migration:** migrate `packages/three` to aggregate 3D tracks and
  `tableFrameSource`.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
