# Runtime changes

A loaded project is not frozen. Motions and tracks can be added and removed while it runs, which is what an editor or a scroll-driven rig needs. Every mutation is transactional: it either commits fully or changes nothing.

## Adding and destroying a motion

```ts
const { id } = handle.addMotion({
  id: "outro",
  trigger: { type: "time", duration: 400 },
  tracks: [{ id: "fade", duration: 1, keyframes: { x: [{ p: 0, v: 0 }] } }],
});

handle.destroyMotion(id);
```

`addMotion` validates, builds the motion, and only then publishes its id. If the trigger cannot resolve a driver, or the graph rejects the definition, nothing is committed and no public surface ever names a motion that failed to build. The rejection you get back is the reason the operation was refused, never a failure from the rollback that followed it.

A `MotionHandle` edits a live Motion without tearing down its tracks. Resolve one with `handle.motion(motionId)`; use `tryMotion(motionId)` when a missing id is expected. It exposes `id`, `live`, `definition`, `trackIds`, `setTrigger`, `setStagger`, `addTrack`, `track`, `tryTrack`, `signal`, and `destroy`. Trigger and stagger edits are tier 0: they touch no graph node or edge, preserve the playhead, and refuse stale handles with `StaleMotionHandleError`.

## Track handles

`addTrack` returns a capability handle rather than an id, and the handle is the only way to mutate that track:

```ts
const track = handle.addTrack(armTrack, { motionId: "walk" });

track.replace(nextDefinition);
track.addObserve({ source: "walk/chest" });
track.setRequire("fk", "base", "walk/chest");
track.removeRequire("fk", "base");
track.setKeyframeGroup("fk", { values: { length: 10 }, requires: { base: "walk/chest" } });
track.removeKeyframeGroup("fk");
track.setGoal("ik", "wrist", "walk/hand");
track.removeGoal("ik", "wrist");
track.setKeyframe("fk", "length", 12);
track.removeKeyframe("fk", "length");
track.remove();
```

`setRequire` and `removeRequire` edit one edge on an already-bound plugin group. They preserve the group values, redirect rather than append, support `memberKey` for dict-valued slots, and leave the `requires` section absent when its last binding is removed. They rebuild the graph because an authored requirement is topology, and refused candidates leave the handle unchanged. To originate a plugin group, use `setKeyframeGroup` rather than silently creating a partial group: `keyframe-group-unbound` is what you get for naming a plugin this node authors no group for.

`setKeyframeGroup` and `removeKeyframeGroup` are the whole-group pair. The first writes a plugin binding, values and `requires` together, whether or not the node had one, because a group holding only half its data may be transiently invalid; that also makes it the one honest `set` verb here, since a group carries no id, no token and no mount, so originating one and replacing one are the same edit at the same price. It is wholesale rather than merged: the group you hand over is the group the node authors afterwards. The second drops the group and every edge its `requires` derived, in one commit, values included, because what is removed is the group rather than a section of it.

`setGoal` and `removeGoal` edit one entry of a solver's goals slot, addressed by the member id it is authored under, so two entries of one slot stay two edges. `setRequire` and `removeRequire` refuse that slot by name, as `keyframe-goal-slot-reserved`, and point at these two: without a member key they could only write the scalar spelling the loader refuses, and with one they would write the right shape through the wrong verb.

All four are no-ops when nothing changes, and each refuses before writing anything: `keyframe-entry-shape` for a name this node authors as an ordinary property, because writing a group over one would drop every stop you wrote, and `keyframe-group-shape` for a group naming neither reserved section, because that object is the ordinary property it looks like and removing the entry is how you author nothing. Everything else about the candidate is answered where it already is, by the plugin registry and by graph validation, and a refused candidate is rolled back with the handle unchanged. See ADR-062 and ADR-063.

An observation carries `source` and nothing else, and the edge it declares is always an output edge: the source's contribution merges over this track's composed patch. `addObserve` throws for each of the three removed fields, `observation-target-unsupported`, `observation-role-unsupported`, and `observation-projection-unsupported`. There is no way to declare an input edge by hand: bind the dependency under the plugin group's `requires` section, which is the only way a value enters composition. See ADR-046 and ADR-047.

Omit `motionId` to add a free track, which lands at `~/trackId` with no motion scheduling it.

## Many edits, one transaction

Every member above commits on its own. `handle.edit(recipe)` runs a batch of them as one transaction instead:

