# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-17, Asia/Jakarta.
- **Read against:** base branch `feat/skeldata-v5-base`.

## Now

- **Skeldata normative contract and invariant owners landed** in `docs/skeldata/CONTRACT.md`;
  single owners, validation stages, generic injected cache port and execution model established in
  slice A1 on `feat/skeldata-v5-base`.

## Next in line

- **Slice A2 execution:** pin disjoint identifier spaces, generation handles, reserved delimiters,
  and private collision-free tuple codecs under `02-A2-identity.md`.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
