# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-24, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the cheap-authored-edit slice.

## Now

- **Cheap authored edits share the one edit path:** `TrackHandle.input.values.set` and `setField`
  mint `set-values`/`set-field`, a pure plan validates them against the committed value spec without
  re-inferring, and the runtime moves the definition, rewrites the compiled evaluator and publishes
  once. Binding edits and authored edits keep a live overlay; replacement and removal clear it.

## Next in line

- **Live values on the same path:** add `write-live` and `release-live`, remove `overrideValues`,
  `LiveValueKeyError` and the live-value-key rule id, and make a valid write or release clear an
  errored node on the next flush.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
