# ADR-155: The motion tools package

**Status:** Accepted, 2026-11-08

## Context

The agent's tools, frames, probe, check, onion and timeline, were the most useful part of the agent-motion work,
and the page tools already work on a page with no gerak in it. They live in `scripts/motion-tools` as scripts,
and `motion:sample` reads only engine projects.

## Decision

`@gerak/tools` owns the agent's tools, in three parts: `./page` (frames, probe, check, points) imports only node,
`playwright-core` and `vite`; `./scene` samples and times a code scene with no browser and no engine; `./engine`
samples, times and lists JSON projects. `motion:sample` and `motion:timeline` read a `.ts` module exporting `scene`
and `durationMs` as well as a JSON project, and both kinds draw their timeline through one change detector. The npm
script names stay; they run `packages/tools/bin`.

## Consequences

The boundary scan keeps page tools to node, `playwright-core` and `vite`. `test:frames` stays the browser check for
what only a browser shows. A test holds that the timing beat's code scene and engine project draw one timeline.

## Rejected

- Keeping the tools as repository scripts: another project cannot use them.
- Making page tools read the engine: they work on any page today, and that is their value.
