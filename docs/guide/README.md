# gerak user guide

This directory is written for someone using gerak. Everything else under `docs/` is written for someone building it.

The guide documents the surface each package declares in its `exports` map and nothing else. If a symbol or subpath is
not listed here, treat it as internal even when a workspace checkout lets you import it through a source path.

## Read in this order

1. [Getting started](./getting-started.md): a scene, a player, a driver and a renderer, on a plain page and in React.
2. [Live editing](./live.md): `motion:live`, hot-swapping scenes in place, the timeline, and dragging numbers in code.
3. [Making motion as an agent](./agent-motion.md): code scenes of moves on a player, and the review loop.
4. [Events](./agent-events.md), [physics](./agent-physics.md), [rigs](./agent-rigs.md),
   [motion principles](./agent-principles.md) and [3D scenes](./agent-3d.md): the parts a brief may need.
5. [Agent reference](./agent-reference.md): every function, type and command a scene uses, each with a short example.

## Status of this guide

[SESSION-STATUS.md](../SESSION-STATUS.md) is the only document allowed to claim what is true today, so check it before
trusting a claim here about what is finished. None of the workspace packages is published.
