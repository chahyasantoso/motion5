# motion5

A transactional dataflow animation runtime.

A loaded project has exactly one authoritative observation graph, one live observation state, one mutation coordinator, one publisher, one patch registry, and one clock subscription. Everything else in this repository exists to keep that sentence true.

**Status:** Phase 0. Charter and contracts only. There is no runtime yet, and that is deliberate.

## What this is

motion5 animates authored JSON projects. A project declares motions, each motion declares tracks, and tracks may observe one another to form a dependency graph (forward kinematics rigs, follow behavior, derived values). The runtime resolves that graph in topological order once per tick and publishes an immutable batch of patches. Renderers consume patches. They never reach into the animation objects.

The core is renderer-neutral. Time, interpolation, scheduling, and rendering all arrive through ports. GSAP, the DOM, React, and browser timing live in adapters and never leak inward.

## What this is not

- Not a fork, copy, or cleanup of [`motionpath`](https://github.com/chahyasantoso/motionpath). No source, tests, fixtures, demos, or commit history are carried over.
- Not a demo gallery. This repository ships a library and its evidence. Example applications live elsewhere.
- Not a compatibility layer. There are no rollout flags, no legacy facades, and no two implementations of the same responsibility.

motionpath remains useful as a behavioral oracle: when a question is "what should this do," its behavior is a reasonable answer. It is never the answer to "how should this be structured."

## Documentation

Start here, in this order:

1. [Product requirements](docs/PRD.md) - what we are building and why, and what done means.
2. [Architecture](docs/ARCHITECTURE.md) - ownership model, invariants, module layout, flush algorithm.
3. [Authored schema](docs/AUTHORED-SCHEMA.md) - the stable `schemaVersion: 4` input contract.
4. [Implementation plan](docs/IMPLEMENTATION-PLAN.md) - phases, pull requests, and exit gates.
5. [Pull request workflow](docs/PR-WORKFLOW.md) - branching, sizing, review, merge rules.
6. [CI workflow](docs/CI-WORKFLOW.md) - the gate matrix and which pull request lands each job.
7. [Formatting](docs/FORMATTING.md) - the manual Prettier workflow, and why it is manual.
8. [Testing strategy](docs/TESTING-STRATEGY.md) - tiers, fake ports, determinism, no borrowed tests.
9. [Decisions](docs/DECISIONS.md) - recorded architectural decisions and their reasons.
10. [Session status](docs/SESSION-STATUS.md) - current state and the next action. Read this first if you are resuming work.

## Toolchain

Node 24, ESM only, TypeScript for public contracts and runtime boundaries, Vitest for tests, Prettier for formatting. No lint-by-vibes rules: every gate measures behavior, API shape, boundaries, packaging, or mechanical formatting.

## Commands

```bash
npm install
npm run check         # format check, typecheck, unit tests
npm run format        # apply Prettier locally
npm run format:check  # verify formatting without writing
npm run typecheck     # tsc --noEmit
npm test              # unit tests
npm run test:watch    # unit tests in watch mode
```

## Repository layout

```text
.github/workflows/    ci.yml (automatic) and format.yml (manual only)
docs/                 charter, architecture, contracts, plans, status
packages/core/        renderer-neutral runtime (Phase 1 onward)
packages/react/       patch and lifecycle hooks (Phase 4 onward)
performance/          deterministic benchmarks and budgets (Phase 3 onward)
scripts/              boundary and API surface checks (Phase 2 onward)
```

Directories appear when the pull request that owns them lands. Empty scaffolding is not created in advance.

## Contributing loop

1. Write or update the invariant and a failing test.
2. Implement the smallest ownership-preserving change.
3. Update types, exports, and docs in the same change.
4. Run `npm run check` locally, not just the nearest test.
5. Review the whitespace-insensitive diff and the public API diff.
6. Merge only when the branch is green and the phase exit gate is met.

Formatting never rides along with behavior. See [docs/FORMATTING.md](docs/FORMATTING.md).

## License

MIT.
