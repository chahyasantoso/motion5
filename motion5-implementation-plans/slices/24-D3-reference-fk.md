# D3 — Implement the simple new-contract FK reference

Status: not implemented. Depends on: C5, D1, D2.

## Start here

Read `00-overview.md`, the dynamic skeleton view/layout API, D1's pure math helpers, and canonical A4 fixtures. Inspect `packages/plugins/src/fk.ts` only for reusable math boundaries and `packages/plugins/test` for test-oracle placement.

## Outcome and work

Implement a small stateless uncached FK evaluator accepting the derived layout, current local data, completed source root frame, and optional validated solved angles. Walk parent-first; use external root for the first point and parent TIP for descendants. Missing overrides use authored local angles; readable overrides blend using D1. Return a safe immutable ID-indexed poses record of TIP `{x,y,rotation}` frames.

The reference accepts only the final data contract. It is a test/benchmark optimization oracle, not a selectable production reference/legacy mode and not another authored parser. Keep frame arithmetic shared but traversal/cache structure simple enough to audit. Source records/arrays and solver payloads must remain unchanged.

Honor strict boundary validation: foreign/non-finite solve keys refuse; compatible custom partial solves are valid. A one-point chain (with or without a root entry) is valid FK data, including nonzero point length/offset. A root-only track with no point has no `chain`, so an FK bound to it is refused by core with `derivation-missing-capability` before FK runs. Root plugin omission uses origin; explicit source-owned frame applies once. Do not use PlanX's pose/member-pivot array transport.

Expose only the minimum test helper needed; public FK output remains poses. A lookup record must safely contain permitted prototype-looking point IDs. Ensure public order/identity policy matches compiled layout rather than arbitrary object enumeration.

## Evidence and finish

Run independent geometry cases plus direct reference tests: chain/tree, one point, moved/rotated root, nonzero pivot, zero/negative extent, missing solve/member, blend endpoints, foreign solve key, source immutability, and special IDs. Compare with hand calculations using justified tolerances. No retired per-bone pipeline parity requirement.

Done when a readable direct evaluator expresses the exact intended FK semantics and independent geometry agrees. Record actual helper/test paths, commands/results, and how production D5 will reuse math without selecting this evaluator as a runtime mode. Next: D4.
