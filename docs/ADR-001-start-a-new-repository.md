# ADR-001: Start a new repository

**Status:** Accepted, 2026-08-10

**Context.** Predecessor behavior valuable, residue heavy: overlapping observation owners, per-Motion runtime pieces, compatibility APIs, demos coupled to package layout, tests protecting historical seams. In-place refactor keeps old + new assumptions alive while ownership model changes.

**Decision.** motion5 starts clean. Predecessor = read-only behavioral oracle. Copy no source, tests, fixtures, demos, commit history, status documents.

**Alternatives rejected.** Fork faster first feature, imports seams project exists to remove. Branch in old repo makes “new contract” vs “old contract” indistinguishable.

**Consequences.** Phase 0 slower. Later changes easier to reason about: no compatibility layer to preserve.
