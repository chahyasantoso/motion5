# ADR-186: The motion vocabulary

**Status:** Accepted, 2026-11-15
**Superseded in part by ADR-192:** the vocabulary card and its catalog.

## Context

After ADR-185 an agent could search moves by words, fields, qualities and likeness, but it had no readable account of
the primitives a move is made from: the fields were a type, the parts were grouped by topic with no rule to check,
renderers ignored fields without saying so, and a move's measured shape was taken from one field. An agent that
wanted to design a motion first and reuse a move only when one fits could neither name the design nor ask for it,
and nothing checked that a finished piece did what its author intended.

## Decision

- **An agent works in four steps:** it learns the primitives and how to use them; writes the brief's motion in them
  as a spec in the piece; finds tested moves that meet the spec and decides to use, adjust, combine or write one; and
  the review checks the finished piece against its own spec.
- **The kinds a piece is assembled from have contracts and one owner each:** a field is its row of `VALUE_FIELDS`
  (meaning, unit, rest, joining, bounds, how the review judges it, dimension); a pose type is derived from the rows;
  a part is a function exported from `@gerak/moves` and declared with `definePart` in its kind's folder; a move is
  `defineMove`; composition places moves; a shape is what the gate measures.
- **A part's kind is its folder** under `parts/`: `time`, `ease`, `envelope`, `oscillation`, `dynamics`, `path`,
  `geometry`, `blend`, `coupling`, `signal`, `utility`. `definePart` records a contract in a registry and returns the
  function unchanged. The kinds that take a progress (ease, envelope, oscillation, dynamics, path, blend, coupling)
  state a rule the part gate samples over the arguments the contract declares.
- **Each renderer declares what it writes** and what it leaves unwritten, with a reason; a field of a pose type a
  renderer takes is in exactly one of its lists.
- **One card holds the vocabulary.** `motion:moves -- --anatomy` lists fields by what they change and parts by kind,
  each with a sample of its use; `--json` gives the same data.
- **Shapes are per field.** Every moved field's shape is kept; likeness and duplicates compare field by field.
- **The catalog answers a design.** `--move <field>[:<quality>]`, `--uses <kind or part>`, `--design <file>
  --target <name>` and `--renderer <name>` score gate-passing moves at their example and option sets, say what
  matched, and say when no move fits.
- **A piece may export `design`:** each target's fields with a quality, optionally per beat. `motion:review`
  measures those fields and reports where a shape lies outside its quality.

## Consequences

- A primitive is found by what it changes (a field) or how it shapes change (a part's kind), and its use is shown.
- A move that would vanish on a renderer is visible before it is used.
- A piece states its intent in checkable terms, and the review answers it without a render round.
- The quality ranges become a shared measure of intent, the shape a style card will use.
