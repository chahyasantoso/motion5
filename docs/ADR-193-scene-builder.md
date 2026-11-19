# ADR-193: Scene builder

**Status:** Accepted, 2026-11-20

## Context

A piece was one `defineStage({ beats, cast, scene, skins, ... })` object: beats as named `[from, to]` pairs, a cast
builder callback whose members carried modifier chains (`.on`, `.watch`, `.static`, `.ambient`, `.pivot`), and one
scene function posing every member by name each frame. Everything an element did was spread over three places, names
were strings checked only while the cast's keys stayed literal, and the skin, which only the DOM renderer reads, sat
inside the motion.

## Decision

1. **A piece is a `sceneBuilder` chain.** Elements (`box`, `shape`, `text`, `many`, `group`) and beats (`beat`) are
   values made once with a unique name. `.element(e)` selects an element; `.motion(...)` appends motions to its list,
   `.modify(principle)` wraps everything above it, `.show(beat | [from, to])` sets when it exists, and `.limits(...)`
   sets its review limits. An element may be selected again later.
2. **A motion is a core `Motion`:** a function of time with `.in(beat, ease?)`, `.loop(ms)`, `.take()` and
   `.ambient()`. Every move returns one. Motions on an element join by each field's rule; a take replaces its fields
   from its beat's start. Timing names beats only.
3. **Helpers in stage:** `bind` and `bindEach` set fields from signals, `stagger` plays a motion per part in lanes,
   `stayWith` adds another element's travel, `carry` moves an element across layouts. Core adds `shared`, so a signal
   several elements read runs once a frame.
4. **Inferred, never written:** an element with no motion is static, one with a loop or ambient motion is ambient,
   every other settles; draw order is the order of first `.element` calls; beats are the ones motions and windows use.
5. **The skin is the renderer's.** A piece file exports `skin` beside its default scene. `compileScene(scene, { skin })`
   gives the `Stage` the renderers play; `mountStage` and `<Stage>` take a scene and a `skin` option. Headless tools
   never read it.
6. **`defineStage`, `StageDefinition`, the cast builder and their types leave the public surface.** The definition
   stays inside `@gerak/stage` as the compiler's input; its own tests and the renderer and review tests build compiled
   stages through it, for the mistakes the builder cannot write.
7. **The pages read whole explain; the reference lists.** `core.md` and `stage.md` say how their package works, tersely,
   including what agents had to guess, and link each reference page with one line on when to read it. They name no
   export list and hold no size cap; a test holds that they link every reference page.

## Consequences

- Every piece under `apps/pieces` is a builder piece and samples the same values as before; an element that had an
  empty pose and no motion no longer writes one.
- `gerak new` and `gerak import-svg` write builder pieces with a `skin` export, and `--into` appends `.element(...)` calls
  and skin rules.
- How the DOM draws moved to `@gerak/dom`'s docs.
- Supersedes in part [ADR-192](./ADR-192-principles-and-plain-moves.md) (the size ceiling on the pages read whole).
- Supersedes in part [ADR-174](./ADR-174-a-cast-of-proxies-and-a-story.md) and
  [ADR-175](./ADR-175-paths-presence-by-beats-and-events-on-a-clock.md) (how a piece is written),
  [ADR-178](./ADR-178-layouts-the-stage-measures-and-carrying-between-boxes.md) (`carry` called from the scene) and
  [ADR-190](./ADR-190-stage-v3.md) (the cast builder as the authoring surface).
