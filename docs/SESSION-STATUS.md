# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-04, Asia/Jakarta.
- **Read against:** the supplied `motion5-main.zip` at `c5e317582c8b6848d734c6f0876dd722a0a92d5f`.

## Now

- **`main` carries the pose gap filler and its accepted image-space pipeline; the repository is
  unchanged by the unmerged #534 handover branch.**

## Next in line

- **[#534][issue534] phase 1 plugin authoring contract:** the separate branch adds
  `@motion5/core/plugin-api`, migrates current plugin imports to that contract, and gates the layer
  boundary and declaration closure; the handover is prepared but not merged.

## Open, and not scheduled

- **#534 later phases:** extracting `@motion5/plugins`, atomic registration, lazy loading, solver
  capabilities, labels, rig, runners and 3D avatar driving remain unmerged and unscheduled here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and
  activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status
  database.

[issue534]: https://github.com/chahyasantoso/motion5/issues/534
