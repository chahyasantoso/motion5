# Skeldata v5 Deletions and Consumer Inventory

Normative inventory of deprecated contracts, APIs, generators, and consumers for skeldata v5.
Every entry specifies producer, consumers, public export status, replacement/removal strategy, and owning slice.

## 1. Inventory of Retired Machinery

### 1.1 Object-Group Parser and Flattening

- **Producer:**
  [packages/core/src/domain/keyframe-groups.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/domain/keyframe-groups.ts)
  (`flattenAuthoredKeyframes`, `FlattenedKeyframes`, `FlattenedKeyframe`).
- **Consumers:**
  [packages/core/src/engine.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/engine.ts),
  [packages/core/src/domain/plugins.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/domain/plugins.ts),
  [packages/core/src/runtime/authored-values.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/runtime/authored-values.ts),
  [packages/core/src/contract/keyframe-shape.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/contract/keyframe-shape.ts).
- **Public Export:**
  Internal to `@motion5/core`; shape interfaces exported via core contract types.
- **Replacement / Removal:**
  Replaced by canonical entry-map parsing (`08-B2-execution-plan.md`, `09-B3-leaf-codec.md`). Authored keyframes become singleton-map entry records (`{ [entryId]: { plugin, values, requires } }`).
- **Owning Later Slices:**
  B2, B3 (new contract parser); F1 (consumer rewrites); F2 (removal of `keyframe-groups.ts`).

### 1.2 Plugin-Name Requirement Scoping and Group Syntax

- **Producer:**
  [packages/core/src/contract/keyframe-shape.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/contract/keyframe-shape.ts)
  (`PLUGIN_REQUIRES_SECTION`, `PLUGIN_VALUES_SECTION`, `readPluginBindings`, `readPluginValues`).
- **Consumers:**
  `flattenAuthoredKeyframes`, `PluginRegistry.resolveForKeyframes`, validator in
  [packages/core/src/contract/validate-v5.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/contract/validate-v5.ts).
- **Public Export:**
  Public authoring schema constants and diagnostic codes (`keyframes-reserved-section`, `keyframes-ungrouped-key`).
- **Replacement / Removal:**
  Replaced by explicit entry descriptors where each entry has an outer ID, a declared `plugin`, `values` record, and `requires` record. No reserved group names (`values`/`requires`) at top-level; section names belong to entry object.
- **Owning Later Slices:**
  B1, B2, B5 (entry authoring & requirements); F2 (delete group-section parser).

### 1.3 Stage, Priority, Compose, and Top-Level Outputs

- **Producer:**
  [packages/core/src/domain/plugins.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/domain/plugins.ts)
  (`PluginStage` "prepare" | "compose", `priority`, `outputs`, `stageRank`).
- **Consumers:**
  `PluginRegistry.register`, `comparePlugins`, `finalizeGraph`, `GraphPublisher`.
- **Public Export:**
  Exported via `@motion5/core/plugin-api` (`PluginDefinition.stage`, `priority`, `outputs`).
- **Replacement / Removal:**
  Replaced by single-stage execution plan and generic derivation hooks. Entries evaluate in dependency order via compiled execution plans (`08-B2-execution-plan.md`, `20-C6-generic-core.md`). Stage ranking and arbitrary priority numbers are eliminated.
- **Owning Later Slices:**
  B2, C6; F2 (delete stage and priority fields from `PluginDefinition`).

### 1.4 Cross-Entry Contributions (Prepare Hook)

- **Producer:**
  [packages/core/src/domain/plugins.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/domain/plugins.ts)
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
  [packages/core/src/runtime/project-handles.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/runtime/project-handles.ts),
  `TrackHandle` (`setKeyframe(group, leaf, value)`, `setKeyframeGroup(group, value)`, `removeKeyframe(group, leaf)`, `removeKeyframeGroup(group)`).
- **Consumers:**
  Apps, integration tests, runtime phase tests.
- **Public Export:**
  Public methods on `TrackHandle`.
- **Replacement / Removal:**
  Replaced by entry handles (`EntryHandle`) with scoped edits (`setValues`, `setRequirements`, `replace`) and transaction-level entry writes (`29-E1-entry-handles.md`, `30-E2-atomic-batches.md`).
