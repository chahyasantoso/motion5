# D1 — Consolidate numeric readers and point-frame composition

Status: not implemented. Depends on: A3, A4.

## Start here

Read `00-overview.md`, the pinned numeric contract, canonical fixture expectations, `packages/plugins/src/frame.ts`, `packages/plugins/src/fk.ts`, and numeric/constraint readers reached from `packages/plugins/src/ik-member.ts`. Check focused existing math tests before moving helpers.

## Outcome and work

Implement/extract one effective-angle function, one point composition helper, and one anchored-root-tip helper. All take plain local values/frames and remain independent of graph, DOM, project edits, publication, and cache policy. Preserve shared composeWorld operation order: parent-frame pivot offset plus chosen angle, then nonnegative extension along resulting local +x.

Use the A3 defaults, extent/weight clamps, limit/influence readers, degree convention, shortest-arc endpoints, and exact half-turn tie. Missing solve uses authored angle. Distinguish total internal reading from boundary rejection: malformed external publications and non-finite solved angles refuse; helpers must not silently sanitize structural corruption. Check arithmetic overflow before accepted results enter publication/cache state.

External root is source-owned. Compose the first point from that frame exactly once for IK's anchored tip, and use the identical operation sequence in FK. Do not reintroduce independent base slots or solve the first point. Root orientation must rotate pivot offsets as well as extension.

Keep a small pure helper surface and a single owner per numeric policy. Do not introduce epsilon-based cache equality, redundant FK/IK clamps, or dimension-general framework abstractions for this 2D release.

## Evidence and finish

Run independent geometry tests for zero/90-degree, moved/rotated external root, nonzero pivot, branched parent tips, negative/zero extent, missing/partial solve, blend endpoints/clamping/half-turn, dynamic inverted limits, signed zero, and supported-domain overflow refusal. Retain relevant existing solver/frame unit tests. Use justified tolerances for independently computed geometry, exact checks for specified endpoints.

Done when D3–D5 share numerical owners but tests retain independent geometry assertions. Record actual helper/test paths, commands/results, any deliberate behavior change, and remaining bounds. Next: D2.
