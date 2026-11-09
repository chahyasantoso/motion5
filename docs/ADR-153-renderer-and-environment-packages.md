# ADR-153: Renderer and environment packages

**Status:** Accepted, 2026-11-08

## Context

ADR-015 says core stays renderer-neutral, yet `packages/core/src/adapters/` holds the DOM adapter, the browser
clock, the GSAP interpolator and the GSAP scroll source. Plain HTML has no renderer package of its own; React
reaches the DOM through `@motion5/core/adapters`.

## Decision

- `@motion5/dom` owns `applyPose`, `applyReveal`, `applyDrawn`, `applyPath` and the CSS and SVG formats for HTML
  and SVG; `@motion5/dom/engine` holds the engine's DOM patch adapter and the browser clock.
- `@motion5/three` owns `applyPose2d(object, pose)`.
- `@motion5/react` depends on `@motion5/dom`.

Core keeps no DOM code, and drops its `./adapters/browser-clock` subpath. `./adapters` keeps the microtask
scheduler, the scroll trigger port, the trigger factory and the GSAP adapters: none touches an environment, and
core never imports GSAP, which callers inject. A `@motion5/gsap` package waits for the engine decision, since
moving the GSAP interpolator needs core's keyframe compiler public.

## Consequences

Each renderer is a package like any other, and plain HTML needs no React. The boundary scan refuses an
environment import from core.

## Rejected

- Keeping adapters in core under a subpath: core then ships environment code to every reader.
- One `@motion5/web` package for DOM and GSAP: GSAP is optional and most pages do not need it.
- A `@motion5/gsap` package now: it would make core's keyframe compiler public for an adapter that touches no
  environment.
