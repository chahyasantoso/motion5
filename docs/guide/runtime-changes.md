# Runtime changes

A loaded project is not frozen. Motions and tracks can be added and removed while it runs, which is what an editor or a scroll-driven rig needs. Every mutation is transactional: it either commits fully or changes nothing.

## Adding and destroying a motion

```ts
const { id } = handle.addMotion({
  id: "outro",
  trigger: { type: "time", duration: 400 },
  tracks: [{ id: "fade", duration: 1, keyframes: { x: { stops: [{ p: 0, v: 0 }] } } }],
});

handle.destroyMotion(id);
```

`addMotion` validates, builds the motion, and only then publishes its id. If the trigger cannot resolve a driver, or the graph rejects the definition, nothing is committed and no public surface ever names a motion that failed to build. The rejection you get back is the reason the operation was refused, never a failure from the rollback that followed it.

## Track handles

`addTrack` returns a capability handle rather than an id, and the handle is the only way to mutate that track:

```ts
const track = handle.addTrack(armTrack, { motionId: "walk" });

track.replace(nextDefinition);
track.addObserve({ source: "walk/chest", role: "input" });
track.remove();
```

An observation carries `source`, `role`, and an optional `projection`, and nothing else. `addObserve` throws `observation-target-unsupported` for a `target`: use `projection` to rename the incoming keys, or bind the dependency under the plugin group's `requires` section when it belongs to a plugin. See ADR-046.

A handle carries a private token, so `remove` and `replace` are inert once the track is gone and cannot affect a later track that reuses the same id. `replace` preserves node identity and publishes through the normal ready path, so a React consumer does not see the node disappear and come back. Renaming is not a replace: it is a remove plus an add.

Omit `motionId` to add a free track, which lands at `~/trackId` with no motion scheduling it.

## Ordering and preflight

Remove children before parents so every intermediate graph stays valid. When you hold several handles from one insertion, reverse the list:

```ts
for (const track of [...handles].reverse()) track.remove();
```

`handle.dependantsOf(nodeId)` is a read-only query for editor preflight: it tells you who observes a node before you try to delete it. It is not the enforcement. Graph validation rejects a deletion that would orphan a live dependant, and there is no cascade delete.

## What atomicity guarantees you get

A refused single-track mutation costs nothing. `addTrack` and `replaceTrack` resolve the compiled track and seed its progress against the entry list they are about to commit, then commit, so a rejection leaves no partial state and the seeded values are identical to what a successful commit would have produced.

A rejected motion mutation reports the rejection that caused it. If the rollback itself also fails, for example because your own scroll-source unsubscribe throws, you get one `AggregateError` whose message opens with the original rejection verbatim and whose `errors` are `[rejection, rollbackFailure]`. The reason the operation was refused always outranks the noise from cleaning up.

Destruction is visible on the wire. An evicted node publishes exactly one `destroyed` patch before its retained patch is dropped, so an already-attached subscriber cannot keep rendering a node the graph has removed.

## Compatibility note

`handle.adopt()` and `handle.destroyAdopted()` still exist and still take a caller-invented owner object. They are the older owner-based API that `addTrack` replaced. Prefer handles; the demo consumer has already migrated.
