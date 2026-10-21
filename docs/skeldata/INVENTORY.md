# Skeldata v5 Deletions and Consumer Inventory

Normative inventory of deprecated contracts, APIs, generators, and consumers for skeldata v5.
Every entry specifies producer, consumers, public export status, replacement/removal strategy, and owning slice.

Status (2026-10-20): section 1 items are still present in code unless section 1.10 lists them as
already retired. Producer links are relative to the repository root. Revised on 2026-10-20 for the
refine review and phase G (ADR-143): 3D surfaces are migrated, not retired, and the legacy kinematic
channel is quarantined by C6 until F2.

## 1. Inventory of Retired Machinery

### 1.1 Object-Group Parser and Flattening

- **Producer:**
  [packages/core/src/domain/keyframe-groups.ts](../../packages/core/src/domain/keyframe-groups.ts)
  (`flattenAuthoredKeyframes`, `FlattenedKeyframes`, `FlattenedKeyframe`).
- **Consumers:**
  [packages/core/src/engine.ts](../../packages/core/src/engine.ts),
  [packages/core/src/domain/plugins.ts](../../packages/core/src/domain/plugins.ts),
  [packages/core/src/runtime/authored-values.ts](../../packages/core/src/runtime/authored-values.ts),
  [packages/core/src/contract/keyframe-shape.ts](../../packages/core/src/contract/keyframe-shape.ts).
- **Public Export:**
  Internal to `@motion5/core`; shape interfaces exported via core contract types.
- **Replacement / Removal:**
  Replaced by canonical entry-map parsing (`08-B2-execution-plan.md`, `09-B3-leaf-codec.md`). Authored keyframes become singleton-map entry records (`{ [entryId]: { plugin, values, requires } }`).
- **Owning Later Slices:**
  B2, B3 (new contract parser); G8 (app rewrites), F1 (remaining package consumers); F2 (removal of `keyframe-groups.ts`).

### 1.2 Plugin-Name Requirement Scoping and Group Syntax

- **Producer:**
  [packages/core/src/contract/keyframe-shape.ts](../../packages/core/src/contract/keyframe-shape.ts)
  (`PLUGIN_REQUIRES_SECTION`, `PLUGIN_VALUES_SECTION`, `readPluginBindings`, `readPluginValues`).
- **Consumers:**
  `flattenAuthoredKeyframes`, `PluginRegistry.resolveForKeyframes`, validator in
  [packages/core/src/contract/validate-v5.ts](../../packages/core/src/contract/validate-v5.ts).
- **Public Export:**
  Public authoring schema constants and diagnostic codes (`keyframes-reserved-section`, `keyframes-ungrouped-key`).
- **Replacement / Removal:**
  Replaced by explicit entry descriptors where each entry has an outer ID, a declared `plugin`, `values` record, and `requires` record. No reserved group names (`values`/`requires`) at top-level; section names belong to entry object.
