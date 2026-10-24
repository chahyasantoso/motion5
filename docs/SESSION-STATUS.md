# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-24, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the consumer-routing slice.

## Now

- **Runners and recipes use the live verbs:** a runner write step carries one whole table or record
  and a release is its own step; `ValueTransaction` exposes `writeValues`/`releaseValues` beside
  `seek`, and the per-write refusal isolation inside `values(recipe)` is unchanged. The rig writer
  and goal control address single fields with `setField`.

## Next in line

- **Lifecycle and scheduling:** with the un-pended tests, mount and unmount gating, terminal
  destroy patches, subscription and timeline disposal, repeated replacement leaks, reentrant
  subscribers, and the manual, time and scroll trigger paths.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
