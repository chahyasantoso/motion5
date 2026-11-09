# ADR-148: Motion is plain code and the engine is optional

**Status:** Accepted, 2026-11-08

## Context

The goal is to let an agent or a person write good motion for a web page quickly, and prove it looks right.
In two benchmarks the repository path cost more tokens and time than a cold agent with no repository, and a
cold agent wrote rope physics in about 40 lines that the owner rated more natural. The page tools were the most
useful part. The motion math sits inside plugins that only the engine can run, so code cannot call it without
loading a project.

## Decision

Motion is a function of time: values in, values out. The layers, each its own package:

- `@motion5/moves`: `Time`, the time module, the move declaration format, every move, `Pose2d` and the path
  outputs.
- `@motion5/rig`: chain setup, FK, IK 2D and 3D, world frames, joint and constraint vocabulary.
- `@motion5/player`: runs a scene, a function from `Time` to poses by target, against a driver.
- `@motion5/dom`, `@motion5/three`, `@motion5/react`, `@motion5/gsap`: renderers and environment adapters.
- `@motion5/tools`: page tools and scene sampling.

`moves` and `rig` form the pure layer: math with no engine, renderer or environment. A package joins it by
declaring `"motion5": { "layer": "pure" }` in its manifest, and a pure package imports only its own files and
other pure packages, so a move reuses the rig instead of repeating it. The boundary scan reads the flag, and the
cycle scan keeps the layer free of loops.

The engine, `@motion5/core` with `@motion5/plugins`, is optional. It reaches moves through plugins generated
from them and keeps its graph, live editing and publishing. Whether a live editor of a loaded project is a goal,
and so whether core grows or retires, is decided after a benchmark of the code path.

## Consequences

Code calls the same functions the engine runs, so a move is tested once and runs in both. Core changes only where
a move's contract reaches it. Until the engine decision, two runtimes exist: the player and the engine. Both read
one time module, and parity tests pin each move across both.

## Rejected

- A new engine API that takes functions directly: it reshapes core before the evidence says core has a future.
- Keeping the math in plugins and adding a facade for code: two ways to reach one function, with the plugin
  contract still in front of it.
- Removing the engine now: live editing and JSON projects have readers in this repository.
