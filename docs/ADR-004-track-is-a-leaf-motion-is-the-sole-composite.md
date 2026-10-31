# ADR-004: Track is a leaf; Motion is the sole composite

**Status:** Accepted, 2026-08-10

**Context.** Predecessor let Track own children, group hosts, playback delegation and graph recursion while Motion also owned scheduling → two composite owners, unclear teardown.

**Decision.** Track owns only playhead/progress, interpolation inputs, local plugin composition, renderer-neutral snapshots, local lifecycle. Motion owns child membership, hierarchy, stagger, layout, scheduling, triggers, playback, child teardown. Graph traversal belongs to graph layer.

**Alternatives rejected.** Keeping convenience methods on Track preserves a second composite API. Motion delegating graph composition to Track bypasses the project-wide publisher.

**Consequences.** Callers use Motion for hierarchy, runtime for graph observation. Track simpler to test, safe to reuse as leaf.
