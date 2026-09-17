# ADR-005: Publication is one-way

**Status:** Accepted, 2026-08-10

**Context.** A publisher that can also add/remove nodes or edges overlaps with the topology binding. Two writers cannot guarantee atomic graph changes.

**Decision.** GraphBinding is the only topology mutation coordinator. GraphPublisher accepts a validated snapshot and publishes patches. It has no topology mutation methods.

**Alternatives rejected.** A convenience mutation method on the publisher is still a second owner, even if it forwards to the binding today.

**Consequences.** Changes during a flush are deferred to the next tick. Publication observes committed graph snapshots only.
