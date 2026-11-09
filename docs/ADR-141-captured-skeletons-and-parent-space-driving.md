# ADR-141: Captured skeletons and parent-space driving

**Status:** Accepted, 2026-10-05

## Context

Published FK frames describe world poses; Three bones store parent-local transforms. Writing world
angles onto nested bones applies ancestors twice. Avatar I/O must not reach graph evaluation, length
estimation or trust decisions.

## Decision

Pure `@motion5/three/skeleton` entrypoint captures rigid rest hierarchy, generates zero-length FK
pivot tracks, drives presentation bones through one caller-provided source space. Capture snapshots
and freezes cloned rest transforms. Scale admission has one owner. Unknown keys throw TypeError.
Unmapped bones get tracks, restored by reset.

`frameToMatrix` and inverse `frameFromMatrix` own ZXY degree convention for flat writes, generated
tracks, driver and application-built frames; flat writes never decompose a matrix. Frames become
parent-local through inverse(parent world) × source world × source frame. Aim and restAim share parent
space: restAim = rest quaternion applied to normalized child rest position. Swing pre-multiplies rest
rotation → preserves rest twist, never invents roll. Missing and degenerate sources hold. Parents
precede children regardless of input order. Written bones update world matrices immediately; bind
matrices and inverse binds untouched.

Amended 2026-10-06 (#559). Bone aims only at an unambiguous child: its one child bone, or the child the
caller names in `aimChildren`; otherwise restAim undefined and aim drive holds with `no-rest-aim`,
because skeleton child order is not a choice. A `basis` drive reads a body basis whose identity means
the bone's rest orientation as placed under source space → a rig's own hips axes never leak into the
pose; `frame` stays absolute for bone world frames. Application names every aim child from one chain
table (torso to neck or head, upper to lower limb, lower limb to hand or foot) → twist or shoulder
siblings never make a bone ambiguous. GLTFLoader reached only through one dynamic import in
`gltf-avatar.ts` (test A15).

Drive and outcome unions exhaustively consumed, held reasons included. File loading belongs to the
application, not the adapter. Synthetic rigs give controlled tests without licensed assets.

## Alternatives rejected

Scene-library retargeting, graph retargeting, stretching and inferred roll each introduce semantics
this adapter does not own. Copying angle conversion = a second convention owner. Per-frame topological
sorting spends work on an immutable hierarchy.

## Consequences

Non-unit bone and non-uniform ancestor scales refused, within `SCALE_NOISE_TOLERANCE` (1e-3). Real
Mixamo exports carry float32 noise near 2e-5 on bones, and a centimetre armature near 100 carries it on
ancestors → bone scale judged absolutely, ancestor uniformity relative to ancestor's own scale. The
refusal names the actual scale. Uniform ancestor units stay scene-owned. Rest rotations accepted within
`ROTATION_NOISE_TOLERANCE` (1e-6 on `lengthSq`, since glTF stores float32) and captured normalized →
driver never re-applies the noise.
Per-written-bone world update cost measured before optimization.
Application retains stale presentation independently of observations and solver inputs.

## Evidence

Supplemental Node 22/light-shim tests cover capture, FK matrix agreement, calibrated aiming,
non-identity rest rotation, holds, antipodal input, ordering, reset and inverse binds.
Exact logs in the handover; required Node 24 CI not replaced.
