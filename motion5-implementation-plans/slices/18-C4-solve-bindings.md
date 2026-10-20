# C4 — Derive IK/FK source and target contracts

Status: not implemented. Depends on: C2, C3, B5, A3.

## Start here

Read `00-overview.md`, chain/join descriptors, `packages/plugins/src/ik.ts`, `packages/plugins/src/fk.ts`, `packages/plugins/src/ik-chain.ts`, `packages/plugins/src/ik-goal.ts`, and `packages/plugins/src/ik-result.ts`. Use C1 slot capabilities and `validate` hooks, not core solver classifications.

## Outcome and work

Declare final slots: IK requires scalar skeleton and nonempty dict targets; FK requires skeleton, optional scalar solver. NO independent base, old root-membership, or singular target shorthand. Frame root comes from skeleton publication/provenance. The `skeleton` slot declares `capability: "chain"`; C4 adds decision D6's extension so it accepts `chain` or `joined` (`capability?: CapabilityName | readonly [CapabilityName, ...CapabilityName[]]` with a `readAny`), not earlier. `readAny` returns a discriminated union keyed by the capability that was actually found, `{ capability: "chain"; payload: CapabilityMap["chain"] } | { capability: "joined"; payload: CapabilityMap["joined"] }` (generated from the slot's tuple), so callers narrow on `capability` instead of re-reading a name string. Goal sources are ordinary frame producers: the frame is a runtime value validated by `readFrame`/the C5 reader with existing partial-frame defaults, not a structural capability (D7) and not a guessed nested point.

IK and FK implement these checks in `validate` (requirement payloads only). Before candidate acceptance, `ik.validate` requires at least one non-root IK member (rule id `ik-solver-no-solve-members`, which this slice adds to `packages/core/src/contract/rule-id.ts` and the registry in `packages/core/src/contract/rule.ts`); first point's tip is anchored and excluded from targets/solve members. Every non-root leaf has exactly one target binding. Refuse unknown, topology-root, non-leaf, or missing goal IDs using safe lookups and entry/slot/member diagnostics. A one-point chain is valid for FK and refused by `ik.validate`. A root-only track has no `chain`, so FK and IK bound to it are both refused by core with `derivation-missing-capability` before `validate` runs.

Built-in solver descriptors carry canonical skeleton source/layout/root-binding provenance. FK with built-in IK must match those bindings, not equal IDs/numbers. Custom solve capability producers must declare compatible provenance and runtime validation; partial valid angle maps are allowed, unknown/non-finite angles are not. Optional absent solver differs from bound blocked/error/malformed solver.

Re-derive contracts when skeleton/root/solver/goal bindings or target keys change, even if current frames/IDs match. Root numeric animation does not change topology. Inspection is explicitly optional; derive declared publication metadata without assuming it exists each tick.

## Evidence and finish

Run derivation tests for all target coverage failures, one-point FK valid versus one-point IK refused, root-only source refused for both, wrong skeleton/solve capability, malformed runtime goal frame, mismatched same-looking skeletons, changed root binding provenance, missing versus blocked optional sources, and custom compatible partial solves. Include an ordinary non-kinematic dict plugin unaffected by targets spelling. Add an `ik-solver-no-solve-members` case to `packages/core/test/contract/rule-registry.test.ts`, and a type test that `readAny` narrows each variant.

Done when supported built-in wiring known invalid from structure cannot activate and fail only next tick, and the rule id exists in `rule-id.ts`, the registry and its test. Dynamic numerical corruption still has runtime boundary tests. Record actual commands/results and capability compatibility decisions. Next: C5.
