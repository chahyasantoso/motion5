# C4 — Derive IK/FK source and target contracts

Status: not implemented. Depends on: C2, C3, B5, A3.

## Start here

Read `00-overview.md`, chain/join descriptors, `packages/plugins/src/ik.ts`, `packages/plugins/src/fk.ts`, `packages/plugins/src/ik-chain.ts`, `packages/plugins/src/ik-goal.ts`, and `packages/plugins/src/ik-result.ts`. Use C1 capability validation, not core solver classifications.

## Outcome and work

Declare final slots: IK requires scalar skeleton and nonempty dict targets; FK requires skeleton, optional scalar solver. NO independent base, old root-membership, or singular target shorthand. Frame root comes from skeleton publication/provenance. Goal sources require an explicit validated frame capability with existing partial-frame defaults, not a guessed nested point.

Before candidate acceptance, require at least one non-root IK member; first point's tip is anchored and excluded from targets/solve members. Every non-root leaf has exactly one target binding. Refuse unknown, topology-root, non-leaf, or missing goal IDs using safe lookups and entry/slot/member diagnostics. Root-only FK remains valid.

Built-in solver descriptors carry canonical skeleton source/layout/root-binding provenance. FK with built-in IK must match those bindings, not equal IDs/numbers. Custom solve capability producers must declare compatible provenance and runtime validation; partial valid angle maps are allowed, unknown/non-finite angles are not. Optional absent solver differs from bound blocked/error/malformed solver.

Re-derive contracts when skeleton/root/solver/goal bindings or target keys change, even if current frames/IDs match. Root numeric animation does not change topology. Inspection is explicitly optional; derive declared publication metadata without assuming it exists each tick.

## Evidence and finish

Run derivation tests for all target coverage failures, one-point FK/invalid IK, wrong frame/skeleton/solve capability, mismatched same-looking skeletons, changed root binding provenance, missing versus blocked optional sources, and custom compatible partial solves. Include an ordinary non-kinematic dict plugin unaffected by targets spelling.

Done when supported built-in wiring known invalid from structure cannot activate and fail only next tick. Dynamic numerical corruption still has runtime boundary tests. Record actual commands/results and capability compatibility decisions. Next: C5.
