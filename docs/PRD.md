# motion5 product requirements

**Owner:** [@chahyasantoso](https://github.com/chahyasantoso)
**Status:** Accepted for Phase 0
**Authored contract:** `schemaVersion: 5`
**Migration:** [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md)

## Contract decision

motion5 uses authored schema v5. Schema v4 is not accepted as an alias. The v4-to-v5 migration is explicit: bump the version, rename project-level `tracks` to `freeTracks`, qualify free-track references as `~/trackId`, and validate perspective metadata for 3D scenes.

## 1. Problem

Rich web animation work fails at the same place every time: dependency between animated things. A hand follows a forearm, which follows an upper arm, which follows a scroll position. Tools handle the single-timeline case well and the dependency case badly.

## 2. Vision

A small animation runtime where **ownership is impossible to misunderstand**. One authority per state transition, one live state per project, one publication path, one clock.

## 3. Goals

1. **G1 Deterministic evaluation.** Same authored project plus same tick sequence yields byte-identical published patches.
2. **G2 Single authority.** Every state transition has exactly one code path. No aliases, parity modes, rollout flags, or schema-version aliases.
3. **G3 Renderer neutrality.** Core resolves and publishes without GSAP, DOM, or React imports.
4. **G4 Transactional topology.** Failed graph mutations leave IR, live edges, indexes, subscriptions, and patches unchanged.
5. **G5 Immutable publication.** Subscribers receive frozen, revisioned patches in whole batches.
6. **G6 Honest gates.** CI measures behavior, API shape, boundaries, packaging, or formatting.
7. **G7 Leak-free lifecycle.** Teardown is owner-first and idempotent.
8. **G8 Small public surface.** Published exports are allow-listed.

## 4. Functional requirements

### Authoring and loading

- **FR-1** Load and validate authored `schemaVersion: 5` projects. v4 input fails with a migration diagnostic before mount.
- **FR-2** Reject ambiguous, duplicate, malformed, unknown, self-referential, and cyclic references with rule id, authored path, message, severity, and ids.
- **FR-3** Normalize motion ids to `motionId/trackId` and free tracks to `~/trackId` exactly once at load.
- **FR-4** Support explicit v4-to-v5 migration outside the runtime; do not auto-migrate or accept aliases.
- **FR-5** Preserve optional `perspective` as validated renderer metadata and emit a warning when 3D data lacks it.

### Graph and runtime

- **FR-6** Produce immutable graph IR with nodes, edges, diagnostics, and canonical topological order.
- **FR-7** Route every topology change through one transactional mutation coordinator.
- **FR-8** Keep one long-lived observation state per project.
- **FR-9** One ProjectRuntime owns exactly one GraphRuntime, publisher, patch registry, and clock subscription.
- **FR-10** One flush per tick produces one immutable batch; each dirty node composes at most once.
- **FR-11** Track is a leaf; Motion is the sole composite; graph traversal belongs to the graph layer.

### Ports and adapters

- **FR-12** Define injectable Clock, Interpolator, and Scheduler ports with fakes.
- **FR-13** Provide GSAP and DOM adapters behind ports, and React hooks over immutable patches.

### Membership

- **FR-14** Support cross-motion references and `~/trackId` free tracks with no capability flag.
- **FR-15** Diagnose missing, unknown, duplicate, role-mismatched, and incompatible references consistently.

## 5. Non-goals

- Backward compatibility with the runtime API of motionpath.
- A demo application or example gallery in this repository.
- A visual editor, physics engine, or SSR ticking.

## 6. Release criteria for v1

1. Authored schema v5 projects load and validate; v4 projects receive the documented migration diagnostic.
2. One qualified graph and one long-lived observation state exist per loaded project.
3. The mutation coordinator is the only topology writer; the publisher cannot mutate topology.
4. Track is a leaf and Motion is the sole composite.
5. Core imports no animation engine or DOM.
6. Free tracks and cross-motion references share the same graph path with no flags.
7. Migration, tests, types, exports, docs, and benchmarks describe only the v5 contract.
8. Every CI gate exists and runs.

## 7. Open questions

- **Q1** Closed: authored schema v5 is the contract. v4 migration is explicit and external to the runtime.
- **Q2** Reference interpolator: GSAP adapter, or built-in sampler with GSAP optional. Current position: GSAP first.
- **Q3** Diagnostics inline on patches, or separate stream. Current position: inline, with batch summary.
- **Q4** Is `packages/react` in v1. Current position: yes, minimal surface.
