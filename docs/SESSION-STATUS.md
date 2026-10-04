# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-04, Asia/Jakarta.
- **Read against:** `main` at `c5e317582c8b6848d734c6f0876dd722a0a92d5f` and the open
  [PR #547][pr547] at `41a422f5f8f3038debb9012ed0e8a757394943e5`.

## Now

- **`main` carries the pose gap filler; the plugin-authoring contract is verified on open PR #547
  with seven successful Node 24 CI contexts, but has not been merged.**

## Next in line

- **[#534][issue534] plugin package extraction:** prepared separately on
  `refactor/534-plugins-package`, above PR #547. The handover moves implementations into
  `@motion5/plugins` and keeps core implementation-free; publication and Node 24 CI remain pending.

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
