# ADR-044: A plugin owns its input requirements, and the author binds them in its group

**Status:** Accepted, 2026-08-21

## Context

A track declared its upstream dependencies at track level, in `observes`, and an input edge carried a projection map:

```text
observes: [{
  source: "walk/pelvis",
  role: "input",
  projection: { map: { x: "parentX", y: "parentY", rotation: "parentRotation" } },
}]
```

That block is repeated on all thirteen bones of the walker rig, and it is the author restating `fkPlugin`'s own input contract. The author has to know that `fk` reads `parentX`, `parentY`, and `parentRotation`, and has to keep that map synchronized with a plugin they may not own. The declaration is generic and lives nowhere near the keyframes that consume it.

The renaming is not decoration either. `fk` reads a parent rotation and animates a local one, and both would be spelled `rotation` in one flat value bag, so the projection existed to move the upstream value out of the way. That put every plugin's inputs in the same namespace as every track's authored values, where an upstream value could silently replace an authored one and where two plugins wanting the same input name needed `plugin-input-collision` to arbitrate.

ADR-041 and ADR-043 made an authored keyframe *property* scopable by plugin. They left the plugin's *dependencies* unscoped.

## Decision

A plugin declares the input slots it understands. An author binds one inside that plugin's authored group. The graph derives the edge, and the bound values reach composition scoped to the plugin and slot.

```text
keyframes: {
  fk: {
    length: { stops: [ ... ] },
    rotation: { stops: [ ... ] },
    requires: { base: "walk/pelvis" },
  },
}
```

1. **`requires` is a reserved section inside a plugin-named group.** It is metadata, not a property: `flattenAuthoredKeyframes` skips it, so it never reaches the percent map, the interpolator, or a patch. A top-level `requires` names no plugin, so no binding written there could have an owner, and it is `keyframes-reserved-section`.
2. **Bindings are optional, and the unbound case belongs to the plugin.** Omitting `requires`, or a slot within it, derives no edge. `fkPlugin` composes against the origin; a plugin for which a missing base is meaningless refuses in its own `compose`. The schema does not decide what an absent parent means.
3. **The slot name is the destination.** There is no author-facing projection and no naming convention. A bound source's values arrive whole, under the source's own key names, at `inputs.base`.
4. **Three validation owners, because no single one can answer all three questions.** `validateKeyframes` owns registry-independent shape and stays registry-free, which is what lets it live in the contract layer. `PluginRegistry.resolveForKeyframes` owns whether the group names a registered plugin and whether that plugin declares the slot, as `plugin-unknown-requirement`. Graph construction owns topology: unknown source, self-reference, duplicate edge, cycle. Plugin resolution and graph construction are independent, so the ordering constraint the issue thread worried about does not exist: edge derivation reads the authored form directly.
5. **The requirement is part of edge identity and of edge ordering.** Two slots of one plugin may intentionally bind the same source, which is how a multi-source plugin such as IK is expressed without a second authoring model. `"-"` for an absent requirement, the same rule `targetOrder` already uses, so the comparator separates exactly the edges the identity encoding separates. `ObservationState.normalizeEdge` carries it for the same reason it carries a target.
6. **Composition never merges upstream inputs into authored values.** `Track.compose` takes the scoped inputs as their own argument and hands each plugin only its own slots. The separation is structural rather than enforced: `values.rotation` and `inputs.base.rotation` are distinguished by where they live, so a collision is not representable and `fkPlugin` needs no `parentRotation`.
7. **A bindings-only group still resolves its plugin into the compose chain.** Otherwise a track could derive an edge, receive its scoped input, and run no composer, which reads as a held value rather than as an error.
8. **The colon is reserved in a requirement slot too.** A namespaced slot would name a scoped input no author could spell, because `keyframes` rejects the colon in every authored name.

## Alternatives rejected

**A `values` wrapper beside `requires`,** so a group reads `{ fk: { values: { ... }, requires: { ... } } }`. It is more symmetric and it is not decidable. `isKeyframeGroup` is structural and registry-free by design, so a group whose sole leaf is named `values` is indistinguishable from a wrapper, and making the wrapper optional would leave two legal group shapes forever. Keeping the leaves at the group top level is additive: every grouped track that loads today loads unchanged, and the pathPlugin precedent the issue cites already authors configuration beside animated fields.

**`config` rather than `requires`.** `config` describes nothing and would accept anything. This section is graph bindings and nothing else, so it is named for what it is, and a plugin wanting other configuration gets its own reserved name and its own argument.

**Removing `ObservationDefinition.target` in this slice.** It is dead API surface, validated and included in edge identity but never consumed when composing inputs, and it should go. It is also a second invariant with its own blast radius across identity, ordering, and four test files, and this slice is already at the sizing ceiling. Deferred to its own change, with `observes` left untouched: it remains the generic graph primitive and `requires` is the plugin-owned one.

**Reordering `PluginComposer` to `compose(values, inputs)`.** The third argument is appended instead, so every composer written against the two-argument form stays assignable and no plugin outside this change has to move. Argument position is not the invariant; the separate argument is.

**A global collision guard over scoped inputs.** `plugin-input-collision` exists because a projected input name is not addressable by any owner. A requirement slot is addressed through its owning plugin's group and delivered scoped to it, so two plugins declaring `base` never share a namespace and there is nothing to arbitrate. The guard stays for `inputs`, which still has no other owner.

## Consequences

Thirteen projection blocks disappear from the React demo and two from the walker suite, each replaced by one line beside the keyframes it belongs to. Composed values are unchanged, which is what cases `Q-7` and `N-8` pin numerically rather than structurally.

`fkPlugin` no longer declares the `parentX`, `parentY`, and `parentRotation` inputs. It declares one `base` requirement and reads `inputs.base`, so the source keeps `x`, `y`, and `rotation`.

A derived edge is an edge. It is held to every topology rule an authored one is, so destroying a bound source is still `observation-unknown-source` and a binding cycle is still refused before mount.

An empty `requires` is refused rather than ignored, because omitting the section is already the way to bind nothing and a field accepted and then ignored is what ADR-033 forbids.
