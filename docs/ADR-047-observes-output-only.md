# ADR-047: `observes` declares an output edge only, and a plugin requirement is the only input channel

**Status:** accepted  
**Date:** 2026-08-22  
**Closes:** issue [#180](https://github.com/chahyasantoso/motion5/issues/180)  
**Supersedes:** the "generic `observes` inputs remain in the flat input bag" clause of ADR-044, and the three-authored-field description of an observation edge in ADR-046

## Context

`Track.compose()` accepted cross-track values through two independent, unequal channels.

First: `observes` with `role: "input"`. `resolveObservationEdge` validated it; `GraphPublisher` projected source's values through optional `projection`, flat-merged result into observer's value bag; `Track.compose` spread bag last. Spreading last is the defect: same-named upstream value silently replaced observer's own authored value. `projection` existed to rename upstream key so it stopped colliding — workaround for merge, not feature of edge; `observation-input-collision` existed to catch two projections landing on one name anyway.

Second: `keyframes.<plugin>.requires`, added by ADR-044. Scoped per plugin and slot, delivered as `requirementInputs`, structurally cannot collide with authored value: `inputs.base.rotation` and `values.rotation` distinguished by where they live, not by spelling.

Nothing in application used first channel any more. `apps/react-demo/src/full-body-project.ts` one hundred percent `requires` across all thirteen walker tracks; ADR-044 moved thirteen repeated projection blocks into bindings. Flat channel survived only in `observation-identity.test.ts`, `partial-seed-inputs.test.ts`, `publisher-flat-inputs.test.ts`, `observation-projection-validation.test.ts`, pinning behavior strictly worse than `requires` already offers, no remaining use case `requires` cannot cover.

Two owners of "where does an upstream value land" is one more than model tolerates; this pair not tolerable kind — not equally good. One can overwrite authored value, other cannot.

## Decision

`observes` becomes output-only; `keyframes.<plugin>.requires` becomes only way value enters composition.

`ObservationDefinition` narrows to one member, `source`. `InputProjection` and `GraphEdge.projection` deleted, along with `validateProjection`, `canonicalizeProjection`, `projectValues`. `Track.compose` and `PublisherNode.compose` take one parameter. Authored `role` or `projection` refused.

Five things about that shape deliberate.

**Refused, not merely undeclared, and refused on both role values.** Rule ADR-046 established for `target`; every clause applies here. Deleting member stops TypeScript author, does nothing to JavaScript author, who gets accepted-and-ignored shape rule 6 of ADR-033 forbids. Here also worse than ignored: `{ source: "a", role: "input" }` and `{ source: "a", role: "output" }` are two distinct edges today, collapse to one identity after this change → project authoring both silently loses edge or trips `observation-duplicate` naming edge author never wrote. `role: "output"` refused for same reason `target` refused on both roles: only legal value is default → writing it is field accepted then ignored. One rule id, `observation-role-unsupported`, both values.

**A projection gets its own rule id.** `observation-projection-unsupported`, not reuse of role's. Projection is different authored field; TR-E-08 wants diagnostic to name what author actually wrote, not removal two fields happen to share. `observation-input-projection` and `observation-input-collision` retire with primitives they guarded.

**The same owner, and the target guard stays in front.** `resolveObservationEdge` in `graph/ir.ts` already owned every authored-observation shape rule; reads three removed fields through one record view. Target guard deliberately runs ahead of two new refusals → ADR-046's `V-2` through `V-4` still report `observation-target-unsupported` for fixture carrying role too, neither record's evidence rewritten to accommodate other. `observation-role`, which rejected role outside `"input" | "output"`, retires: no authored role left to be outside anything.

**`GraphEdge.role` stays.** Every input edge now carries `requirement`, so `role` looks derivable from `requirement !== undefined`. Kept: `edgesByRole` in `runtime/graph-publisher.ts` is two-phase split of composition, inputs collected before `node.compose`, outputs merged after; naming that phase `role` clearer than `edge.requirement === undefined ? "after" : "before"`. `compareEdges` orders by it; deriving inside comparator puts conditional in single ordering owner. Two sources of truth defect only when they can disagree; after this change each set by exactly one literal in exactly one resolver: `"output"` in `resolveObservationEdge`, `"input"` in `resolveRequirementEdge`. `J-5` pins equivalence over whole built graph.

**One parameter, not a parameter every caller passes `{}` to.** Invariant worth stating is not "no caller merges flat bag into authored namespace" but that no parameter exists to merge one with. Default-`{}` parameter leaves merge one line from returning.

## Alternatives rejected

**Keep the flat channel for dependencies that belong to no plugin.** Rejected. `requires` covers them: plugin group with bindings section and no property leaves already legal; `PluginRegistry` already joins such plugin to compose chain precisely so group authoring nothing but bindings still has consumer. Two answers to "where does an upstream value land" is tolerated maximum; this candidate pair not tolerable — one of two can overwrite authored value.

**Keep `projection` as a rename primitive on output edges.** Rejected. `projection` only ever read on input role. Output edge merges source's whole patch over observer's composed one, never renamed anything → keeping field invents consumer for it, in the one place ADR-046 already refused to invent one for `target`.

**Narrow `role` to `"output"` instead of removing it.** Rejected under first clause of decision. Issue offered it; taking it leaves field whose only legal value is default — accepted-and-ignored shape arrived at by narrowing, not design.

## Consequences

`edgeKey` changes format second time after ADR-046. Internal identity, never persisted, never part of patch payload or golden fixture → no migration. Requirement's plugin and slot only authored string pair left inside encoding; `J-6` carries separator question `E-2` and `E-3` asked about projection keys to that pair.

`E-2` and `E-3` retire with projection primitive they proved. `E-4`'s fixture loses four projection rows, gains four requirement rows, still carries ten pairwise-distinct edges → identity and ordering still proven to agree on distinctness. ADR-034 not edited.

ADR-046's `V-6` retires. Pinned that projected input observation still resolved to one identified, ordered edge; no projected input observation left to resolve. `J-4` refuses field it authored.

Ordering has one fewer tie-break. Two edges differing only by requirement still separate.

`Track` loses `#lastInputs` and its half of dirty check → clean track recomposes on change to scoped inputs, nothing else. `ObservationState.normalizeEdge` lists one optional field, not two.

Publisher keeps `observation-missing-upstream` and `observation-input-shape`, keeps recording `sourceRevisions` for input edge: requirement edge still needs published record. Input edge with no requirement unreachable by construction once `observes` output-only → throws `observation-input-shape` naming edge, not skipped. Unreachable-by-construction worth explicit throw; matches two "unreachable in normal flow" guards already in that loop.

Public surface loses one exported interface, `InputProjection`, and two optional members of `ObservationDefinition`. Neither `InputProjection` nor `GraphEdge` in `packages/core/src/index.ts` or in `allowedPublicExports` set in `scripts/boundary-scan.mjs` → no export list, entrypoint or boundary allow-list entry changes. Both packages unpublished at `0.0.0` → breaking narrowing carries no compatibility shim.

Three places needed no edit; "there was nothing there" is finding, not omission. `contract/validate-v5.ts` only checks `observes` is array; per-entry rules live in `graph/ir.ts`, reach it through `buildGraphIR`. `runtime/project-runtime.ts` reaches `observationEdgeKey` unchanged; `#replaceWithObservation`'s dedup still behaves once `role` cannot vary, identity now source spelling and nothing else. `ComposeResolver` in `runtime/graph-runtime.ts` derives shape from `PublisherNode["compose"]` → followed arity change with no edit.

Two places implementation plan did not name needed one. `docs/acceptance-map.json` still mapped `flat-projected-inputs` to deleted `publisher-flat-inputs.test.ts`, which `acceptance-scan` reports as missing mapped test; now names requirement-scoped successor. `scripts/bench-graph.mjs` authored both refused fields on every scenario edge, would have thrown at construction; its edges plain output edges, exerting same topological pressure scenarios measure.

Evidence ids gain `J-` series; `packages/core/test/unit/scripts/evidence-case-ids.test.ts` widens title pattern to admit it. Citation gate cannot see is not enforced.

## Evidence

`packages/core/test/unit/graph/single-input-channel.test.ts`:

- `J-1` neither `ObservationDefinition` nor `GraphEdge` declares `projection`; `ObservationDefinition` declares no `role`.
- `J-2` authored `role: "input"` refused as `observation-role-unsupported`, at authored path, no edge produced.
- `J-3` same rule id refuses `role: "output"` → removal, not narrowing.
- `J-4` authored `projection` refused as `observation-projection-unsupported`, under own rule id.
- `J-5` over graph built from both authored forms, every edge with `role === "input"` carries requirement; every edge with requirement has `role === "input"`. Passes on parent by design, not claimed as red: guard keeping two fields from drifting.
- `J-6` `edgeKey` ignores stray projection, separates two slots of one plugin, separates output edge from requirement edge to same source, cannot be forged by separator inside plugin or slot name.
- `J-9` `Track.compose` and `PublisherNode.compose` take one parameter, asserted from type, not `Function.length`, which default value zeroes out.

`packages/core/test/integration/observation-identity.test.ts`:

- `J-7` `TrackHandle.addObserve` refuses authored role on either value and authored projection, adds no live edge, still accepts and removes one authored form left.

`packages/plugins/test/integration/single-input-channel.test.ts`:

- `J-8` bone authoring `rotation` under `fk`, whose `base` binds upstream publishing own `rotation`, composes parent's 30 with local 45 into world-space 75, publishes exactly `rotation`, `x`, `y`. Flat merge anywhere replaces authored 45 with upstream 30 and composes 60, or adds bare key beside it. Passes on parent by design, walker rig already pure `requires`; mutation guard, not red evidence.

`packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts` succeeds `publisher-flat-inputs.test.ts`. First case survives as delivery of source record whole under its plugin and slot; pick-projection and collision cases retire with primitives they proved; new case pins defensive throw for input edge with no requirement. `packages/core/test/integration/partial-seed-inputs.test.ts` keeps scenario and requirement, TR-R-02, converted from two flat edges to two slots of one plugin: unseeded upstream still contributes its last published value. `packages/core/test/unit/graph/observation-projection-validation.test.ts` deleted — one honest deletion in this slice; every case validated primitive that no longer exists.

Red before green executed and archived, not described. Five `test(...)` commits at base of pull request [#184](https://github.com/chahyasantoso/motion5/pull/184) carry evidence alone, against unmodified sources. Run [32559525865](https://github.com/chahyasantoso/motion5/actions/runs/32559525865), archived at `logs/32559525865/` on `ci-logs`, fails two required jobs.

`quality` fails `typecheck` with sixteen errors. Five are `TS2322: Type 'true' is not assignable to type 'false'` in `single-input-channel.test.ts`, naming lines 17, 18, 19, asserting three absent members, and lines 27, 31, asserting two composition arities. Other eleven are `TS2345` and `TS2322` in `cross-motion.test.ts`, `p2-runtime-smells.test.ts`, `partial-seed-inputs.test.ts`, `publisher-output-merge-consistency.test.ts`, `remount.test.ts`, `publisher-requirement-inputs.test.ts` — same mismatch every one: composer written against one parameter not assignable to seam still declaring two.

`integration` reports `6 failed | 206 passed` across five files. `J-7` fails with `expected [Function] to throw an error` — defect itself: `addObserve` accepted both refused fields, did nothing with them. Other five are flat-bag conversions failing on parent, second half of same defect: composer written against requirement scope receives flat bag instead. `cross-motion` composes `parentWorld: null` instead of `"base/root"`; `p2-runtime-smells` and both `publisher-output-merge-consistency` cases receive `{}` where source's merged record belongs; `partial-seed-inputs` totals `0` instead of `7`.

`J-1` through `J-6` and `J-9`'s runtime halves are unit cases; red run could not reach them: `quality` runs `typecheck` before `npm test` → red typecheck stops job before unit tier executes. Not claimed as archived red. `J-1` and `J-9`'s compile-time halves are, because that is where they were designed to fail.

**Green:** run [32561177715](https://github.com/chahyasantoso/motion5/actions/runs/32561177715), all six behavioral jobs green plus write-enabled Prettier job, which found no drift to repair. `quality` reached unit tier this run → seven `J-` cases red run could not execute green in runner and in `typecheck`.

Three mutation checks implementation plan requires all go red, each with exactly one owner. Restoring `role === "input"` branch in `resolveObservationEdge` reddens `J-2`. Re-adding second `Track.compose` parameter, spreading into value bag, reddens `J-8` and `J-9`. Re-adding `projection` to `edgeKey` reddens `J-6`.
