# ADR-041: Plugin-named authored keyframe groups

**Status:** Accepted, 2026-08-19

## Context

Authored keyframes were a flat record and plugins claimed flat keys. The collision that motivated
issue #165 is not silent: `PluginRegistry.register()` throws `plugin-key-collision` at startup for
two plugins claiming one key. The real cost is upstream of that guard. `fkPlugin` claims
`boneLength` and `boneRotation` rather than the natural `length` and `rotation` precisely because
`transformPlugin` already owns `rotation` in one global map, so plugin authors hand-mangle names to
route around a namespace they cannot scope. That is an ergonomics problem, not a safety hole, and
the fix has to be judged as one.

Two shapes were on the table, both starting from `keyframes: { fk: { length }, transform: { x } }`.
Option B flattens the group in the graph before compilation. Option C keeps the group as sugar and
flattens after the prepare stage.

## Decision

Option B. Groups are accepted **in addition** to the flat form and flattened before compilation.

1. **Additive.** Grouped keyframes are rejected today at load: `validateKeyframes` emits
   `stops-shape` for a property with no `stops` array, so no authored content can depend on the
   group form and none can be broken by accepting it. The flat form stays legal forever.
2. **Flattening is a pure transform with one owner,** `flattenAuthoredKeyframes` in
   `domain/keyframe-groups.ts`, and the Engine calls it whether or not a `PluginRegistry` was
   injected. Leaving it inside the resolver alone looks like one owner and is not: an Engine
   constructed with no registry has no resolver to fall back on, so a grouped track would reach
   `compilePercentKeyframes` and the interpolator as a nested object, read no stops, and hold still
   at every progress while reporting nothing.
3. **Ownership stays with the registry.** A group name addresses a plugin by name, and the leaf is
   checked against that plugin's own `keys`/`claimsKey` set. Resolving a grouped leaf through the
   global key map would accept any leaf under any group name and report nothing for a group naming
   no plugin, which is the entire granularity the group form exists to add.
4. **Leaves keep their authored names.** They are not rewritten to `fk:length`. A prefixed leaf
   would reach the percent map, the interpolator, the plugin `compose` chain, and every adapter
   under a name none of them reads, so `fkPlugin` would stop composing the very values it authored.
   Per-plugin key ownership, which would let `fk` claim the natural `length`, is a separate slice.
5. **The colon is reserved as code, not convention.** It is rejected in flat keyframe names, group
   names, leaf names, and in plugin `keys`, `inputs`, and `outputs`. Without that,
   `{ "fk:length": ... }` and a flattened `{ fk: { length } }` would be two spellings of one key,
   which is the dual namespace Option C was rejected for.
6. **One compiled key, one authored spelling.** Two groups contributing the same leaf, or a leaf
   colliding with a flat key, is `keyframes-duplicate-key` at validation. Flattening therefore
   cannot silently drop a property, and the rule has exactly one owner: the validator sees the
   authored document and needs no registry to see the collision.
7. **Diagnostics cite what was typed.** Flattening carries an authored path per leaf, so resolve
   and contribution diagnostics report `keyframes.fk.boneLength`, never the flattened spelling.

## Alternatives rejected

**Option C**, flattening after `prepareContributions`, breaks the `contribute` hook for grouped
keys: the hook would receive the group whole and `readStops` returns `[]` for it, so a
prepare-stage plugin could not contribute inside a group without a second per-child contribution
path. It also leaves the group name and the flat leaf space as two namespaces that can collide.

**Flattening inside `validateV5`** would normalize the project the validator returns, so
`TrackHandle.track` and every adoption clone would stop reporting what the author wrote.

**Prefixed canonical leaves** (`fk:length`) are what issue #165 originally specified. They cannot
land without per-plugin key ownership, and shipping them without it renames the keys plugins and
adapters read. Deferred with that slice.

## Consequences

The authored contract gains one shape and loses none. `TrackDefinition.keyframes` values are now
`AuthoredKeyframe`, so code reading `.stops` off one narrows to `AuthoredProperty` first.
`ResolvedPlugins` gains `authoredKeyframes`, the flattened record, and `Engine` has one
prepare-and-compile owner instead of two copies. `domain/track.ts` is unchanged, and deliberately
so: reading `plugins.authoredKeyframes` there would let `EMPTY_RESOLVED_PLUGINS` erase every
keyframe on a Track constructed without plugins.

A group leaf whose value is an empty object stays accepted, matching the flat form. The contract
layer cannot tell a one-key group from a malformed property without a registry it must not have, so
that ambiguity resolves at plugin resolution as `plugin-unknown-key`.
