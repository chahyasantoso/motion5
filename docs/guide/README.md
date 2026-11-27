# gerak user guide

This directory is written for someone using gerak. Everything else under `docs/` is written for someone building it.
Each package carries its own docs, generated from its doc comments and written beside them; this page points into them.

The guide documents the surface each package declares in its `exports` map and nothing else. If a symbol or subpath is
not listed there, treat it as internal even when a workspace checkout lets you import it through a source path.

## Read in this order

1. [Getting started](./getting-started.md): a scene, a player, a driver and a renderer, on a plain page and in React.
2. [Core](../../packages/core/docs/core.md) and [stage](../../packages/stage/docs/stage.md): the two pages to read whole before making motion; the second holds the loop.
3. The docs of the package a brief needs:
   [core](../../packages/core/docs/README.md), [stage](../../packages/stage/docs/README.md),
   [player](../../packages/player/docs/README.md), [dom](../../packages/dom/docs/README.md),
   [react](../../packages/react/docs/README.md), [three](../../packages/three/docs/README.md),
   [rig](../../packages/rig/docs/README.md), [rig-three](../../packages/rig-three/docs/README.md),
   [physics](../../packages/physics/docs/README.md), [rapier](../../packages/rapier/docs/README.md),
   [moves](../../packages/moves/docs/README.md) and [tools](../../packages/tools/docs/README.md).

## Status of this guide

[SESSION-STATUS.md](../SESSION-STATUS.md) is the only document allowed to claim what is true today, so check it before
trusting a claim here about what is finished. None of the workspace packages is published.
