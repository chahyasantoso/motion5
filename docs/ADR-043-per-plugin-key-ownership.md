# ADR-043: Key ownership is per plugin, and the group names the owner

**Status:** Accepted, 2026-08-20

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** The group is now the
only authored top-level spelling. Shared claims remain legal, but the author names the owner by
choosing the plugin group; no flat entry reaches resolution.

## Context

ADR-041 shipped plugin-named keyframe groups and deferred exactly one thing by name: per-plugin key
ownership. `PluginRegistry.register()` still threw `plugin-key-collision` for two plugins claiming
one key, `#keyOwners` was still one global map from key to plugin, and `fkPlugin` still claimed
`boneLength` and `boneRotation` rather than the natural `length` and `rotation` because
`transformPlugin` already owned `rotation` in that map.

So the ergonomics problem issue #165 was opened against outlived the slice that closed it. Grouping
made the authored _spelling_ scopable and left _who may claim what_ exactly as it was, and a plugin
author still hand-mangles a key name to route around a namespace they cannot share.

ADR-041 also deferred prefixed canonical leaves (`fk:length`) "with that slice". This record decides
both, because ADR-042 has since given them opposite answers.

## Decision

A key may be claimed by more than one plugin. Which plugin owns an authored entry is decided per
entry, at resolve time, and the group form is how an author names that owner.

1. **Registration accepts a shared key.** `plugin-key-collision` is deleted, so one registry may
   hold `transform` claiming `x`, `y`, `rotation` and `fk` claiming `length`, `rotation`, and
   `fkPlugin` claims the natural names.
2. **A shared key is authored in a named group, never inferred.** A top-level entry that names no
   plugin group is `keyframes-ungrouped-key`, regardless of how many plugins claim its key. The
   author points the leaf at the intended owner by placing it under that group's `values` section.
3. **Explicit ownership, by ADR-121.** The registry still answers whether the named group claims
   a leaf, but it no longer infers an owner for an ungrouped entry. An app that registers only
   `transformPlugin` still authors `rotation` under `transform.values`, because one spelling keeps
   one owner.
4. **The group form stops being sugar.** For every claimed key the group form names the owner. ADR-121 makes that form mandatory, so there
   is no second authored spelling whose owner must be inferred.
5. **One owner map, computed once.** `resolveForKeyframes` records the owner of every flattened
   entry and hands that map to `prepareContributions`, which used to re-derive ownership from the
   global key map. Under one owner per key those two lookups agreed by construction; under shared
   keys they do not, and the second one ran another claimant's `contribute` hook for a grouped leaf
   and ran a hook at all for a group that named no plugin. `claimantsOf` survives for contributed
   keys only, which no author wrote and no group can therefore name.
6. **`claimsKey` is unchanged and is not a claimant for this purpose.** An exact `keys` entry is an
   enumerable declaration two plugins can be compared on; a predicate is an opaque matcher whose
   overlap is not a declaration. Exact claims still outrank predicates, at most one predicate ever
   owns a key, and first-registered still wins between two predicates. Widening ambiguity to reach
   predicates would delete that rule, which has its own owner and its own evidence, and would make
   every exactly-claimed key in a registry with a catch-all predicate unauthorable.
7. **`inputs` keeps its collision guard.** An input is not addressable by a group name, so nothing
   could name an owner for one. `plugin-input-collision` is the only owner that rule has, and
   deleting it would leave two plugins silently sharing one projected input name.
8. **Prefixed canonical leaves are rejected, not deferred again.** ADR-042 made every key containing
   `:` unpublishable in `Track.compose`. A canonical `transform:x` would therefore interpolate, pass
   the plugin chain, and then be filtered out before the snapshot is frozen, so a grouped track
   would publish nothing at all. The prefix cannot be the canonical spelling while the prefix means
   private, and per-plugin ownership removes the only reason to want it.

## Alternatives rejected

**A per-track winner inferred from siblings,** so `rotation` beside `x` resolves to `transform` and
beside `length` resolves to `fk`. It reads well in the two-plugin case and is undecidable in
general, and a diagnostic that depends on which other keys a track happens to author cannot be
reasoned about by the person holding it.

**Registration-order precedence,** where the first plugin to claim a key keeps it. That is the
global map with a friendlier failure mode: the second plugin's authored keys become silently
unreachable, and the group form could not override it without ownership being per entry anyway.

**Renaming `fkPlugin`'s keys without the ownership change,** claiming `length` alone and leaving
`boneRotation`. Half a rename is worse than none: the plugin would use one natural name and one
mangled one, and the reason for the mangling would no longer be visible anywhere.

**Keeping `boneLength` and `boneRotation` as aliases.** Two authored spellings of one compiled key
is exactly what ADR-041 reserved the colon to prevent, and both packages are unpublished at
`0.0.0`, so there is nothing to stay compatible with.

## Consequences

`fkPlugin` claims `length` and `rotation`. Every rig that registers `fkPlugin` and `transformPlugin`
together authors its bones as `fk: { length, rotation }` and its roots as
`transform: { x, y, rotation }`; the walker fixtures and the React demo move with this record.
Published values are unchanged, because `fk.compose` returns only `x`, `y`, and `rotation` and never
published the authored keys it reads.

`rotation` is both claimed and produced by `fk`. The authored value is a bone's rotation relative to
its parent and the composed value is its rotation in world space, which is what a child observes and
what a renderer writes. Nothing downstream reads the local value, so it is replaced rather than
published beside its own result.

A plugin still sees keys it does not own in a given track, because the composed value bag has always
been flat and every plugin has always seen all of it. Ownership decides which plugin resolves into
the chain and which spellings are legal, not what a composer may read; `inputs` remains the
declaration for values a plugin expects to arrive from somewhere else.
