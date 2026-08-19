# ADR-042: Internal keys are enforced once, before publication

**Status:** Accepted, 2026-08-19

## Context

`internalKeys` was a plugin-declared denylist with exactly one enforcement point,
`adapters/dom.ts`, and zero coverage: no shipped plugin declared it. A plugin that computed a
private derived value that was neither authored nor underscore-prefixed leaked it to the DOM with
no error anywhere. Issue #166 diagnosed that correctly.

The issue then proposed treating a namespace prefix as internal _in the renderer_, mirroring the
underscore convention. Two things about that are wrong.

First, `adapters/dom.ts` is not the only renderer. `packages/react/src/patch-store.ts` memoizes and
returns the whole `Patch`, values included, and `usePatch` hands it to the consumer untouched. That
is the path the demo renders through. A denylist at the renderer means every renderer reimplements
it, and one of the two shipped renderers never did, so a regression test written against
`createDomPatchAdapter` would pass while React kept leaking.

Second, the underscore is not a renderer denylist to mirror. It is stripped from interpolator state
before the plugin chain in `domain/track.ts`, and _rejected_ after the chain by `isRendererNeutral`,
which publishes `composition-output-shape` and status `error`. The `dom.ts` underscore branch is
unreachable on the publisher path. Those are two rules at two boundaries, not one convention.

## Decision

Internal keys are removed once, in `Track.compose`, after the plugin `compose` chain and before the
snapshot is frozen.

1. **After the chain, not before it.** Plugins can still read each other's namespaced keys while
   composing, which is the only reason a plugin would derive one.
2. **The namespace is the marker.** Any key containing `:` is private by rule, so a plugin
   computing `fk:phase` needs no declaration for it to stay hidden. ADR-041 makes that sound by
   rejecting the colon in every authored keyframe name and in plugin `keys`, `inputs`, and
   `outputs`, so a namespaced key can only be something a plugin derived for itself.
3. **`internalKeys` survives, for unprefixed derived keys only.** Deleting it would leave nothing
   at all hiding a private key that carries no marker, and the honest place to notice that is here
   rather than in a test rewritten to assert the leak. It is the declaration of last resort; the
   rule is the mechanism.
4. **`dom.ts` stops reading `internalKeys`.** The values it receives are already filtered. It keeps
   `offset` and `_`, which are renderer and tween-engine concerns.
5. **`isRendererNeutral` and `validateComposition` are unchanged.** Namespaced keys never reach
   them, so no validator learns a second notion of internal, and the underscore rejection keeps
   working exactly as before.

## Alternatives rejected

**Skipping namespaced keys in `dom.ts`,** as issue #166 recommended, enforces "internal" per
renderer and leaves React leaking.

**Teaching `isRendererNeutral` about namespaced keys,** which was acceptance criterion 2 of the
issue, is inverted: it treats `_` by _rejecting_ it, so recognizing namespaced keys the same way
would make it impossible for any plugin to derive one. A namespaced key passing validation is the
precondition for the feature, not a hole in it.

**One predicate for `_` and `:`,** also proposed by the issue, would strip a plugin-invented
underscore key before the publisher could reject it, converting an existing loud
`composition-output-shape` error into a silent hide. Pinned by case `H-3`, which passes on its
parent by design.

**Deleting `internalKeys` entirely.** It is unused by any shipped plugin today, but the
unprefixed-private-key case is real, and nothing else covers it.

## Consequences

One owner decides what is publishable, and `handle.get`, `subscribeNode`, the batch, the DOM
adapter, and React all agree by construction. Projected observation inputs are covered for free,
because they are merged into `Track.compose`'s values ahead of the chain and pass through the same
filter.

A plugin can no longer publish a key containing a colon at all. That is the point, and it is why
ADR-041 reserves the separator rather than leaving it to convention.
