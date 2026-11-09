# ADR-074: a DOM adapter writes only from state it owns, at the newest revision it accepted

Status: accepted. Supersedes nothing. Issues [#356](https://github.com/chahyasantoso/motion5/issues/356) and [#357](https://github.com/chahyasantoso/motion5/issues/357).

## Context

`createDomPatchAdapter` is single owner of patch-to-target translation; ADR-073 made it owner for React path too → every published value reaching an element goes through one implementation. Implementation carried two pieces of state whose ownership never decided. Both decided by where a declaration sat, not by what the state is for.

`transformState`, record of composed transform keys per target, was module-level `WeakMap`. Composition genuinely stateful: `x` alone must be written as whole `transform` string beside `scale` an earlier patch set → writer must remember keys it composed. Module-level map makes that memory global to process. Two adapters bound to one element therefore shared one composition while keeping separate dirty caches — worst of both: second starts with empty `lastApplied`, writes own keys, composes them with keys first set and it never saw. `clear(target)` global for same reason → releasing one binding erased other's pose. `useDomPatch` creates one adapter per binding, which turned narrow API shape into reachable one.

`apply` read `patch.revision` for nothing. `PatchRegistry` increments it per node on every publish, only publisher in tree → out-of-order delivery not something shipped composition can produce. Injected `PatchSource` can, and cost is not one stale frame: `lastApplied` is what next frame's dirty set measured against → write from older patch leaves every later diff wrong about what element holds. Keys that should be rewritten suppressed as unchanged; keys that should be removed not in previous record to remove.

## Decision

Both live on adapter instance. `transformState` moves into closure beside `lastApplied`; shipped writer becomes `createTransformWriter(transformState)`, factory over state it composes into rather than module function reaching for module map. Injected `write` replaces it entirely, as before; declared parameter type unchanged: defaulted parameter + optional one emit same declaration.

`apply` refuses patch whose revision not newer than newest this adapter accepted for that target + that node, before diff rather than after, and records accepted revision whether or not diff turned out empty. Accepted patch writing nothing still newest thing adapter seen; treating it as unseen would let patch before it through.

**The guard is keyed by target and node together, and neither half is optional.** Keyed by node alone it would refuse first write to rebound element: `useDomPatch` re-applies retained patch when React hands it new node; patch carries revision adapter already accepted → fresh element keeps whatever pose it was born with. Keyed by target alone it would refuse legitimate writes: default `resolveTarget` sends every node's patches to stage; revisions monotonic per node, unrelated across nodes; node whose stream numbered lower than neighbour's not stale for it. `clear(target)` drops record with rest of target's state → re-arms rebind.

Issue #356 proposed reading revision off `lastApplied`. Record holds rendered values + no revision; widening it would key freshness question + dirty question on one entry while they need different keys: dirty diff per target, because that is what a write lands on; freshness per target + node. Two maps, two questions.

## Consequences

Adapter now safe to construct per binding, which React hook already does; two on one element are two independent renderers, not one shared pose with two dirty caches. Custom `PatchSource` cannot walk target's diff cache backwards.

`originPinned` not part of this. SVG reference-box pin ADR-073 added idempotent against element's own `style.transformBox`, not module-level `WeakSet` → reads per-target state from target, had nothing to move. Issue #357's description written against draft that did not ship; that half of issue answered as already correct, not quietly dropped.

Evidence is `packages/core/test/integration/dom-adapter-owned-state.test.ts`. Each case asserts accepting direction in same rig as refusing one: guard that refuses everything + writer that composes nothing both green against refusal alone.
