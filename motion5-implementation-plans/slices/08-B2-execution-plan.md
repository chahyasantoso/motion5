# B2 — Compile one immutable ordered entry plan

Status: implemented on branch `feat/plugin-structural-api`. Depends on: B1, A2.

Evidence: `packages/core/src/domain/execution-plan.ts`, `packages/core/test/contract/execution-plan-b2.test.ts`. The plugin structural API follow-up replaced the stateless/factory strategy and operation claims with the `stateless | stateful` strategy below (ADR-142).

## Start here

Read `00-overview.md`, `cache-contract.md`, prerequisite evidence, `packages/core/src/domain/plugins.ts`, `packages/core/src/domain/track.ts`, `packages/core/src/contract/keyframe-compiler.ts` and `packages/core/src/domain/keyframe-groups.ts`. Use admitted B1 types, not a parallel authored schema.

## Outcome and work

Compile each authored instance into one immutable plan containing compiler identity, authored ID/path/order, definition reference, entry schema, requirements, contributions, collect/fold operations, structural hooks and the execution strategy with its lifecycle context. Use that plan for interpolation, inputs, publication, edits, state and diagnostics. Compiler identity is not current index.

Keep collect/fold independent capabilities, not a collect/fold/both mode tag. Resolve outputs before callbacks: every collect record publishes under the reserved `collect` output and appends in entry order, shared fold outputs apply ordered deltas, and admission refuses a fold output named `collect`. Core owns collected id and refuses producer declarations/returns of it. Derive serializer/publication metadata from operation descriptors, not a duplicate top-level outputs list. Shared schemas/serializers must agree.

Normalize exactly one execution strategy per entry: `stateless` (`collect`/`fold.run` on the definition) or `stateful` (`init`/`prepare` with optional `dispose`, whose `collect`/`fold.run` receive the prepared value). The compiled `ExecutionStrategy` is a genuine `stateless | stateful` discriminated union consumed exhaustively (`assertExecutionStrategy`, `unreachable`). Admission refuses `createEvaluator`, `init` without `prepare`, `prepare`/`dispose` without `init`, and non-function `collect`/`fold.run`. This is not a plugin operation-mode tag, and it must not enumerate cache providers or plugin names.

Record the generation/definition/context (`entryEvaluatorContext`) needed to call a stateful plugin's `init` and create its cache tables during candidate preparation, not on the shared definition or by runtime graph discovery. The plan carries the strategy and the services dependency, not live mutable cache contents; B7 implements the fixed shared protocol. Runtime provider override changes re-initialize affected plugin state rather than silently changing an existing state table.

Keep registry name order and graph canonical order independent of authored entry order. Use existing exhaustive binding/edit/result variants where meaningful. No second owner reparses identity, operations or instance selection.

## Evidence and finish

Run compilation/ownership/type tests: repeated same-definition entries have separate compiler identities; reorder preserved; shared collectors/folds legal; a fold output named `collect` refused at admission; optional fold outputs still reserve fields; serializers agree; immutable plan. Test stateless/stateful exhaustiveness, removed/incomplete stateful shapes, service propagation without provider-name branches, and distinct generation context for two entries. Include noncommutative fake folds for B6.

Done when downstream services share one identity/operation/execution plan and B7 needs no speculative interface. Record actual changed paths, API/type decisions and commands/results. Next: B3.
