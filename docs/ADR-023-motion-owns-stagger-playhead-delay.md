# ADR-023: Motion owns stagger playhead delay calculations

**Status:** Accepted, 2026-08-15

**Superseded in part by [ADR-150](./ADR-150-time-and-the-time-module.md), 2026-11-08.** The stagger calculation moves to the time module; Track stays a passive leaf.

**Decision.** Motion computes per-track staggered progress; Track stays passive leaf.
