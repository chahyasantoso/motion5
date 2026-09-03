# packages/core/src/graph/ir.ts

## readRemoved

Reads a removed authored field through the record view.

The member is gone from `ObservationDefinition`, so a TypeScript author cannot write it, and a JavaScript author still can. Reading it structurally is what turns "undeclared" into "refused", which is the difference between a removal and a field accepted and then ignored. See ADR-046.

## groupsAuthoring

The plugin-named groups whose `values` section authors `key`, sorted by name.

One walker, and the two rules that read it are set operations against the groups that bound a `solver` slot. It used to answer a single question, "what did the binder groups author for this key", which is one of the two predicates that question splits into the moment a second rule needs its complement: the dead rotation asks whether a binder group authored `rotation` and no `weight`, and the inert weight asks whether a solver-bound node authored `weight` in a group that bound none. Two near-identical group walkers is how those two drift apart, and this read has drifted once already, when it was wider than the rule that used it. See ADR-055.

Presence, never value. Whether an authored `weight` is provably always `1` is a leaf-shape and value-semantics question, `contract/authored-leaf` already owns leaf shape, and hand-walking a `stops` array here would make this layer a second owner of it: the same break issue #192 closed once. This layer answers which group authored a key, and nothing about what it authored.

Two shapes it deliberately does not report, because each already has a more specific owner. A value directly under the plugin name is the pre-ADR-049 group form, refused as `keyframes-missing-values-section`. And a flat key names no group at all: attributing one to a plugin is the registry's question, and this layer holds no registry by design, so a member authoring one meets `plugin-ambiguous-key` in any registry with two claimants and `plugin-unknown-key` in one with none.

Sorted, so a diagnostic that lists the groups it fired on never depends on authoring order. `readPluginValues` stays the only answer to what a group's `values` section is. See ADR-043, ADR-044, ADR-049, ADR-051, ADR-053, ADR-054, and ADR-055.

## baseOf

The node this one hangs from through its `base` slot, or `undefined` when it binds none.

## ownerOf

The owner a node's authored sources were qualified against, recovered from its own qualified id.

`collectTrack` qualifies against the motion id, or `~` for a free track, and both spellings put that owner before the first `/` of the node id. Recovering it here is what lets a goal key be qualified in the one layer that knows the member set, without adding a field to `GraphNode` that two owners would then have to keep in step with the id it is derived from. An authored goal key therefore qualifies exactly as an authored `base` source does, including a free-track solver having to spell its members out, which is a requirement its own bindings already carry.

## AuthoredGoal

One authored goal of a solver: the member key as written, and the node it names as a source.

## GoalBindings

Every goal binding one node authored: the bare slot, and the dict entries in authored key order.

One reader, because four rules and the derivation all ask the same question of the same edges. `ik-mode-ambiguous` needs to know whether a node bound a goal at all, `ik-goal-conflict` needs both spellings, `ik-solver-no-goal` needs neither of them, and the derivation needs every dict entry with its authored key. Two of those used to read the literal `"target"` in one loop while the grammar was read in another, which is how a member binding `solver` beside a goal dict loaded clean with every one of its goals ignored.

Gated on the base slot as well as on the field, and both halves are load-bearing. The field alone would classify any dict-valued binding as a goal, so a spring's or a spline's tension dict would have six IK rules run over it by a layer that holds no registry and cannot know better; the slot alone is what `"target"` already was. That puts `targets` in the same set as the `root`, `solver`, `base` and `target` literals this layer already hardcodes. `DV-8` pins it. See ADR-057.

The dict is sorted by the authored key rather than by `compareEdges`, whose first key is the source id: two goals pointing at one node would otherwise be ordered by nothing, and the authored key is what a duplicate diagnostic has to list. That is the ordering the derived slot produced, because the slot was this key under a fixed prefix. Order is a pure function of authored ids either way.
