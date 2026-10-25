# Runtime changes

A loaded project is not frozen. Motions and tracks can be added and removed while it runs, which is what an editor or a scroll-driven rig needs. Every mutation is transactional: it either commits fully or changes nothing.

## Adding and destroying a motion

```ts
const { id } = handle.addMotion({
  id: "outro",
  trigger: { type: "time", duration: 400 },
  tracks: [{ id: "fade", duration: 1000, input: { values: { opacity: 0 } } }],
});

handle.destroyMotion(id);
```

`addMotion` validates, builds the motion, and only then publishes its id. If the trigger cannot resolve a driver, or the graph rejects the definition, nothing is committed and no public surface ever names a motion that failed to build. The rejection you get back is the reason the operation was refused, never a failure from the rollback that followed it.

A `MotionHandle` edits a live Motion without tearing down its tracks. Resolve one with `handle.motion(motionId)`; use `tryMotion(motionId)` when a missing id is expected. It exposes `id`, `live`, `definition`, `trackIds`, `setTrigger`, `setStagger`, `addTrack`, `track`, `tryTrack`, and `destroy`, and no `signal`: signalling a Motion is `ProjectHandle.signal`'s question, because the runtime holding those trigger tokens holds no Motion instance to signal. Trigger and stagger edits are tier 0: they touch no graph node or edge, preserve the playhead, and refuse stale handles with `StaleMotionHandleError`.

## Track handles

`addTrack` returns a capability handle rather than an id, and the handle is the only way to mutate that track:

```ts
const track = handle.addTrack(armTrack, { motionId: "walk" });

track.replace(nextDefinition);
track.input.requires.set("base", "walk/chest");
track.input.requires.remove("base");
track.input.replace({ values: { length: 10 }, requires: { base: "walk/chest" } });
track.input.values.set({ length: 12 });
track.input.values.setField({ field: "length" }, 14);
track.remove();
```

`input.requires.set` and `input.requires.remove` edit one dependency binding. They redirect rather than append, support `memberKey` for map-valued slots, and leave the section absent when its last binding is removed. They rebuild the graph because an authored requirement is topology, and a refused candidate leaves the handle unchanged: an unknown source is `edge-unknown-source`.

`input.replace` replaces the whole authored input, values and `requires` together. Crossing the authored input contract belongs to it or to `replace()`, rather than to a value edit. `input.values.set` and `input.values.setField` edit authored values without re-inferring, and `writeValues`/`releaseValues` own the live overlay. All four value verbs validate against the committed contract; a table/record change is `values-shape-invalid`, an undeclared or absent field is `cell-form-invalid`, and an unknown row address is `cell-address-unknown`.

A live write replaces the whole evaluated value rather than a key at a time, and a dependency that feeds composition is bound under `input.requires`. See ADR-046 and ADR-047.

Omit `motionId` to add a free track, which lands at `~/trackId` with no motion scheduling it.

## Many edits, one transaction

Every member above commits on its own. `handle.edit(recipe)` runs a batch of them as one transaction instead:

```ts
handle.edit((tx) => {
  const rig = tx.addMotion({ id: "rig", trigger: { type: "manual" }, tracks: [] });
  for (const bone of bones) rig.addTrack(bone);
  tx.track("rig/forearm").input.requires.set("base", "rig/upperarm");
});
```

`n` ops across `m` tracks cost one candidate build, one graph replacement, one `ObservationState` commit and one flush, where the same sequence outside a recipe costs all of that per op. Each op still validates on entry, so every step is individually correct exactly as before; what changes is that committing is a separate verb from editing.

The recipe is handed a `SchemaTransaction`, which carries `addMotion`, `motion`, `tryMotion`, `addTrack`, `track` and `tryTrack` and nothing else: `mount`, `seek`, `subscribeNode` and `dispose` are not reachable through it. Reads inside it resolve against what it has staged, so a two-step edit sees its own first step, and the recipe's own return value is yours. A throw commits nothing, reaches no hook, and leaves every handle the recipe issued permanently not live.

