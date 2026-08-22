# Session status

**Captured:** 2026-08-22, Asia/Jakarta  
**Branch verified:** `feat/plugin-group-values-section`  
**Phase:** runtime mutation model, trigger drivers, compiled Track ownership, edge identity, trigger progress ownership, teardown ownership, single-track mutation atomicity, declared package entrypoints, Scheduler and public port contracts, clock tick error attribution, time loop semantics, the GSAP-backed scroll source producer seam, plugin-named keyframe groups, internal-key enforcement, per-plugin key ownership, plugin-owned input requirements, transactional Track replacement, the removal of the dead observation target, the collapse of two composition input channels into one, the separation of test support from production entrypoints, and the explicit `values` section inside plugin groups.

This document reports current implementation reality. Plans and audits describe intent unless this file says they landed.

## Shipped runtime work

- Runtime mutation model W1 through W5 is complete through PRs [#109](https://github.com/chahyasantoso/motion5/pull/109), [#110](https://github.com/chahyasantoso/motion5/pull/110), [#111](https://github.com/chahyasantoso/motion5/pull/111), [#112](https://github.com/chahyasantoso/motion5/pull/112), and [#113](https://github.com/chahyasantoso/motion5/pull/113).
- Trigger drivers through `T5`, compiled Track ownership option C, edge identity and ordering, progress range ownership, teardown ownership, clock error boundaries, time loop semantics, the GSAP scroll source seam, plugin-named groups, internal-key enforcement, and per-plugin key ownership have landed. See ADRs 034 and 039 through 043.
- Plugin-owned input requirements landed in [PR #174](https://github.com/chahyasantoso/motion5/pull/174), closing [issue #173](https://github.com/chahyasantoso/motion5/issues/173). A plugin declares `requirements`; an author binds those slots under `keyframes.<plugin>.requires`; the graph derives one input edge per binding; and composition receives the upstream values scoped by plugin and slot.
- `fkPlugin` declares the `base` requirement, reads `inputs.base`, and does not require the author to invent `parentX`, `parentY`, or `parentRotation`. The walker demo moved thirteen repeated projection blocks into bindings beside the FK keyframes. Published values are unchanged.
- Track replacement is staged and committed transactionally as of [PR #178](https://github.com/chahyasantoso/motion5/pull/178), with ADR-045 and U-1 through U-8 evidence.
- `ObservationDefinition.target` is gone, closing [issue #175](https://github.com/chahyasantoso/motion5/issues/175) with ADR-046 and V-1 through V-7 evidence. It is deleted from `GraphEdge`, from `edgeKey`, from `compareEdges`, and from `ObservationState.normalizeEdge`, and an authored one is refused as `observation-target-unsupported` on both roles, replacing `observation-output-target`.
- `observes` declares an output edge only, closing [issue #180](https://github.com/chahyasantoso/motion5/issues/180) with ADR-047 and J-1 through J-9 evidence. `keyframes.<plugin>.requires` is now the only way a value enters composition. An `observes` entry has exactly one authored field, `source`. An authored `role` is refused as `observation-role-unsupported` at either value, and an authored `projection` as `observation-projection-unsupported`.
- The flat input bag is gone rather than merely unused. `InputProjection`, `GraphEdge.projection`, `validateProjection`, `canonicalizeProjection`, and `projectValues` are deleted, `Track.compose` and `PublisherNode.compose` take one parameter, and `Track` no longer keeps `#lastInputs` or its half of the dirty check. The invariant is not that no caller merges an upstream value into a track's authored namespace; it is that no parameter exists to merge one with.
- `GraphEdge.role` stays and names the composition phase. It cannot drift from `requirement`: each is set by one literal in one resolver, and `J-5` pins the equivalence over a whole built graph.
- `docs/TRD.md` TR-D-05 and Glossary entry corrected in [issue #182](https://github.com/chahyasantoso/motion5/issues/182) to match current edge identity and semantics post ADR-034, ADR-044, ADR-046, and ADR-047.
- Test support is a declared tier of its own, closing [issue #167](https://github.com/chahyasantoso/motion5/issues/167) with ADR-048 and W-1 through W-7 evidence. `src/ports/fakes.ts` moved to `src/testing/fakes.ts`, `./ports/fakes` is replaced in the export map by `./testing`, and no shim is left at the old path.
- The boundary scan is the enforcement, not the documentation. `testing` joined `coreLayers`, `importsTestingEntrypoint` reports any consumer that names `@motion5/core/testing` or reaches `packages/core/src/testing` directly, and workspace discovery reads the globs from the root `package.json` so `apps/*` is scanned by the same rules.
- A plugin group has exactly two members, closing [issue #177](https://github.com/chahyasantoso/motion5/issues/177) with ADR-049 and Y-1 through Y-13 evidence. `values` is reserved by name beside `requires`, so the authored properties a plugin claims live under `keyframes.<plugin>.values` and the graph bindings it owns live beside them. There is one canonical group shape and no compatibility form.
- Group detection is exact rather than heuristic. `isKeyframeGroup` asks whether an entry names at least one reserved section instead of guessing from the shape of its leaves, so the registry-free contract layer can report `keyframes-unknown-section` for a typo and `keyframes-missing-values-section` for the old leaf form. The old predicate survives as `looksLikeLegacyGroup`, which exists only to refuse that form by name.
- `values` is the only compiled value domain, and now structurally. `flattenAuthoredKeyframes` reads that section and nothing else, so the `requires` skip it used to need is deleted: a binding is not a sibling of the leaves to be skipped past. `AuthoredPluginGroup` is two optional named members rather than an open record, and `AuthoredPluginMember` is deleted with the escape hatch it served.
- Not one function moved layers for it. Section names, detection, and the two section readers stay in `contract/keyframe-shape`; authored legality in `contract/validate-v5`; flattening in `domain/keyframe-groups`; ownership in `domain/plugins`, with no logic change; topology in `graph/ir.ts`, whose diff is empty. `usesThreeD` is the one place inaction would have been a silent regression, and `Y-9` pins that `perspective-usage` still fires for 3D content inside a section.

## Documentation and package surface

- Consumer documentation lives under `docs/guide/` and names only declared package entrypoints.
- `docs/guide/api-reference.md` opens with an entrypoint tier table: public, public adapter, public plugin, test support, and unadvertised. The test-support row is the only one a production consumer may not import, and that row is enforced by the boundary scan rather than by the table.
- `@motion5/core` remains private at `0.0.0`; packaged-consumer verification and publication remain Phase 6 work.
- `PluginDefinition.requirements` is optional. `PluginComposer` receives values, progress, and that plugin's scoped inputs. `ResolvedPlugins.requirements` reports resolved bindings. The public entrypoint allow-list is unchanged.
- `TrackDefinition.keyframes` changes shape with ADR-049, and that is the whole breaking change of the surface. `AuthoredPluginGroup`, `AuthoredPluginMember`, `AuthoredPluginRequires`, and `PluginRequiresBinding` are in neither `packages/core/src/index.ts` nor `allowedPublicExports` in `scripts/boundary-scan.mjs`, so **no export map, entrypoint, or boundary allow-list entry changes**. That is a finding, verified by a green `boundaries` job and an unmodified `public-declaration-surface` gate.
- `docs/TRD.md` needs no ADR-049 edit. TR-D-02, TR-D-05 as corrected by #182, and TR-D-06 make no claim about a group's internals beyond `keyframes.<plugin>.requires.<slot>`, whose authored path is unchanged. Also a finding, not an omission.
- The authored schema and the diagnostics guide state one canonical group shape and the five section rule ids: `keyframes-missing-values-section`, `keyframes-unknown-section`, `keyframes-values-shape`, `keyframes-values-empty`, and the widened `keyframes-reserved-section`.
- ADR-041 and ADR-044 are not edited by ADR-049. It amends both by replacing the group's authored shape and supersedes ADR-044's rejection of a `values` wrapper, the precedent ADR-046 set with ADR-034 and ADR-048 with ADR-036.
- `docs/acceptance-map.json` maps `requirement-scoped-inputs` to `publisher-requirement-inputs.test.ts`.

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
- An input edge carrying no requirement is unreachable by construction and throws `observation-input-shape` naming the edge.
- The core test suite reaches the fakes by relative source path, not through `@motion5/core/testing`.
- No author may animate a flat property named `values`, and no plugin may claim that key at group level. Both are the existing `requires` precedent, and the reservation is on section position: a leaf named `values` inside the section is an ordinary property, which `Y-8` pins.
- A group may author `requires` with no `values`. That is not an omission to be refused; it is how a plugin joins the composer chain to receive an upstream value without animating anything of its own. `Y-11` pins it, and `remount`, `cross-motion`, and `phase4-dynamic-lifecycle` author exactly that shape and needed no migration at all.
- `{ fk: {} }` is an accepted no-op property rather than a group, because it names no section. `Y-6` guards it, since it is easy to break by accident.

## Evidence anchors

- Plugin-owned requirements red run: [32476954868](https://github.com/chahyasantoso/motion5/actions/runs/32476954868), archived at `logs/32476954868/` on `ci-logs`. Green run: [32478658229](https://github.com/chahyasantoso/motion5/actions/runs/32478658229).
- Transactional Track replacement red run: [32484448662](https://github.com/chahyasantoso/motion5/actions/runs/32484448662). Final green run: [32487529184](https://github.com/chahyasantoso/motion5/actions/runs/32487529184).
- Observation target removal red run: [32491256526](https://github.com/chahyasantoso/motion5/actions/runs/32491256526). Green run: [32491803628](https://github.com/chahyasantoso/motion5/actions/runs/32491803628).
- Single input channel red run: [32559525865](https://github.com/chahyasantoso/motion5/actions/runs/32559525865). Green run: [32561177715](https://github.com/chahyasantoso/motion5/actions/runs/32561177715).
- Test-only entrypoint tier red run: [32568986919](https://github.com/chahyasantoso/motion5/actions/runs/32568986919), archived at `logs/32568986919/` on `ci-logs`. The two empty violation lists in it are the defect stated as an assertion: the scan never opened `apps/`.
- Explicit `values` section red run: [32572953699](https://github.com/chahyasantoso/motion5/actions/runs/32572953699), archived at `logs/32572953699/` on `ci-logs`. `quality` failed `typecheck` and `integration` reported `11 failed | 214 passed`. `Y-1` and `Y-13` failed with `stops-shape at ...keyframes.fk.values.stops`, which is the old runtime reading the section as a property with no stops array; `Y-2`, `Y-3`, and `Y-4` failed with `expected [] to ...` because none of the three new rule ids existed; `Y-5`, `Y-8`, `Y-9`, and `Y-10` failed with `stops-shape` arriving where the new rule id belonged; `Y-7` reported the pre-section path; and `Y-12` failed on the declaring source still containing `AuthoredPluginMember`. `Y-6` and `Y-11` passed as guards, and boundaries, build, end-to-end and performance were green, so the red is assertion-level rather than infrastructure-level.
- Explicit `values` section intermediate run [32573658619](https://github.com/chahyasantoso/motion5/actions/runs/32573658619), archived at `logs/32573658619/`, is kept as a second finding. With the source landed and the fixtures migrated, `U-1` and `U-2` failed because their deliberately unresolvable fixture was refused one layer earlier, by the contract rather than by the resolver. A test that names its owner is what made that visible.
- Cases `Q-1` through `Q-12` cover requirement shape, plugin-owned slot validation, derived graph edges, multi-source identity, and scoped composition. `Q-8` is a compatibility guard and passes on the parent by design.
- Cases `U-1` through `U-8` cover replacement compile refusal, Motion refusal, graph rejection, staging order, rollback order, and rollback error precedence.
- Cases `V-1` through `V-5` and `V-7` cover the absent target declarations, the refusal on both roles, the identity collapse the field used to hide, live state, and `addObserve`. `V-6` retired with the generic input channel it guarded.
- Cases `J-1` through `J-9` cover the absent declarations, the two new refusals, the role and requirement equivalence, identity without a projection, `addObserve`, the FK rig composing an upstream value without it becoming an authored one, and the one-parameter arity of both composition seams.
- Cases `W-1` through `W-7` cover the entrypoint tier predicate, the scanned workspaces, the export map keys, and manifest-driven discovery.
- Cases `Y-1` through `Y-13` cover the canonical shape, the refused legacy form and its negative assertion, unknown and missing sections, the reserved top level, malformed and empty sections, the accepted empty object, section-aware diagnostic paths, a leaf named `values`, 3D detection inside the section, duplicate leaves across two groups, a bindings-only group, the type surface, and the walker rig's world frame. `Y-6` and `Y-11` are guards and pass on the parent by design.
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
- A declared entrypoint carries a tier, and a tier a consumer may not import is enforced by a gate that can see every declared workspace. Prose alone is not enforcement.
- An authored section is reserved by name rather than inferred from shape. Where a spelling would otherwise mean two things depending on context, the name is taken out of the author's namespace and the ambiguity stops existing instead of being resolved.
