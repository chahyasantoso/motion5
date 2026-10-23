# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-23, Asia/Jakarta.
- **Read against:** supplied main archive `c14ec42`.

## Now

- **The v5 identified-table contract is staged;** target value types, the failure vocabulary and
  shape-neutral test builders sit beside the live engine, and nine target behaviors are expected
  failures until parsing and the explicit plugin path are replaced.

## Next in line

- **Replace authored parsing and evaluation with identified tables,** then port the built-in plugin
  path; the staged acceptance suite is the exit gate for both.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
