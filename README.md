# motion5

motion5 is a renderer-neutral, transactional dataflow animation runtime. It evaluates authored animation projects as one dependency graph and publishes immutable patches for DOM, React, or any other renderer.

> **Using it?** Start with [the user guide](docs/guide/README.md). Everything else in `docs/` is written for implementors.

> **Status:** [SESSION-STATUS.md](docs/SESSION-STATUS.md) is the only document allowed to claim what has landed; check it before trusting anything here. On `feat/adopt-motion-track` the runtime mutation model (W1-W5), the trigger drivers (T0-T5), and compiled Track ownership have all landed, along with edge identity, trigger progress range ownership, failed-build disposal, rollback error precedence, and single-track mutation atomicity. Phase 5 membership work and Phase 6 packaging work remain.

> **Contributing?** Read [the PR workflow](docs/PR-WORKFLOW.md), [the CI workflow](docs/CI-WORKFLOW.md), and [formatting](docs/FORMATTING.md) first. Failed CI and recovery-audit runs are archived on the separate `ci-logs` branch under `logs/<run-id>/`.

> **Lineage:** motion5 is a clean-room successor to [motionpath](https://github.com/chahyasantoso/motionpath), a data-first animation runtime built on GSAP. motionpath is the behavioral oracle for what these animations should do. motion5 is a different answer to how the runtime should own that behavior.

## Why motion5 exists

Timeline engines are good at answering "what is this value at progress 0.42?" They are much less good at answering "what is the value of this thing when it depends on three other animated things, one of which failed, one of which was unmounted, and all of which changed during the same tick?"

motion5 treats those dependencies as a first-class graph. A project is loaded, validated, normalized into qualified node ids, evaluated in canonical topological order, and published as one immutable batch per clock tick. Consumers render the batch. They do not traverse the graph, call `Track.compose()`, or inspect runtime internals.

## What is shipped

- one project-wide graph runtime, publisher, patch registry, and clock subscription;
- transactional graph replacement with rollback, and rollback failures attached to the rejection that caused them rather than replacing it;
- immutable, revisioned, batched patch publication, with a terminal `destroyed` patch on eviction;
- input and output observation publication with deterministic ordering, over a prefix-free edge identity;
- explicit attach/detach membership gating;
- authored keyframe compilation and plugin resolution from authored keys, with `Engine` as the single owner of compiled Tracks;
- real trigger drivers for `time`, `scroll`, and `manual`, with no fallback and one validator for trigger progress;
- runtime motion and track mutation through capability handles, resolved and seeded before commit;
- target-aware DOM patch application with diffing and key removal, plus a React `usePatch` hook;
- declared package entrypoints, a mechanical boundary scanner, and a declaration-closure scan over the public surface.

## What remains

- loop semantics: `repeat`, `yoyo`, and ping-pong are rejected at validation until a plan exists;
- Phase 5 cross-motion membership and adoption;
- Phase 6 packaging: an API report, a packed-package consumer check, a required performance budget, and deletion of the transitional owner-based adoption wrappers;
- publishing. Both packages are `private` at `0.0.0`, so consumers build from the workspace today.

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

Users read [the guide](docs/guide/README.md). Implementors read, in this order: [Session status](docs/SESSION-STATUS.md), [PRD](docs/PRD.md), [TRD](docs/TRD.md), [Architecture](docs/ARCHITECTURE.md), [Authored schema](docs/AUTHORED-SCHEMA.md), [Implementation plan](docs/IMPLEMENTATION-PLAN.md), [Phase 5 detailed plan](docs/PHASE5-DETAILED-PLAN.md), [Testing strategy](docs/TESTING-STRATEGY.md), [PR workflow](docs/PR-WORKFLOW.md), [CI workflow](docs/CI-WORKFLOW.md), [Formatting](docs/FORMATTING.md), and [Decision records](docs/DECISIONS.md).

## Contributing rule of thumb

Write the invariant first. Name the owner. Add a test that fails without the change. Implement the smallest vertical slice. Update code, types, docs, and tests together. Formatting stays separate from behavior.

## License

MIT.
