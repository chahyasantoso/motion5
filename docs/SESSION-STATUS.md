# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-23, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the identified-table engine slice.

## Now

- **The identified-table contract is live for tracks that name no plugin:** an authored table or
  record is parsed, its source contract inferred, and its cells evaluated through one flat slot plan,
  so a ready patch publishes `outputs.values`; tests that still author grouped plugin keyframes are
  held in `test/pending.json` under the slice that replaces them, and the only staged red is the one
  plugin acceptance case.

## Next in line

- **Admit plugins on the identified-table path:** a registered plugin id, declared input slots and
  named outputs replace grouped keyframes as the only way a track observes another.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
