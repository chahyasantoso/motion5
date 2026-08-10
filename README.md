# motion5

A transactional dataflow animation runtime using authored schema v5.

A loaded project has exactly one authoritative observation graph, one live observation state, one mutation coordinator, one publisher, one patch registry, and one clock subscription.

**Status:** Phase 0. Charter and contracts only. There is no runtime yet.

## What this is

motion5 animates authored JSON projects. Motions own scheduled tracks; `freeTracks` contains shared or externally driven tracks. The runtime resolves dependencies in topological order and publishes immutable patches. Renderers consume patches, never animation internals.

The core is renderer-neutral. GSAP, DOM, React, and browser timing live behind ports and adapters.

## Schema

The authored contract is **schema v5**. v4 is not accepted as an alias. Migrate existing projects with [docs/MIGRATION-V4-TO-V5.md](docs/MIGRATION-V4-TO-V5.md): rename project-level `tracks` to `freeTracks`, qualify free-track references as `~/trackId`, and validate perspective metadata for 3D scenes.

## What this is not

- Not a fork, copy, or cleanup of [`motionpath`](https://github.com/chahyasantoso/motionpath).
- Not a demo gallery.
- Not a compatibility layer.

## Documentation

Start with [PRD](docs/PRD.md), [architecture](docs/ARCHITECTURE.md), [authored schema](docs/AUTHORED-SCHEMA.md), and the [migration guide](docs/MIGRATION-V4-TO-V5.md). Then read the [implementation plan](docs/IMPLEMENTATION-PLAN.md), [CI workflow](docs/CI-WORKFLOW.md), [formatting workflow](docs/FORMATTING.md), [testing strategy](docs/TESTING-STRATEGY.md), [decisions](docs/DECISIONS.md), and [session status](docs/SESSION-STATUS.md).

## Toolchain

Node 24, ESM, TypeScript, Vitest, and Prettier. Run `npm run check`, `npm run format`, `npm run typecheck`, or `npm test`.

## License

MIT.
