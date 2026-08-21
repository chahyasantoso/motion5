# Session status

**Captured:** 2026-08-21, Asia/Jakarta  
**Branch verified:** `fix/issue-175-remove-observation-target`  
**Phase:** runtime mutation model, trigger drivers, compiled Track ownership, edge identity, trigger progress ownership, teardown ownership, single-track mutation atomicity, declared package entrypoints, Scheduler and public port contracts, clock tick error attribution, time loop semantics, the GSAP-backed scroll source producer seam, plugin-named keyframe groups, internal-key enforcement, per-plugin key ownership, plugin-owned input requirements, transactional Track replacement, and the removal of the dead observation target.

This document reports current implementation reality. Plans and audits describe intent unless this file says they landed.

## Shipped runtime work

- Runtime mutation model W1 through W5 is complete through PRs [#109](https://github.com/chahyasantoso/motion5/pull/109), [#110](https://github.com/chahyasantoso/motion5/pull/110), [#111](https://github.com/chahyasantoso/motion5/pull/111), [#112](https://github.com/chahyasantoso/motion5/pull/112), and [#113](https://github.com/chahyasantoso/motion5/pull/113).
- Trigger drivers through `T5`, compiled Track ownership option C, edge identity and ordering, progress range ownership, teardown ownership, clock error boundaries, time loop semantics, the GSAP scroll source seam, plugin-named groups, internal-key enforcement, and per-plugin key ownership have landed. See ADRs 034 and 039 through 043.
- Plugin-owned input requirements landed in [PR #174](https://github.com/chahyasantoso/motion5/pull/174), closing [issue #173](https://github.com/chahyasantoso/motion5/issues/173). A plugin declares `requirements`; an author binds those slots under `keyframes.<plugin>.requires`; the graph derives one input edge per binding; and composition receives the upstream values scoped by plugin and slot.
- `fkPlugin` now declares the `base` requirement, reads `inputs.base`, and no longer requires the author to invent `parentX`, `parentY`, or `parentRotation`. The walker demo moved thirteen repeated projection blocks into bindings beside the FK keyframes. Published values are unchanged.
- The authored `requires` section is metadata, not a keyframe. `validateKeyframes` owns registry-independent shape, `PluginRegistry` owns plugin and slot resolution, and graph construction owns source, cycle, duplicate, and self-reference validation. ADR-044 records the decision.
- Track replacement is now staged and committed transactionally in [PR #178](https://github.com/chahyasantoso/motion5/pull/178), with ADR-045 and U-1 through U-8 evidence. All CI gates are green.
- `ObservationDefinition.target` is gone, closing [issue #175](https://github.com/chahyasantoso/motion5/issues/175) with ADR-046 and V-1 through V-7 evidence. It is deleted from `GraphEdge`, from `edgeKey`, from `compareEdges`, and from `ObservationState.normalizeEdge`, and an authored one is now refused as `observation-target-unsupported` on both roles, replacing `observation-output-target`. An `observes` entry has exactly three authored fields: `source`, `role`, and `projection`.

## Documentation and package surface

- Consumer documentation lives under `docs/guide/` and names only declared package entrypoints.
- `@motion5/core` remains private at `0.0.0`; packaged-consumer verification and publication remain Phase 6 work.
- `PluginDefinition.requirements` is optional. `PluginComposer` receives a third argument containing that plugin's scoped inputs. `ResolvedPlugins.requirements` reports resolved bindings. The public entrypoint allow-list is unchanged.
- The schema now documents plugin-owned requirements, scoped composition inputs, and the fact that `requires` replaces FK projection maps. Generic `observes` remains available for generic graph edges.
- `ObservationDefinition` loses one optional member and no export list changes, so the boundary allow-list is untouched. The authored schema, the diagnostics guide, and the migration guide all state that a `target` is refused rather than ignored.

## Accepted behavior, not remaining defects

- `ProjectHandle.seek(nodeId, progress)` is leaf-level scrubbing. On a driver-backed Motion, the next driver emission overwrites a seeked value.
- Owner-based `adopt` and `destroyAdopted` remain available for compatibility; current consumer code should use `addTrack` and `TrackHandle`.
- A scheduled job runs in its scheduler pass even when another job throws; the configured error boundary reports the failure once.
- A tick whose clock consumer fails still flushes the graph. The failure is attributed to the consumer boundary, not to graph flushing.
- A Motion is destroyed empty. Remove its tracks before destroying it.
- `fkPlugin` replaces local authored `rotation` with world-space `rotation` in its composed output. The local value is not published beside the world value.
- A refused Track replacement leaves the previous compiled Track live and retryable; a successful replacement preserves the Motion entry index and stagger timing.
- An authored observation `target` is an error rather than an ignored key, for the same reason `use` is. Both packages are unpublished at `0.0.0`, so neither removal carries a compatibility shim.

## Follow-up issues

- `TR-D-05` of `docs/TRD.md` still describes an observation edge as `(source, role, target)` and still requires a non-empty `target` for an input edge. Both statements were already superseded, first by ADR-034's edge identity and then by the input projection work, so this is pre-existing drift in a normative requirement rather than drift introduced by ADR-046. It needs its own docs slice, together with the `core/graph/validate.ts` owner that `docs/IMPLEMENTATION-PLAN.md` still names for the same rules.

## Evidence anchors

- Plugin-owned requirements red run: [32476954868](https://github.com/chahyasantoso/motion5/actions/runs/32476954868), archived at `logs/32476954868/` on `ci-logs`. The run reported `5 failed | 200 passed`; the key failure was `stops-shape` for `keyframes.fk.requires`, proving the new section was absent before implementation.
- Plugin-owned requirements green run: [32478658229](https://github.com/chahyasantoso/motion5/actions/runs/32478658229), all six behavioral jobs green, including `format:check` inside `quality`.
- Transactional Track replacement red run: [32484448662](https://github.com/chahyasantoso/motion5/actions/runs/32484448662), archived at `logs/32484448662/` on `ci-logs`; U-1/U-3 failed and typecheck named the absent staging seam.
- Transactional Track replacement final green run: [32487529184](https://github.com/chahyasantoso/motion5/actions/runs/32487529184); quality, integration, boundaries, build, end-to-end, performance, and the Prettier repair job passed.
- Observation target removal red run: [32491256526](https://github.com/chahyasantoso/motion5/actions/runs/32491256526), archived at `logs/32491256526/` on `ci-logs`. `quality` failed `typecheck` with `TS2322` twice, naming the two constants that assert the member is absent, and `integration` reported `1 failed | 209 passed`, the failure being `V-7` with `expected [Function] to throw an error`: `addObserve` accepted the field and did nothing with it.
- Observation target removal green run: [32491803628](https://github.com/chahyasantoso/motion5/actions/runs/32491803628), all six behavioral jobs green plus the Prettier job, which found no drift to repair.
- Cases `Q-1` through `Q-12` cover requirement shape, plugin-owned slot validation, derived graph edges, multi-source identity, and scoped composition. `Q-8` is a compatibility guard and passes on the parent by design.
- Cases `U-1` through `U-8` cover replacement compile refusal, Motion refusal, graph rejection, staging order, rollback order, and rollback error precedence.
- Cases `V-1` through `V-7` cover the absent declarations, the refusal on both roles, the identity collapse the field used to hide, live state, and `addObserve`. `V-6` is a compatibility guard and passes on the parent by design.
- Per-plugin ownership evidence: cases `N-1` through `N-10` and [ADR-043](https://github.com/chahyasantoso/motion5/blob/main/docs/ADR-043-per-plugin-key-ownership.md).

## Guardrails

- One owner per state transition and one owner per normalization.
- No compatibility flags, facades, placeholder tests, renderer imports, or core GSAP imports.
- Every behavioral recovery slice starts with failing-first evidence and archives the failed run when the pipeline supports it.
- Docs, public types, tests, and status move together.
- A cited evidence case id names exactly one test in the suite.
- Formatting is a hard CI gate; hand-padded Markdown tables are avoided.
- A key may have several claimants; the authored group names the owner. A plugin-owned requirement is scoped and never merged into authored values.
- A field with no consumer is removed and then refused, never left declared or silently ignored.
