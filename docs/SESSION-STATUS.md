# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-04, Asia/Jakarta.
- **Read against:** supplied `main` snapshot and upstream `main` at
  `f0e994100799c88c7ad8cb34c53e908cadc53666`, the squash of [PR #548][pr548].

## Now

- **[PR #548][pr548] is merged into `main`: all 33 plugin implementations live in
  `@motion5/plugins`, and core exposes their declared plugin-authoring contract.**

## Next in line

- **[#534][issue534] plugin-only tests move:** the local `test/534-plugin-tests-home` branch
  prepares the public-entrypoint-only tests and shared fixtures in `packages/plugins/test`;
  publication and seven green Node 24 CI contexts remain required before merge.

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
[pr548]: https://github.com/chahyasantoso/motion5/pull/548
