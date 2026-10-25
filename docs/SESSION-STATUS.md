# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-24, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the identified 2D solver proof.

## Now

- **Phase 5 has three cutovers and its 2D solver proof:** public `transform`, `transform3d` and `ik`
  now use identified tables, while grouped consumers stay behind explicit internal legacy paths.
  The 2D solver reads named member, root and goal outputs, preserves canonical member row ids, and
  publishes optional inspection only when requested. No pending ledger entries were removed; 73 Phase
  5, 4 Phase 6 and 2 Phase 7 entries remain.

## Next in line

- **Phase 5 continues with the explicit 3D solver graph:** migrate `ik3d` with named member, root,
  goal, pole and joint inputs, then keep FK and rig migration blocked until the 3D proof is green.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
