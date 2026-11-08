# ADR-153: Renderer and environment packages

**Status:** Accepted, 2026-11-08

**Supersedes in part:** [ADR-015](./ADR-015-gsap-remains-the-v1-interpolator.md). GSAP stays an interpolator
behind the port, in its own package instead of core.

## Context

ADR-015 says core stays renderer-neutral, yet `packages/core/src/adapters/` holds the DOM adapter, the browser
clock, the GSAP interpolator and the GSAP scroll source. Plain HTML has no renderer package of its own; React
reaches the DOM through `@motion5/core/adapters`.

## Decision

- `@motion5/dom` owns `applyPose` for HTML and SVG, path formatting, the DOM adapter, the browser clock and the
  scroll driver.
- `@motion5/three` owns `applyPose2d(object, pose)`.
- `@motion5/gsap` owns the GSAP interpolator and scroll source.
- `@motion5/react` depends on `@motion5/dom`.

Core keeps no renderer or environment code; its microtask scheduler stays, since its host is injected. Core drops
the `./adapters` and `./adapters/browser-clock` subpaths, and every reader moves in the same change.

## Consequences

Each renderer is a package like any other, and plain HTML needs no React. The boundary scan refuses an
environment import from core.

## Rejected

- Keeping adapters in core under a subpath: core then ships environment code to every reader.
- One `@motion5/web` package for DOM and GSAP: GSAP is optional and most pages do not need it.
