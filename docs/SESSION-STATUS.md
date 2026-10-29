# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-29, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after Slice 10 rig retirement and Phase 5 closeout.

## Now

- **Aggregate kinematics pipeline complete:** 2D/3D IK and FK consume identified tables and records
  through single-source slots; FK publishes complete pose tables; Three.js and pose-gap-filler select
  rows by id; rig plugins, `readRigValues` and hidden solver fan-in are deleted. All 73 Phase 5
  pending suites retired; 4 Phase 6 and 2 Phase 7 pending entries remain.

## Next in line

- **Phase 6 consumer migration:** migrate Three.js and React consumers to generated tracks and named
  outputs.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
