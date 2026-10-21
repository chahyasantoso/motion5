# C6 — Remove kinematic knowledge from core

Status: not implemented. Depends on: B5, C1, C4, A5.

## Start here

Read `00-overview.md`, the deletion inventory, `packages/core/src/contract/solver-slots.ts`, `packages/core/src/contract/validate-v5.ts`, `packages/core/src/graph/ir.ts`, `packages/core/src/runtime/graph-publisher.ts`, and `packages/core/src/domain/plugins.ts`. Follow ALL actual imports/readers before deleting exports.

## Outcome and work

Delete old solver membership derivation, GraphNode solves data, members input injection, solverChain declarations, root/target conventions, and kinematic slot-name recognition. Move maintained numerical/semantic validations to plugin adapters/derivation. Core keeps generic binding requiredness/cardinality, dependency edges, cycles, descriptor transport, staged evaluation, and publication only.

No fallback to old membership when a descriptor is absent. Remove obsolete public types/helpers, not just their exports. Inspect hidden validation in both graph and schema layers; removing only members injection leaves the main boundary violation unfinished.

Retire/defer incompatible fk3d/ik3d skeleton exports and generators now if they block removal. Update minimum affected imports/catalog/compilation consumers; F1/F2 complete the maintained-caller sweep later. Do not add PlanX's temporary 3D bridge or a half-ported Rig3. Keep independent transform3d/frame/driver/pose aggregation only where they no longer require the deleted channel.

## Evidence and finish

Run focused generic graph/registry/boundary tests plus changed-type checks. A toy non-kinematic plugin uses scalar slots named root/base/solver and a dict named targets and is governed only by its declarations. A capability-based skeleton still gets plugin-owned refusals. Real cycles remain rejected. Inspect import/export consumers and classify search hits semantically, including legitimate solver-local members variables.

Done when adding a new constraint-like plugin requires no core classification branch and retained exports do not depend on hidden legacy behavior. Record actual removed paths/public APIs, commands/results, and any explicitly deferred features. Never claim a string search alone proves correctness. Next: C7.
