# packages/core/src/domain/plugins.ts

`RenderMetadata` is the renderer-facing port contract declared in `../ports/render-metadata.ts`.
`ResolvedPlugins` extends it here so the registry remains the owner of the resolved serializer map,
while adapters consume the port without reaching into this domain module. This module no longer
exports `RenderMetadata`; the adapter barrel and the internal entry re-export it from the port under
the same name, so there is one declaration and one import path. See ADR-105.

## prepareContributions

Runs the prepare-stage `contribute` hooks.

`entryOwners` is the owner map the resolver already computed, not a second lookup: a key may have several claimants, so the plugin whose hook runs for an authored entry has to be the same plugin that entry resolved to. Re-deriving it from the registry's key map would run another claimant's hook for a grouped leaf, and would run a hook at all for a group that named no plugin. See ADR-043. `claimantsOf` answers for contributed keys only, which no author wrote and which no group can therefore name.

The stops a hook receives come from `readCompilableStops`, the one owner of the leaf shape, so a hook sees exactly the stops the interpolation compiler would rather than a second reading of the same authored record. See issue #192.

## PluginRegistry

Batch admission is atomic: every definition is admitted before any registry index is written.
`plugin-admission.ts` owns validation against a single own-property snapshot. The registry supplies
existing and staged names/input owners, stages the resulting entries, then stores them in input order.
`register` delegates to a one-member batch; checks, precedence and messages have one owner.

An empty batch is a no-op; a non-array throws `TypeError("Plugin definitions must be an array.")`.
Getter failures propagate without inserting earlier candidates. A compose method present only on a
prototype is refused because it would disappear from the stored own-property snapshot. Own compose
fields remain valid. Keys, inputs and outputs must hold strings and are copied and frozen
before commit; requirements are stored as a frozen copy, never frozen in place.

`#admitting` rejects nested registration during snapshotting with
`TypeError("Plugin registration is already in progress.")` and resets in `finally`. Getters and
metadata proxies are user code, so otherwise a callback could publish a nested partial registration
inside a batch that later fails. Compose and contribution hooks never run during admission.
The joint-key predicate is consulted once when the explicit keys do not already claim it.
The store phase reads only
admitted data and performs map/array writes. See ADR-134.

The registry implements `PluginCapabilities`, the graph's narrow declaration port (ADR-136).
Admission validates and freezes one chain snapshot, derives pole from the requirements record and
joint from the key claim, then stages that capability beside the definition. A refused batch stores
neither definitions nor capabilities. Dedication is registry-wide: every admitted tree contributes
its member name, including a solver unused by the current project. A private Set owns uniqueness;
the exposed array is sorted, frozen, and replaced only when a new dedicated member is admitted.

## #claimantsOf

Every plugin that claims `key`, in registration order, asked only about a contributed key.

No authored key reaches it. Every authored property sits in a group, and `#ownerForEntry` resolves a grouped leaf against the plugin the group names, so the claimant map answers only for a key a prepare hook contributed, which no author wrote and no group can name: whether any plugin claims it at all (`plugin-unknown-key`) and whether a claimant would contribute from it again (`plugin-contribution-cascade`). See ADR-121.

An exact claim outranks a predicate, unchanged, and at most one predicate is ever returned. A predicate is the fallback for keys nobody named rather than a declaration of ownership, so two overlapping predicates keep first-registered precedence.

## #ownerForEntry

A leaf resolves against the plugin its group names and nothing else, which is the granularity the group form exists for: routing the leaf through the claimant map instead would accept a leaf under any group name and report nothing at all for a group that names no registered plugin.

There is no ungrouped arm. `validateKeyframes` refuses every ungrouped entry as `keyframes-ungrouped-key` before this runs, so every entry here carries its group and ownership never depends on which plugins the host registered. See ADR-043 and ADR-121.

## #resolveRequirements

The registry-dependent half of binding validation.

Three questions only: does the group name a registered plugin, does that plugin declare the bound slot, and does the declaration agree with the shape the author bound it to. The shape of the section is already proven by `validateKeyframes`, and whether the source resolves to a node belongs to graph construction, which runs on the authored form and needs no registry at all. See ADR-044.

"Declares" has one source again. It was the `requirements` record for a slot the plugin named plus `claimsSlot` for a family it could not name, which is two owners of one question kept consistent by hand; the record answers alone now, and the third question above is what the predicate was really for. `PluginRequirement.dict` is that answer, and it is data, so no plugin gets to answer with code. See ADR-057.

Both directions are refused, because a mismatch is silent in both. A dict at a slot that takes one source is a binding accepted and then ignored, which is what ADR-033 rule 6 forbids, and nothing below this layer can catch it: the parser holds no registry, and the slot name is legitimately declared. One source at a slot that takes a dict hands a plugin one node's values where it reads a keyed record, which is the same silence with the shapes swapped.

`reportedGroups` is shared with `#ownerForEntry` so a group naming no registered plugin is one diagnostic whether the author got there through a leaf, a binding, or both.

The owning plugin joins `plugins` here, because a group may author nothing but bindings. Left out, such a track would derive its edge, receive its scoped input, and then run no composer at all: an edge with no consumer, which reads as a held value rather than as an error. It joins after the refusals, so a plugin reached only through a refused binding does not compose.
