# B5 — Scope requirements and graph destinations by entry

Status: implemented on branch `feat/plugin-structural-api`. Depends on: B2.

Evidence: `packages/core/test/contract/requirements-b5.test.ts`.

## Start here

Read `00-overview.md`, B2's plan types, `packages/core/src/graph/ir.ts`, `packages/core/src/graph/order.ts`, `packages/core/src/runtime/graph-publisher.ts`, `packages/core/src/contract/keyframe-shape.ts`, and requirement identity helpers reached from them.

## Outcome and work

Normalize bindings into a real single/dict union; optional absence remains absent. Preserve separate fields for qualified source, destination track, entry compiler/authored identity, slot, and optional dictionary member. Derive graph edges and input delivery from that normalized plan. Input scope is entry -> slot -> optional dict member, never plugin name -> slot.

If track adjacency deduplicates a shared dependency, retain EVERY consumer destination. One source feeding two joins, two slots, or two target keys cannot collapse those deliveries. Use centralized collision-free tuple identities and safe dictionary writes; do not invent a track/member string grammar.

Requiredness/cardinality comes from admitted declarations for any plugin. A dict named targets gets no special graph/validator privileges, and a slot named root/base/solver is ordinary unless its plugin validates it. Preserve existing free-track `~/id` and motion-local qualification semantics.

Runtime operations receive only their own resolved payloads/context. Structural derivation may later receive validated binding provenance through its narrow compile interface; do not expose the whole graph or a runtime service locator. Keep graph canonical order separate from authored operation order.

## Evidence and finish

Run focused graph/input tests: repeated joins bind distinct chain/parent sources; the same source feeds two entries and both arrive; two dict keys to one source survive; prototype-looking dictionary keys remain own properties; required generic dict validation works under another name; valid qualification persists; real/self/pose-driven cycles refuse.

Done when no repeated definition can steal another instance's inputs and edge deduplication cannot drop destinations. Record actual path/command results and new public type implications. Next: B6.
