# F5 — Prove adversarial, provider, property and failure behavior

Status: not implemented. Depends on: B1–B8, C1–C7, D1–D7, E1–E7, G1–G8, F1, F2.

## Start here

Read `00-overview.md`, `cache-contract.md`, final contract/ownership ledger, existing generator/fault harness, cached/reference FK, canonical IK requests, provider conformance, transaction and adapter lifecycle tests. Prefer one reusable existing-boundary harness over production test hooks.

## Outcome and work

Generate bounded valid chains/trees and deterministic numeric/edit histories. Compare default/no-cache/evicting providers, D3 reference poses and independent geometry regressions; check full IK results/inspection as well as rotations, order, history independence and isolated state. Run the same generators over 3D sources (`fk3d`/`ik3d` against G3's uncached 3D reference, joint limits, pole, orient and influence). Include forward/reverse/direct seek, equal effective fresh records, signed zero, source-root motion, every consumed IK key field, inspection toggles, source/goal rebinding, reorder/reparent/delete/reinsert and same IDs across rigs/runtimes.

Generate minimal invalid structure: duplicate entries/members, bad root links/parents, rooted imports, duplicate frame-root entries, wrong capabilities/provenance, cross-space wiring (a 2D source bound to a 3D consumer and the reverse), mixed-space tracks, and unknown/missing/root/non-leaf goals. Refusal preserves authored/live/graph/output/handle/subscription/binding observations and **both caches**, not just an error return.

Inject provider create/equality/lookup/remember, preparation, derivation, collect/fold, solver, validation/freezing, candidate abandonment and late downstream failures. Fork candidates from one accepted snapshot; assert lookup does not change committed recency and remembered proposals do not mutate/evict active state. Retry matches cold semantics, with no reuse of an unaccepted solve. Test postcommit delivery errors separately; do not claim external effects were rolled back.

Protect extensibility using a non-kinematic single/dict/derivation/state/cache plugin with runtime-injected providers and preceding-fold-dependent memo inputs. Test stateless/collect-only/fold-only/both, exactly one executor, local contributions, output routing/conflicts and no collect-to-fold output channel. Test prototype-looking IDs, codec injectivity, exhaustive execution/lookup/edit/binding/request variants and retired-schema refusals. A fake alternative provider must work without core/registry/FK/IK changes. Churn binding/disposal to expose stale ownership and references in both the DOM and Three adapters, and assert each stateful generation is disposed exactly once.

Run provider conformance with frozen alias traps, slot/key collisions, undefined values, finite capacity, replacement/eviction and persistent old snapshots. Do not assume arbitrary third-party provider code is safe because interfaces compile. Counterexample tests should demonstrate why in-place Map writes, epsilon keys or omitted goal/constraint inputs are invalid.

## Evidence and finish

Run focused/generated suites; record seeds/operation counts and minimized regressions, shrinking if supported. Bound normal numeric magnitudes; separate deliberate overflow from supported geometry. No new property-testing dependency is required for deterministic tables.

Done when failure/history/provider/structure/resource transitions are executed and evidenced, not just happy frames. Report commands/results, seeds/counts, uncovered faults and retained generic/math guarantees. No all-properties-pass claim without actual execution. Next: F6.
