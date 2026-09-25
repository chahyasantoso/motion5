# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

- **Captured:** 2026-09-25, Asia/Jakarta.
- **Read against:** `main` at `baa5def6a1e0fd57d34c3ae23beb37741de4cbfb`, where the non-finite goal reader of [#489](https://github.com/chahyasantoso/motion5/issues/489) ([ADR-111](./ADR-111-stability-and-determinism.md), amendment of 2026-09-25), the internal 3D seam prototype of [#349](https://github.com/chahyasantoso/motion5/issues/349) ([ADR-114](./ADR-114-3d-seam-prototype.md)), the 2D IK envelope ([ADR-113](./ADR-113-2d-ik-envelope-and-documentation.md)) and the one bone extent of [#482](https://github.com/chahyasantoso/motion5/issues/482) ([ADR-107](./ADR-107-one-solve-result.md)) have landed; nothing 3D is exported from the package.

## Now

- **[#490](https://github.com/chahyasantoso/motion5/issues/490) lands with this change:** a `conflicted` FABRIK tree also tries the opposite seed and an offset-exact reach-circle compromise, publishing a converged candidate before a lower residual, while every non-`conflicted` result stays bit-identical ([ADR-110](./ADR-110-goal-influence-and-conflict-policy.md)).

## Next in line

- **[#491](https://github.com/chahyasantoso/motion5/issues/491) is next:** FABRIK iteration-cap policy on long serial chains. No implementation or run on `main` is claimed.

## Open, and not scheduled

- [#328](https://github.com/chahyasantoso/motion5/issues/328) remains open for activation and failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
