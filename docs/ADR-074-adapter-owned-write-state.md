# ADR-074: a DOM adapter writes only from state it owns, at the newest revision it accepted

Status: accepted. Supersedes nothing. Issues [#356](https://github.com/chahyasantoso/motion5/issues/356) and [#357](https://github.com/chahyasantoso/motion5/issues/357).

## Context

`createDomPatchAdapter` is the single owner of patch-to-target translation, and ADR-073 made it the owner for the React path too, so every published value that reaches an element now goes through one implementation. That implementation carried two pieces of state whose ownership had never been decided. Both were decided by where a declaration happened to sit rather than by what the state is for.

`transformState`, the record of composed transform keys per target, was a module-level `WeakMap`. Composition is genuinely stateful: `x` alone has to be written as a whole `transform` string beside the `scale` an earlier patch set, so the writer has to remember the keys it composed. A module-level map makes that memory global to the process. Two adapters bound to one element therefore shared one composition while keeping separate dirty caches, which is the worst of both: the second starts with an empty `lastApplied`, writes its own keys, and composes them together with keys the first set and it has never seen. `clear(target)` was global for the same reason, so releasing one binding erased the other's pose. `useDomPatch` creates one adapter per binding, which is what turned a narrow API shape into a reachable one.

`apply` read `patch.revision` for nothing. `PatchRegistry` increments it per node on every publish and is the only publisher in the tree, so out-of-order delivery is not something the shipped composition can produce. An injected `PatchSource` can, and the cost is not one stale frame: `lastApplied` is what the next frame's dirty set is measured against, so a write from an older patch leaves every later diff wrong about what the element holds. Keys that should be rewritten are suppressed as unchanged, and keys that should be removed are not in the previous record to remove.

## Decision

Both live on the adapter instance. `transformState` moves into the closure beside `lastApplied`, and the shipped writer becomes `createTransformWriter(transformState)`, a factory over the state it composes into rather than a module function reaching for a module map. An injected `write` replaces it entirely, as before, and the declared parameter type does not change: a defaulted parameter and an optional one emit the same declaration.

`apply` refuses a patch whose revision is not newer than the newest this adapter accepted for that target and that node, before the diff rather than after it, and records the accepted revision whether or not the diff turned out to be empty. An accepted patch that writes nothing is still the newest thing this adapter has seen, and treating it as unseen would let the patch before it through.

**The guard is keyed by target and node together, and neither half is optional.** Keyed by node alone it would refuse the first write to a rebound element: `useDomPatch` re-applies the retained patch when React hands it a new node, and that patch carries a revision the adapter has already accepted, so a fresh element would keep whatever pose it was born with. Keyed by target alone it would refuse legitimate writes: the default `resolveTarget` sends every node's patches to the stage, revisions are monotonic per node and unrelated across nodes, and a node whose stream is numbered lower than its neighbour's is not stale for it. `clear(target)` drops the record with the rest of that target's state, which is what re-arms a rebind.

Issue #356 proposed reading the revision off `lastApplied`. That record holds rendered values and no revision, and widening it would key the freshness question and the dirty question on one entry while they need different keys: the dirty diff is per target, because that is what a write lands on, and freshness is per target and node. Two maps, two questions.

## Consequences

An adapter is now safe to construct per binding, which is what the React hook already does, and two of them on one element are two independent renderers rather than one shared pose with two dirty caches. A custom `PatchSource` cannot walk a target's diff cache backwards.

`originPinned` is not part of this. The SVG reference-box pin ADR-073 added is idempotent against the element's own `style.transformBox` rather than against a module-level `WeakSet`, so it reads per-target state from the target and had nothing to move. Issue #357's description of it was written against a draft that did not ship, and that half of the issue is answered as already correct rather than quietly dropped.

Evidence is `packages/core/test/integration/dom-adapter-owned-state.test.ts`. Each case asserts the accepting direction in the same rig as the refusing one, because a guard that refuses everything and a writer that composes nothing are both green against the refusal alone.
