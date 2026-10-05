# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-05, Asia/Jakarta.
- **Read against:** verified remote `main` `60c6afaee74b4f01e6539035898d35714e2b0533`.

## Now

- **Rig aggregation and geodesic pose classification are merged in PR #556.** The supplied snapshot
  matches every root file blob and directory tree on verified remote main.

## Next in line

- **#534 skeleton and avatar driving:** Capture, FK tracks, the parent-space driver and GLB avatar
  loading are prepared on `feat/534-skeleton-avatar` (PR #557, reviewed); the driver measured
  0.0169 ms per `apply` on the synthetic humanoid (browser smoke). Required Node 24 CI remains.

## Open, and not scheduled

- 3D avatar driving, runners, and retargeting remain unmerged.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
