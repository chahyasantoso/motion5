# ADR-138: Rig aggregation and frame-local pose classification

**Status:** Accepted for the prepared implementation, 2026-10-05; not a merge or CI claim.

## Context

Applications need one named pose over existing world-frame tracks, and frame-local consumers need
to classify that pose without embedding another solver or reaching into graph internals. Forward
and inverse kinematics already own world-frame composition and limits. A rig must not duplicate
those owners, and stateful estimation belongs in an application-owned runner rather than compose.

The #534 phase 9 plan is read with revision 2 of its review amendments. Comparing authored Euler
angles per axis is not a rotation metric: under ZXY, `(30, 90, 0)` and `(0, 90, 30)` are the same
orientation. An axis-wise mean would falsely reject that pose at a ten-degree threshold.

## Decision

`@motion5/plugins/rig` exports `rigPlugin`, `readRigValues`, and the nameable `RigPose`, `RigControls`
and `RigValues` types. Rig has empty keys and dict-valued `bones` and `controls` requirements.
It publishes nested records assembled only from those bound tracks. It declares no solver chain,
imports no fk/ik implementation, owns no limits, and has no output serializer.

`readRigValues` owns decoding of published rig data. `readFrame3d` owns world-frame defaults;
an existing bone without frame keys decodes to a zero frame, while an absent bone remains absent.
Keys are sorted deterministically and copied into own data properties. Controls contain only
positions. Empty or malformed dictionaries decode to empty records; callers never assume that
an unbound track publishes `pose`.

The plan's empty-dictionary example is corrected rather than admitted through a second schema:
the tolerant binding parser derives no bindings from an empty dict, but public validation refuses
empty groups, values and requirement dictionaries. An unbound data track omits the rig group.
G3b pins its absent pose and the decoder's empty records without weakening validation.

`rig` is appended to the lazy built-in catalog. `@motion5/plugins/pose-classify` exports the
`createPoseClassifyPlugin` factory and nameable `PoseTemplate` and `PoseClassifyOptions` types.
The factory is not a built-in catalog entry: an app supplies its descriptor and may fetch templates
inside the descriptor's async load before constructing the pure definition.

Classification binds `requires.rig`, never a generic output observation. The definition claims no
authored keys and publishes `label` and `confidence`. Construction validates a non-empty template
array, non-empty distinct labels different from the unknown label, at least one bone per template,
finite angles, and a positive finite maximum distance. Sparse arrays and malformed optional
identity fields are refused eagerly. The default name is `pose-classify`, and the unknown label
defaults to `unknown`. A custom name must equal its catalog key.

Construction snapshots templates into deeply frozen inverse rotation matrices. Compose computes
each actual bone matrix once and compares `transpose(template) * actual` using frame3d's existing
matrix helpers. The geodesic angle is `acos(clamp((trace - 1) / 2, -1, 1))` in degrees, averaged
over template bones. A missing bone scores Infinity. The lowest mean wins, ties retain the first
template, and an inclusive maximum selects its label. Confidence is `max(0, 1 - distance / maximum)`
for finite distances and zero otherwise. Position does not affect classification. No hidden
history, model state or new closed union is introduced.

Rig and classifier tracks are data rather than render targets. DOM adapters skip record values;
the flat-frame Three adapter does not interpret a nested rig pose. Consumers use the rig decoder
or the shared label reader, and `onLabelChange` supplies edges over classifier publication.

Independent review found an input-assembly defect that violates the bound-member invariant:
assignment to a dict member named `__proto__` changes its prototype rather than creating an own
property. A regression exposed the same defect in validation cloning. Both existing owners now
define own data properties while retaining their existing freezing and cycle behavior. This does
not relax renderer-neutral output admission: underscore-prefixed output keys still produce
`composition-output-shape`, rather than disappearing silently before composition.

## Alternatives rejected

Importing fk/ik code into rig would create a second solver owner. Flat dotted pose keys would
duplicate nested decoding and couple consumers to an encoding convention. Rig-owned limits would
compete with the solver/member vocabulary. A serializer is inappropriate for data tracks.

Per-axis Euler distance is withdrawn because equivalent gimbal-lock orientations disagree in that
representation. A Three dependency for rotation arithmetic would introduce renderer ownership into
pure plugins; existing frame3d helpers already own the required convention and operations.

Fetching templates inside compose or maintaining temporal classification state would make seeks,
recompiles and rollback nondeterministic. Configuration belongs to factory construction, with
application-owned asynchronous loading before atomic registration.

## Consequences

A pose aggregates existing fk/ik tracks through ordinary graph edges, so upstream seeks propagate
without a second solve. Preparation costs one matrix per template bone once; each compose computes
one actual matrix per bound bone and compares the prepared templates. Ranking is linear in total
template bone count.

The zero-default decoder intentionally does not diagnose absent frame fields: a missing pose bone
and a present zero frame are different cases. Underscore-prefixed output keys remain disallowed.
Definitions require registration before synchronous live edits.

## Evidence

G1 through G4 cover requires-only selection, exact bone frames, controls, upstream ik3d propagation,
unbound tracks, zero defaults and sorting. G5 through G8c cover matching, refusals, missing bones,
label-change integration and the revision 2 gimbal-lock controls. Additional cases pin template
snapshot isolation, ties, multi-bone means, small rotations, custom loader descriptors and own-key
input delivery. Empty aggregation and the rejected Euler metric produce assertion-level red runs;
restored implementation passes the supplemental sandbox suite.

Exact commits, logs and independent review findings are carried in the handover. These checks do
not replace Node 24 and real Vitest CI; no Actions run, remote publication or merge is claimed.
