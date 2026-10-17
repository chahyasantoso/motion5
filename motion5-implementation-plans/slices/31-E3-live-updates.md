# E3 — Integrate live values, seeks, and cached evaluation

Status: not implemented. Depends on: B8, D7, E2.

## Start here

Read `00-overview.md`, final value/entry-handle APIs, `packages/core/src/contract/value-transaction.ts`, `packages/core/src/runtime/authored-values.ts`, `packages/core/src/domain/track.ts`, and current real pipeline integration fixtures.

## Outcome and work

Exercise public entry-nested value batches and entry-handle live writes through actual interpolation, graph delivery, root/skeleton producers, IK, and cached FK. All calls route through B8's single schema/address/value-transaction owner. No special bone setter or flat transform shortcut.

Pin update timing to the runtime's documented policy: accepted value transaction evaluates immediately or at the normal update boundary, not an invented second flush. Root-frame source values are ordinary frame-entry writes; they change poses without rederiving topology. Lengths, pivot offsets, rest angles/stops, weights, limits, influence, and goals remain numeric/value-tier content.

Keep rewind/forward/reverse seek and repeated evaluation history-independent. Static and animated overlays stay with the correct entry through recompile/reorder; removed/reinserted IDs cannot inherit old overlays. Invalid multi-entry writes preserve active values/output/cache under the existing value transaction's guarantee.

IDs/order/plugin selection/requires/target member keys are structural and refuse value writes. Bound blocked/error source semantics remain intact during live updates. A changing IK goal may legitimately change multiple branches; reuse depends on effective solved angles, not a guessed dirty limb.

## Evidence and finish

Run public integration tests for every supported value class, exact zero, nested transform entries, goal/root motion, static-to-stop edits, endpoint/reverse seeks, direct-versus-multistep cached/reference equivalence, invalid mixed writes, structural-looking writes, stale handles, and numeric edits causing ZERO topology derivations. Compare with direct evaluation of equivalent final values.

Done when live authoring produces correct poses without structural recompilation or stale caches. Record actual commands/results, update-boundary behavior, instrumentation counts, and any unsupported value mutation. Next: E4.
