# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-05, Asia/Jakarta.
- **Read against:** [PR #551][pr551] at `645fbd53cbcf12b1d6c61a3bb26dc35028192673`;
  GitHub shows [PR #549][pr549], [PR #550][pr550] and [PR #551][pr551] open.

## Now

- **[PR #548][pr548] is merged into `main`: all 33 plugin implementations live in
  `@motion5/plugins`, and core exposes their declared plugin-authoring contract.**

## Next in line

- **[#534][issue534] lazy playground composition:** local `feat/534-lazy-composition-root` is
  prepared on the approved loader in [PR #551][pr551]. Publish the handover and obtain exact-head
  Node 24 CI; the open prerequisites are not claimed merged.

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
[pr551]: https://github.com/chahyasantoso/motion5/pull/551
