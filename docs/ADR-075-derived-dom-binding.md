# ADR-075: one React binding from several patches to one derived target

Status: accepted. Amends [ADR-073](./ADR-073-react-dom-patch-binding.md) on the SVG transform reference box and on what stays with `usePatch`. Issue [#359](https://github.com/chahyasantoso/motion5/issues/359).

## Context

ADR-073 removed one owner of patch-to-DOM translation and left a second one standing. `useDomPatch` writes one node's pose with no React render, and every consumer that needs more than one patch stayed on `usePatch`, which is `useSyncExternalStore`, which is a real render per published patch. That remainder is not theoretical: `Bone`, `BoneSegment`, `FootWedge`, `HeadSkull` and `TorsoContour` are the load-bearing geometry of both demos and they re-render at tick rate.

ADR-073 also said that teaching a generic renderer what a bone is would be the wrong abstraction, and that is still true. What was missing is not renderer knowledge of geometry. It is a lifecycle: a fan-in that subscribes to several nodes and writes once, with the geometry supplied by the consumer.

Two facts about the write path turned up while reading it, and neither is separable from the first slice that needs it.

`createTransformWriter` routes a key to `style` when the key is a CSS property and to a property assignment otherwise. SVG geometry is neither. `x1`, `y1`, `x2`, `y2` and `points` are readonly IDL attributes, so `target.x1 = 4` throws in a module rather than failing quietly. Nothing publishes those keys today, so the gap has never been reachable; a derived line reaches it on its first frame.

The `transform-box: fill-box` pin ADR-073 added is wrong for the case it was added for. The SVG `transform` attribute pivots at the element's own coordinate origin, while `fill-box` with the default `transform-origin` pivots at the centre of the element's bounding box. Those agree only when the content is symmetric about its origin, which the label beside a joint and the visor beside a skull are not, and `walk/head` publishes `rotation` today.

## Decision

`useDerivedDomPatch(source, nodeIds, derive)`, returning a callback ref. It owns the fan-in and nothing else.

**Geometry stays with the consumer, as a `PatchDerivation`:** a pure positional function from the named nodes' values to the record to write. The hook never interprets a key, so a derivation may write geometry attributes, a pose, or both, and the adapter stays the only thing that knows how a key reaches an element.

**The write path is `DomPatchAdapter.applyValues(nodeId, values)`.** A derivation is not a published node: it has no status to gate, no revision to compare, and no `sourceProgress`, `sourceRevisions` or `diagnostics` a hook has any business inventing. Fabricating a `Patch` to reach `apply` would have made a React hook the author of registry bookkeeping. So `apply` keeps the patch protocol above it, `applyValues` starts below it, and both call one private `writeValues`: one renderable set, one dirty cache, one composer, one omitted-key removal.

**Freshness is the registry's, not the hook's.** The derivation reads `source.get(id)` for every id on every delivery instead of accumulating the patches it was handed, so nothing here keeps a second copy of what a node currently is, and no delivery order can leave a target composed from a mix that outlives its own batch. No scheduler either: a batch that delivers twice writes twice, and the dirty diff makes the second one nothing.

**Liveness belongs to this binding, and that is a deliberate difference from ADR-073.** A derivation is a function of every node it names, so one blocked, errored or destroyed input makes the whole result meaningless and there is nothing sensible to hold. The hook therefore runs the derivation only while every source is ready, which is exactly the rule both demos duplicated in a local `useLivePatch`, now with one owner. A derivation receives values and never a status, which is what keeps that rule out of every consumer.

**Absence is a write, because a bound element cannot unmount itself.** A source that is not ready, or a derivation that returns `undefined`, writes `visibility: hidden`, and the adapter's own omitted-key removal takes it back on the first frame that derives again. Removing the geometry alone was refused: a line with no endpoints collapses onto the origin rather than disappearing.

**Three write channels, decided by the target rather than by a list.** A CSS property is a style write. A key that names no writable property on a target answering `setAttribute` is an attribute. Anything else is a property assignment, which is what keeps every existing fake target in the suite writing where it always did. The order is load-bearing rather than incidental: a key that is both a CSS property and an SVG geometry attribute, such as `cx`, `r` or `d`, stays a style write, where a unitless number is invalid CSS, so a derived position is `x`/`y` and the adapter composes it.

**The SVG pin becomes `transform-box: view-box` with `transform-origin: 0px 0px`.** That restores the attribute's pivot for a target whose ancestors are untransformed, which is every consumer in both demos, and it is a correction to a shipped decision rather than a new capability: the head joint marker now rotates around the joint instead of around the middle of its own label. The boundary is named rather than papered over. Under a transformed ancestor group the reference box is the viewport as that element's user space sees it, so the pivot is not the element's origin; making that exact means writing the `transform` attribute, which cannot express `z`, `rotationX` or `rotationY`, and it is a different decision for a different slice. Translation is origin-independent, so nothing shipped moves for this.

**One hook call per bound element.** `HeadSkull` becomes three bindings over the same two nodes rather than one binding fanning out to three refs. Subscriptions are cheap, a derivation stays a function to one record, and no consumer has to name its elements to a hook.

## Consequences

Every derived-geometry and projection consumer in both demos is imperative. `SkeletonRig` itself no longer subscribes, so the walker's SVG tree renders once and the ground shadow is bound rather than positioned. What is left on `usePatch` is what it is for: the diagnostic panels, and markup that must render absence rather than hide it. `useLivePatch` is deleted from both demos.

One behaviour change is deliberate. The IK goal handle's pending marker is client state, so it stays mounted and draggable while its node is blocked, errored or destroyed, where the whole handle used to unmount with the applied marker.

`useDomPatch` keeps its contract and loses its copy of the lifecycle. Both hooks share `useDomBinding`, which owns the target reference, one adapter per binding, cleanup on rebind, and re-posing a fresh element; the subscription is the half they genuinely differ in, so it is the half each keeps.

`PatchSource` is unchanged and `useDerivedDomPatch` requires nothing more than it. A derivation authors its own keys, so there is no metadata channel to require, and the two-member contract stays what a consumer that only reads values can satisfy.
