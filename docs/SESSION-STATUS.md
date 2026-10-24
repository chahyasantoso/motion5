# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-24, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the live-values slice.

## Now

- **Live values share the one edit path:** `TrackHandle.writeValues` and `releaseValues` mint
  `write-live`/`release-live`, a pure plan validates the whole evaluated value against the committed
  contract, and the compiled table or record track stands the overlay over its authored evaluation.
  A write never moves the authored definition, an overlay survives authored and binding edits and
  seeks, and replacement, removal, release and destroy clear it.

## Next in line

- **Runners, recipes and consumers on the new verbs:** route the runner and value transaction through
  `writeValues`/`releaseValues`, send full records through `values.set` or use `setField` in the rig
  writer and goal control, and keep per-write failure isolation.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
