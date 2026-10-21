# C6 — Remove kinematic knowledge from the new core path and quarantine the legacy channel

Status: not implemented. Depends on: B5, C1, C4, A5.

## Start here

Read `00-overview.md`, the deletion inventory, `packages/core/src/contract/solver-slots.ts`, `packages/core/src/contract/validate-v5.ts`, `packages/core/src/graph/ir.ts`, `packages/core/src/runtime/graph-publisher.ts`, and `packages/core/src/domain/plugins.ts`. Follow ALL actual imports/readers before deleting exports.

## Outcome and work

The new execution path (structural derivation, the operation executor, capability slots and requirement inputs keyed by entry) must carry no kinematic knowledge. Legacy compose `ik` and `ik3d` still read `inputs.members`, and `fk3d`/`ik3d` still depend on `solverChain`, `node.solves` and slot-name rules, until D4 and G3/G4 migrate them. Deleting that channel here would break them before their replacements exist, which is the same hazard refine #1 found in C7. So this slice removes what the new path no longer needs and quarantines the rest. F2 deletes the quarantined channel together with the C7 `legacy-compose` strategy.

Quarantine, in one place:

- Add one shared predicate in core, for example `isLegacyComposeDefinition(definition)` (true when the definition declares `compose`). C7 uses the same predicate to compile the `legacy-compose` execution strategy; there is no second test for "legacy".
- Members injection, `node.solves`, `solverChain` resolution, the `PluginCapability`/`PluginCapabilities` port (`packages/core/src/ports/plugin-capabilities.ts`, ADR-136 solver-chain shape) with `UNJUDGED_CAPABILITIES`, and the kinematic slot-name rules in `graph/ir.ts`, `graph/solver-constraints.ts`, `contract/solver-slots.ts`, `contract/solver-shape.ts` (`POLE_SLOT`) and `validate-v5.ts` run only for nodes whose definition satisfies the predicate. A definition that does not satisfy it never receives `members`, is never classified by slot spelling and never reaches the port.
- Remove the port's type export from `packages/core/src/index.ts` now; the quarantined channel uses it internally only. It is already absent from `@motion5/core/plugin-api`, and plugin-level `capabilities[]` was removed by ADR-142.
- Mark each quarantined module or function with a one-line comment naming F2 as its deletion owner, so F2's worklist is the set of those markers plus the predicate.

Delete outright what no legacy plugin reads: dead exports, helpers whose only consumers are already migrated, and duplicated validation that the C3/C4 plugin hooks now own for the new path (`skeleton-imported-chain-has-root`, `ik-solver-no-solve-members`, goal coverage). Move maintained numerical/semantic validations to plugin adapters/derivation. Core keeps generic binding requiredness/cardinality, dependency edges, cycles, descriptor transport, staged evaluation, and publication only.

No fallback to old membership when a descriptor is absent on the new path. Remove obsolete public types/helpers, not just their exports. Inspect hidden validation in both graph and schema layers; gating only members injection leaves the main boundary violation unfinished.

The 3D skeleton plugins are migrated, not retired: do not delete `fk3d`/`ik3d` exports or `skeletonTracks` here. They stay on the quarantined legacy channel until G3, G4 and G7 replace them. Do not add PlanX's temporary 3D bridge, a converter or a half-ported Rig3. Update minimum affected imports/catalog/compilation consumers; G8/F1/F2 complete the maintained-caller sweep later.

## Evidence and finish

Run focused generic graph/registry/boundary tests plus changed-type checks. A toy non-kinematic plugin uses scalar slots named root/base/solver and a dict named targets and is governed only by its declarations: no members injection, no slot-name rule, no solver classification. Legacy compose `ik`/`ik3d` fixtures still solve through the quarantined channel, which proves the quarantine did not break them. A capability-based skeleton still gets plugin-owned refusals. Real cycles remain rejected. Inspect import/export consumers and classify search hits semantically, including legitimate solver-local members variables.

Done when adding a new constraint-like plugin requires no core classification branch, every remaining kinematic reader sits behind the one legacy predicate, and retained exports do not depend on hidden legacy behavior. Record actual removed paths/public APIs, quarantined paths with their F2 markers, commands/results, and any explicitly deferred features. Never claim a string search alone proves correctness. Next: C7.
