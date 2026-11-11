# ADR-172: A move declares its role, and a gate holds it to it

**Status:** Accepted, 2026-11-11

## Context

An agent given a brief copied the nearest worked example. The guide told it to, five declared moves were all it
could choose from, and a move it wrote had no home and no standard to meet, so it stayed in its scene file. "A
standard move" meant nothing a tool could check.

## Decision

- A move's declaration carries a `role`, one of `enter`, `exit`, `emphasis`, `travel`, `reveal`, `follow` and
  `modifier`, read by an exhaustive `switch`. The role says what the move is for and where it must hold its rest:
  an entrance and a travel at their end, an exit at its start, an emphasis at both, a reveal fully shown at its end,
  a follow and a modifier nowhere of their own.
- A declaration carries an `example`: options a caller would pass, and an input when `run` takes one. `defineMove`
  checks the example's options when the move is defined. The gate samples it and the catalog shows it.
- A modifier is a move whose input is another move's answer. `defineMove` stays the one way to declare; there is no
  second kind of declaration.
- Exits are entrances reversed by one modifier. The library carries no separate set of exits.
- `checkMove` in `@gerak/tools/scene` is the gate. It runs the example, and the example with each ranged number at
  its least and its greatest, and reports: an id that is not lower kebab-case, a missing description, a throw, a
  value that is not finite, a field off its rest where the role holds rest, a reveal that ends below its greatest
  value, a moment outside 0 to 1, and a jump.
- A jump is a step between two 16 ms samples of a second-long run larger than 0.35 of the field's whole travel. It
  is asked of the example only, because a bound may be abrupt by design, and never of a scale, because a contact
  squashes in one frame.
- The declaration is the one owner of what a move is. The catalog, the gate, the reference and the live page's drag
  ranges read it, and none restates it.
- Authored moves live in `src/moves/<id>.ts` of the app that uses them, one per file. A move that proves general
  moves into `@gerak/moves` by a pull request.

## Consequences

- Every existing declaration gains a `role` and an `example`; a declaration without them does not compile.
- A move that ends off its rest on purpose has no role. When one is needed, the roles gain a member; the gate gains
  no exemption.
- The gate's thresholds are constants in one file. A move that fails them at its example is changed, or the
  threshold is, in the open.
