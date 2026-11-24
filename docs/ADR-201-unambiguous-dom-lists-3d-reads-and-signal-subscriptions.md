# ADR-201: Unambiguous DOM lists, generated cast types, and selector scroll actions

**Date:** 2026-11-24
**Status:** Accepted, 2026-11-24

## Context

Three pieces of authoring and verification boilerplate kept recurring across multi-section 2D and
3D pieces:

1. `bindList` in `@gerak/dom` switched on match count: multiple `[data-cast="<name>"]` nodes bound
   directly as parts `0..count-1`, whereas a single `[data-cast="<name>"]` node with child elements
   descended into `first.children` — even for `box(name, { parts: true })` and explicit
   `options.nodes[name]` arrays. Pieces with a 1-item list whose card contained `<h3>`/`<p>`
   children collided with child-element binding and fell back to numbered casts (`card0..card3`).
2. Multi-file pieces (`apps/pieces/cookie/`) hand-maintained a `CAST` string dictionary in
   `src/contract.ts` to keep HTML `[data-cast]` names, Three.js object names, and scene element
   names aligned, duplicating information `gerak measure` already collects.
3. `parseActions` accepted only pixel offsets for `scroll:<px>@ms`, so multi-viewport checks under
   `--sizes 1440x900,390x844` could not land on the same section across desktop and mobile without
   hard-coding viewport-specific pixel coordinates, and refreshing `<name>.measure.json` required a
   separate manual `gerak measure` command before `gerak review <scene.ts>` or `gerak sample`.

## Decision

1. **Unambiguous DOM list binding (`@gerak/dom`).**
   - `box(name, { parts: true })` and explicit `options.nodes[name]` arrays always bind the matched
     or supplied elements directly (`1..N`), never descending into a single node's `.children`.
   - `text(name, { split: "words" | "letters" })` alone binds single-container child elements (or
     wraps `textContent` in `<span>` nodes on mount and restores the original text on `dispose()`).

2. **Generated `<name>.cast.d.ts` and typed element makers (`@gerak/tools`, `@gerak/stage`).**
   - `gerak measure <brief>/<name>.html` writes `<brief>/<name>.cast.d.ts` alongside
     `<name>.measure.json`, emitting type-only `export type CastName = ...` as the sorted union of
     HTML `[data-cast]` names and base 3D `objects`/`counts` names (zero runtime JS).
   - `box<N extends string = string>(name: N, ...)`, `text<N extends string = string>(...)`,
     `shape<N extends string = string>(...)`, and `object<N extends string = string>(...)` accept an
     optional type parameter so multi-file pieces check cast names against `<name>.cast.d.ts` without
     a hand-maintained `CAST` dictionary, while single-file pieces omit the type parameter.

3. **Selector-based scroll actions and `--measure` refresh (`@gerak/tools`).**
   - `PageAction`'s `"scroll"` variant widens to `target: ScrollActionTarget` (`{ kind: "px", px }`
     | `{ kind: "selector", selector, offsetPx }`), inspected via an exhaustive `switch`.
     `scroll:<selector>[±px]@ms` resolves `element.getBoundingClientRect().top + scrollY + offsetPx`
     inside the active viewport at action time, failing fast when the selector matches nothing.
   - `gerak review <scene.ts> --measure` and `gerak sample <scene.ts> --measure` refresh a missing
     or stale `<name>.measure.json` and `<name>.cast.d.ts` before loading the scene, keeping default
     headless runs browser-free.

## Consequences

- `box(..., { parts: true })` behaves consistently from `1` to `N` elements regardless of inner DOM
  markup, eliminating indexed cast proliferation such as `flavorTitle0..3`.
- Multi-file pieces get compile-time cast name checking from `gerak measure` output with no
  runtime cast registry.
- Multi-viewport `--sizes` page checks and FPS runs target page sections uniformly via CSS
  selectors.

## Amends

- [ADR-198](./ADR-198-authored-cast.md): Decision 2 is refined so `box(..., { parts: true })` and
  explicit `options.nodes` arrays bind matched nodes directly without child descent, and Decision 4
  is refined with `<page>.cast.d.ts` emission and `--measure` refresh on headless CLI commands.