Two refusals name where a call was made rather than what it does. A recipe opened inside a recipe is `schema-transaction-nested`. A verb that applies immediately is `schema-transaction-immediate`, named at the verb, which covers `setTrigger` and `setStagger` on a `MotionHandle` and `seek`, `writeValues`, `releaseValues`, `input.values.set` and `input.values.setField` on a `TrackHandle`: a settle step cannot refuse, so deferring one of those into the transaction would move its failure to after the graph had committed. See ADR-064.

## Many value writes, one publication

`handle.edit(recipe)` batches structural work. `handle.values(recipe)` batches the other tier, and what it batches is the publication rather than the write:

```ts
handle.values((batch) => {
  for (const rig of rigs) {
    batch.track(rig.goal).input.values.setField({ field: "x" }, rig.x);
    batch.track(rig.goal).input.values.setField({ field: "y" }, rig.y);
    batch.track(rig.solver).input.values.setField({ field: "flip" }, rig.flip);
  }
});
```

Outside a batch each of those writes publishes on its own, so `n` rigs cost `n` invalidations, `n` rounds of subscriber notification and `n` sequence moves. Inside one they cost one of each, and the call answers the `PatchBatch` that single publication produced. That is the whole saving, stated as narrowly as it deserves: a batch does not make a write cheaper. Each verb still validates on entry, still applies its write when you call it, and still rebuilds the affected node's compiled evaluator in place, because what one edit costs has nothing to do with how many nodes you are writing.

The recipe is handed a `ValueTransaction` carrying `seek`, `writeValues` and `releaseValues` addressed by node id, plus `track` and `tryTrack`. Those two answer the ordinary `TrackHandle`, so `writeValues`, `releaseValues`, `input.values.set` and `input.values.setField` on it join the batch as well, and there is deliberately no node-addressed authored value verb here: that spelling would throw away the lifetime token the handle captured, which is the whole mechanism behind `StaleTrackHandleError`.

A verb reached inside a batch answers a deferred batch rather than nothing: your own node as the only seed, no patches, and one warning whose `ruleId` is `value-batch-deferred`, saying the publication was queued. A `TrackHandle` is one interface whether or not a batch is open, so a member that answered `undefined` in one case would be a value nobody checks. A recipe is not a transaction: each cheap edit applies immediately, so edits before a refused one stay applied and nothing publishes. A recipe that staged nothing publishes nothing at all and answers an empty batch, for the same reason a commit with no seeds does not call `invalidate`: an empty batch still opens one, notifies every batch subscriber and moves the sequence.

Two refusals, and they name where the call was made rather than what it does. Everything that publishes or mounts is `value-batch-immediate` inside a batch, named at the verb, which covers `invalidate`, `mount`, `unmount`, `signal`, and `setTrigger` and `setStagger` reached on the handle itself, and a second `values`. `seek` is deliberately not one of them: it is a value verb, so inside a batch it stages its own node and joins the one publication exactly as the other four do. Every structural verb is `value-batch-structural`, at the one member all of them reach, and it stages nothing, so a refused `addTrack` or `remove()` leaves the project exactly as it was. Going the other way, a value verb inside `edit(recipe)` is still `schema-transaction-immediate`: the two tiers do not nest, in either direction. A recipe that disposes the project is answered with `ProjectRuntime is disposed.` in place of the batch, because the batch is the answer to the call and there is no batch. See ADR-078.

## Changing values without rebuilding the graph

`replace()` is for topology. To move a value, use the value tier, which stages no Track and rebuilds no graph:

```ts
// Revertible overlay. The authored definition is untouched.
track.writeValues({ x: 100, y: 0 });

// Sticky authored values. `track.definition` moves with it.
track.input.values.set({ x: 100, y: 0 });
```

Both return the `PatchBatch` of the one publication they cause, exactly as `seek()` does, so a dependent recomputes in the same call: moving a bone's `length` moves what an IK solver publishes for it, because a member's values reach a solve through the same read.

The difference is the retained definition. `track.definition` answers from it, so `input.values.set` is the one that keeps `handle.definition` and the live composition in agreement, and `writeValues` deliberately does not: it installs an overlay you expect to take back. `releaseValues()` drops that overlay and resumes authored evaluation at the current progress. The overlay survives authored value edits, binding edits and seeks, and is cleared only by a structural replacement or removal, `releaseValues`, and destroy.

