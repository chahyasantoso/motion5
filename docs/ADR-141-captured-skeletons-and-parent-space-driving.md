# ADR-141: Captured skeletons and parent-space driving

**Status:** Accepted, 2026-10-05

## Context

Published FK frames describe world poses, while Three bones store parent-local transforms.
Writing world angles onto nested bones applies ancestors twice. Avatar I/O must not reach graph
evaluation, length estimation or trust decisions.

## Decision

The pure `@motion5/three/skeleton` entrypoint captures a rigid rest hierarchy, generates zero-length
FK pivot tracks and drives presentation bones through one caller-provided source space.
Capture snapshots and freezes cloned rest transforms. Scale admission has one owner.
Unknown keys throw TypeError. Unmapped bones get tracks and are restored by reset.

`frameToMatrix` owns the ZXY degree convention for both flat writes and the driver.
Frames become parent-local through inverse(parent world) times source world times source frame.
Aim and restAim share parent space: restAim is rest quaternion applied to normalized child rest
position. Swing pre-multiplies rest rotation, preserving rest twist rather than inventing roll.
Missing and degenerate sources hold. Parents precede children independently of input order.
Written bones update world matrices immediately; bind matrices and inverse binds are untouched.

Drive and outcome unions are exhaustively consumed, including held reasons. File loading belongs
to the application, not the adapter. Synthetic rigs provide controlled tests without licensed assets.

## Alternatives rejected

Scene-library retargeting, graph retargeting, stretching and inferred roll each introduce semantics
this adapter does not own. Copying angle conversion introduces a second convention owner.
Per-frame topological sorting spends work on an immutable hierarchy.

## Consequences

Non-unit bone and non-uniform ancestor scales are refused. Uniform ancestor units stay scene-owned.
Per-written-bone world update cost is measured before optimization.
The application retains stale presentation independently of observations and solver inputs.

## Evidence

Supplemental Node 22/light-shim tests cover capture, FK matrix agreement, calibrated aiming,
non-identity rest rotation, holds, antipodal input, ordering, reset and inverse binds.
Exact logs are in the handover; required Node 24 CI is not replaced.
