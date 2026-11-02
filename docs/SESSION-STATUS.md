# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-02, Asia/Jakarta.
- **Read against:** `feat/v5.1-self-validating-tracks` after the full check gate.

## Now

- **One v5.1 contract is live:** a data track declares its type, commit brands one `Structure` on
  the compiled track, typed slots verify nominal fit, live writes cannot move static cells, and 2D
  and 3D body, goal, root and solved rules live in pure domain modules. `fk`/`fk3d` solved slots are
  optional at rest, idle tracks are not reseeded, and catalog `describe`, graph `explain` and
  `assertStable` tooling are present.

## Next in line

- **Await the owner's review before any further slice:** the v5.1 branch is green and ready for
  review; no new phase starts until the owner decides.

## Open, and not scheduled

- Cache and measurement work remains deferred by the owner; no threshold, cache hook or Phase 8
  measurement is active.
- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
