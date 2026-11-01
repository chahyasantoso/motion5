# ADR-005: Publication is one-way

**Status:** Accepted, 2026-08-10

**Context.** Publisher that can also add/remove nodes or edges overlaps topology binding. Two writers cannot guarantee atomic graph changes.

**Decision.** GraphBinding sole topology mutation coordinator. GraphPublisher accepts validated snapshot, publishes patches. No topology mutation methods.

**Alternatives rejected.** Convenience mutation method on publisher still second owner, even forwarding to binding today.

**Consequences.** Changes during flush deferred to next tick. Publication observes committed graph snapshots only.