- **Owning Later Slices:**
  B1, B2, B5 (entry authoring & requirements); F2 (delete group-section parser). The new runner keys
  requirement inputs by entry; C7 keeps plugin-name scoping (`requirementInputs[plugin.name]` in
  `Track.compose` and the executor's fallback) only inside `legacy-compose`, and F2 deletes it.

### 1.3 Stage, Priority, Compose, and Top-Level Outputs

- **Producer:**
  [packages/core/src/domain/plugins.ts](../../packages/core/src/domain/plugins.ts)
  (`PluginStage` "prepare" | "compose", `priority`, `outputs`, `stageRank`).
- **Consumers:**
  `PluginRegistry.register`, `comparePlugins`, `finalizeGraph`, `GraphPublisher`.
- **Public Export:**
  Exported via `@motion5/core/plugin-api` (`PluginDefinition.stage`, `priority`, `outputs`).
- **Replacement / Removal:**
  Replaced by single-stage execution plan and generic derivation hooks. Entries evaluate in dependency order via compiled execution plans (`08-B2-execution-plan.md`, `20-C6-generic-core.md`). Stage ranking and arbitrary priority numbers are eliminated. Until F2, admission still accepts a legacy `compose` definition (`plugin-admission.ts`), and runtime evaluation still runs `Track.compose` → `plugin.compose`; C7 switches the runtime to the operation executor and runs not-yet-migrated compose plugins through a temporary `legacy-compose` execution strategy with per-plugin parity tests.
- **Owning Later Slices:**
  B2, C6; C7 (runtime uses the operation executor; `legacy-compose` strategy); D2, D4, D5, G1, G3,
  G4, G5 (migrate each compose plugin and delete its parity test); F2 (delete `legacy-compose`,
  `stage`, `priority`, `outputs`, `compose` and `Track.compose`).

### 1.4 Cross-Entry Contributions (Prepare Hook)

- **Producer:**
  [packages/core/src/domain/plugins.ts](../../packages/core/src/domain/plugins.ts)
  (`PluginContributor`, `plugin.contribute`).
- **Consumers:**
  `PluginRegistry.resolveForKeyframes` (running prepare hooks to inject unauthored properties).
- **Public Export:**
  Exported via `PluginDefinition.contribute`.
- **Replacement / Removal:**
  Eliminated. Cross-entry contributions violate isolated entry authoring and create secondary compilation rounds (`plugin-contribution-cascade`). All entries and requirements must be explicitly declared.
- **Owning Later Slices:**
  B5, C6; F2 (remove `contribute` from `PluginDefinition` and resolver).

### 1.5 Old Group Edit APIs

- **Producer:**
  [packages/core/src/runtime/project-handles.ts](../../packages/core/src/runtime/project-handles.ts),
  `TrackHandle` (`setKeyframe(group, leaf, value)`, `setKeyframeGroup(group, value)`, `removeKeyframe(group, leaf)`, `removeKeyframeGroup(group)`).
- **Consumers:**
  Apps, integration tests, runtime phase tests.
- **Public Export:**
  Public methods on `TrackHandle`.
- **Replacement / Removal:**
  Replaced by entry handles (`EntryHandle`) with scoped edits (`setValues`, `setRequirements`, `replace`) and transaction-level entry writes (`29-E1-entry-handles.md`, `30-E2-atomic-batches.md`).
- **Owning Later Slices:**
  E1, E2; G8 (apps), F1 (remaining callers); F2 (remove old methods from `TrackHandle`).

### 1.6 Flat Writes

- **Producer:**
  [packages/core/src/runtime/project-handles.ts](../../packages/core/src/runtime/project-handles.ts)
  (`track.setValues({ length: 50 })` expecting un-nested leaf keys).
- **Consumers:**
  Tests, old demo writers.
- **Public Export:**
  Public method `TrackHandle.setValues`.
- **Replacement / Removal:**
  Replaced by entry-nested value writes: `track.setValues({ [entryId]: { length: 50 } })` (`14-B8-value-writes.md`, `30-E2-atomic-batches.md`).
- **Owning Later Slices:**
  B8, E2; G8 (apps), F1 (remaining callers); F2 (enforce entry nesting).

### 1.7 SolverChain, Solves, and Members Injection

- **Producer:**
  [packages/core/src/domain/plugin-admission.ts](../../packages/core/src/domain/plugin-admission.ts)
  (`SolverChainShape`, `solverChain`),
  [packages/core/src/graph/ir.ts](../../packages/core/src/graph/ir.ts)
  (`resolveSolvers`, `node.solves`),
  [packages/core/src/runtime/graph-publisher.ts](../../packages/core/src/runtime/graph-publisher.ts)
  (injecting `inputs.members = membersList`).
- **Consumers:**
  `ikPlugin`, `ik3dPlugin`, solver constraints in `graph/solver-constraints.ts`.
- **Public Export:**
  `PluginDefinition.solverChain`, internal IR properties `solves`.
- **Replacement / Removal:**
  Replaced by explicit `skeleton` / `chain` references to canonical skeleton descriptors (`18-C4-solve-bindings.md`, `25-D4-ik-adapter.md`). Core does not inject hardcoded `members` arrays into publisher inputs. Kinematic solvers read descriptor topologies.
- **Owning Later Slices:**
  C4, D4, G4 (new solvers read descriptors); C6 (quarantine: reachable only for definitions
  matching `isLegacyComposeDefinition`, so legacy compose `ik`/`ik3d` keep working until migrated);
  F2 (delete `solverChain` from admission, `node.solves` from IR and the `members` injection).

### 1.8 Slot-Name Hardcoding and Classification

- **Producer:**
  [packages/core/src/contract/solver-slots.ts](../../packages/core/src/contract/solver-slots.ts)
  (`PLUGIN_GOALS_SLOT = "targets"`),
  [packages/core/src/graph/ir.ts](../../packages/core/src/graph/ir.ts)
  (hardcoded string literals: "root", "solver", "base", "target", "pole", "targets").
- **Consumers:**
  Graph classification rules and goal resolution in `graph/ir.ts` and `graph/solver-constraints.ts`.
- **Public Export:**
  `PLUGIN_GOALS_SLOT` constant in contract.
- **Replacement / Removal:**
  Replaced by generic capability matching and descriptor readers (`19-C5-dynamic-reader.md`, `20-C6-generic-core.md`). Core does not hardcode kinematic slot semantics; plugins declare capability requirements.
- **Owning Later Slices:**
  C5, C6 (quarantine behind `isLegacyComposeDefinition`, including the kinematic constants
  `POLE_SLOT`, `INSPECT_KEY`, `INSPECTION_KEY` and bend/flip keys that `@motion5/core/plugin-api`
  re-exports from `contract/solver-shape.ts` and `contract/solver-constraints.ts`); D4, G4 (plugins
  own those names); F2 (delete `solver-slots.ts`, the constants and their re-exports).

### 1.9 Old Per-Bone 2D/3D Generators

- **Producer:**
  [packages/three/src/skeleton-tracks.ts](../../packages/three/src/skeleton-tracks.ts)
  (`skeletonTracks`),
  [apps/pose-gap-filler/src/rig/rig.ts](../../apps/pose-gap-filler/src/rig/rig.ts)
  (`imageLimbTracks`, `worldRigProject`).
- **Consumers:**
  `packages/three/test/skeleton-driver.test.ts`, `apps/pose-gap-filler`.
- **Public Export:**
  `skeletonTracks` exported from `@motion5/three` and `@motion5/three/skeleton`.
- **Replacement / Removal:**
  Migrated, not retired. G7 rewrites `skeletonTracks` to emit new-contract 3D skeletons: one
  `point3d` chain track per maximal unbranched bone chain (zero-length points with pivot offsets),
  one `joined3d` track per captured root bone, a generated `transform3d` root frame track and an
  `fk3d` pose track, returning a bone-key to point-ID map. The driver reads poses through
  `poseFrameSource`. G8 rewrites the app generators in both 2D and 3D. No bridge or converter.
- **Owning Later Slices:**
  G7 (`skeletonTracks`, driver source and their tests); G8 (`imageLimbTracks`, `worldRigProject`).

### 1.10 Already Retired by the Plugin Structural API (ADR-142)

These items no longer exist in `packages/*/src`; they are listed so later slices do not reintroduce
them. Source: [motion5-plugin-api-decisions.md](../../motion5-implementation-plans/motion5-plugin-api-decisions.md).

- **Evaluator factory:** `createEvaluator`, `EvaluatorFactory`, `StatefulEvaluator`,
  `StatefulEvaluatorSpec`, `defineStatefulEvaluator`, `createEntryEvaluator`. Replaced by stateful
  plugin `init`/`prepare` (`defineStatefulPlugin` in `packages/core/src/domain/stateful-plugin.ts`).
  Admission refuses `createEvaluator` with "createEvaluator was removed; declare init and prepare
  instead."
- **Operation claims:** `FoldClaim` and the claims `collect: true` / `fold: { outputs }`. `collect`
  and `fold.run` are always functions; the `ExecutionStrategy` union is `stateless | stateful`.
- **Collect output label:** collect declares no output name; records publish under the reserved
  `collect` output, and a fold output named `collect` refuses at admission.
- **Plugin capability list:** `PluginDefinition.capabilities[]`. Produced capabilities come only from
  `derive` results (`DeriveResult`), and `CapabilityMap` is the typed registry.
- **Eager root-only error:** a root-only track is a legal track with no `chain` capability; FK or IK
  bound to it refuse with `derivation-missing-capability`. The duplicate-root rule belongs to
  `root.derive` (`derivation-failure`).

### 1.11 ADR-136 Solver-Chain Capability Port

- **Producer:**
  [packages/core/src/ports/plugin-capabilities.ts](../../packages/core/src/ports/plugin-capabilities.ts)
  (`PluginCapability`, `PluginCapabilities`, `UNJUDGED_CAPABILITIES`).
- **Consumers:**
  `plugin-admission.ts`, `plugins.ts`, `engine.ts`, the default and incremental graph builders,
  `graph/ir.ts`, `graph/solver-constraints.ts`, `graph-runtime`, `project-runtime` and
  `validate-v5`. C6 removed `execution-plan.ts`'s `CompiledEntryPlan.capabilities`.
- **Public Export:**
  Removed from `packages/core/src/index.ts` by C6; the port is internal to core now and absent from
  `plugin-api.ts`.
- **Replacement / Removal:**
  Unrelated to the structural `CapabilityMap`. Replaced by derived capabilities and C4 bindings.
- **Owning Later Slices:**
  C6 (done: type export removed and the port quarantined behind `isLegacyComposeDefinition`,
  because legacy compose `ik`/`ik3d` still need it); F2 (delete the port, its consumers and the
  ADR-136 parts of `packages/core/test/unit/domain/plugin-capabilities.test.ts`).

---

## 2. Test Classification

### 2.1 Retain Invariant Tests

- Generic transaction tests: atomic rollbacks, commit lifecycles, subscriber notifications (`packages/core/test/unit/runtime/structural-commit-*.test.ts`).
- Generic interpolation and scheduling tests: percent mapping, microtask scheduler, tween stops (`packages/core/test/contract/gsap-*.test.ts`, `microtask-scheduler.test.ts`).
- Core numeric and geometry guarantees: finite check, signed zero, shortest-arc angle lerp, pivot-then-extension frame composition (`packages/core/test/contract/numerics.test.ts`).
- Solver mathematics: FABRIK convergence, two-bone trigonometric correctness, target reachability.

### 2.2 Rewrite Maintained Behavior into Hybrid Form

- Authoring unit tests: rewrite tracks to use singleton-map arrays with explicit entry IDs.
- Kinematic solver tests: rewrite member/chain declarations to use `join` chains and explicit skeleton bindings.
- Runtime value write tests: rewrite flat write calls (`track.setValues({ ... })`) to entry-nested calls (`track.setValues({ [entry]: { ... } })`).

### 2.3 Remove Retired Contract Assertions

- Tests asserting `keyframes-ungrouped-key` when top-level properties lack plugin group wrappers.
- Tests asserting `keyframes-reserved-section` on top-level `requires` or `values`.
- Tests validating `solverChain` registration errors in `plugin-admission.test.ts`.
- Tests verifying `fk3d`/`ik3d` per-bone track generation in `skeleton-tracks.ts` (G7 replaces them
  with new-contract generator tests).
- C7's temporary `legacy-compose` parity tests, each deleted by the slice that migrates its plugin.

### 2.4 Guard Against "Members" False Positives

- Solvers (such as FABRIK or joined trees) legitimately handle internal member lists or point descriptors.
- Classification distinguishes the retired injected graph slot (`inputs.members`) from valid solver-local descriptor arrays. Solver-internal data structures are preserved.

---

## 3. Consumer Trace and Impact Analysis

### 3.1 Apps and Demos

- **`apps/ik-playground`:**
  - `ik-playground-project.ts`: 2D FABRIK chain. Rewritten to the 2D family in G8.
  - `ik3d-playground-project.ts`: 3D FABRIK chain using `fk3d`/`ik3d`. Rewritten to the 3D family in G8.
- **`apps/pose-gap-filler`:**
  - `imageRigProject`: 2D limb tracks. Rewritten to a 2D skeleton in G8.
  - `worldRigProject`: 3D limb tracks using `fk3d`/`ik3d`. Rewritten to a 3D skeleton in G8; not
    flagged off.
  - `writer.ts`: rewritten to entry-nested value writes in G8.
  - `view/avatar-body.ts`: keeps `SkeletonDriver`; switches to `poseFrameSource` in G8.
- **`apps/react-demo`:**
  - `full-body-project.ts`: 2D walk rig with `fk` and `transform`. Rewritten to the 2D family in G8.

### 3.2 Packages

- **`@motion5/three`:**
  - `skeletonTracks`: rewritten in G7 to emit new-contract 3D skeletons.
  - `createSkeletonDriver`, `captureSkeleton`, `SkeletonBinding`: Retained. They operate on Three `Skeleton` / `Bone` objects directly and do not depend on core graph flattening. `rigFrameSource` becomes `poseFrameSource` (G7).
  - `createObject3dPatchAdapter`: gains explicit `poses[id]` member bindings on the shared renderer-neutral binding module (G6).
- **`@motion5/plugins`:**
  - Catalog keeps `fk3d` and `ik3d` under their names with new contracts (G3, G4).
  - Catalog additions: `point` and `root` (registered, C2); `join` (hierarchical chain assembly plugin, pending C3); `point3d`, `root3d`, `join3d` (G2).
  - Migrated plugins: `transform` (D2) and `transform3d` (G1) share one frame-fold helper; `rig` becomes a fold publishing `poses` and `pose-classify` reads poses through `readPoses3d` (G5). `rig` stays distinct from the skeleton model.

---

## 4. Architectural Boundaries and Non-Goals

- **No PlanX Converter:** No transitional bridge or automatic file upgrader from old grouping to hybrid format. Clean break. The only temporary runtime exception is C7's `legacy-compose` strategy for not-yet-migrated compose plugins, deleted by F2.
- **No Tree Plugin:** No standalone monolithic "tree" plugin. Tree topologies are formed by composing `join` plugins referencing parent points.
- **No 3D Bridge:** No runtime adapter translating old `fk3d` calls to hybrid entries. Phase G migrates 3D plugins, generators and consumers directly; cross-space wiring is refused by distinct capability names.

---

## 5. Actionable Worklists for Slices G, F1 and F2

### 5.1 G Worklist (Migrate 3D and Apps)

1. G1–G5: migrate `transform3d`, add the 3D skeleton family, rebuild `fk3d`/`ik3d`, move `rig` and `pose-classify` onto `poses`.
2. G6–G7: Three pose-member bindings; rewrite `packages/three/src/skeleton-tracks.ts` and `packages/three/test/skeleton-*.test.ts`.
3. G8: rewrite `apps/react-demo/src/full-body-project.ts`, both `apps/ik-playground` projects and both `apps/pose-gap-filler` rigs with `writer.ts`.
4. D4 and G4: rewrite the executed guide examples in `docs/guide/inverse-kinematics.md` and `docs/guide/inverse-kinematics-3d.md`.

### 5.2 F1 Worklist (Rewrite Remaining Package Callers)

1. Update package integration and unit tests under `packages/core/test/` and remaining package fixtures to hybrid syntax.
2. Rewrite remaining doc examples not owned by a migrating slice.

### 5.3 F2 Worklist (Delete Obsolete Machinery)

1. Delete `packages/core/src/domain/keyframe-groups.ts` and update `authored-values.ts`, `engine.ts`, `plugins.ts`.
2. Delete `packages/core/src/contract/solver-slots.ts`.
3. Remove `PluginStage` ("prepare" | "compose"), `priority`, `outputs`, `contribute` and `compose` from `PluginDefinition` and `PluginRegistry`.
4. Remove `solverChain` from `plugin-admission.ts` and `PluginDefinition`.
5. Remove `node.solves` and injected `members` from `ir.ts` and `graph-publisher.ts`, with the `isLegacyComposeDefinition` predicate and every C6 quarantine marker.
6. Remove old group-based track handle methods (`setKeyframe`, `setKeyframeGroup`, `removeKeyframe`, `removeKeyframeGroup`).
7. Remove the `legacy-compose` execution strategy, its exhaustive-switch cases, the `legacy-compose-mixed-track` rule id, `Track.compose` and plugin-name requirement scoping; remove the kinematic constants re-exported by `@motion5/core/plugin-api`.
8. Confirm `join` (C3) and `point3d`/`root3d`/`join3d` (G2) are exported; F2 adds no plugins.
