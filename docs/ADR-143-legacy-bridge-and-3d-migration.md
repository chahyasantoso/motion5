# ADR-143: Legacy compose bridge, kinematic quarantine and 3D migration

**Status:** Proposed, 2026-10-20

## Context

The skeldata plan switches the runtime to the operation executor in C7, but the executor knows only
the `stateless` and `stateful` strategies, and a compose-only plugin compiles to an empty
`stateless` strategy. Routing the runtime through it would silently drop the output of every plugin
not yet migrated (`transform`, `transform3d`, `fk`, `ik`, `fk3d`, `ik3d`, `rig`, `pose-classify`).
C6 as first planned deleted the `members` injection, `solverChain`, `node.solves`, the ADR-136
capability port and kinematic slot-name rules, which legacy `ik`/`ik3d` still read
(`inputs.members`), so C6 would have broken them before D4 and the 3D work migrated them. The plan
also retired `fk3d`/`ik3d`, `skeletonTracks` and the 3D apps instead of migrating them. Review
notes: `refine.txt`, applied in the plan pack revision of the same date.

## Decision

- **Legacy bridge:** from C7 until F2, `ExecutionStrategy` has a temporary third kind,
  `legacy-compose`, so the runtime has one runner. It reproduces `Track.compose` → `plugin.compose`
  exactly (replacement chaining, plugin-name input scoping, published keys), proven by one parity
  test per catalog compose plugin. Each migrating slice deletes its plugin's parity test. A track
  mixing `legacy-compose` with collect/fold entries refuses (`legacy-compose-mixed-track`). F2
  deletes the kind; the exhaustive switches turn leftovers into compile errors.
- **Quarantine:** C6 removes kinematic knowledge from the new path and quarantines the legacy
  kinematic channel (members injection, `solverChain`, `solves`, the ADR-136 port, kinematic
  slot-name rules and the kinematic constants re-exported by `@motion5/core/plugin-api`) behind one
  predicate, `isLegacyComposeDefinition`, which C7 also uses to compile `legacy-compose`. F2
  deletes both together.
- **State keys and disposal:** committed and proposed state maps are keyed by `CompilerEntryKey`
  only. Each proposal carries `origin: "continued" | "initialized"`. `dispose` runs once per entry
  generation: after commit for every key the candidate did not continue, and on abandonment only
  for `initialized` proposals.
- **3D migration:** 3D is migrated in phase G (slices 36–43, before F), with no bridge or converter.
  Shared factories parameterized by a skeleton-space spec build `point`/`root`/`join` (`chain`,
  `joined`) and `point3d`/`root3d`/`join3d` (`chain3d`, `joined3d`); distinct capability names make
  core's presence check refuse cross-space wiring. `fk3d` and `ik3d` keep their names with the
  new contract. `rig` folds `poses`, and one decoder reads poses from `rig` or `fk3d`.
  `skeletonTracks` emits new-contract skeletons; the Three adapter gains `poses[id]` member
  bindings through the renderer-neutral binding module shared with the DOM adapter.
- **Generic helpers, per-dimension math:** numeric frame math stays per dimension; traversal, the
  FK cached walk, the IK whole-solve memo and topology derivation are generic and shared.

## Alternatives rejected

- Keeping `Track.compose` beside the executor until F2: two runners, two acceptance paths.
- Deleting the kinematic channel in C6: breaks legacy `ik`/`ik3d` before they migrate.
- Retiring or deferring 3D, or a 3D bridge/converter: loses shipped features or adds a second dialect.
- One space-agnostic skeleton family with a dimension field: cross-space wiring would pass the
  presence check and need runtime refusals.

## Consequences

- C6, C7 and F2 own the bridge lifecycle; phase G owns 3D; F1 covers only remaining package callers.
- When G5, G7 and F2 land they mark the superseded parts of ADR-138 (rig output `pose` → `poses`),
  ADR-141 (generated track shape) and ADR-136 (capability port) in the same change.
- The plan pack runs 01–49: A–E, then G, then F.

## Evidence

- Code facts: `track-operations.ts` (`committedStates` fallback, `requirementInputs[plugin.name]`),
  `execution-plan.ts` (`executionStrategyOf`), `cache.ts` (`EvaluatorServices` index signature),
  `chain-layout.ts` (mixed tracks), `ik.ts`/`ik3d.ts` (`inputs.members`, `POLE_SLOT`).
- Plan pack: `motion5-implementation-plans/00-overview.md`, slices C6, C7 and G1–G8. Related:
  [ADR-142](./ADR-142-plugin-structural-api.md), [ADR-136](./ADR-136-registry-owned-solver-capabilities.md),
  [ADR-138](./ADR-138-rig-aggregation-and-pose-classification.md),
  [ADR-141](./ADR-141-captured-skeletons-and-parent-space-driving.md).
