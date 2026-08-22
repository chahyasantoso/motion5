# ADR-047: `observes` declares an output edge only, and a plugin requirement is the only input channel

**Status:** accepted  
**Date:** 2026-08-22  
**Closes:** issue [#180](https://github.com/chahyasantoso/motion5/issues/180)  
**Supersedes:** the "generic `observes` inputs remain in the flat input bag" clause of ADR-044, and the three-authored-field description of an observation edge in ADR-046

## Context

`Track.compose()` accepted cross-track values through two independent and unequal channels.

The first was `observes` with `role: "input"`. `resolveObservationEdge` validated it, `GraphPublisher` projected the source's values through an optional `projection` and flat-merged the result into the observer's value bag, and `Track.compose` spread that bag last. Spreading last is the defect: a same-named upstream value silently replaced the observer's own authored value. `projection` existed to rename the upstream key so it would stop colliding, which is a workaround for the merge rather than a feature of the edge, and `observation-input-collision` existed to catch the case where two projections landed on one name anyway.

The second was `keyframes.<plugin>.requires`, added by ADR-044. It is scoped per plugin and slot, delivered as `requirementInputs`, and structurally cannot collide with an authored value: `inputs.base.rotation` and `values.rotation` are distinguished by where they live rather than by being spelled differently.

Nothing in the application used the first channel any more. `apps/react-demo/src/full-body-project.ts` is one hundred percent `requires` across all thirteen walker tracks; ADR-044 moved thirteen repeated projection blocks into bindings. The flat channel survived only in `observation-identity.test.ts`, `partial-seed-inputs.test.ts`, `publisher-flat-inputs.test.ts`, and `observation-projection-validation.test.ts`, pinning behavior that is strictly worse than what `requires` already offers, with no remaining use case `requires` cannot cover.

Two owners of "where does an upstream value land" is one more than the model tolerates, and this pair is not the tolerable kind, because they are not equally good. One of them can overwrite an authored value and the other cannot.

## Decision

`observes` becomes output-only, and `keyframes.<plugin>.requires` becomes the only way a value enters composition.

`ObservationDefinition` narrows to one member, `source`. `InputProjection` and `GraphEdge.projection` are deleted, along with `validateProjection`, `canonicalizeProjection`, and `projectValues`. `Track.compose` and `PublisherNode.compose` take one parameter. An authored `role` or `projection` is refused.

Five things about that shape are deliberate.

**Refused, not merely undeclared, and refused on both role values.** This is the rule ADR-046 established for `target`, and every clause of it applies here. Deleting the member stops a TypeScript author and does nothing to a JavaScript author, who gets the accepted-and-ignored shape rule 6 of ADR-033 forbids. Here it would also be worse than ignored: `{ source: "a", role: "input" }` and `{ source: "a", role: "output" }` are two distinct edges today and collapse to one identity after this change, so a project authoring both would silently lose an edge or trip `observation-duplicate` naming an edge the author never wrote. `role: "output"` is refused for the same reason a `target` was refused on both roles: if the only legal value is the default, writing it is a field accepted and then ignored. One rule id, `observation-role-unsupported`, both values.

**A projection gets its own rule id.** `observation-projection-unsupported`, not a reuse of the role's. A projection is a different authored field, and TR-E-08 wants the diagnostic to name what the author actually wrote rather than the removal two fields happen to share. `observation-input-projection` and `observation-input-collision` retire with the primitives they guarded.

**The same owner, and the target guard stays in front.** `resolveObservationEdge` in `graph/ir.ts` already owned every authored-observation shape rule, and it reads the three removed fields through one record view. The target guard deliberately runs ahead of the two new refusals, so ADR-046's `V-2` through `V-4` still report `observation-target-unsupported` for a fixture that carries a role too, and neither record's evidence has to be rewritten to accommodate the other. `observation-role`, which rejected a role outside `"input" | "output"`, retires: there is no authored role left to be outside anything.

**`GraphEdge.role` stays.** Every input edge now carries a `requirement`, so `role` looks derivable from `requirement !== undefined`. It is kept, because `edgesByRole` in `runtime/graph-publisher.ts` is the two-phase split of composition, inputs collected before `node.compose` and outputs merged after, and naming that phase `role` is clearer than `edge.requirement === undefined ? "after" : "before"`. `compareEdges` orders by it, and deriving it inside the comparator would put a conditional in the single ordering owner. Two sources of truth are a defect only when they can disagree, and after this change each is set by exactly one literal in exactly one resolver: `"output"` in `resolveObservationEdge`, `"input"` in `resolveRequirementEdge`. `J-5` pins the equivalence over a whole built graph.

**One parameter, not a parameter every caller passes `{}` to.** The invariant worth stating is not "no caller merges a flat bag into the authored namespace" but that no parameter exists to merge one with. A default-`{}` parameter would leave the merge one line away from returning.

## Alternatives rejected

**Keep the flat channel for dependencies that belong to no plugin.** Rejected. `requires` covers them: a plugin group with a bindings section and no property leaves is already legal, and `PluginRegistry` already joins such a plugin to the compose chain precisely so a group that authors nothing but bindings still has a consumer. Two answers to "where does an upstream value land" is the tolerated maximum, and this candidate pair is not tolerable because one of the two can overwrite an authored value.

**Keep `projection` as a rename primitive on output edges.** Rejected. `projection` was only ever read on the input role. An output edge merges the source's whole patch over the observer's composed one and has never renamed anything, so keeping the field would be inventing a consumer for it, in the one place ADR-046 already refused to invent one for `target`.

**Narrow `role` to `"output"` instead of removing it.** Rejected under the first clause of the decision. The issue offered it; taking it would leave a field whose only legal value is its default, which is the accepted-and-ignored shape arrived at by narrowing instead of by design.

## Consequences

`edgeKey` changes format for the second time after ADR-046. It is internal identity, never persisted, never part of a patch payload or a golden fixture, so there is no migration. The requirement's plugin and slot are the only authored string pair left inside the encoding, and `J-6` carries the separator question `E-2` and `E-3` asked about projection keys to that pair.

`E-2` and `E-3` retire with the projection primitive they proved. `E-4`'s fixture loses its four projection rows, gains four requirement rows, and still carries ten pairwise-distinct edges, so identity and ordering are still proven to agree on distinctness. ADR-034 is not edited.

ADR-046's `V-6` retires. It pinned that a projected input observation still resolved to one identified, ordered edge, and there is no projected input observation left to resolve. `J-4` refuses the field it authored.

Ordering has one fewer tie-break. Two edges that differ only by requirement still separate.

`Track` loses `#lastInputs` and its half of the dirty check, so a clean track recomposes on a change to its scoped inputs and on nothing else. `ObservationState.normalizeEdge` lists one optional field instead of two.

The publisher keeps `observation-missing-upstream` and `observation-input-shape`, and keeps recording `sourceRevisions` for an input edge: a requirement edge still needs a published record. An input edge with no requirement is unreachable by construction once `observes` is output-only, so it throws `observation-input-shape` naming the edge rather than being skipped. Unreachable-by-construction is worth an explicit throw, and it matches the two "unreachable in normal flow" guards already in that loop.

The public surface loses one exported interface, `InputProjection`, and two optional members of `ObservationDefinition`. Neither `InputProjection` nor `GraphEdge` is in `packages/core/src/index.ts` or in the `allowedPublicExports` set in `scripts/boundary-scan.mjs`, so no export list, entrypoint, or boundary allow-list entry changes. Both packages are unpublished at `0.0.0`, so the breaking narrowing carries no compatibility shim.

Three places needed no edit, and "there was nothing there" is a finding rather than an omission. `contract/validate-v5.ts` only checks that `observes` is an array; the per-entry rules live in `graph/ir.ts` and reach it through `buildGraphIR`. `runtime/project-runtime.ts` reaches `observationEdgeKey` unchanged, and `#replaceWithObservation`'s dedup still behaves once `role` cannot vary, because identity is now source spelling and nothing else. `ComposeResolver` in `runtime/graph-runtime.ts` derives its shape from `PublisherNode["compose"]`, so it followed the arity change with no edit.

Two places the implementation plan did not name needed one. `docs/acceptance-map.json` still mapped `flat-projected-inputs` to the deleted `publisher-flat-inputs.test.ts`, which `acceptance-scan` reports as a missing mapped test; it now names the requirement-scoped successor. `scripts/bench-graph.mjs` authored both refused fields on every scenario edge and would have thrown at construction; its edges are plain output edges, which exert the same topological pressure the scenarios measure.

Evidence ids gain the `J-` series, and `packages/core/test/unit/scripts/evidence-case-ids.test.ts` widens its title pattern to admit it. A citation the gate cannot see is not enforced.

## Evidence

`packages/core/test/unit/graph/single-input-channel.test.ts`:

- `J-1` neither `ObservationDefinition` nor `GraphEdge` declares a `projection`, and `ObservationDefinition` declares no `role`.
- `J-2` an authored `role: "input"` is refused as `observation-role-unsupported`, at the authored path, with no edge produced.
- `J-3` the same rule id refuses `role: "output"`, so this is a removal and not a narrowing.
- `J-4` an authored `projection` is refused as `observation-projection-unsupported`, under its own rule id.
- `J-5` over a graph built from both authored forms, every edge with `role === "input"` carries a requirement and every edge with a requirement has `role === "input"`. It passes on the parent by design and is not claimed as red: it is the guard that keeps the two fields from drifting.
- `J-6` `edgeKey` ignores a stray projection, separates two slots of one plugin, separates an output edge from a requirement edge to the same source, and cannot be forged by a separator inside a plugin or slot name.
- `J-9` `Track.compose` and `PublisherNode.compose` take one parameter, asserted from the type rather than from `Function.length`, which a default value zeroes out.

`packages/core/test/integration/observation-identity.test.ts`:

- `J-7` `TrackHandle.addObserve` refuses an authored role on either value and an authored projection, adds no live edge, and still accepts and removes the one authored form that is left.

`packages/core/test/integration/single-input-channel.test.ts`:

- `J-8` a bone authoring `rotation` under `fk`, whose `base` binds an upstream publishing its own `rotation`, composes the parent's 30 with its local 45 into a world-space 75, and publishes exactly `rotation`, `x`, and `y`. A flat merge anywhere would replace the authored 45 with the upstream 30 and compose 60, or add a bare key beside it. It passes on the parent by design, because the walker rig is already pure `requires`; it is the mutation guard rather than red evidence.

`packages/core/test/unit/runtime/publisher-requirement-inputs.test.ts` succeeds `publisher-flat-inputs.test.ts`. Its first case survives as delivery of the source record whole under its plugin and slot; the pick-projection and collision cases retire with the primitives they proved, and a new case pins the defensive throw for an input edge with no requirement. `packages/core/test/integration/partial-seed-inputs.test.ts` keeps its scenario and its requirement, TR-R-02, converted from two flat edges to two slots of one plugin: an unseeded upstream still contributes its last published value. `packages/core/test/unit/graph/observation-projection-validation.test.ts` is deleted, and is the one honest deletion in this slice; every case in it validated a primitive that no longer exists.

Red before green is executed and archived rather than described. The five `test(...)` commits at the base of pull request [#184](https://github.com/chahyasantoso/motion5/pull/184) carry the evidence alone, against unmodified sources. Run [32559525865](https://github.com/chahyasantoso/motion5/actions/runs/32559525865), archived at `logs/32559525865/` on `ci-logs`, fails two required jobs.

`quality` fails `typecheck` with sixteen errors. Five are `TS2322: Type 'true' is not assignable to type 'false'` in `single-input-channel.test.ts`, naming lines 17, 18, and 19, which assert the three absent members, and lines 27 and 31, which assert the two composition arities. The other eleven are `TS2345` and `TS2322` in `cross-motion.test.ts`, `p2-runtime-smells.test.ts`, `partial-seed-inputs.test.ts`, `publisher-output-merge-consistency.test.ts`, `remount.test.ts`, and `publisher-requirement-inputs.test.ts`, every one of them the same mismatch: a composer written against one parameter is not assignable to a seam that still declares two.

`integration` reports `6 failed | 206 passed` across five files. `J-7` fails with `expected [Function] to throw an error`, which is the defect itself: `addObserve` accepted both refused fields and did nothing with them. The other five are the flat-bag conversions failing on the parent, which is the second half of the same defect: a composer written against the requirement scope receives the flat bag instead. `cross-motion` composes `parentWorld: null` instead of `"base/root"`, `p2-runtime-smells` and both `publisher-output-merge-consistency` cases receive `{}` where the source's merged record belongs, and `partial-seed-inputs` totals `0` instead of `7`.

`J-1` through `J-6` and `J-9`'s runtime halves are unit cases, and the red run could not reach them: `quality` runs `typecheck` before `npm test`, so a red typecheck stops the job before the unit tier executes. They are not claimed as archived red. `J-1` and `J-9`'s compile-time halves are, because that is where they were designed to fail.

**Green:** run [32561177715](https://github.com/chahyasantoso/motion5/actions/runs/32561177715), all six behavioral jobs green plus the write-enabled Prettier job, which found no drift to repair. `quality` reached the unit tier on this run, so the seven `J-` cases the red run could not execute are green in the runner as well as in `typecheck`.

The three mutation checks the implementation plan requires all go red, and each has exactly one owner. Restoring the `role === "input"` branch in `resolveObservationEdge` reddens `J-2`. Re-adding a second `Track.compose` parameter and spreading it into the value bag reddens `J-8` and `J-9`. Re-adding `projection` to `edgeKey` reddens `J-6`.
