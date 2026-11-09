# ADR-137: Renderer-neutral values have one non-null leaf policy

**Status:** Accepted for the prepared implementation, 2026-10-05; not a merge or CI claim.

## Context

Immutable value type, its freezer, graph publication each answered whether a leaf could be `null`. Type and freezer disagreed with publisher: composed `null` could reach a patch, while typed value could not safely describe it. DOM consumers serialize it as `"null"`, 3D readers turn it into zero → accepting it not neutral representation.

## Decision

`isImmutableLeaf` in `packages/core/src/domain/values.ts` one owner of renderer-neutral leaf admission. Accepts strings, booleans, finite numbers. `ImmutableValue` excludes `null`; `freezeValue` uses predicate after preserving its non-finite-number refusal; graph publisher uses same predicate. Structural rules stay with owners: plain records, arrays, cycles, underscore-prefixed publisher keys not folded into leaf predicate.

Invariant: one leaf rule (`isImmutableLeaf`) decides which leaves allowed; structural rules stay with owners. Authored `null` already refused by validator (`keyframes-ungrouped-key` at top level, leaf path inside `values`) → only composed output changes. Fixtures composing `null` for "absent" now omit key.

`ImmutableLeaf` names leaf type. Labels are `ImmutableLeaf`; `readLabel` calls `isImmutableLeaf`; both, with `patchRender`, re-exported from `@motion5/core/plugin-api` → plugin-package consumers reuse core leaf rule and ADR-094 status policy rather than copying them. Label read is closed union (`label`, `retained`, `gone`) read by exhaustive switches. Listener retains prior value through blocked and error patches, emits one destroyed edge only when label delivered; synchronous write from listener refused with `schema-commit-reentrant`.

## Rejected

Accepting `null` everywhere rejected: makes renderer boundary ambiguous, gives multiple consumers different implicit conversions. Second label-specific status mapping rejected: `patchRender` already owns that transition.

## Evidence

N1 to N10 in `packages/core/test/unit/domain/values.test.ts` and `packages/plugins/test/labels.test.ts`. Public plugin subpath test pins `labels`; plugin-api closure test pins new re-export.
