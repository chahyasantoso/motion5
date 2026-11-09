# Motion principles

Read this when the brief asks for weight, life, character or polish. Each principle below is a tool with knobs, not a
look: pick the amounts the brief's style calls for. Names are in [the reference](./agent-reference.md).
`apps/react-demo/src/principles-scene.ts` uses most of them in one scene.

## The tools

| Principle | Use | Look for on the sheet |
| --- | --- | --- |
| Squash and stretch | `squashed(squash, weight, anchor)` at a contact; `smear(velocity(...), { stretch, max })` at speed | volume kept: wide when short, thin when long |
| Anticipation | a crouch (`squashed` on a span before the move), then `backEase({ amount, direction: "in" })` on a `mix` | a small move the other way before the big one |
| Slow in, slow out | `span.of(time, ease.*)`; `springEase({ stiffness, damping })` for a settle | bunched onion steps at the ends, wide in the middle |
| Arcs | `along(toCubics(anchors), share, { turn })` | the onion's centre path curves |
| Follow-through, overlap | `trail(signal, { stiffness, damping })` on what hangs off a body; `rope` for a chain | parts stop after the body, at different times |
| Stagger | `lanes(lengths, stagger, { from, spacing })` | an order the eye can follow |
| Secondary action | `react` on a cue for a shake or wobble; `combine` to add it to a pose | small, and never hiding the main move |
| Timing | `span` in ms, `move.moments` for when things land | the last frame holds long enough to read |

## Patterns

- **A crouch, then a leap.** Squash on a short span ending where the leap starts, so the weight falls as the travel
  begins:
  ```ts
  const crouch = squashed(0.3, Math.sin(Math.PI * windup.of(time).progress));
  const lift = mix(0, -260, leap.of(time, backEase({ amount: 2, direction: "in" })).progress);
  ```
- **A settle.** `springEase` on a value, never on a move's progress: moves are not defined past 0 and 1, and a
  spring overshoots. Lower damping rings longer. Very low damping does nearly all its travel early, then rings faintly.
- **A smear on content that must not turn.** The outer element takes `smear(...).pose`, and an inner one takes
  `{ rotation: -heading }`. A round body needs only the outer one.
- **A tail.** `trail((t) => body(t).rotation ?? 0, { damping: 10 })` turns behind the body. For a chain, trail each
  link on the one before it.
- **A timed shake.** `react({ on: ["hit"], kind: "shake", amplitude })` with a cue at the hit's ms in `play`'s
  `cues`.
- **A pop.** Scale with `springEase` on a `mix` from 0, plus opacity on a short `span`. There is no preset.

## Judgment

- **Staging:** one thing moves at a time; the rest holds still or moves less. The eye goes to what moves first and
  most.
- **Exaggeration:** push past real, then read the sheet. If a squash merges a letter into its neighbour, it is too
  much for that layout, not for the style.
- **Duration:** small moves are short (about 150 to 300 ms) and travel is longer (about 400 to 900 ms). Hold the final
  frame long enough to read it.
- **Appeal:** clear silhouettes and readable timing. A move nobody can follow is noise.
- **Restraint:** the clock driver shows the last frame to a person who prefers reduced motion; let it, unless the
  motion carries meaning they would lose.

## Limits

- `Pose2d` only: no skew and no 3D. `smear` on content that must not turn needs the inner element.
- `trail` refuses a spring that rings past 4 s; raise damping.
- `trail` and `velocity` take the scene's time, never `span.of(time, ease)`: they sample the signal at other ms, so
  the signal applies its own spans and eases.
- An overshooting ease (`back*`, `elasticOut`, `springEase`) goes on values through `mix`, never into a move's progress.
