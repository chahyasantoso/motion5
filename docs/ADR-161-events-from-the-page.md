# ADR-161: Events from the page

**Status:** Accepted, 2026-11-08

## Context

Every scene was a function of time alone, played by a clock, scroll or hand. Web motion answers people: a card lifts
on hover and must turn back smoothly when the pointer leaves half way, which keyframes cannot do. The tools had no
way to make a page see a hover, so an answer to one could not be sampled, checked or rendered.

## Decision

- **One event list.** `@motion5/moves` owns `MotionEvent` `{ name, at, target }`, `at` in ms on the scene's clock.
  A scene is `(time, events) => targets`; a scene of time alone still fits. A driver may answer `events()`, and the
  player passes them, or none, to the scene on every step.
- **A live clock.** `Clock` gains `{ kind: "live", elapsed }`: ms with no end, and progress 0. `span` reads a live
  clock's ms; `window` and `lane` leave it as it is.
- **`follow`.** A closed-form unit-mass spring whose goal each named event sets, carried from its position and speed
  at that event, so it is a pure function of time and events and turns back with no jump. Within 0.001 of its goal
  and slower than ten times that a second, it is at rest on the goal.
- **`eventDriver` in `@motion5/dom`.** A live clock from its creation and a log of `enter`, `leave`, `down`, `up`,
  `click`, `focus` and `blur` from the elements it watches, `in-view` and `out-of-view` from an intersection
  observer, and anything passed to `emit`. Frames run through `introMs`, then for `settleMs` after each event.
  `useWatch` in `@motion5/react` watches the element a ref lands on.
- **`--action` in every page tool.** `hover`, `leave`, `click`, `press`, `release` and `scroll` at exact ms, done with
  the real mouse between steps of the paused clock, so a page sees what a person's pointer gives it.

## Consequences

The player stays one function of what the driver says; nothing in moves reads the page. A long session grows the
event log, and `follow` walks it on every step. `motion:sample` and `motion:timeline` play scenes with no events.
Core and plugins do not see the live clock.

## Rejected

- Recording the pointer's position each frame: a scene of positions would not be seekable or scriptable.
- A spring that steps forward each frame: it would hold state, so a seek or a tool run would not repeat it.
- One driver per element: a scene answering several elements would need several clocks.
