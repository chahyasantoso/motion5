# ADR-123: 3D joint limits behind a closed per-member union, enforced inside 3D FABRIK

**Status:** Accepted, 2026-09-27, as part of the public 3D contract
([ADR-125](./ADR-125-public-3d-api.md)); landed through #513 (`main` at `7ee6980a`).
Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 6,
2026-09-27, above `main` at `db79cc49dae9442eb7403dbe3931d90521114f16` (#512).
**Extended by [ADR-124](./ADR-124-3d-goal-influence-and-end-effector-orientation.md),
2026-09-27** (phase 7): `limitLocal3d` also limits the orientation step's turned leaf, so an
oriented leaf's solved orientation stays legal.
**Extended by [ADR-126][adr126],
2026-09-27** (issue #514): limited FABRIK now retries the opposite seed side, enforces limits
inward as well as outward, records 2D bounds from the enforced angle, and uses a progress-gated
limited pass budget.

## Invariant

Every local orientation `ik3d` publishes for a member whose `fk3d` group declares a joint lies
inside that joint's limit, measured in the member's local orientation relative to its parent's
solved frame, and it is legal because the pose it was solved in is legal, never because the output
was clamped afterwards. A chain with any constraining member is solved by 3D FABRIK, two members
included, and reports `limited` with `atBound` naming every member resting on a bound when a goal
misses by more than `FABRIK_TOLERANCE`. A member that declares no joint, or `free`, takes exactly
the path, the cost and the bytes it took before limits existed. Every joint an author can write is
either read by the solve or refused at load, and the load-time strategy and the runtime dispatcher
agree on which chains are constrained. No 2D byte moves.

## Decision

- **One closed union per member, one runtime owner.** `plugins/ik3d-constraint.ts` states
  `JointLimit3d = free | hinge | cone | swing-twist` and is the only module that reads a live
  joint (`readJointLimit3d`) or limits an orientation (`limitLocal3d`), each read by one exhaustive
  switch (ADR-092). `limitLocal3d` answers the closed `unmoved | moved` value, so an in-range member
  publishes the bytes it would unlimited rather than a copy of the proposal.
- **The kind is authored, never inferred.** `fk3d.values.joint` names the kind and is the union's
  discriminant; which bounds a joint reads follows from it (`jointBoundKeys`). A bound beside a kind
  that does not read it is refused (`ik-joint-key-unused`) instead of guessing a kind from whichever
  keys are present, so a 2D habit (`minRotation` with no `joint`) is told why rather than read as a
  hinge.
- **Limits are relative to the parent's solved frame, as 2D ranges are.** A hinge is `R(axis, θ)`
  with `axis` in the parent frame (`axisX`/`axisY`/`axisZ`, default +z, so a +z hinge is the 2D
  range exactly) and `θ` in `[minRotation, maxRotation]`; a cone keeps the member's +x within
  `maxSwing` of the parent's +x; a swing-twist adds `[minTwist, maxTwist]` about the member's own +x
  through the swing-twist split. The 2D range owner is reused, not restated: `readAngleRange`,
  `limitRotation` (nearer bound on the circle) and `atBound` answer every angle range in both
  dimensions.
- **Enforced inside the outward pass.** `ik3d-fabrik.ts` calls `limitLocal3d` for every member of
  every outward pass after its minimal-swing reconstruction and re-places a limited member's tip
  along the legal direction, so every later pass starts from a legal pose (ADR-108's rule carried
  into 3D). A limited member's legal local orientation is published as it is, not re-derived from
  world frames. A free member never builds its proposal: the thunk is not called.
- **A hinge is always rebuilt.** A hinge has one degree of freedom, so its answer is always
  `R(axis, limited angle)`, in range or not; a floating-point proposal is never exactly a turn about
  the axis, and an `unmoved` arm would publish a tilt off the hinge. Where the member's direction
  names no angle (a roll-only hinge whose axis is the member's +x, or a direction along the axis)
  the proposal's own twist about the axis answers.
- **A constrained chain is its own arm.** `ChainShape3d` gains `constrained`, decided first after
  the goal guard, and dispatched to 3D FABRIK: the closed form solves without the limit and
  clamping its answer would constrain a pose that was never solved under it.
  `contract/solver-shape.ts`'s `DerivedChainMember` carries `constrained`, read at load through
  `authorsConstrainingJoint`, and `derivedStrategy` answers `iterative` for it; `TH-76` holds the
  two readings equal over 153 forests unconstrained and 719 with each member constrained in turn.
  So a rest orientation with no weight on a constrained two-bone rig is live and loads.
- **Load rules reuse what already names the mistake.** Two new ids, `ik-joint-malformed` (a joint
  that is not one static kind, a non-static or non-finite axis component, an authored axis with no
  direction, a cone or swing-twist with no `maxSwing`) and `ik-joint-key-unused`. Every angle bound,
  `maxSwing` and the twist range included, reuses `ik-limit-malformed` and `ik-limit-empty`;
  placement reuses `ik-limit-without-solver`. `classifyJoint` is the one classifier and
  `malformedBound` the one owner of which id and which domain a malformed bound is refused with.
- **Placement follows the flattened bag.** A joint reaches `ik3d` through the member's flattened
  values, so a joint key under any group of a node that binds a solver through a joint-declaring
  group reaches the solve. Such a key is well placed only under that joint group; anywhere else on
  a 3D member it is `ik-limit-without-solver`. On a node that is no 3D member, `joint` and its
  bounds are common words and remain the registry's question (`plugin-unknown-key`).
  `declaresJoint` (today `fk3d` alone) owns which plugins' values are a joint, and `TH-88` holds it
  equal to the plugin definitions that claim `joint`.
- **Primitive arithmetic has one owner.** `frame3d.ts` gains `rotationAboutAxis3d` (Rodrigues),
  `swingTwist3d` (split about +x whose swing is `swingFrame3d`'s, so a pure-swing orientation reads
  no twist) and `twistAbout3d` (the split conjugated onto any axis), plus `LOCAL_X3`,
  `IDENTITY_MATRIX3` and the exported `canonicalDegrees`.
- **A huge finite axis is a direction.** `readHingeAxis` divides by the largest component before
  normalising, because load accepts every finite component and `Math.hypot` overflows near
  `Number.MAX_VALUE`, which read a legal axis as the +z fallback (found by the independent pass).

## What is withdrawn

- Clamping the published orientation after the solve: it constrains a pose that was never solved
  under the limit, and the composed tip then misses the reported residual.
- Inferring the kind from the bounds present: two owners for one question (the author's word and
  the reader's guess), and a 2D range would silently become a hinge.
- Limits relative to the rest orientation: the rest is what `fk3d` composes with no solve, not a
  second centre, and 2D ranges already bound the local angle rather than a turn from rest.
- Scoping the placement rule to joint-declaring groups only (checkpoint 1's draft): a third-party
  group's `joint` on a 3D member steered the solve unvalidated while the load-time strategy read the
  member as free. `TH-93` is red without the fix.
- A predicate over axis keys to pick the refusal id, and the ternary over `cone | swing-twist`:
  both are now exhaustive switches.
- A per-iteration pole constraint (ADR-122 deferred it here): the pole bends the seed arc only;
  a joint is how an author bounds an elbow.
- Changing 2D FABRIK's seed or `atBound` derivation to match 3D: out of scope, measured below.

## Consequences

[ADR-126][adr126] extends
this record's outward enforcement with an inward pass for bases that have limited children, and
has the selector retry the opposite seed side only for a `limited` baseline. It also records 2D
`atBound` from the angle the limit enforced, so planar +z hinges no longer disagree with 3D only
because position rounding put a legal angle one ulp inside the bound. Limited attempts retain the
shared free cap first and may continue only under the progress-gated ceiling; a residual that does
not project tolerance still reports its honest miss. The live `joint` write, authored-property
validation path, and `fk3d` vocabulary remain as described here. Nothing 3D is exported.

## Evidence

- `TH-79` to `TH-87` (`unit/plugins/ik3d-constraint.test.ts`): primitives, reader totality,
  per-kind limiting, a 600-rig seeded corpus of chains and trees (every limited orientation inside
  its limit within `1e-7` degrees, finite, pure, each leaf composed onto its residual), planar
  agreement with 2D, dispatch and `limited`, and free-path identity. `TH-88` the joint plugin set.
  `TH-89` to `TH-94` (`unit/graph/ik3d-joint-load.test.ts`) the load rules. `TH-95`
  (`integration/ik3d-joint.test.ts`) a limited two-bone arm through `Engine`: FABRIK not the closed
  form, legal orientations, `converged` then `limited`, byte-for-byte scrub. `TH-76` extended.
- 2D identity, sandbox: 1,840 solves hash to `7e514e48…` on `db79cc4` and this change. 3D
  two-bone: 4,000 closed-form solves `22b3680e…`. 3D tree: 1,380 solves `7e3cf790…`. Both equal.
- Sandbox TypeScript 5.8.3 reports the base error set; the full suite under the sandbox Vitest
  stand-in has no new failure against the base. Reviewed, not trusted; `CI` on the pull request
  head is the evidence.

[adr126]: ./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md