- **Owning Later Slices:**
  E1, E2; F1 (rewrite callers); F2 (remove old methods from `TrackHandle`).

### 1.6 Flat Writes

- **Producer:**
  [packages/core/src/runtime/project-handles.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/runtime/project-handles.ts)
  (`track.setValues({ length: 50 })` expecting un-nested leaf keys).
- **Consumers:**
  Tests, old demo writers.
- **Public Export:**
  Public method `TrackHandle.setValues`.
- **Replacement / Removal:**
  Replaced by entry-nested value writes: `track.setValues({ [entryId]: { length: 50 } })` (`14-B8-value-writes.md`, `30-E2-atomic-batches.md`).
- **Owning Later Slices:**
  B8, E2; F1 (caller migration); F2 (enforce entry nesting).

### 1.7 SolverChain, Solves, and Members Injection

- **Producer:**
  [packages/core/src/domain/plugin-admission.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/domain/plugin-admission.ts)
  (`SolverChainShape`, `solverChain`),
  [packages/core/src/graph/ir.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/graph/ir.ts)
  (`resolveSolvers`, `node.solves`),
  [packages/core/src/runtime/graph-publisher.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/runtime/graph-publisher.ts)
  (injecting `inputs.members = membersList`).
- **Consumers:**
  `ikPlugin`, `ik3dPlugin`, solver constraints in `graph/solver-constraints.ts`.
- **Public Export:**
  `PluginDefinition.solverChain`, internal IR properties `solves`.
- **Replacement / Removal:**
  Replaced by explicit `skeleton` / `chain` references to canonical skeleton descriptors (`18-C4-solve-bindings.md`, `25-D4-ik-adapter.md`). Core does not inject hardcoded `members` arrays into publisher inputs. Kinematic solvers read descriptor topologies.
- **Owning Later Slices:**
  C4, D4; F2 (delete `solverChain` from admission and `node.solves` from IR).

### 1.8 Slot-Name Hardcoding and Classification