Authored values accept a static cell or a stop sequence. A live write is an evaluated value: a table or record of scalars that matches the committed contract, never a stop sequence. A write is replaced wholesale by the next one rather than accumulated:

```ts
track.input.values.set({
  rotation: [
    { p: 0, v: 0 },
    { p: 1, v: 180 },
  ],
});
```

That is the whole authored record, not a merge, so a field this call omits is absent and may be refused if the contract requires it.

The refusal set is contract, not a limitation. A live write that does not match the committed contract throws `live-values-invalid` with the diagnostics that name every offending path, and the previous overlay stands. An authored write that changes the table/record shape is `values-shape-invalid`, an undeclared or absent field is `cell-form-invalid`, and an unknown row address is `cell-address-unknown`. Use `replace()` or `input.replace()` when the contract itself has to change. See ADR-059 and ADR-060.

## One field, without replacing the rest

`input.values.setField(address, cell)` writes one authored cell or field:

```ts
track.input.values.setField({ field: "length" }, 12);
track.input.values.setField({ row: "tip", field: "x" }, 40);
```

`address.row` selects a table cell and must be absent for a record field. A mismatch between the address form and the track's shape is `values-shape-invalid`, and an address that does not exist is `cell-address-unknown`. The verb returns the `PatchBatch` of its one publication and stages no Track.

## A stale handle refuses, and `live` asks without throwing

A handle carries a private token, so it can never affect a later track that reuses the same id. Once that token is no longer current the handle is stale, and every member of it fails the same way: `definition`, `requires`, `input`, `remove()`, `replace()`, `writeValues()`, and `releaseValues()` all throw `StaleTrackHandleError`. Four of them used to return silently, which reported success for doing nothing. See ADR-056.

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

`handle.dependantsOf(nodeId)` is a read-only query for editor preflight: it tells you who reads a node before you try to delete it, which is every observer of an edge plus any solver that reads it as a chain member. It is not the enforcement. Graph validation rejects a deletion that would orphan a live dependant, and there is no cascade delete.

Inside one `edit(recipe)`, remove children before parents too. A recipe plans each structural verb against the staged view rather than accumulating an operation log, so a parent-first removal is refused with `edge-unknown-source` and changes nothing, while the leaf-first order succeeds. Two further constraints are one line each: a Motion must own no tracks when `destroy()` runs, so children still leave before their Motion, and removing an id and recreating it in one recipe is refused as `schema-transaction-recreated`. Reversing a list is therefore necessary inside a recipe as well as when each removal is its own commit.

Enumeration is a read too. `handle.motionIds()`, `handle.freeTrackIds()` and `handle.mountedNodeIds()` answer every Motion id, every track node no Motion owns, and every node currently mounted, each frozen and in committed order, so nothing has to keep a copy of the document's ids beside it:

```ts
for (const motionId of handle.motionIds())
  for (const node of handle.motion(motionId).trackIds) handle.mount(node);
for (const node of handle.freeTrackIds()) handle.mount(node);
```

A Motion's own children stay `MotionHandle.trackIds`, so the two track answers partition the project between them. Inside a recipe they resolve against what it has staged, exactly as the resolvers do, and on a disposed project they refuse the way `dependantsOf` does.

## What atomicity guarantees you get

A refused single-track mutation costs nothing. `addTrack` and `replaceTrack` resolve the compiled track and seed its progress against the entry list they are about to commit, then commit, so a rejection leaves no partial state and the seeded values are identical to what a successful commit would have produced. A refused live value write is the same: the whole value is validated against the committed contract before anything is published, so the retained definition, overlay, compiled track, and published patch are all exactly as they were.

A rejected motion mutation reports the rejection that caused it. If the rollback itself also fails, for example because your own scroll-source unsubscribe throws, you get one `AggregateError` whose message opens with the original rejection verbatim and whose `errors` are `[rejection, rollbackFailure]`. The reason the operation was refused always outranks the noise from cleaning up.

Destruction is visible on the wire. An evicted node that has a retained publication delivers exactly one `destroyed` patch to its subscribers, and its entry is dropped before that delivery rather than after, so an already-attached subscriber cannot keep rendering a node the graph has removed and `get` can never hand the terminal patch back. Evicting a node that never published is silent, because there is no state for a terminal patch to contradict.
