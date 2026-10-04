# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-04, Asia/Jakarta.
- **Read against:** `main` at `f2589922d6ba099f2756274968a2ad1e05bfc9c0`, the squash of
  [PR #547][pr547].

## Now

- **`main` carries the pose gap filler and the plugin-authoring contract ([PR #547][pr547] merged
  as `f2589922`); [PR #548][pr548] extracts all 33 plugin implementations into `@motion5/plugins`,
  keeps core implementation-free, and awaits seven green Node 24 CI contexts.**

## Next in line

- **[#534][issue534] plugin-only tests move:** after [PR #548][pr548] merges, tests that need only
  public core entrypoints move from `packages/core/test` to `packages/plugins/test`.

## Open, and not scheduled

- Atomic registration, lazy loading, solver capabilities, labels, rig, runners and 3D avatar driving
  remain unmerged.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.

[issue534]: https://github.com/chahyasantoso/motion5/issues/534
[pr547]: https://github.com/chahyasantoso/motion5/pull/547
[pr548]: https://github.com/chahyasantoso/motion5/pull/548
