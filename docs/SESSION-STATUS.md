# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-05, Asia/Jakarta.
- **Read against:** supplied snapshot, phase 3, phase 4 and reviewed loader handovers; GitHub shows
  [PR #549][pr549] and [PR #550][pr550] open, with no merge claimed.

## Now

- **[PR #548][pr548] is merged into `main`: all 33 plugin implementations live in
  `@motion5/plugins`, and core exposes their declared plugin-authoring contract.**

## Next in line

- **[#534][issue534] lazy plugin loading:** local `feat/534-plugin-loader` adds the reviewed approved
  catalog, typed loader and atomic ensure path on the phase 4 checkpoint. Publish only after PRs [#549][pr549]
  and [#550][pr550] land, then obtain exact-head Node 24 CI.

## Open, and not scheduled

- Solver capabilities, labels, rig, runners and 3D avatar driving remain unmerged.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.

[issue534]: https://github.com/chahyasantoso/motion5/issues/534
[pr548]: https://github.com/chahyasantoso/motion5/pull/548
[pr549]: https://github.com/chahyasantoso/motion5/pull/549
[pr550]: https://github.com/chahyasantoso/motion5/pull/550
