# ADR-140: Retargeting is a separate plugin

**Status:** Proposed, 2026-10-05

## Context

A presentation driver converts frames into a live hierarchy, not a reusable target rig pose.
It must not silently invent axial twist or proportions.

## Decision

Reserve graph-level retargeting for a later plugin with explicit source and target rest poses.
File loading remains application-owned. No retarget implementation is introduced here.

## Alternatives rejected

Retargeting in core or the presentation driver creates a second owner of rig semantics.

## Consequences

The current driver performs rigid frame conversion and swing-only aiming, not general retargeting.
