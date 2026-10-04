# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-04, Asia/Jakarta.
- **Read against:** supplied snapshot plus the test-move handover and its testing-entrypoint
  correction; [PR #549][pr549] CI is green per the contributor, not independently retrieved.

## Now

- **[PR #548][pr548] is merged into `main`: all 33 plugin implementations live in
  `@motion5/plugins`, and core exposes their declared plugin-authoring contract.**

## Next in line

- **[#534][issue534] atomic registration:** `feat/534-register-all` prepares all-or-nothing plugin
  batch admission and composition-root adoption on top of [PR #549][pr549]. This separate branch
  still needs publication and exact-head Node 24 CI; neither PR's merge is claimed here.

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
[pr549]: https://github.com/chahyasantoso/motion5/pull/549
