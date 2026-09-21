# packages/core/src/validate-v5.ts

## validateV5

`validateV5` is the public whole-project validator. It first asks `validateSchemaV5` for the
accepted, frozen authored project. Only an accepted schema value reaches `buildGraphIR`, the single
owner of reference resolution, duplicate edges, cycles, solver resolution, and graph diagnostics.

The composer preserves the old diagnostic order and values by appending graph diagnostics after the
schema diagnostics. Any graph error folds the combined collection into the same refused `Outcome`
algebra. A graph-only refusal therefore still reaches callers with its graph diagnostic, and the
engine formats it with the same `describeDiagnostics` path as before.

This module is the use-case composition point rather than contract or graph ownership. The
architecture rule is that dependencies point inward: an outer layer may import an inner one, while
the contract layer must not import graph. The engine consumes this composer and does not build a
second graph-validation path.
