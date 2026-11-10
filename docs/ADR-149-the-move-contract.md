# ADR-149: The move contract

**Status:** Accepted, 2026-11-08

## Context

Each motion plugin hand-writes its param spec with `Spec` from core and reads params back through untyped
helpers such as `numberParam(param, "height", 0)`. The spec, the TypeScript type, the defaults and the catalog
text are separate answers to one question. Of 17 plugins, 12 read other tracks through `requires`, so a move
that took only options and time could not express `trace` or `layer`.

## Decision

A move is one function and one declaration:

```ts
move(options, time, inputs) -> output
```

The declaration names the move, its options and its inputs as plain spec data, with defaults and descriptions.
From it come the options and input types, validation, the catalog listing and the engine's plugin. The format
lives in `@gerak/moves` and imports nothing from core; core's value specs are plain objects of the same shape.

Inputs are plain values. Code passes them; the engine binds them through the track's `requires`. A move never
reads engine state, never keeps state between calls, and never formats CSS or SVG.

`movePlugin(move)` in `@gerak/plugins` is the one place that turns a move into a plugin. Nodes that need setup
from an engine-owned rig keep the full plugin contract with `prepare`.

## Consequences

Hand-written move plugins become `movePlugin(move)`. A parity test pins, for each move, that the plugin and the
function give the same output for the same options, time and inputs. TypeScript rejects a wrong option name at
the call site.

## Rejected

- Core admitting a move as a declaration form: it gives core a dependency and a second place that turns moves
  into nodes while core's future is open.
- Options only, with no inputs: `trace`, `layer` and the path nodes read other tracks.
- Keeping `Spec` from core as the declaration format: it ties dependency-free math to the engine.
