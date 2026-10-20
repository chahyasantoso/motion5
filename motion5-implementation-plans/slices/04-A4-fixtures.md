# A4 — Author canonical fixtures and oracle strategy

Status: implemented on branch `feat/plugin-structural-api`. Depends on: A1, A2, A3.

Evidence: `packages/core/test/fixtures/skeldata-fixtures.ts`, `packages/core/test/contract/fixtures-oracle.test.ts`.

## Start here

Read `00-overview.md`, the contract/identity/numeric artifacts, `packages/plugins/test/unit`, `packages/plugins/test/integration`, and current project-fixture helpers reached from those suites. Inspect `packages/core/src/contract/v5.ts` only to separate current parser limitations from target fixture syntax.

## Outcome and work

Author final-schema fixtures directly: FK-only chain; one-point FK; rooted chain; torso/two-arms joined tree with root plugin; constrained multi-goal solve. Every entry uses one outer ID map, including frame/root/solve/pose entries. Requirements use valid qualified free-track or existing motion-local addresses. No embedded entry ID and no base slot on IK/FK.

Keep source chains local/rootless in joined fixtures. Include moved/rotated outer root, pivot offsets, unequal lengths, animated rest angles, blend weights, limits, and influences. Write expected parent indices, point-source locators, topology root, anchored tip, leaf goals, and public tip frames beside small fixtures.

Create minimal invalid variants changing one fact: duplicate entry/member IDs, multiple topology roots, root-not-first among joins, missing/forward parent, repeated chain, empty chain, rooted imported chain, duplicate frame root, wrong source capability, missing/invalid goal, mismatched solver provenance, malformed solve value. Root entry placement itself must NEVER be an invalid case.

Define three independent evidence paths: hand-calculated geometry; retained solver mathematics; cached versus simple uncached NEW-contract FK. Use seeded bounded valid-tree generators and deterministic value/edit sequences, recording seeds. Do not build an old-format loader, legacy parity harness, or snapshots of retired patches.

## Evidence and finish

Validate fixture construction and expected topology with small pure assertions. Parser/evaluator smoke tests may initially be pending until B–D; name that dependency rather than adapting old syntax. Ensure generated cases supplement readable examples and use a bounded numeric domain.

Done when later slices can import concise final-contract fixtures without reading historical plans or duplicating model assumptions. Record actual new paths and runnable versus pending checks in the small status index. Next: A5.
