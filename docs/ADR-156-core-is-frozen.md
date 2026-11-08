# ADR-156: Core is frozen

**Status:** Accepted, 2026-11-08

## Context

The goal is to let an agent or a person write good motion for a web page quickly and prove it looks right. Motion is
code on `@motion5/moves`, `@motion5/rig` and `@motion5/player`, and the engine is optional. Three blind benchmarks
ran without the engine. A live editor of a loaded project is what the engine adds, and the owner does not want one
now, though they may reopen the question.

## Decision

`@motion5/core` and `@motion5/plugins` are frozen: they keep working and passing their tests, take bug fixes, and
take no new features. New motion work lands in the pure layer, the renderers, the player and the tools. Core keeps
its DOM-format models, and the GSAP adapters stay in core. Nothing in core is deleted.

## Consequences

The engine path, its guide and `movePlugin` parity tests stay green, so the live editor can be reopened from where
it stands. A pure package never imports core. Reopening the live editor means a new decision that unfreezes core,
then models on patches, a `@motion5/gsap` package and a core reorganized by job.

## Rejected

- Building toward the live editor now: the goal does not need it, and it is the heaviest work left.
- Deleting core and plugins: the owner may reopen the live editor, and frozen code costs nothing to keep.
