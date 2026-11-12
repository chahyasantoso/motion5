# ADR-174: A cast of proxies, a story of named beats, and skins per renderer

**Status:** Accepted, 2026-11-12

## Context

A piece was three files: a scene, a component that built the cast by hand with one `useTarget` per element, and a
page that held the look as CSS. The scene's beats were raw numbers, so no tool could say whether a thing showed before
its beat or what the beats were called. A first design put kinds with looks into the cast (`shape("circle")`, CSS,
markup); that tied the core to the page and would have had to change for a 3D renderer.

## Decision

- A cast member is a proxy. `@gerak/stage` records only what the scene's motion depends on: the member's name, how
  many parts it has, the text it says, and its behaviour (`enters`, `leaves`, `watch`, `still`). Its shape, size,
  colour and layout belong to a renderer's skin.
- Three kinds: `actor` (one value), `many` (one value per item) and `group` (a value its members move within).
  `letters` and `words` are helpers that make `many` of text actors; no renderer knows them.
- Names are keys, unique across the cast; an item of `many` is named by its key and index, `dust.3`. A member without
  `enters` or `leaves` takes its group's.
- A story names the beats: `story(durationMs, { name: [from, to] })` answers one span per beat, the length and the
  order, and is the one source of the piece's duration and its beat names.
- A renderer hands back where each member rests after layout, as a `Rest` record the scene reads through `restOf`;
  a tool with no renderer passes none, and `restOf` answers a zero box, so a scene never throws on a tool's run.
- Skins live in the module, one per renderer (`skins.dom` now, `skins.three` later); core never reads them. A member
  no skin styles is drawn by a default skin of grey boxes and plain text.
- Pieces are stage modules; `usePlayer` and `useTarget` remain for binding a real site's own elements.

## Consequences

- `@gerak/stage` is pure and knows no renderer; the DOM and React stages render it.
- A 3D renderer needs a skin and a renderer, and no change to any piece's cast or scene.
- The examples keep their components; the guide never names them.
