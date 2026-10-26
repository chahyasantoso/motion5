# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-25, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the identified rig cutover.

## Now

- **Phase 5 has seven cutovers and both solver proofs:** all public built-in plugin paths now use
  identified tables, while grouped consumers stay behind explicit internal legacy paths. FK and FK3D
  select solver rows by canonical `memberId`, and rig aggregates named bone and control tables by
  source row identity with duplicate output ids left to output validation. No pending ledger entries
  were removed; 73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.

## Next in line

- **Phase 5 continues with identified classifier and label consumers:** read declared rig outputs by row
  identity, publish the classifier flat record, and keep the app writer after those keyed consumers.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
