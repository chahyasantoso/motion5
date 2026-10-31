# ADR-006: Live state is stable and mutated in place

**Status:** Accepted, 2026-08-10

**Context.** Recreating observation bridge after graph commit invalidates subscriber references, makes rollback ambiguous.

**Decision.** Each project one long-lived ObservationState. GraphBinding mutates it transactionally with undo journal. Commit replaces immutable graph snapshot, not live state object.

**Alternatives rejected.** Rebuild from entire graph after every change simpler locally, but loses identity, makes side effects hard to undo.

**Consequences.** Mutation code must be explicit, reversible. Invariants I-1 and I-2 mandatory evidence.