- **Producer:**
  [packages/core/src/contract/solver-slots.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/contract/solver-slots.ts)
  (`PLUGIN_GOALS_SLOT = "targets"`),
  [packages/core/src/graph/ir.ts](file:///c:/Data/dev/motion5/motion5/packages/core/src/graph/ir.ts)
  (hardcoded string literals: "root", "solver", "base", "target", "pole", "targets").
- **Consumers:**
  Graph classification rules and goal resolution in `graph/ir.ts` and `graph/solver-constraints.ts`.
- **Public Export:**
  `PLUGIN_GOALS_SLOT` constant in contract.
- **Replacement / Removal:**
  Replaced by generic capability matching and descriptor readers (`19-C5-dynamic-reader.md`, `20-C6-generic-core.md`). Core does not hardcode kinematic slot semantics; plugins declare capability requirements.
- **Owning Later Slices:**
  C5, C6; F2 (delete `solver-slots.ts`).

### 1.9 Old Per-Bone 2D/3D Generators

- **Producer:**
  [packages/three/src/skeleton-tracks.ts](file:///c:/Data/dev/motion5/motion5/packages/three/src/skeleton-tracks.ts)
  (`skeletonTracks`),
  [apps/pose-gap-filler/src/rig/rig.ts](file:///c:/Data/dev/motion5/motion5/apps/pose-gap-filler/src/rig/rig.ts)
  (`imageLimbTracks`, `worldRigProject`).
- **Consumers:**
  `packages/three/test/skeleton-driver.test.ts`, `apps/pose-gap-filler`.
- **Public Export:**
  `skeletonTracks` exported from `@motion5/three` and `@motion5/three/skeleton`.
- **Replacement / Removal:**
  Retired in first release. Skeldata v5 targets 2D hybrid skeleton authoring (`root`, `join`, `ik`, `fk`). 3D skeleton generators emitting per-bone tracks are removed. `skeletonTracks` is deferred/retired; callers use explicit 2D hybrid definitions or standalone Three drivers.
- **Owning Later Slices:**
  F1, F2 (retire `skeletonTracks` and dependent 3D generator suites).

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
- Tests verifying `fk3d`/`ik3d` per-bone track generation in `skeleton-tracks.ts`.

### 2.4 Guard Against "Members" False Positives

- Solvers (such as FABRIK or joined trees) legitimately handle internal member lists or point descriptors.
- Classification distinguishes the retired injected graph slot (`inputs.members`) from valid solver-local descriptor arrays. Solver-internal data structures are preserved.

---

## 3. Consumer Trace and Impact Analysis

### 3.1 Apps and Demos

- **`apps/ik-playground`:**
  - `ik-playground-project.ts`: 2D FABRIK chain. Rewritten to hybrid entries in F1.
  - `ik3d-playground-project.ts`: 3D FABRIK chain using `fk3d`/`ik3d`. Deferred in first release; app conditionally exposes 2D playground.
- **`apps/pose-gap-filler`:**
  - `imageRigProject`: 2D limb tracks. Rewritten to 2D hybrid skeleton in F1.
  - `worldRigProject`: 3D limb tracks using `fk3d`/`ik3d`. Deferred; world rig feature flagged off until 3D kinematics re-land.
  - `avatar-body.ts`: Uses `SkeletonDriver` and Three matrices; independent of old keyframe grouping. Retained.
- **`apps/react-demo`:**
  - `full-body-project.ts`: 2D walk rig with `fk` and `transform`. Rewritten to hybrid entries in F1.

### 3.2 Packages

- **`@motion5/three`:**
  - `skeletonTracks`: Retired/deferred. Generates obsolete per-bone `fk3d` tracks.
  - `createSkeletonDriver`, `captureSkeleton`, `SkeletonBinding`: Retained. They operate on Three `Skeleton` / `Bone` objects directly and do not depend on core graph flattening.
- **`@motion5/plugins`:**
  - Catalog removals/deferrals: `fk3d`, `ik3d`.
  - Catalog additions: `root` (root placement plugin), `join` (hierarchical point/chain assembly plugin).
  - Retained plugins: `transform`, `transform3d`, `rig` (pose and control aggregation; distinct from skeleton model).

---

## 4. Architectural Boundaries and Non-Goals

- **No PlanX Converter:** No transitional bridge or automatic file upgrader from old grouping to hybrid format. Clean break.
- **No Tree Plugin:** No standalone monolithic "tree" plugin. Tree topologies are formed by composing `join` plugins referencing parent points.
- **No Temporary 3D Bridge:** No runtime adapter translating old `fk3d` calls to hybrid entries. Incompatible 3D skeleton generators are cleanly deferred.

---

## 5. Actionable Worklists for Slices F1 and F2

### 5.1 F1 Worklist (Rewrite Maintained Callers & Generators)

1. Rewrite `apps/react-demo/src/full-body-project.ts` to singleton-map hybrid entries.
2. Rewrite `apps/ik-playground/src/ik-playground-project.ts` to hybrid format; defer `ik3d-playground-project.ts`.
3. Rewrite `apps/pose-gap-filler/src/rig/rig.ts` (`imageRigProject`) to hybrid format; defer `worldRigProject`.
4. Update package integration and unit tests under `packages/core/test/` to hybrid syntax.
5. Defer `packages/three/src/skeleton-tracks.ts` and update `packages/three/test/skeleton-driver.test.ts`.

### 5.2 F2 Worklist (Delete Obsolete Machinery)

1. Delete `packages/core/src/domain/keyframe-groups.ts` and update `authored-values.ts`, `engine.ts`, `plugins.ts`.
2. Delete `packages/core/src/contract/solver-slots.ts`.
3. Remove `PluginStage` ("prepare" | "compose"), `priority`, and `contribute` from `PluginDefinition` and `PluginRegistry`.
4. Remove `solverChain` from `plugin-admission.ts` and `PluginDefinition`.
5. Remove `node.solves` and injected `members` from `ir.ts` and `graph-publisher.ts`.
6. Remove old group-based track handle methods (`setKeyframe`, `setKeyframeGroup`, `removeKeyframe`, `removeKeyframeGroup`).
7. Remove `fk3d` and `ik3d` from `packages/plugins/src/catalog.ts` and `packages/plugins/package.json` exports.
8. Add and export `root` and `join` plugins in `packages/plugins`.
