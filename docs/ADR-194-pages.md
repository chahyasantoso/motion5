# ADR-194: Pages

**Status:** Accepted, 2026-11-20

## Context

Scenes ran on a timed or live clock with discrete pointer events (`enter`, `leave`, `click`) and rendered inside a shadow-DOM frame scaled by `mountStage` (`@gerak/dom`). Animating a real landing page section by section on scroll and pointer while keeping one seekable, testable scene contract needed scroll and pointer as pure folded inputs, a mount over existing DOM nodes with no frame or shadow root, measured line breaks, and section and slot measurements from the page's own CSS.

## Decision

1. **One clock; scroll and pointer are inputs.** Scroll position and pointer position arrive as sample events with a value (`"scroll"` in px, `"pointer-x"` and `"pointer-y"` normalized 0 to 1), so a recording replays and scrubs. Core adds `scroll` (`scroll.y`) and `pointer` (`pointer.x`, `pointer.y`) built on `state`, and `Motion.in` accepts a `MotionWindow`. Stage adds `scrollPoint(px)` (`.plus`, `.minus`, `.reached`), scroll beats `beat(name, { scroll: [from, to] })` (refusing ms at type level), and trigger beats `beat(name, ms, { when: point.reached, back })` with required `back: "reverse" | "stay" | "replay"`. Smooth scroll is `springTo(scroll.y, (y) => y)`. Headless tools read scripted `cues` or `--action scroll:px@ms`.
2. **A page mount in `@gerak/dom`.** `mountPage(scene, { root? })` animates existing page nodes with no frame, no shadow DOM, no created element and no skin. `el(selector)` binds an element to an existing node (`{ node: el(selector) }`), and `compileScene` refuses any element of a page scene without one. Poses write through the shared pose-to-CSS writer, and rests remeasure on resize. `mountStage` is unchanged.
3. **Lines are measured, not counted.** `text(..., { split: "words" })` keeps a fixed part count; in a page mount each word's context gains `line` measured from layout (0 headless), updated on resize without changing part count. `stagger` gains `by: "index" | "line"` (default `"index"`).
4. **Sections and slots are measured from CSS.** The page's CSS owns pinning (`position: sticky` inside a tall wrapper) and fixed layers (`position: fixed`). `section(name, el(selector))` reads measured `.top` and `.end` edges as scroll points. A slot is an element bound to an empty CSS-placed node with no motion; `travel({ to: slot, arc? })` moves an element to the slot's measured box over its beat. An element belongs to one scene, enforced by the builder.

## Consequences

- Scroll, pointer and clock motion share one pure `(time, events)` model and replay identically across browsers and headless tools.
- Sites keep full ownership of layout, styling and responsive breakpoints while motion reads measured boxes, lines, section edges and slots.
