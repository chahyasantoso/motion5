# ADR-075: one React binding from several patches to one derived target

Status: accepted. Amends [ADR-073](./ADR-073-react-dom-patch-binding.md) on the SVG transform reference box and on what stays with `usePatch`. Issue [#359](https://github.com/chahyasantoso/motion5/issues/359).

## Context

ADR-073 removed one owner of patch-to-DOM translation, left second one standing. `useDomPatch` writes one node's pose with no React render; every consumer needing more than one patch stayed on `usePatch` — `useSyncExternalStore` → real render per published patch. Remainder not theoretical: `Bone`, `BoneSegment`, `FootWedge`, `HeadSkull` and `TorsoContour` are load-bearing geometry of both demos, re-render at tick rate.

ADR-073 also said teaching generic renderer what a bone is would be wrong abstraction — still true. Missing: not renderer knowledge of geometry, but lifecycle — fan-in subscribing to several nodes, writing once, geometry supplied by consumer.

Two facts about write path turned up while reading it; neither separable from first slice that needs it.

`createTransformWriter` routes key to `style` when key is CSS property, to property assignment otherwise. SVG geometry neither. `x1`, `y1`, `x2`, `y2` and `points` readonly IDL attributes → `target.x1 = 4` throws in module, not fails quietly. Nothing publishes those keys today → gap never reachable; derived line reaches it on first frame.

`transform-box: fill-box` pin ADR-073 added wrong for case it was added for. SVG `transform` attribute pivots at element's own coordinate origin; `fill-box` with default `transform-origin` pivots at centre of element's bounding box. Agree only when content symmetric about its origin — label beside joint and visor beside skull are not; `walk/head` publishes `rotation` today.

## Decision

`useDerivedDomPatch(source, nodeIds, derive)`, returning callback ref. Owns fan-in, nothing else.

**Geometry stays with the consumer, as a `PatchDerivation`:** pure positional function from named nodes' values to record to write. Hook never interprets key → derivation may write geometry attributes, pose, or both; adapter stays only thing that knows how key reaches element.

**The write path is `DomPatchAdapter.applyValues(nodeId, values)`.** Derivation is not published node: no status to gate, no revision to compare, no `sourceProgress`, `sourceRevisions` or `diagnostics` a hook has any business inventing. Fabricating `Patch` to reach `apply` would make React hook author of registry bookkeeping. So `apply` keeps patch protocol above it, `applyValues` starts below it, both call one private `writeValues`: one renderable set, one dirty cache, one composer, one omitted-key removal.

**Freshness is the registry's, not the hook's.** Derivation reads `source.get(id)` for every id on every delivery, not accumulating patches it was handed → nothing here keeps second copy of what node currently is; no delivery order leaves target composed from mix that outlives its own batch. No scheduler either: batch delivering twice writes twice; dirty diff makes second one nothing.

**Liveness belongs to this binding, and that is a deliberate difference from ADR-073.** Derivation is function of every node it names → one blocked, errored or destroyed input makes whole result meaningless, nothing sensible to hold. Hook runs derivation only while every source ready — exactly rule both demos duplicated in local `useLivePatch`, now one owner. Derivation receives values, never status → rule stays out of every consumer.

**Absence is a write, because a bound element cannot unmount itself.** Source not ready, or derivation returning `undefined`, writes `visibility: hidden`; adapter's own omitted-key removal takes it back on first frame that derives again. Removing geometry alone refused: line with no endpoints collapses onto origin, not disappear.

**Three write channels, decided by the target rather than by a list.** CSS property → style write. Key naming no writable property on target answering `setAttribute` → attribute. Anything else → property assignment, which keeps every existing fake target in suite writing where it always did. Order load-bearing, not incidental: key that is both CSS property and SVG geometry attribute, such as `cx`, `r` or `d`, stays style write, where unitless number invalid CSS → derived position is `x`/`y`, adapter composes it.

**The SVG pin becomes `transform-box: view-box` with `transform-origin: 0px 0px`.** Restores attribute's pivot for target with untransformed ancestors — every consumer in both demos; correction to shipped decision, not new capability: head joint marker now rotates around joint, not middle of its own label. Boundary named, not papered over. Under transformed ancestor group reference box is viewport as that element's user space sees it → pivot is not element's origin; making that exact means writing `transform` attribute, which cannot express `z`, `rotationX` or `rotationY` — different decision for different slice. Translation origin-independent → nothing shipped moves.

**One hook call per bound element.** `HeadSkull` becomes three bindings over same two nodes, not one binding fanning out to three refs. Subscriptions cheap, derivation stays function to one record, no consumer names its elements to hook.

## Consequences

Every derived-geometry and projection consumer in both demos imperative. `SkeletonRig` no longer subscribes → walker's SVG tree renders once, ground shadow bound, not positioned. Left on `usePatch`: what it is for — diagnostic panels, markup that must render absence, not hide it. `useLivePatch` deleted from both demos.

One deliberate behaviour change. IK goal handle's pending marker is client state → stays mounted and draggable while its node blocked, errored or destroyed; whole handle used to unmount with applied marker.

`useDomPatch` keeps contract, loses its copy of lifecycle. Both hooks share `useDomBinding`, owning target reference, one adapter per binding, cleanup on rebind, re-posing fresh element; subscription is half they genuinely differ in → half each keeps.

`PatchSource` unchanged; `useDerivedDomPatch` requires nothing more. Derivation authors own keys → no metadata channel to require; two-member contract stays what consumer that only reads values can satisfy.
