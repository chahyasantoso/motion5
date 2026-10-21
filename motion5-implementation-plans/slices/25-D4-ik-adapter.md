# D4 — Adapt resolved skeletons to retained IK math and memoize whole solves

Status: not implemented. Depends on: C4, C5, D1, D2, B7.

## Start here

Read `00-overview.md`, `42-cache-contract.md` (especially sections 6, 8 and 9), pinned A3 numerical/solve contracts, `packages/plugins/src/ik.ts`, `packages/plugins/src/ik-chain.ts`, `packages/plugins/src/ik-member.ts`, `packages/plugins/src/ik-topology.ts`, `packages/plugins/src/ik-solve.ts` and `packages/plugins/src/ik-result.ts`. Follow goal/constraint/seed/strategy helpers that affect actual inputs. Use B7's implemented typed evaluator and provider port, not a second cache implementation.

## Outcome and work

Replace graph-membership adaptation with one plugin-package adapter over the resolved current skeleton. Compose the first point's tip once from the source root via D1; anchor it and exclude it from solve members. Adapt non-root members parent-first with stable point IDs, local pivots/extents/limits and compiled parent links. A collision-free private root sentinel is allowed only if retained types require one; never publish it.

Read mandatory goals from this entry's targets dict by member identity. Reuse C4 coverage/C5 dynamic validation: no unavailable/malformed-goal fallback to origin or fabricated no-objective success. Influence applies to addressed leaves and differs from FK blend weight. Retain analytic/FABRIK/tree/constraint/convergence ownership and deterministic seed policy. No topology discovery, graph access, DOM work, cache dependency or old members channel in solver mathematics.

Build one frozen canonical SolveRequest from the exact normalized data consumed by the adapter/solver, and use that same request for equality and math. Its complete semantic key includes anchored tip; ordered member IDs/parent links/pivots/extents/constraint variants/influences/goals; effective flip/bend; every consumed option, policy or seed. Source/layout/root/solver/configuration identity is bound by the evaluator generation and immutable tokens. Read current retained strategy code to audit coverage; an old signature is not a complete specification for a changed adapter. Distinguish optional/variant states and compare finite numeric fields with Object.is. No rounded/epsilon, JSON-only, revision-only or record-identity-only key.

Create a private capacity-one solve table through injected services. Exhaustively handle hit/miss. On a miss, run retained pure math, validate result membership/finite local rotations and full SolveResult invariants, freeze the owned key/result, then propose remember's new snapshot. On a hit, preserve normal validation/publication. Cache complete rotations plus residual/quality data required for inspection. Project this evaluation's inspection opt-in afterward; if the solver conditionally computes diagnostics, include that computation option in the request until full-result computation is available. Never fabricate inspection from cached rotations.

Emit rotations and opt-in inspection as the current delta, not a cached full fold accumulator. Options do not automatically publish. A failed/invalid/blocked solve does not write. Cache/provider/math work is fallible before acceptance; state is accepted only with the complete successful evaluation, including downstream tracks. No previous cached rotations as seed, per-point IK memoization, history-dependent warm start, shared/global table or plugin-specific core branch. A goal can change several branches; do not claim local invalidation beyond actual effective results.

## Evidence and finish

Run retained math through the new adapter: reachable/unreachable, zero extent, translated/rotated root and pivot, constraints, multiple goals, influence, iteration bounds, local angles and inspection. Refuse malformed/non-finite output transactionally; propagate bound goal errors/blocked state and precommit coverage faults.

Run identical sequences with default, no-cache and evicting providers. Count actual evaluator/solve calls separately. Identical effective requests with new records hit; mutate each consumed field independently and require a miss. Cover inspection off/on, signed zero, goal rebinding to equal numbers (cold generation), two entries/rigs with matching IDs, provider exceptions, late downstream/freeze failure, retry and forward/reverse/direct seeks. Assert full accepted result/inspection equivalence, not only visually similar endpoints. A deterministic identical math path should match exactly; independent geometry tests use A3's justified tolerances.

Done when IK consumes only declared skeleton/targets, produces the intended finite solve and memoizes complete effective requests through B7 without changing cold semantics. Record adapter/strategy/API changes, key audit, actual commands/results, tolerances and limits. No benchmark claim from call counts alone. Next: D5.
