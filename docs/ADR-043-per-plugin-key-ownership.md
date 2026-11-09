# ADR-043: Key ownership is per plugin, and the group names the owner

**Status:** Accepted, 2026-08-20

**Superseded by [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md), 2026-10-29.** Identified tables and records with an explicit `PluginCatalog` are the one supported contract; the grouped machinery this record describes is deleted.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** The group is now the
only authored top-level spelling. Shared claims remain legal, but the author names the owner by
choosing the plugin group; no flat entry reaches resolution.

## Context

ADR-041 shipped plugin-named keyframe groups, deferred exactly one thing by name: per-plugin key ownership. `PluginRegistry.register()` still threw `plugin-key-collision` for two plugins claiming one key; `#keyOwners` still one global map key→plugin; `fkPlugin` still claimed `boneLength` and `boneRotation` rather than natural `length` and `rotation`, because `transformPlugin` already owned `rotation` in that map.

So ergonomics problem issue #165 opened outlived slice that closed it. Grouping made authored _spelling_ scopable, left _who may claim what_ as it was; plugin author still hand-mangles key name to route around namespace they cannot share.

ADR-041 also deferred prefixed canonical leaves (`fk:length`) "with that slice". This record decides both: ADR-042 has since given them opposite answers.

## Decision

Key may be claimed by more than one plugin. Which plugin owns authored entry decided per entry, at resolve time; group form how author names owner.

1. **Registration accepts shared key.** `plugin-key-collision` deleted: one registry may hold `transform` claiming `x`, `y`, `rotation` and `fk` claiming `length`, `rotation`; `fkPlugin` claims natural names.
2. **Shared key authored flat refused, never won.** Flat key with two or more exact claimants is `plugin-ambiguous-key`, naming every claimant in sorted order, pointing at group form. Alternative is winner by registration order: losing plugin's keys quietly unreachable — last-write-wins this codebase rejects everywhere else. **Superseded in part by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** Flat key never resolved against claimants any more: every ungrouped top-level entry is `keyframes-ungrouped-key` however many plugins claim it; `plugin-ambiguous-key` deleted.
3. **Additive, by ADR-041's own argument.** Two plugins claiming one key could not register before this change → no registry able to report `plugin-ambiguous-key` could previously exist; no authored document loading today can start failing. Ambiguity property of registry, not plugin catalog: app registering only `transformPlugin` keeps authoring flat `rotation` forever. **Superseded in part by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** No app authors flat `rotation`: grouped-only authoring deliberate breaking change; `rotation` authored under `transform.values`.
4. **Group form stops being sugar.** For key one plugin claims it stays equivalent spelling, exactly as ADR-041 shipped. For shared key only legal spelling — why this record, not ADR-041, makes grouping load-bearing. **Superseded in part by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** Group form only legal spelling for every key, shared or not.
5. **One owner map, computed once.** `resolveForKeyframes` records owner of every flattened entry, hands map to `prepareContributions`, which used to re-derive ownership from global key map. Under one owner per key lookups agreed by construction; under shared keys they do not: second ran another claimant's `contribute` hook for grouped leaf, and ran a hook at all for group naming no plugin. `claimantsOf` survives for contributed keys only — no author wrote them, no group can name them.
6. **`claimsKey` unchanged, not claimant for this purpose.** Exact `keys` entry enumerable declaration two plugins comparable on; predicate opaque matcher whose overlap not declaration. Exact claims still outrank predicates; at most one predicate owns a key; first-registered wins between two predicates. Widening ambiguity to predicates deletes that rule (own owner, own evidence), makes every exactly-claimed key unauthorable in registry with catch-all predicate.
7. **`inputs` keeps collision guard.** Input not addressable by group name → nothing could name owner for one. `plugin-input-collision` only owner that rule has; deleting it leaves two plugins silently sharing one projected input name.
8. **Prefixed canonical leaves rejected, not deferred again.** ADR-042 made every key containing `:` unpublishable in `Track.compose`. Canonical `transform:x` would interpolate, pass plugin chain, then be filtered before snapshot frozen → grouped track publishes nothing. Prefix cannot be canonical spelling while prefix means private; per-plugin ownership removes only reason to want it.

## Alternatives rejected

**Per-track winner inferred from siblings,** so `rotation` beside `x` resolves to `transform`, beside `length` to `fk`. Reads well in two-plugin case, undecidable in general; diagnostic depending on which other keys a track happens to author cannot be reasoned about by person holding it.

**Registration-order precedence:** first plugin to claim key keeps it. Global map with friendlier failure mode: second plugin's authored keys silently unreachable; group form could not override without ownership being per entry anyway.

**Renaming `fkPlugin`'s keys without ownership change,** claiming `length` alone, leaving `boneRotation`. Half a rename worse than none: plugin uses one natural name and one mangled one; reason for mangling no longer visible anywhere.

**Keeping `boneLength` and `boneRotation` as aliases.** Two authored spellings of one compiled key exactly what ADR-041 reserved colon to prevent; both packages unpublished at `0.0.0`, nothing to stay compatible with.

## Consequences

`fkPlugin` claims `length` and `rotation`. Every rig registering `fkPlugin` and `transformPlugin` together authors bones as `fk: { length, rotation }`, roots as `transform: { x, y, rotation }`; walker fixtures and React demo move with this record. Published values unchanged: `fk.compose` returns only `x`, `y` and `rotation`, never published authored keys it reads.

`rotation` both claimed and produced by `fk`. Authored value is bone rotation relative to parent; composed value rotation in world space, which child observes and renderer writes. Nothing downstream reads local value → replaced rather than published beside its own result.

Plugin still sees keys it does not own in a given track: composed value bag always flat, every plugin always saw all of it. Ownership decides which plugin resolves into chain and which spellings legal, not what composer may read; `inputs` remains declaration for values plugin expects from somewhere else.
