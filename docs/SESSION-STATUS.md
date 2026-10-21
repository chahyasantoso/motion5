# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-21, Asia/Jakarta.
- **Read against:** branch `feat/skeldata-v5-phase-c`.

## Now

- **Solve bindings:** final IK/FK `skeleton`, `targets`, and optional `solver` descriptors, the
  chain-or-joined `readAny` union, target coverage rules, and solve provenance checks under
  `18-C4-solve-bindings.md`; implemented locally with CI pending.

## Next in line

- **Dynamic skeleton reader:** bind current point and link records to compiled layouts under
  `19-C5-dynamic-reader.md`.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
