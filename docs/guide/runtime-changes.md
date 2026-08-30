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

## Track handles

`addTrack` returns a capability handle rather than an id, and the handle is the only way to mutate that track:

```ts
const track = handle.addTrack(armTrack, { motionId: "walk" });

track.replace(nextDefinition);
track.addObserve({ source: "walk/chest" });
track.remove();
```

An observation carries `source` and nothing else, and the edge it declares is always an output edge: the source's contribution merges over this track's composed patch. `addObserve` throws for each of the three removed fields, `observation-target-unsupported`, `observation-role-unsupported`, and `observation-projection-unsupported`. There is no way to declare an input edge by hand: bind the dependency under the plugin group's `requires` section, which is the only way a value enters composition. See ADR-046 and ADR-047.

Omit `motionId` to add a free track, which lands at `~/trackId` with no motion scheduling it.

## A stale handle refuses, and `live` asks without throwing

A handle carries a private token, so it can never affect a later track that reuses the same id. Once that token is no longer current the handle is stale, and every member of it fails the same way: `track`, `remove()`, `replace()`, `addObserve()`, and `removeObserve()` all throw `StaleTrackHandleError`. Four of them used to return silently, which reported success for doing nothing. See ADR-056.

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

A refused single-track mutation costs nothing. `addTrack` and `replaceTrack` resolve the compiled track and seed its progress against the entry list they are about to commit, then commit, so a rejection leaves no partial state and the seeded values are identical to what a successful commit would have produced.

A rejected motion mutation reports the rejection that caused it. If the rollback itself also fails, for example because your own scroll-source unsubscribe throws, you get one `AggregateError` whose message opens with the original rejection verbatim and whose `errors` are `[rejection, rollbackFailure]`. The reason the operation was refused always outranks the noise from cleaning up.

Destruction is visible on the wire. An evicted node publishes exactly one `destroyed` patch before its retained patch is dropped, so an already-attached subscriber cannot keep rendering a node the graph has removed.

## Compatibility note

`handle.adopt()` and `handle.destroyAdopted()` still exist and still take a caller-invented owner object. They are the older owner-based API that `addTrack` replaced. Prefer handles; the demo consumer has already migrated.
