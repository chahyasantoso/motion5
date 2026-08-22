# Session status

**Captured:** 2026-08-22, Asia/Jakarta  
**Branch verified:** `feat/observes-output-only`  
**Phase:** runtime mutation model, trigger drivers, compiled Track ownership, edge identity, trigger progress ownership, teardown ownership, single-track mutation atomicity, declared package entrypoints, Scheduler and public port contracts, clock tick error attribution, time loop semantics, the GSAP-backed scroll source producer seam, plugin-named keyframe groups, internal-key enforcement, per-plugin key ownership, plugin-owned input requirements, transactional Track replacement, the removal of the dead observation target, and the collapse of two composition input channels into one.

This document reports current implementation reality. Plans and audits describe intent unless this file says they landed.

## Shipped runtime work

- Runtime mutation model W1 through W5 is complete through PRs [#109](https://github.com/chahyasantoso/motion5/pull/109), [#110](https://github.com/chahyasantoso/motion5/pull/110), [#111](https://github.com/chahyasantoso/motion5/pull/111), [#112](https://github.com/chahyasantoso/motion5/pull/112), and [#113](https://github.com/chahyasantoso/motion5/pull/113).
- Trigger drivers through `T5`, compiled Track ownership option C, edge identity and ordering, progress range ownership, teardown ownership, clock error boundaries, time loop semantics, the GSAP scroll source seam, plugin-named groups, internal-key enforcement, and per-plugin key ownership have landed. See ADRs 034 and 039 through 043.
- Plugin-owned input requirements landed in [PR #174](https://github.com/chahyasantoso/motion5/pull/174), closing [issue #173](https://github.com/chahyasantoso/motion5/issues/173). A plugin declares `requirements`; an author binds those slots under `keyframes.<plugin>.requires`; the graph derives one input edge per binding; and composition receives the upstream values scoped by plugin and slot.
- `fkPlugin` declares the `base` requirement, reads `inputs.base`, and does not require the author to invent `parentX`, `parentY`, or `parentRotation`. The walker demo moved thirteen repeated projection blocks into bindings beside the FK keyframes. Published values are unchanged.
- The authored `requires` section is metadata, not a keyframe. `validateKeyframes` owns registry-independent shape, `PluginRegistry` owns plugin and slot resolution, and graph construction owns source, cycle, duplicate, and self-reference validation. ADR-044 records the decision.
- Track replacement is staged and committed transactionally as of [PR #178](https://github.com/chahyasantoso/motion5/pull/178), with ADR-045 and U-1 through U-8 evidence.
- `ObservationDefinition.target` is gone, closing [issue #175](https://github.com/chahyasantoso/motion5/issues/175) with ADR-046 and V-1 through V-7 evidence. It is deleted from `GraphEdge`, from `edgeKey`, from `compareEdges`, and from `ObservationState.normalizeEdge`, and an authored one is refused as `observation-target-unsupported` on both roles, replacing `observation-output-target`.
- `observes` declares an output edge only, closing [issue #180](https://github.com/chahyasantoso/motion5/issues/180) with ADR-047 and J-1 through J-9 evidence. `keyframes.<plugin>.requires` is now the only way a value enters composition. An `observes` entry has exactly one authored field, `source`, which supersedes the three-field description ADR-046 left behind. An authored `role` is refused as `observation-role-unsupported` at either value, and an authored `projection` as `observation-projection-unsupported`.
- The flat input bag is gone rather than merely unused. `InputProjection`, `GraphEdge.projection`, `validateProjection`, `canonicalizeProjection`, and `projectValues` are deleted, `Track.compose` and `PublisherNode.compose` take one parameter, and `Track` no longer keeps `#lastInputs` or its half of the dirty check. `observation-input-collision` and `observation-input-projection` retire with the primitives they guarded, and so does `observation-role`. The invariant is not that no caller merges an upstream value into a track's authored namespace; it is that no parameter exists to merge one with.
- `GraphEdge.role` stays and names the composition phase. It cannot drift from `requirement`: each is set by one literal in one resolver, and `J-5` pins the equivalence over a whole built graph.

## Documentation and package surface

- Consumer documentation lives under `docs/guide/` and names only declared package entrypoints.
- `@motion5/core` remains private at `0.0.0`; packaged-consumer verification and publication remain Phase 6 work.
- `PluginDefinition.requirements` is optional. `PluginComposer` receives values, progress, and that plugin's scoped inputs. `ResolvedPlugins.requirements` reports resolved bindings. The public entrypoint allow-list is unchanged.
- `ObservationDefinition` narrows to one member and `InputProjection` is deleted. Neither `InputProjection` nor `GraphEdge` was ever in `packages/core/src/index.ts` or in the `allowedPublicExports` set in `scripts/boundary-scan.mjs`, so no export list, entrypoint, or boundary allow-list entry changes.
- The authored schema, the diagnostics guide, the API reference, and the migration guide all state that a `target`, a `role`, and a `projection` are refused rather than ignored, and that a plugin requirement is the only input channel. The migration guide previously produced `role: "input"`, which the runtime now rejects; it maps an input edge to a plugin binding instead.
- `docs/acceptance-map.json` maps `requirement-scoped-inputs` to `publisher-requirement-inputs.test.ts`. It previously mapped `flat-projected-inputs` to a file this slice deleted, which `acceptance-scan` reports as a missing mapped test.

## Accepted behavior, not remaining defects

- `ProjectHandle.seek(nodeId, progress)` is leaf-level scrubbing. On a driver-backed Motion, the next driver emission overwrites a seeked value.
- Owner-based `adopt` and `destroyAdopted` remain available for compatibility; current consumer code should use `addTrack` and `TrackHandle`.
- A scheduled job runs in its scheduler pass even when another job throws; the configured error boundary reports the failure once.
- A tick whose clock consumer fails still flushes the graph. The failure is attributed to the consumer boundary, not to graph flushing.
- A Motion is destroyed empty. Remove its tracks before destroying it.
- `fkPlugin` replaces local authored `rotation` with world-space `rotation` in its composed output. The local value is not published beside the world value.
- A refused Track replacement leaves the previous compiled Track live and retryable; a successful replacement preserves the Motion entry index and stagger timing.
- An authored observation `target`, `role`, or `projection` is an error rather than an ignored key, for the same reason `use` is. Both packages are unpublished at `0.0.0`, so no removal carries a compatibility shim.
- A generic `observes` entry cannot feed a track's own composition, by design. There is no authored form for an input edge; a plugin requirement is the only one.
- An input edge carrying no requirement is unreachable by construction and throws `observation-input-shape` naming the edge. It is an explicit guard rather than a reachable state.

## Follow-up issues

- `TR-D-05` of `docs/TRD.md` still describes an observation edge as `(source, role, target)` and still requires a non-empty `target` for an input edge. Both statements were already superseded, first by ADR-034's edge identity and then by the input projection work, and ADR-047 adds a third contradiction by removing the authored `role`. [Issue #182](https://github.com/chahyasantoso/motion5/issues/182) owns that docs slice, together with the `core/graph/validate.ts` owner that `docs/IMPLEMENTATION-PLAN.md` still names for the same rules. It is deliberately not edited here: two owners for one paragraph is how a normative requirement ends up saying two things.

## Evidence anchors

- Plugin-owned requirements red run: [32476954868](https://github.com/chahyasantoso/motion5/actions/runs/32476954868), archived at `logs/32476954868/` on `ci-logs`. The run reported `5 failed | 200 passed`; the key failure was `stops-shape` for `keyframes.fk.requires`, proving the new section was absent before implementation.
- Plugin-owned requirements green run: [32478658229](https://github.com/chahyasantoso/motion5/actions/runs/32478658229), all six behavioral jobs green, including `format:check` inside `quality`.
- Transactional Track replacement red run: [32484448662](https://github.com/chahyasantoso/motion5/actions/runs/32484448662), archived at `logs/32484448662/` on `ci-logs`; U-1/U-3 failed and typecheck named the absent staging seam.
- Transactional Track replacement final green run: [32487529184](https://github.com/chahyasantoso/motion5/actions/runs/32487529184); quality, integration, boundaries, build, end-to-end, performance, and the Prettier repair job passed.
- Observation target removal red run: [32491256526](https://github.com/chahyasantoso/motion5/actions/runs/32491256526), archived at `logs/32491256526/` on `ci-logs`. `quality` failed `typecheck` with `TS2322` twice, naming the two constants that assert the member is absent, and `integration` reported `1 failed | 209 passed`, the failure being `V-7` with `expected [Function] to throw an error`: `addObserve` accepted the field and did nothing with it.
- Observation target removal green run: [32491803628](https://github.com/chahyasantoso/motion5/actions/runs/32491803628), all six behavioral jobs green plus the Prettier job, which found no drift to repair.
- Single input channel red run: [32559525865](https://github.com/chahyasantoso/motion5/actions/runs/32559525865), archived at `logs/32559525865/` on `ci-logs`. `quality` failed `typecheck` with sixteen errors: five `TS2322: Type 'true' is not assignable to type 'false'` in `single-input-channel.test.ts` for the three absent members and the two composition arities, and eleven `TS2345`/`TS2322` across six files, all of them a composer written against one parameter meeting a seam that still declared two. `integration` reported `6 failed | 206 passed`; `J-7` failed with `expected [Function] to throw an error`, and the five converted cases failed because the flat bag arrived where the requirement scope belonged, composing `parentWorld: null`, `{}`, and `total: 0`.
- Single input channel green run: recorded here and in ADR-047 once the behavioral jobs report on this head.
- Cases `Q-1` through `Q-12` cover requirement shape, plugin-owned slot validation, derived graph edges, multi-source identity, and scoped composition. `Q-8` is a compatibility guard and passes on the parent by design.
- Cases `U-1` through `U-8` cover replacement compile refusal, Motion refusal, graph rejection, staging order, rollback order, and rollback error precedence.
- Cases `V-1` through `V-5` and `V-7` cover the absent target declarations, the refusal on both roles, the identity collapse the field used to hide, live state, and `addObserve`. `V-6` retired with the generic input channel it guarded.
- Cases `J-1` through `J-9` cover the absent declarations, the two new refusals, the role and requirement equivalence, identity without a projection, `addObserve`, the FK rig composing an upstream value without it becoming an authored one, and the one-parameter arity of both composition seams. `J-5` and `J-8` are guards and pass on the parent by design.
- Cases `Z-1` through `Z-3` cover edge-construction symmetry between the two authored forms that derive an edge.
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
- One question, one mechanism. Where two mechanisms answer "where does an upstream value land" and one of them can overwrite an authored value, the weaker one is deleted rather than documented as discouraged.
