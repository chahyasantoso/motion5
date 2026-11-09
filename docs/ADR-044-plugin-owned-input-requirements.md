# ADR-044: A plugin owns its input requirements, and the author binds them in its group

**Status:** Accepted, 2026-08-21

**Superseded by [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md), 2026-10-29.** Identified tables and records with an explicit `PluginCatalog` are the one supported contract; the grouped machinery this record describes is deleted.

## Context

Track declared upstream dependencies at track level, in `observes`; input edge carried projection map:

```text
observes: [{
  source: "walk/pelvis",
  role: "input",
  projection: { map: { x: "parentX", y: "parentY", rotation: "parentRotation" } },
}]
```

Block repeats on all thirteen bones of walker rig: author restating `fkPlugin`'s own input contract. Author must know `fk` reads `parentX`, `parentY`, `parentRotation`, keep map synchronized with plugin they may not own. Declaration generic, lives nowhere near keyframes consuming it.

Renaming not decoration. `fk` reads parent rotation, animates local one; both would be spelled `rotation` in one flat value bag → projection moved upstream value out of way. That put every plugin's inputs in same namespace as every track's authored values, where upstream value could silently replace authored one, and two plugins wanting same input name needed `plugin-input-collision` to arbitrate.

ADR-041 and ADR-043 made authored keyframe _property_ scopable by plugin; left plugin's _dependencies_ unscoped.

## Decision

Plugin declares input slots it understands. Author binds one inside that plugin's authored group. Graph derives edge; bound values reach composition scoped to plugin and slot.

```text
keyframes: {
  fk: {
    length: { stops: [ ... ] },
    rotation: { stops: [ ... ] },
    requires: { base: "walk/pelvis" },
  },
}
```

1. **`requires` is a reserved section inside a plugin-named group.** Metadata, not property: `flattenAuthoredKeyframes` skips it → never reaches percent map, interpolator or patch. Top-level `requires` names no plugin → no binding there could have owner; `keyframes-reserved-section`.
2. **Bindings are optional, and the unbound case belongs to the plugin.** Omitting `requires`, or slot within it, derives no edge. `fkPlugin` composes against origin; plugin for which missing base is meaningless refuses in its own `compose`. Schema does not decide what absent parent means.
3. **The slot name is the destination.** No author-facing projection, no naming convention. Bound source's values arrive whole, under source's own key names, at `inputs.base`.
4. **Three validation owners, because no single one can answer all three questions.** `validateKeyframes` owns registry-independent shape, stays registry-free → lives in contract layer. `PluginRegistry.resolveForKeyframes` owns whether group names registered plugin and whether that plugin declares slot, as `plugin-unknown-requirement`. Graph construction owns topology: unknown source, self-reference, duplicate edge, cycle. Plugin resolution and graph construction independent → ordering constraint issue thread worried about does not exist: edge derivation reads authored form directly.
5. **The requirement is part of edge identity and of edge ordering.** Two slots of one plugin may intentionally bind same source -- how multi-source plugin such as IK is expressed without second authoring model. `"-"` for absent requirement, same rule `targetOrder` already uses → comparator separates exactly edges identity encoding separates. `ObservationState.normalizeEdge` carries it for same reason it carries a target.
6. **Composition never merges upstream inputs into authored values.** `Track.compose` takes scoped inputs as own argument, hands each plugin only its own slots. Separation structural, not enforced: `values.rotation` and `inputs.base.rotation` distinguished by where they live → collision not representable; `fkPlugin` needs no `parentRotation`.
7. **A bindings-only group still resolves its plugin into the compose chain.** Otherwise track could derive edge, receive scoped input, run no composer -- reads as held value rather than error.
8. **The colon is reserved in a requirement slot too.** Namespaced slot would name scoped input no author could spell: `keyframes` rejects colon in every authored name.

## Alternatives rejected

**A `values` wrapper beside `requires`,** so group reads `{ fk: { values: { ... }, requires: { ... } } }`. More symmetric, not decidable. `isKeyframeGroup` structural and registry-free by design → group whose sole leaf is named `values` indistinguishable from wrapper; optional wrapper leaves two legal group shapes forever. Keeping leaves at group top level additive: every grouped track that loads today loads unchanged; pathPlugin precedent issue cites already authors configuration beside animated fields.

**`config` rather than `requires`.** `config` describes nothing, would accept anything. Section is graph bindings and nothing else → named for what it is; plugin wanting other configuration gets own reserved name and own argument.

**Removing `ObservationDefinition.target` in this slice.** Dead API surface: validated, included in edge identity, never consumed composing inputs; should go. Also second invariant with own blast radius across identity, ordering, four test files; slice already at sizing ceiling. Deferred to own change; `observes` untouched -- generic graph primitive; `requires` plugin-owned one.

**Reordering `PluginComposer` to `compose(values, inputs)`.** Third argument appended instead → every composer written against two-argument form stays assignable; no plugin outside change moves. Argument position not invariant; separate argument is.

**A global collision guard over scoped inputs.** `plugin-input-collision` exists because projected input name not addressable by any owner. Requirement slot addressed through owning plugin's group, delivered scoped to it → two plugins declaring `base` never share namespace; nothing to arbitrate. Guard stays for `inputs`, which still has no other owner.

## Consequences

Thirteen projection blocks disappear from React demo, two from walker suite, each replaced by one line beside keyframes it belongs to. Composed values unchanged -- `Q-7` and `N-8` pin numerically, not structurally.

`fkPlugin` no longer declares `parentX`, `parentY`, `parentRotation` inputs. Declares one `base` requirement, reads `inputs.base`; source keeps `x`, `y`, `rotation`.

Derived edge is an edge, held to every topology rule authored one is: destroying bound source still `observation-unknown-source`; binding cycle still refused before mount.

Empty `requires` refused, not ignored: omitting section already how to bind nothing; field accepted then ignored is what ADR-033 forbids.