```ts
handle.edit((tx) => {
  const rig = tx.addMotion({ id: "rig", trigger: { type: "manual" }, tracks: [] });
  for (const bone of bones) rig.addTrack(bone);
  tx.track("rig/forearm").setRequire("fk", "base", "rig/upperarm");
});
```

`n` ops across `m` tracks cost one candidate build, one graph replacement, one `ObservationState` commit and one flush, where the same sequence outside a recipe costs all of that per op. Each op still validates on entry, so every step is individually correct exactly as before; what changes is that committing is a separate verb from editing.

The recipe is handed a `SchemaTransaction`, which carries `addMotion`, `motion`, `tryMotion`, `addTrack`, `track` and `tryTrack` and nothing else: `mount`, `seek`, `subscribe` and `dispose` are not reachable through it. Reads inside it resolve against what it has staged, so a two-step edit sees its own first step, and the recipe's own return value is yours. A throw commits nothing, reaches no hook, and leaves every handle the recipe issued permanently not live.

Two refusals name where a call was made rather than what it does. A recipe opened inside a recipe is `schema-transaction-nested`. A verb that applies immediately is `schema-transaction-immediate`, named at the verb, which covers `setTrigger` and `setStagger` on a `MotionHandle` and `overrideValues`, `setValues`, `setKeyframe` and `removeKeyframe` on a `TrackHandle`: a settle step cannot refuse, so deferring one of those into the transaction would move its failure to after the graph had committed. See ADR-064.

## Changing values without rebuilding the graph

`replace()` is for topology. To move a value, use the two cheap members, which stage no Track and rebuild no graph:

```ts
// Revertible. The authored definition is untouched.
track.overrideValues({ length: 100 });

// Sticky. `track.definition` moves with it.
track.setValues({ length: 100 });
```

Both return the `PatchBatch` of the one invalidation they cause, exactly as `seek()` does, so a dependent recomputes in the same call: masking a bone's `length` moves what an IK solver publishes for it, because a member's values reach a solve through the same read.

The difference is the retained definition. `track.definition` answers from it, so `setValues` is the one that keeps `handle.definition` and the live composition in agreement, and `overrideValues` deliberately does not: it is a write you expect to take back.

Either member takes an animated key as well as a static one, and the two are the same sentence to a reader:

```ts
track.overrideValues({
  rotation: [
    { p: 0, v: 0 },
    { p: 1, v: 180 },
  ],
});
```

A static key is masked over the interpolated state. An animated key has its tweens replaced on the still-live timeline, against a base record the interpolator kept when it compiled, so progress is preserved and no graph is rebuilt. An interpolator with no per-key write is not a second behavior: the runtime escalates to a recompile of the same definition and re-seeks to the same progress, so the published values and `handle.definition` are identical either way.

A write is replaced wholesale by the next one rather than accumulated, so an empty record is the clear for both kinds:

```ts
track.overrideValues({});
```

That restores the authored values, or whatever the last `setValues` wrote, and nothing else. A real `replace()` also drops it, because it compiles a fresh Track. A structural edit drops it too, for the same reason. Omitted keys always keep their values, and topology, progress, and observations are untouched by either member.

The refusal set is contract, not a limitation. Each of these throws `LiveValueKeyError`, whose `ruleId` is `live-value-key`, with no mutation and no publish:

- a key the track does not author;
- a key another plugin owns, which is the same thing: the group form is how you name the owner;
- a namespaced `key:like:this` or an interpolator scratch `_key`, neither of which is authorable;
- a key whose incoming leaf is a different kind from the authored one, which is `reason: "kind"`;
- a key a plugin prepared, which is `reason: "prepared"`.

The last two are the interesting ones. A live write moves a value; it does not change what a leaf is, so a scalar for an animated key and a stop list for a static key are both recompiles of a different shape rather than writes. Use `replace()` for those. A prepared key is compiled from the plugin's value, and a write over it would invert that precedence and disagree with the next real recompile. A malformed stop list is refused too, by the same validator a whole definition goes through, because an authored stop list is definition-shaped input. See ADR-059 and ADR-060.

## One property of a group, without naming the rest

`overrideValues` and `setValues` take a record and answer for the whole node. To move one leaf of one plugin group, name the group:

```ts
track.setKeyframe("fk", "length", 12);
track.setKeyframe("fk", "rotation", [
  { p: 0, v: 0 },
  { p: 1, v: 45 },
]);
track.removeKeyframe("fk", "length");
```

