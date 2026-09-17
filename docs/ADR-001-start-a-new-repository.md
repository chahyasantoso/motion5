# ADR-001: Start a new repository

**Status:** Accepted, 2026-08-10

**Context.** The predecessor has valuable behavior but accumulated migration residue: overlapping observation owners, per-Motion runtime pieces, compatibility APIs, demos coupled to package layout, and tests that protect historical seams. Refactoring in place would keep both the old and new assumptions alive while the ownership model was being changed.

**Decision.** motion5 starts with a clean repository. The predecessor is a read-only behavioral oracle. No source files, tests, fixtures, demos, commit history, or status documents are copied.

**Alternatives rejected.** A fork would be faster for the first feature but would import the very seams this project is meant to remove. A branch inside the old repository would make “new contract” and “old contract” impossible to distinguish.

**Consequences.** Phase 0 is slower. Later changes are easier to reason about because there is no compatibility layer to preserve.
