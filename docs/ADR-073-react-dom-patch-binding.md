# ADR-073: one React binding from a patch to a DOM target

Status: accepted. Supersedes nothing. Issue [#354](https://github.com/chahyasantoso/motion5/issues/354).

## Context

Every React consumer read `patch.values` by hand and re-implemented the same translation: `x` and `y` off the record, into a `translate(...)` string, once per component. Nothing consumed a new `transformPlugin` key until each of those components was edited, so there was no choke point where a published value became visible.

`createDomPatchAdapter` already owns that translation: ready-status gating, plugin output serialization, composite suppression, transform composition, per-target dirty diffing, omitted-key removal, and target cache cleanup. A React renderer would have been the second owner this issue exists to remove.

## Decision

One React lifecycle binding, `useDomPatch(source, nodeId)`, returning a callback ref. React owns subscription and ref lifecycle only; core stays the single owner of translation.

**The metadata channel is part of the binding, not a later slice.** The adapter's renderable set is parameterised by `metadata.outputSerializers`, and `PatchSource` is exactly `{ get, subscribeNode }`, so a hook built on it structurally could not pass metadata: the same implementation would have been instantiated twice, and the React instantiation would have written a serializing plugin's output raw. `ProjectHandle` therefore answers `renderMetadata(nodeId)`, declared as `RenderMetadataSource` beside `PatchSource` rather than inside it, and required by this hook. `usePatch` keeps the two-member contract, because a consumer that only reads values needs nothing more.

The channel is answered by the compiled `Track`, through a new read-only `plugins` getter, rather than by a map beside `tracks`. A cached resolve result would survive a staged rollback that threw its replacement away, and would keep the old serializers after a live recompile. The hook passes a live view of that lookup rather than a snapshot taken at construction, for the same reason.

**The SVG transform mechanism is fixed here, before the keys that need it arrive.** The migrated consumers used the SVG `transform` attribute; the adapter writes CSS `style.transform`. Translation is origin-independent, so nothing shipped changes, but CSS `transform-box` initially resolves against the nearest view box, so a future `rotation` or `scale` would pivot around the SVG viewport where the attribute pivoted around the element. The adapter now pins `transform-box: fill-box` when it composes a transform onto a target that structurally looks like an SVG element, idempotently, and detected by shape rather than by `instanceof` because this adapter types a target by what it can write to. `translate3d` is kept: one composer, one output, one tested contract, and a 3D rendering context on a group is a cost rather than a correctness bug.

**Liveness is decided, not inherited.** `useLivePatch` in both demos states that presence is not liveness and renders only `"ready"`, so a destroyed node disappears. The adapter's contract is different: a non-ready patch is a no-op, so a bound target holds its last applied pose. For a DOM binding that is the behaviour we want, and it is chosen here explicitly: whether a target is on screen is React's business, and a component that must render absence keeps gating on `usePatch`. The adapter does not gain a second liveness rule, and React does not gain a second owner of one.

**The choke point is partial, and scoped honestly.** Every one-patch-to-one-`<g transform>` consumer is migrated: `Joint` and `RootPin` in the IK playground, and `JointMarker` in the walker demo. What stays on `usePatch` is not "everything else": it is derived geometry, which is a function of two nodes (`Bone`, `BoneSegment`, `FootWedge`, `HeadSkull`, `TorsoContour`), projections that map values onto an element's own geometry attributes rather than onto its pose (`ReachCircle`, the applied-goal marker, the ground shadow), and diagnostic readouts (`InspectorPanel`, `SolverPanel`). Teaching a generic renderer those semantics would be a wrong abstraction, not DRY.

## Consequences

A new renderable plugin output reaches every migrated target with no component edit, through the same serializers the vanilla path uses. `ProjectHandle` gains one read; no renderer reaches a Track, a plugin, or the graph through it.

One limitation is named rather than claimed fixed: `DomTarget` keeps its dynamic index signature, because writing renderer-neutral keys is what the adapter does, and a typed DOM class can never satisfy an index signature. The single adaptation therefore lives at the binding seam, in `asDomTarget`, instead of in every consumer's ref. A consumer writes `useDomPatch<SVGGElement>` and casts nothing.

No compatibility alias, renderer fork, field allowlist, scheduler, or rollout flag.