Both are the value tier, so both return the `PatchBatch` of their one invalidation and neither rebuilds the graph, on any path. That holds because a leaf carries no edge and the plugin it belongs to is already in the chain: this pair only edits a group the node already authors, and `keyframe-group-unbound` is what you get for naming a plugin it does not. Originating a group is still `setKeyframeGroup`'s job, because a group holding only half its data may be transiently invalid.

A key the group already authors takes the path `setValues` takes, with the same per-key refusals in the same order. A key it does not author yet cannot be masked, because nothing compiled it, so the authored record is edited and the node is recompiled in place and re-seeked to the progress it had. That new leaf is the one thing this pair can do that the record-shaped members cannot.

The leaf-kind crossing is still refused, and that is a decision rather than an unfinished edge. This verb rewrites the authored record, so it could have compiled a scalar over an animated key, and it does not: which kind of leaf a key is authored as is a whole-definition question that `replace()` owns. An animated key itself is fine, exactly as it is through `setValues`.

`removeKeyframe` takes the empty shapes with it. The values section goes when its last leaf does, the group goes when it names no section, and the definition loses its `keyframes` key when it holds nothing, so dropping the only leaf of a group that binds nothing removes the group and the plugin leaves the chain with it. That is what an author writing the same document would have written. A key the group does not author is a no-op. See ADR-065.

## A stale handle refuses, and `live` asks without throwing

A handle carries a private token, so it can never affect a later track that reuses the same id. Once that token is no longer current the handle is stale, and every member of it fails the same way: `definition`, `requires`, `remove()`, `replace()`, `addObserve()`, `removeObserve()`, `setRequire()`, `removeRequire()`, `setKeyframeGroup()`, `removeKeyframeGroup()`, `setGoal()`, `removeGoal()`, `setKeyframe()`, `removeKeyframe()`, `overrideValues()`, and `setValues()` all throw `StaleTrackHandleError`. Four of them used to return silently, which reported success for doing nothing. See ADR-056.

The error extends `TypeError` and keeps the message `Track "<id>" is no longer live.` verbatim, so an existing `instanceof TypeError` narrowing keeps matching. Branch on `ruleId`, which is `stale-track-handle`, rather than on the message; `nodeId` carries the node the refused handle was captured against.

`readonly live: boolean` is the non-throwing way to ask, so cleanup whose second call is expected rather than mistaken guards instead of catching:

```ts
if (track.live) track.remove();
```

`live` never throws, on either side of any invalidation and on a disposed project. On a disposed project `remove()` reports the disposal rather than the staleness, because the project's own lifecycle outranks one handle's, and the guard above is correct either way.

A handle survives its own `replace()`. Replacement preserves node identity and therefore the token, and it publishes through the normal ready path, so a React consumer does not see the node disappear and come back and the same handle stays usable afterward. Renaming is not a replace: it is a remove plus an add, and the handle you held for the removed node is stale.

## Ordering and preflight

Remove children before parents so every intermediate graph stays valid. When you hold several handles from one insertion, reverse the list:

```ts
for (const track of [...handles].reverse()) track.remove();
```

`handle.dependantsOf(nodeId)` is a read-only query for editor preflight: it tells you who observes a node before you try to delete it. It is not the enforcement. Graph validation rejects a deletion that would orphan a live dependant, and there is no cascade delete.

## What atomicity guarantees you get

A refused single-track mutation costs nothing. `addTrack` and `replaceTrack` resolve the compiled track and seed its progress against the entry list they are about to commit, then commit, so a rejection leaves no partial state and the seeded values are identical to what a successful commit would have produced. A refused live value write is the same: every key is classified before anything is written, so the retained definition, the mask, the timeline, and the published patch are all exactly as they were.

A rejected motion mutation reports the rejection that caused it. If the rollback itself also fails, for example because your own scroll-source unsubscribe throws, you get one `AggregateError` whose message opens with the original rejection verbatim and whose `errors` are `[rejection, rollbackFailure]`. The reason the operation was refused always outranks the noise from cleaning up.

Destruction is visible on the wire. An evicted node publishes exactly one `destroyed` patch before its retained patch is dropped, so an already-attached subscriber cannot keep rendering a node the graph has removed.

## Compatibility note

`handle.adopt()` and `handle.destroyAdopted()` still exist and still take a caller-invented owner object. They are the older owner-based API that `addTrack` replaced. Prefer handles; the demo consumer has already migrated.
