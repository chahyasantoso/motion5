# ADR-205: The Studio canvas as its own package

**Date:** 2026-11-25
**Status:** Accepted, 2026-11-25

## Context

A person directing agent-written motion wants to see a piece as connected cards (sources, timing, cast, moves,
outputs) and steer it without reading the files. The agent keeps writing those files: `<name>.html` for the look and
the cast, `<name>.ts` for the motion, and the CLI for render and check. `gerak live` plays one scene but runs no
`<name>-main.ts`, and `compileScene` keeps no record of which shot or scene a member or beat came from. Making a piece
has to stay simple and cheap in tokens, so nothing the Studio needs may grow the pages an agent reads to make a piece.

## Decision

1. **Own package.** `@gerak/studio` (`packages/studio`, group `modules`) holds the graph, the sources reader, the
   canvas and its patches. Nothing in `core` depends on it, and `core.md`, `stage.md` and the authoring reference
   pages do not mention it. The tools package's `gerak` binary forwards any command `<name>` it does not own to an
   installed `@gerak/<name>` package's `bin/<name>.mjs`. Without one, it says which package is missing. The Studio
   replaces `gerak live`.
2. **The code is the source.** One pure `graphOf(piece, sources): StudioGraph` builds the cards and wires that the
   canvas, `gerak studio graph` and tests read. Card ids come from code identity. A canvas sidecar holds layout only.
3. **Provenance is a data subpath.** `provenanceOf(scene): ScenePlan` on `@gerak/stage/provenance` reads a scene as
   written. It gives the scene's name, each member's shot or innermost named scene, its binding steps as a closed
   `StepSummary` union, and each beat's scene, with shot beats under compiled names. `Member`, `Stage`,
   `compileScene` and `frame` are unchanged.
4. **Sources are read statically.** `readSources(sceneFile)` uses the TypeScript compiler and an HTML scan, without
   running the code. It reads cue JSON imports and what they feed, the audio or captions that made them, media
   sources of cast elements, and loose files under `audio/` and `media/`. It sorts each `.moves(...)` argument into
   a package `motion` or hand-written `code` with its file and line. What it cannot place is a card marked
   "set in code".
5. **Edits are code patches** from one closed set, which write the code an agent would write. Render settings live
   in `<name>.render.json` beside the page, which both `gerak render` and the canvas read. The look stays in the
   page's CSS.

## Rejected alternatives

- **Provenance on `Member` and `Stage`:** it adds fields and types to the contract every renderer reads and to the
  reference pages agents read when making a piece. The subpath gives the Studio the same data at no cost to authors.
- **The canvas inside `@gerak/tools`:** every project that runs `gerak init` would install React Flow and the
  canvas.
- **Render settings in the canvas sidecar:** a canvas render and a terminal render could differ.
- **A canvas-owned piece format for building:** it would be a second source beside the code that agents edit.

## Consequences

- `gerak studio graph <piece> [--json]` prints the graph of `reel`, `explainer`, `cookie` and `launch-day` without
  a browser.
- `scripts/installable-packages.mjs` installs `studio` after `tools`, and the pack check runs `gerak studio graph` in
  an installed project. It also checks that a core-only install names the missing package.
- A move assembled by a spread (`...badge(0, -700)`) has no static place. Its card says "set in code" until the code
  names its moves.
