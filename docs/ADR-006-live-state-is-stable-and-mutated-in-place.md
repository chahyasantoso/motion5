# ADR-006: Live state is stable and mutated in place

**Status:** Accepted, 2026-08-10

**Context.** Recreating an observation bridge after a graph commit invalidates references held by subscribers and makes rollback ambiguous.

**Decision.** Each project has one long-lived ObservationState. GraphBinding mutates it transactionally with an undo journal. Commit replaces the immutable graph snapshot, not the live state object.

**Alternatives rejected.** Rebuilding from the entire graph after every change is simpler locally but loses identity and makes side effects difficult to undo.

**Consequences.** Mutation code must be explicit and reversible. Invariants I-1 and I-2 are mandatory evidence.
