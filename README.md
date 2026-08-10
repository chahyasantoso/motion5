# motion5

motion5 is a renderer-neutral, transactional dataflow animation runtime. It evaluates authored animation projects as one dependency graph and publishes immutable patches for DOM, React, or any other renderer.

> **Status:** Phase 0, documentation and toolchain baseline. The runtime is not implemented yet. This README describes the intended product and links to the document that describes current reality.

> **Lineage:** motion5 is a clean-room successor to [motionpath](https://github.com/chahyasantoso/motionpath), a data-first animation runtime built on GSAP. motionpath is the behavioral oracle for what these animations should do. motion5 is a different answer to how the runtime should own that behavior. See [why not just clean up motionpath](docs/ARCHITECTURE.md#15-why-not-just-clean-up-motionpath) and ADR-001 in [DECISIONS.md](docs/DECISIONS.md).

## Why motion5 exists

Timeline engines are good at answering “what is this value at progress 0.42?” They are much less good at answering “what is the value of this thing when it depends on three other animated things, one of which failed, one of which was unmounted, and all of which changed during the same tick?”

motion5 treats those dependencies as a first-class graph. A project is loaded, validated, normalized into qualified node ids, evaluated in canonical topological order, and published as one immutable batch per clock tick. Consumers render the batch. They do not traverse the graph, call `Track.compose()`, or inspect runtime internals.

## Inspiration and what changed

[motionpath](https://github.com/chahyasantoso/motionpath) proved the product: authored projects, motions and tracks, observation between animated values, and a React binding. It also accumulated the cost of every reversed decision along the way, including overlapping observation owners, per-Motion runtime pieces, compatibility APIs, rollout flags, and demos coupled to package layout.

motion5 keeps the intent and rebuilds the ownership model:

- one project-wide graph runtime instead of per-Motion runtime pieces;
- `Motion` as the only composite, with `Track` reduced to a leaf;
- transactional topology mutation with rollback, instead of incremental repair;
- immutable, revisioned, batched publication instead of direct renderer writes;
- an explicit schema v5 contract instead of an ambiguous top-level `tracks` key;
- no compatibility facades, aliases, or capability flags.

The predecessor repository is a behavioral reference only. motion5 intentionally does not copy its source, tests, fixtures, demos, history, or migration seams.

## Core promise

For every loaded project there is exactly one authoritative:

- observation graph;
- live observation state;
- topology mutation coordinator;
- graph publisher;
- patch registry;
- upstream clock subscription.

If a pull request introduces a second owner for one of those responsibilities, it is wrong even if its local tests pass.

## Runtime model

```text
Authored schema v5
        |
        v
  validation + normalization
        |
        v
 ProjectRuntime
        |
        v
   GraphRuntime
   /    |     \\
Binding Publisher PatchRegistry
   |
ObservationState
        |
        v
 immutable patch batches
        |
        +--> DOM adapter
        +--> React hooks
        +--> other renderers
```

`Motion` is the only composite. It owns child membership, scheduling, triggers, playback, stagger, and teardown. `Track` is a leaf. It owns playhead state, interpolation inputs, local plugin composition, and renderer-neutral snapshots. Graph traversal belongs to the graph layer, never to `Track` or `Motion`.

## Authored schema

The current authored contract is **schema v5**. It includes:

- `motions`: scheduled units with triggers and motion-owned tracks;
- `freeTracks`: tracks with no motion or automatic playback, qualified internally as `~/trackId`;
- `perspective`: optional positive CSS-pixel stage metadata for 3D scenes;
- observation edges with `input` and `output` roles;
- diagnostics with `error` and `warning` severity.

v4 is not accepted as an alias. Use the explicit [v4 to v5 migration](docs/MIGRATION-V4-TO-V5.md) before loading a project. The runtime does not silently rename fields or reinterpret ambiguous top-level `tracks`.

## What is deliberately not here

- No demo application or example gallery.
- No compatibility facade for the predecessor runtime.
- No rollout or capability flags.
- No second observation implementation for “legacy” and “new” modes.
- No graph recursion from Track.
- No publisher methods that mutate topology.
- No source-text test pretending to prove a runtime invariant.

## Documentation map

Read in this order:

1. [Session status](docs/SESSION-STATUS.md): what exists today and the next concrete action.
2. [PRD](docs/PRD.md): users, goals, requirements, non-goals, and release criteria.
3. [TRD](docs/TRD.md): normative technical requirements, verification methods, and traceability.
4. [Architecture](docs/ARCHITECTURE.md): ownership, invariants, data flow, failure semantics, and module boundaries.
5. [Authored schema](docs/AUTHORED-SCHEMA.md): the v5 input contract and validation rules.
6. [Migration guide](docs/MIGRATION-V4-TO-V5.md): mechanical and semantic migration steps.
7. [Implementation plan](docs/IMPLEMENTATION-PLAN.md): slice-by-slice pull requests, evidence, and exit gates.
8. [Testing strategy](docs/TESTING-STRATEGY.md): how behavior is proven and what does not count as evidence.
9. [CI workflow](docs/CI-WORKFLOW.md): required gates and when each becomes real.
10. [PR workflow](docs/PR-WORKFLOW.md): branch, review, sizing, merge, and revert rules.
11. [Formatting](docs/FORMATTING.md): local Prettier and the manual formatting workflow.
12. [Decision records](docs/DECISIONS.md): decisions that should not be re-litigated in code review.

## Toolchain and commands

Node 24, ESM, TypeScript for public contracts and runtime boundaries, Vitest, and Prettier.

```bash
npm install
npm run check         # format check, typecheck, and unit tests
npm run format        # apply Prettier locally
npm run format:check  # verify without writing
npm run typecheck     # tsc --noEmit
npm test              # deterministic unit suite
npm run test:watch    # watch mode
```

The lockfile and `npm ci` gate land in P0-02. Until then, CI intentionally uses a temporary install fallback. See [session status](docs/SESSION-STATUS.md), not this README, for what is currently live.

## Contributing rule of thumb

Write the invariant first. Name the owner. Add a test that fails without the change. Implement the smallest vertical slice. Update code, types, exports, and docs together. Keep formatting separate from behavior. If the change cannot explain which single object owns the new state transition, stop before coding.

## License

MIT.
