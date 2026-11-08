# ADR-158: motion:read, and CSS animations held to the paused clock

**Status:** Accepted, 2026-11-08

## Context

Agents judged timing from frame sheets, which cost tokens and hide eases. The page tools promised to work on any
page, but the fake clock drives only timers and animation frames: a CSS or Web Animations animation ran on real time,
so frames, probes and checks of such a page sampled the wrong moment.

## Decision

- `motion:read` samples each matched element's own transform, decomposed into `x`, `y`, `rotation`, `scaleX` and
  `scaleY`, and its own opacity, every 16 ms. It splits each channel into moves where it settles or turns back at
  least 30% of the way it came, follows a slow start or end while it keeps going the same way, and names each move's
  curve. A child moving only with its parent reports nothing of its own.
- The page tools own their reference curves, under the names `@motion5/moves` gives its eases; a test holds the two
  equal. A move no named curve fits within 0.02 gets a fitted `cubic-bezier`, when it has at least 8 frames.
- At every step the page tools pause each CSS and Web Animations animation and set it to the clock's time: one
  present at load counts from time 0, one started later from the step it was first seen at.

## Consequences

Page tools still import nothing from motion5. A CSS animation started between two steps is placed up to 16 ms late.
A move the page makes by changing layout, such as `left` or `width`, is not read.

## Rejected

- Importing the eases from `@motion5/moves` into the page tools: they work on pages with no motion5 in them.
- Reading box positions instead of each element's own transform: a parent's move would be reported again on every
  child.
