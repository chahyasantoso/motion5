# motion5

motion5 is a renderer-neutral, transactional dataflow animation runtime. It evaluates authored animation projects as one dependency graph and publishes immutable patches for DOM, React, or any other renderer.

> **Status:** Phase 6 is active. Phase 5 membership, generated API enforcement, and packed package consumer verification are shipped. The current work is public documentation reconciliation, followed by required performance budgets and transitional-code deletion.

> **Workflow handoff:** GitHub-MCP implementors should read [RECOVERY.md](RECOVERY.md), [the formatter workflow](docs/FORMAT-WORKFLOW.md), and [the PR workflow](docs/PR-WORKFLOW.md) before making changes. Failed CI and recovery-audit logs are archived on the separate `ci-logs` branch.

> **Lineage:** motion5 is a clean-room successor to [motionpath](https://github.com/chahyasantoso/motionpath), a data-first animation runtime built on GSAP. motionpath is the behavioral oracle for what these animations should do. motion5 is a different answer to how the runtime should own that behavior.

## Why motion5 exists

Timeline engines are good at answering “what is this value at progress 0.42?” They are much less good at answering “what is the value of this thing when it depends on three other animated things, one of which failed, one of which was unmounted, and all of which changed during the same tick?”

motion5 treats those dependencies as a first-class graph. A project is loaded, validated, normalized into qualified node ids, evaluated in canonical topological order, and published as one immutable batch per clock tick. Consumers render the batch. They do not traverse the graph, call `Track.compose()`, or inspect runtime internals.

## What is shipped

- one project-wide graph runtime, publisher, patch registry, and clock subscription;
- transactional graph replacement with rollback;
- immutable, revisioned, batched patch publication;
- input and output observation publication with deterministic ordering;
- explicit attach/detach membership gating;
- cross-motion references, runtime-adopted free tracks, and unmount/remount recovery;
- bounded inline diagnostics using the shared `Diagnostic` shape;
- `@motion5/core` and `@motion5/core/internal` package entrypoints;
- a machine-enforced generated-declaration API report;
- packed ESM and TypeScript consumer verification, including deep-import rejection;
- a mechanical boundary scanner covering core and React consumers;
- target-aware DOM patch application with diffing and key removal.

The authored animation value/compiler pipeline is still being documented against the shipped contracts; the vendored oracle remains read-only behavioral evidence and is not production source.

## Authored schema

The current authored contract is **schema v5**. It includes motions, free tracks, perspective, observation edges with `input` and `output` roles, and diagnostics with `error` and `warning` severity. v4 is not accepted as an alias; use the explicit migration guide before loading a project.

## Toolchain and commands

Node 24, ESM, TypeScript, Vitest, and Prettier.

```bash
npm install
npm run check
npm run format
npm run format:check
npm run typecheck
npm test
```

`package-lock.json` is committed and CI uses `npm ci`. Workspace package manifests are included in the lockfile; regenerate it with `npm install --package-lock-only` whenever package manifests change.

## Documentation map

Read in this order: [Session status](docs/SESSION-STATUS.md), [Phase 6 plan](docs/PHASE6-DETAILED-PLAN.md), [Consolidated audit](docs/PHASE-3-4-CONSOLIDATED-AUDIT.md), [Recovery plan](docs/PHASE-3-4-RECOVERY-PLAN.md), [Implementor brief](docs/IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md), [Formatter and CI handoff](docs/FORMAT-WORKFLOW.md), [PR workflow](docs/PR-WORKFLOW.md), [CI workflow](docs/CI-WORKFLOW.md), [PRD](docs/PRD.md), [TRD](docs/TRD.md), [Architecture](docs/ARCHITECTURE.md), [Authored schema](docs/AUTHORED-SCHEMA.md), [Implementation plan](docs/IMPLEMENTATION-PLAN.md), [Testing strategy](docs/TESTING-STRATEGY.md), and [Decision records](docs/DECISIONS.md).

## Contributing rule of thumb

Write the invariant first. Name the owner. Add a test that fails without the change. Implement the smallest vertical slice. Update code, types, docs, and tests together. Formatting stays separate from behavior.

## License

MIT.
