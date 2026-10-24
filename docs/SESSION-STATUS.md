# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-24, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the structural-edit slice.

## Now

- **Structural edits go through one plan and one commit:** `TrackHandle.remove`, `replace`,
  `input.replace` and `input.requires.set`/`remove` mint plain edits, a pure `plan()` answers the
  candidate graph and committed contract, and the runtime stages them into the existing commit
  path. Bind and unbind keep a live overlay; replacement and removal clear it.

## Next in line

- **Cheap authored edits on the same path:** add `set-values` and `set-field`, remove `setValues`,
  `setKeyframe`, `removeKeyframe` and the rule ids only they raise, and validate against the
  committed value spec rather than a fresh inference.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
