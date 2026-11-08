# ADR-155: The motion tools package

**Status:** Accepted, 2026-11-08

## Context

The agent's tools, frames, probe, check, onion and timeline, were the most useful part of the agent-motion work,
and the page tools already work on a page with no motion5 in it. They live in `scripts/motion-tools` as scripts,
and `motion:sample` reads only engine projects.

## Decision

`@motion5/tools` owns the agent's tools. Page tools import only `playwright-core` and `vite`. `sample(scene, times)`
runs a code scene with no browser and no engine. `motion:sample` and `motion:timeline` accept a `.ts` scene
module. The npm script names stay.

## Consequences

A test pins the page tools' import closure. `test:frames` stays the browser check for what only a browser shows.

## Rejected

- Keeping the tools as repository scripts: another project cannot use them.
- Making page tools read the engine: they work on any page today, and that is their value.
