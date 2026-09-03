# packages/core/src/domain/plugins.ts

## listNames

`"a" and "b"`, or `"a", "b" and "c"`: the wording every multi-plugin message here already uses.

## prepareContributions

Runs the prepare-stage `contribute` hooks.

`entryOwners` is the owner map the resolver already computed, not a second lookup: a key may have several claimants, so the plugin whose hook runs for an authored entry has to be the same plugin that entry resolved to. Re-deriving it from the registry's key map would run another claimant's hook for a grouped leaf, and would run a hook at all for a group that named no plugin. See ADR-043. `claimantsOf` answers for contributed keys only, which no author wrote and which no group can therefore name.

The stops a hook receives come from `readCompilableStops`, the one owner of the leaf shape, so a hook sees exactly the stops the interpolation compiler would rather than a second reading of the same authored record. See issue #192.

## #claimantsOf

Every plugin that claims `key`, in registration order.

An exact claim outranks a predicate, unchanged, and at most one predicate is ever returned. A predicate is the fallback for keys nobody named rather than a declaration of ownership, so two overlapping predicates keep first-registered precedence instead of becoming ambiguous: that rule has its own owner and its own evidence, and widening ambiguity to reach it would make every exactly-claimed key in a registry with a catch-all predicate unauthorable.

## #ownerForEntry

A grouped leaf resolves against the plugin the group names and nothing else, which is the granularity the group form exists for: routing the leaf through the claimant map instead would accept a leaf under any group name and report nothing at all for a group that names no registered plugin.

A flat key resolves against its claimants. One claimant owns it. Several is refused rather than won, because the alternative is registration order deciding which plugin an authored key meant and the losing plugin's keys becoming quietly unreachable. See ADR-043.

## #resolveRequirements

The registry-dependent half of binding validation.

Three questions only: does the group name a registered plugin, does that plugin declare the bound slot, and does the declaration agree with the shape the author bound it to. The shape of the section is already proven by `validateKeyframes`, and whether the source resolves to a node belongs to graph construction, which runs on the authored form and needs no registry at all. See ADR-044.

"Declares" has one source again. It was the `requirements` record for a slot the plugin named plus `claimsSlot` for a family it could not name, which is two owners of one question kept consistent by hand; the record answers alone now, and the third question above is what the predicate was really for. `PluginRequirement.dict` is that answer, and it is data, so no plugin gets to answer with code. See ADR-057.

Both directions are refused, because a mismatch is silent in both. A dict at a slot that takes one source is a binding accepted and then ignored, which is what ADR-033 rule 6 forbids, and nothing below this layer can catch it: the parser holds no registry, and the slot name is legitimately declared. One source at a slot that takes a dict hands a plugin one node's values where it reads a keyed record, which is the same silence with the shapes swapped.

`reportedGroups` is shared with `#ownerForEntry` so a group naming no registered plugin is one diagnostic whether the author got there through a leaf, a binding, or both.

The owning plugin joins `plugins` here, because a group may author nothing but bindings. Left out, such a track would derive its edge, receive its scoped input, and then run no composer at all: an edge with no consumer, which reads as a held value rather than as an error. It joins after the refusals, so a plugin reached only through a refused binding does not compose.
