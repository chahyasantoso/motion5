# ADR-124: 3D goal influence and end-effector orientation

**Status:** Accepted, 2026-09-27, as part of the public 3D contract
([ADR-125](./ADR-125-public-3d-api.md)); landed through #515 (`main` at `f8c30d1c`).
Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 7,
2026-09-27, above `main` at `7ee6980a35ed321d3a812991a166a85d956cf5b1` (#513), in
[#515](https://github.com/chahyasantoso/motion5/pull/515).

## Invariant

`influence` on an addressed `fk3d` leaf weighs the 3D tree solve's branch compromise through the 2D
goal owner (`branchPulls`, ADR-110), and does nothing to a chain with one goal. `orient`, a static
finite weight in `[0, 1]` on an addressed `fk3d` leaf, turns that leaf toward its goal frame's world
orientation after the position solve, only by rotations that keep the leaf's tip where the position
solve put it: its roll about its own axis for a leaf with length, the whole short-arc blend for a
zero-length leaf. The joint owner (`limitLocal3d`, ADR-123) re-limits the turned orientation, so
every orientation the solve publishes stays legal (the solver pose, as ADR-123 bounds it; `fk3d`'s
weight blend toward rest is outside that claim, as it is for every limited member). Residuals,
quality and every other member's triple are carried unchanged, and a chain with no addressed leaf
authoring a positive `orient` gets back the very same result object, so no rig that loaded before
this change moves a byte. Every goal weight an author can write on a 3D member is either read by the
solve or refused at load by name. No 2D byte moves.

## Decision

- **One owner for the orientation step.** `plugins/ik3d-orient.ts` is the only module that reads
  a live `orient` (`readOrient`) or turns a leaf (`orientLeaves3d`). The dispatcher
  (`ik3d-solve.ts`) runs it once after whichever strategy answered the chain's position, the closed
  form or 3D FABRIK, so neither strategy carries a copy. What may turn is the closed
  `OrientFreedom = roll | whole`, decided by the leaf's extent through `segmentExtent` and read by
  one exhaustive switch (ADR-092).
- **Position keeps priority exactly.** A leaf with length turns only about its own +x, composed on
  the local side (`local · Rx(θ)`), so its direction is its solved one to rounding. A zero-length
  leaf's tip is its pivot, so every rotation is free and it takes `blendOrientation3d`, the one 3D
  short-arc blend (ADR-116), from its solved world orientation toward the goal's.
- **The roll is the nearest one.** At `orient` 1 the roll is the twist, about +x, of `Wᵀ · G`
  (the rotation carrying the leaf's solved world orientation `W` onto the goal's `G`), through
  `swingTwist3d`; the twist of a swing-twist split is the projection of that rotation onto the axis.
  `orient` is the fraction of that one short arc, and `0` returns the solve's pose byte for byte.
- **The parent frame is the published one.** The leaf's parent world frame is composed from the
  root and the published local triples of its ancestors, what `fk3d` renders at weight 1, never a
  solver-internal frame. The step never reads `rest` or `weight`: both goals, position and
  orientation, are met at weight 1 and faded by it, which is what a weight is for (ADR-055,
  ADR-116). The independent pass raised this as a design risk; it is recorded as the decision.
- **The goal's orientation is its frame's.** The goal's own `rotation`, `rotationX` and
  `rotationY`, a world orientation in the CSS `Rz · Rx · Ry` convention `frame3d.ts` owns. The
  position reading of the same goal (`ik-goal-reading.ts`) still reads only its coordinates.
- **Influence is the 2D owner's.** `readChainMembers3d` reads `influence` through `ik-goal.ts`'s
  `readInfluence` and the tree solve weighs its branches through the same `branchPulls`, because a
  goal's pull does not depend on the dimension it decodes to (ADR-106, ADR-114). `fk3d` claims
  `influence` and `orient` beside its joint vocabulary and never reads them in composition.
- **Load rules are stated once over a table.** `ik-orient-malformed` and `ik-orient-without-goal`
  join the two influence rules in `GOAL_WEIGHT_RULES`, one record per key (its rule ids, the phrase
  its refusal names it by, its domain and its contract classifier), so placement and classification
  are one rule each rather than one per key. The influence messages are byte-identical to what they
  were. `validateGoalInfluence` is renamed `validateGoalWeights`.
- **A 3D goal weight on a bone no solver reads is refused.** On a node that bound no solver
  anywhere the rules keep the narrowing `ik-weight-without-solver` makes, because load holds no
  registry and cannot tell a 2D goal weight from another plugin's own key. Under a 3D member group
  (`declaresJoint`, today `fk3d`) the vocabulary is the contract's, so an `fk3d` `orient` or
  `influence` there is refused as `ik-{orient,influence}-without-goal`, "which did not bind its
  solver". The first checkpoint loaded it clean and ignored it; `TH-107` is red without the fix.
- **The no-orient path allocates nothing.** `orientLeaves3d` tests `some` before it filters, so a
  chain with no orientation goal returns its input without building an array.

## What is withdrawn

- Full orientation on a leaf with length: every rotation but the roll moves the tip, breaking
  position priority and the reported residual.
- An orientation residual in `inspection`: the record's shape is shared with 2D (ADR-109, ADR-120)
  and describes the position solve.
- Reporting a roll that a joint holds off as `atBound`: quality describes position, and the
  orientation is a weighted preference applied after it, with no residual of its own.
- An animated `orient`: it is static like `influence`; a live value-tier write still reaches the
  solve on every tick (`TH-109`).
- Refusing `orient` on a hinge leaf at load: the step reads it, and a hinge about the bone's own
  +x does roll; a hinge about any other axis keeps the orientation its direction fixes (`TH-99`,
  `TH-110`).
- Folding the step into the rendered frame through `rest` and `weight`: it would make the step a
  second owner of `fk3d`'s blend and would give a weight-0 leaf an orientation it cannot render.

## Consequences

`fk3d` claims `influence` and `orient`, which were `plugin-unknown-key` before. A value-tier write
of an already-authored `orient` or `influence` is a mask, read on the next solve without rerunning
load, and a live value outside the domain reads as absent, so a live `orient` of `2` publishes the
position solve ([LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md)). A value-tier write reaches only a key
the track authors, so a rig that wants to fade an orientation in authors `orient: 0`, which loads
and publishes the position solve itself. Nothing 3D is exported; issue #500 phase 8 is the public
surface.

## Evidence

- `TH-96` to `TH-101`, `TH-108` and `TH-110` (`unit/plugins/ik3d-orient.test.ts`): the no-orient
  identity, roll-only turning with tip, residual, quality and ancestors unmoved, whole turning of a
  zero-length leaf, joint re-limiting (swing-twist caps the roll, a cone keeps it, a hinge keeps its
  one degree of freedom about +z, +x and an arbitrary axis), reader domains, influence in the tree
  compromise, and two oriented leaves of a branched tree with pivot offsets.
- `TH-102` to `TH-104` and `TH-107` (`unit/graph/ik3d-goal-weights-load.test.ts`): malformed,
  misplaced, unaddressed and no-solver refusals, with 2D rigs unaffected.
- `TH-105`, `TH-106` and `TH-109` (`integration/ik3d-orient.test.ts`): `Engine` orientation with
  forward, reverse and random scrubs, a weighted branched compromise, and live `orient` writes held
  byte for byte against the authored publication.
- 2D identity, sandbox: 1,840 solves hash to `7e514e48…` on `7ee6980` and this change. 3D
  two-bone: 4,000 closed-form solves `22b3680e…`. 3D tree: 1,380 solves `7e3cf790…`. All equal.
- Nine mutations of the step and its rules were all killed in the sandbox. Sandbox TypeScript 5.8.3
  reports no error outside the base set. Reviewed, not trusted; `CI` on the pull request head is
  the evidence.
