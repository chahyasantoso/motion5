# ADR-139: Stateful work is driven by runners

**Status:** Proposed, 2026-10-05

## Context

Plugin composition repeats on seek, replacement and rollback. Hidden temporal state would make
those operations depend on execution history.

## Decision

Reserve stateful work for application-attached runners publishing revertible overlays on the engine
clock. Failure collection and disposal follow #534 revision 2 in the owning runner change.
No runner API is introduced by this proposal.

## Alternatives rejected

Stateful composition mixes synchronous graph semantics with application lifecycle ownership.

## Consequences

Attachment and disposal stay application-owned. Acceptance requires its own tests and CI evidence.
