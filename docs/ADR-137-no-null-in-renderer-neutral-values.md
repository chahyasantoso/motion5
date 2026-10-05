# ADR-137: Renderer-neutral values have one non-null leaf policy

- Status: Accepted
- Date: 2026-10-05
- Owners: core values and plugin labels

## Context

The immutable value type, its freezer, and graph publication each answered whether a leaf could be
`null`. The type and freezer disagreed with the publisher: a composed `null` could reach a patch,
while a typed value could not safely describe it. DOM consumers would serialize it as `"null"` and
3D readers would turn it into zero, so accepting it is not a neutral representation.

## Decision

`isImmutableLeaf` in `packages/core/src/domain/values.ts` is the one owner of renderer-neutral leaf
admission. It accepts strings, booleans, and finite numbers. `ImmutableValue` excludes `null`,
`freezeValue` uses the predicate after preserving its non-finite-number refusal, and the graph
publisher uses the same predicate. Structural rules remain with their owners: plain records,
arrays, cycles, and underscore-prefixed publisher keys are not folded into the leaf predicate.

`ImmutableLeaf` names the leaf type. Labels are `ImmutableLeaf` and `readLabel` calls
`isImmutableLeaf`; both, with `patchRender`, are re-exported from `@motion5/core/plugin-api`, so
plugin consumers reuse the core leaf rule and status policy rather than copying them. A label listener retains its prior value through blocked and error patches, emits a
destroyed edge once when a label was delivered, and refuses synchronous structural writes with `schema-commit-reentrant`.

## Rejected

Accepting `null` everywhere was rejected because it makes the renderer boundary ambiguous and gives
multiple consumers different implicit conversions. A second label-specific status mapping was
rejected because `patchRender` already owns that transition.

## Evidence

N1-N9 are in `packages/core/test/unit/domain/values.test.ts` and
`packages/plugins/test/labels.test.ts`. The public plugin subpath test pins `labels` and the
plugin-api closure test pins the new re-export.
