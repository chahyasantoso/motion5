# ADR-004: Track is a leaf; Motion is the sole composite

**Status:** Accepted, 2026-08-10

**Context.** The predecessor allowed Track to own children, group hosts, playback delegation, graph recursion while Motion also owned scheduling. That produced two composite owners and unclear teardown.

**Decision.** Track owns only playhead/progress, interpolation inputs, local plugin composition, renderer-neutral snapshots, and local lifecycle. Motion owns child membership, hierarchy, stagger, layout, scheduling, triggers, playback, and child teardown. Graph traversal belongs to the graph layer.

**Alternatives rejected.** Keeping convenience methods on Track would preserve a second composite API. Having Motion delegate graph composition to Track would bypass the project-wide publisher.

**Consequences.** Callers use Motion for hierarchy and the runtime for graph observation. Track becomes simpler to test and safe to reuse as a leaf.
