# B2 — Compile one immutable ordered entry plan

Status: not implemented. Depends on: B1, A2.

## Start here

Read `00-overview.md`, `42-cache-contract.md`, prerequisite evidence, `packages/core/src/domain/plugins.ts`, `packages/core/src/domain/track.ts`, `packages/core/src/contract/keyframe-compiler.ts` and `packages/core/src/domain/keyframe-groups.ts`. Use admitted B1 types, not a parallel authored schema.

## Outcome and work

Compile each authored instance into one immutable plan containing compiler identity, authored ID/path/order, definition reference, entry schema, requirements, contributions, operation claims, structural capabilities and evaluator lifecycle/execution contract. Use that plan for interpolation, inputs, publication, edits, state and diagnostics. Compiler identity is not current index.

Keep collect/fold independent capabilities, not a collect/fold/both mode tag. Resolve claims before callbacks: shared collect appends, shared fold applies ordered deltas, any collect/fold overlap refuses even within one definition or for absent optional outputs. Core owns collected id and refuses producer declarations/returns of it. Derive serializer/publication metadata from operation descriptors, not a duplicate top-level outputs list. Shared schemas/serializers must agree. Dynamic claims must resolve to finite unambiguous candidate ownership.

Separate operation claims from execution strategy. Normalize exactly one strategy per entry: stateless callbacks or a stateful evaluator factory receiving explicit instance context/services. A factory-backed declaration need not carry duplicate run callbacks; mixed or incomplete execution definitions refuse/type-fail. The compiled strategy can use a genuine stateless/factory discriminated union with exhaustive consumers. This is not a plugin operation-mode tag, and it must not enumerate cache providers or plugin names.

Record generation/definition/context needed to create a fresh private evaluator and its cache tables during candidate preparation, not on the shared definition or by runtime graph discovery. The plan carries factory/service dependencies, not live mutable cache contents; B7 implements the fixed shared protocol. Runtime provider override changes rebuild affected evaluators rather than silently changing an existing state table.

Keep registry name order and graph canonical order independent of authored entry order. Use existing exhaustive binding/edit/result variants where meaningful. No second owner reparses identity, claims or instance selection.

## Evidence and finish

Run compilation/ownership/type tests: repeated same-definition entries have separate compiler identities; reorder preserved; shared collectors/folds legal; cross-op conflicts refused before callbacks; optional claims still reserve fields; serializers agree; immutable plan. Test stateless/factory exhaustiveness, duplicate/missing runners, service propagation without provider-name branches, and distinct generation context for two entries. Include noncommutative fake folds for B6.

Done when downstream services share one identity/claim/execution plan and B7 needs no speculative interface. Record actual changed paths, API/type decisions and commands/results. Next: B3.
