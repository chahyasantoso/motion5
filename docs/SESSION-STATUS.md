# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-24, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` at the end of Phase 4.

## Now

- **Phase 4 is complete:** structural, cheap authored and live value edits share one pure plan and
  one commit path, runners and recipes use the live verbs, and the lifecycle, scheduling and
  trigger suites run against identified tables. The pending ledger is 79 files: 73 Phase 5,
  4 Phase 6 and 2 Phase 7, with no Phase 4 entry left.

## Next in line

- **Phase 5 replaces the grouped solver machinery:** express IK, FK, rig and transform plugins with
  identified tables and declared dependencies, register the built-in plugins, and port the 73
  Phase 5 suites onto them.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
