# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-09, Asia/Jakarta.
- **Read against:** `chore/retire-core` after the full check gate.

## Now

- **The repository is the code path alone:** `@motion5/core` and `@motion5/plugins` are deleted (ADR-170), with every
  `/engine` entry, `@motion5/three/skeleton`, the apps `ik-playground` and `pose-gap-filler`, `react-demo`'s engine
  demos, the engine modes of the tools, core's benchmarks, Stryker and CI jobs, and the engine guide pages; the branch
  `archive/core-plugins` holds them. A scene is `(time, events) => targets` built from `@motion5/moves` (time, spans,
  lanes, eases, springs, 2D and 3D poses, events and the moves) and `@motion5/rig` (chains, FK and IK in 2D and 3D),
  played by `@motion5/player` on a manual, clock, scroll or event driver, and written by `@motion5/dom`,
  `@motion5/react` and `@motion5/three`. `@motion5/physics` gives a seekable `PhysicsWorld`, built in or on Rapier
  through `@motion5/rapier`. `@motion5/tools` holds the `motion:*` commands: `motion:new` scaffolds a 2D or Three.js
  scene, `motion:sample` and `motion:timeline` read a `.ts` scene with no browser, and `motion:review` checks, reads and
  photographs a page or a scene file in one call. Seven worked examples in `apps/react-demo`, each held by a test,
  and `docs/guide/agent-reference.md` names every export and command, held complete by a test. The repository gate
  tests live in `test/repo/`.

## Next in line

- **Trim what only the engine used:** a move declaration keeps what code scenes and the live editor read, and rig's
  engine-shaped readers go unless the 3D rigs item needs them, in a second pull request after the deletion.

## Open, and not scheduled

- Retargeting remains a proposed design only.
- 3D rigs, a skinned mesh's bones (rebuilt on the code path, reading the archive), 3D physics (Rapier is 2D today) and
  an R3F scaffold for code scenes: wanted, not started.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Who owns what: [ARCHITECTURE.md](./ARCHITECTURE.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md).
- Earlier long-form history remains in Git, not in this status file.
