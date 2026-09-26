# ADR-121: authored keyframes are grouped only

**Status:** Proposed in [#511](https://github.com/chahyasantoso/motion5/pull/511), 2026-09-26,
for [#509](https://github.com/chahyasantoso/motion5/issues/509); accepted when the pull request
carrying it merges.

## Invariant

Every authored top-level `keyframes` entry is one plugin-named group:
`{ <plugin>: { values: { ... }, requires?: { ... } } }`. One spelling has one owner: the plugin
group names the owner, so key ownership is never inferred from a flat key, registry order, or the
shape of a value. A leaf inside `values` is an authored array of stops, a finite static scalar, or
`{}` as a no-op; `requires` remains the group's optional binding section. This invariant applies to
`TrackDefinition.keyframes` and every record handed to the authored validator, engine, runtime,
registry resolver, or authored flattener.

The invariant does not apply to interpolator and tween configurations, flattened or compiled
records, contribution scope, plugin `contribute` outputs, or live values. Those records stay flat:
the group is an authored ownership boundary and is removed before those consumers receive values.

## Context

The previous contract accepted both plugin-named groups and flat authored properties. That made one
question have two owners. A flat `rotation` required the registry to infer which plugin claimed it,
while a grouped `rotation` named its owner. Shared claims therefore needed a second ambiguity rule,
and every consumer had to preserve the difference between authored shape and compiled shape.

The final group grammar already has exact reserved sections, `values` and `requires`. An object
naming neither section is not a group, and a top-level property has no plugin owner. Keeping that
entry legal would preserve the ambiguity the group form was introduced to remove. The contract layer
can refuse the spelling without a registry, before resolution or compilation.

## Decision

Authored validation accepts only plugin-named groups at the top level. A bare stops array, static
number, retired `{ stops: [...] }` wrapper, `{}`, or other object that is not a named group is
refused as `keyframes-ungrouped-key` with error severity. The path names the top-level entry. A
pre-ADR-049 group that puts leaves beside `requires` remains the more specific
`keyframes-missing-values-section`, because it did name a plugin and only omitted the `values`
section. An empty `{}` inside `values` remains an accepted no-op leaf: it is in the owned leaf
position and does not create a tween or contribution.

The plugin group names the owner, and the resolver checks that the named plugin claims every leaf.
The validator still owns authored shape, the registry owns plugin and slot claims, and graph
construction owns topology. Flattening then removes the group boundary and presents unprefixed
leaves to the flat consumers. No normalization guesses a group or moves a key between plugins.

The v4-to-v5 migrator remains a pure structural migration for the v4 project fields it owns. It
moves the top-level `tracks` field to `freeTracks` and does not inspect keyframe ownership or invent
plugin groups. An author must choose the registered plugin that owns each key, place the key under
that group's `values`, and review any v4 input edge as the plugin's `requires` binding before the
v5 project is loaded.

## What is deleted

- `plugin-ambiguous-key` is deleted. A flat authored key is no longer a legal spelling, so no
  registry state can make it ambiguous and no diagnostic should preserve a second owner for it.
- The runtime refusal `property-entry` and its `keyframe-entry-shape` message are deleted. Runtime
  group edits no longer need to distinguish a group from a flat property at one authored entry:
  the authored definition boundary is handled by the grouped record and `replace()`.
- `readsAsProperty` is deleted because an authored top-level entry is never read as a property.
  Its remaining question, whether a value is a valid leaf, is answered inside `values` by the
  authored-leaf reader.

## Consequences

This is breaking for authors. Every authored property must move under the plugin that owns it and
inside `values`; a top-level flat property, including a static value or `{}`, now refuses. The
change makes ownership explicit, removes registration-order and claimant ambiguity, makes the
contract registry-independent at the top-level shape boundary, and leaves the downstream flat
pipeline unchanged. A no-op is still expressible as `{}` inside `values`, and a binding-only plugin
group still omits `values` while retaining `requires`.

The migrator does not guess groups. A migration can therefore accept a v4 project's structural
fields while the resulting v5 project still needs an author's ownership pass. This is deliberate:
automatic selection from a registry would make a migration tool the owner of plugin intent and could
silently change a rig when plugins or claims change.

## Alternatives withdrawn

- Keeping both flat and grouped authored spellings, with the registry inferring a unique owner,
  was withdrawn because it leaves two spellings and makes one ownership question depend on registry
  state. A unique claimant is still an inference, and a second claimant needs the deleted ambiguity
  rule.
- Auto-grouping flat keys by registry claims during validation or v4 migration was withdrawn because
  the registry cannot know whether an author intended `transform`, `fk`, `ik`, or an application
  plugin when claims overlap. It would also make migration output depend on registration order and
  hide an ownership decision behind normalization.
- Treating every object as a group, or every `{}` as a valid top-level no-op, was withdrawn because
  a group is identified exactly by its reserved sections and an unowned top-level entry cannot be
  compiled safely. `{}` survives only at the leaf position where its plugin owner is already named.
- Grouping downstream flat records was withdrawn. Interpolator configs, compiled records,
  contribution outputs, and live values have different owners and consumers; changing those shapes
  would add a second normalization boundary without solving authored ownership.

## Related records

[ADR-041](./ADR-041-plugin-named-keyframe-groups.md) introduced plugin-named groups.
[ADR-043](./ADR-043-per-plugin-key-ownership.md) made ownership per plugin.
[ADR-049](./ADR-049-explicit-plugin-group-values-section.md) reserved `values`.
[ADR-050](./ADR-050-bare-authored-leaf.md) defined bare leaves inside `values`.
[ADR-063](./ADR-063-whole-group-and-goal-authoring.md) owns whole-group edits.
[ADR-097](./ADR-097-a-rule-id-is-a-closed-union.md) owns the closed rule-id inventory.
[ADR-053](./ADR-053-solver-chain-load-contract.md) records the solver-chain load contract,
amended for grouped authoring.
[ADR-055](./ADR-055-per-member-solved-rotation-weight.md) records per-member solved rotation
weight, amended for grouped authoring.
[ADR-062](./ADR-062-candidate-key-ownership.md) records candidate key ownership, amended for
grouped authoring.
[ADR-108](./ADR-108-constrained-2d-solving.md) records constrained solver spellings, amended
for grouped authoring.
[ADR-109](./ADR-109-opt-in-solve-inspection.md) records inspection spellings, amended for grouped
authoring.
[ADR-110](./ADR-110-goal-influence-and-conflict-policy.md) records goal influence spellings,
amended for grouped authoring.
[ADR-117](./ADR-117-3d-pivot-offsets.md) records 3D pivot spellings, amended for grouped
authoring.
