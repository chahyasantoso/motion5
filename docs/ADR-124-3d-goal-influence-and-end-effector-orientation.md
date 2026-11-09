# ADR-124: 3D goal influence and end-effector orientation

**Status:** Accepted, 2026-09-27, as part of the public 3D contract
([ADR-125](./ADR-125-public-3d-api.md)); landed through #515 (`main` at `f8c30d1c`).
Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 7,
2026-09-27, above `main` at `7ee6980a35ed321d3a812991a166a85d956cf5b1` (#513), in
[#515](https://github.com/chahyasantoso/motion5/pull/515).

## Invariant

`influence` on addressed `fk3d` leaf weighs 3D tree solve's branch compromise through 2D goal owner
(`branchPulls`, ADR-110); does nothing to chain with one goal. `orient`, static finite weight in
`[0, 1]` on addressed `fk3d` leaf, turns leaf toward its goal frame's world orientation after
position solve, only by rotations keeping leaf's tip where position solve put it: roll about own axis
for leaf with length, whole short-arc blend for zero-length leaf. Joint owner (`limitLocal3d`,
ADR-123) re-limits turned orientation, so every orientation solve publishes stays legal (solver pose,
as ADR-123 bounds it; `fk3d`'s weight blend toward rest outside that claim, as for every limited
member). Residuals, quality and every other member's triple carried unchanged; chain with no
addressed leaf authoring positive `orient` gets back very same result object, so no rig loaded before
this change moves a byte. Every goal weight author can write on 3D member either read by solve or
refused at load by name. No 2D byte moves.

## Decision

- **One owner for the orientation step.** `plugins/ik3d-orient.ts` only module reading live `orient`
  (`readOrient`) or turning leaf (`orientLeaves3d`). Dispatcher (`ik3d-solve.ts`) runs it once after
  whichever strategy answered chain's position, closed form or 3D FABRIK, so neither strategy
  carries copy. What may turn is closed `OrientFreedom = roll | whole`, decided by leaf's extent
  through `segmentExtent`, read by one exhaustive switch (ADR-092).
- **Position keeps priority exactly.** Leaf with length turns only about own +x, composed local side
  (`local · Rx(θ)`), so direction is solved one to rounding. Zero-length leaf's tip is its pivot, so
  every rotation free; takes `blendOrientation3d`, one 3D short-arc blend (ADR-116), from solved
  world orientation toward goal's.
- **The roll is the nearest one.** At `orient` 1 roll is twist, about +x, of `Wᵀ · G` (rotation
  carrying leaf's solved world orientation `W` onto goal's `G`), through `swingTwist3d`; twist of
  swing-twist split is projection of that rotation onto axis. `orient` is fraction of that one short
  arc; `0` returns solve's pose byte for byte.
- **The parent frame is the published one.** Leaf's parent world frame composed from root and
  published local triples of ancestors — what `fk3d` renders at weight 1, never solver-internal
  frame. Step never reads `rest` or `weight`: both goals, position and orientation, met at weight 1,
  faded by it — what weight is for (ADR-055, ADR-116). Independent pass raised this as design risk;
  recorded as decision.
- **The goal's orientation is its frame's.** Goal's own `rotation`, `rotationX` and `rotationY`: world
  orientation in CSS `Rz · Rx · Ry` convention `frame3d.ts` owns. Position reading of same goal
  (`ik-goal-reading.ts`) still reads only coordinates.
- **Influence is the 2D owner's.** `readChainMembers3d` reads `influence` through `ik-goal.ts`'s
  `readInfluence`; tree solve weighs branches through same `branchPulls`, because goal's pull does
  not depend on dimension it decodes to (ADR-106, ADR-114). `fk3d` claims `influence` and `orient`
  beside joint vocabulary, never reads them in composition.
- **Load rules are stated once over a table.** `ik-orient-malformed` and `ik-orient-without-goal`
  join two influence rules in `GOAL_WEIGHT_RULES`, one record per key (rule ids, phrase its refusal
  names it by, domain, contract classifier), so placement and classification one rule each, not one
  per key. Influence messages byte-identical to what they were. `validateGoalInfluence` renamed
  `validateGoalWeights`.
- **A 3D goal weight on a bone no solver reads is refused.** Node binding no solver anywhere: rules
  keep narrowing `ik-weight-without-solver` makes, because load holds no registry, cannot tell 2D
  goal weight from another plugin's own key. Under 3D member group (`declaresJoint`, today `fk3d`)
  vocabulary is contract's, so `fk3d` `orient` or `influence` there refused as
  `ik-{orient,influence}-without-goal`, "which did not bind its solver". First checkpoint loaded it
  clean, ignored it; `TH-107` red without fix.
- **The no-orient path allocates nothing.** `orientLeaves3d` tests `some` before filters, so chain
  with no orientation goal returns input without building array.

## What is withdrawn

- Full orientation on leaf with length: every rotation but roll moves tip, breaking position priority
  and reported residual.
- Orientation residual in `inspection`: record's shape shared with 2D (ADR-109, ADR-120), describes
  position solve.
- Reporting roll joint holds off as `atBound`: quality describes position; orientation is weighted
  preference applied after it, no residual of its own.
- Animated `orient`: static like `influence`; live value-tier write still reaches solve every tick
  (`TH-109`).
- Refusing `orient` on hinge leaf at load: step reads it; hinge about bone's own +x does roll; hinge
  about any other axis keeps orientation its direction fixes (`TH-99`, `TH-110`).
- Folding step into rendered frame through `rest` and `weight`: makes step second owner of `fk3d`'s
  blend; gives weight-0 leaf orientation it cannot render.

## Consequences

`fk3d` claims `influence` and `orient`, `plugin-unknown-key` before. Value-tier write of
already-authored `orient` or `influence` is mask, read on next solve without rerunning load; live
value outside domain reads as absent, so live `orient` of `2` publishes position solve
([LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md)). Value-tier write reaches only key track authors, so rig
wanting to fade orientation in authors `orient: 0`, which loads and publishes position solve itself.
Nothing 3D exported; issue #500 phase 8 is public surface.

## Evidence

- `TH-96` to `TH-101`, `TH-108` and `TH-110` (`unit/plugins/ik3d-orient.test.ts`): no-orient identity;
  roll-only turning with tip, residual, quality, ancestors unmoved; whole turning of zero-length leaf;
  joint re-limiting (swing-twist caps roll, cone keeps it, hinge keeps one degree of freedom about +z,
  +x and arbitrary axis); reader domains; influence in tree compromise; two oriented leaves of
  branched tree with pivot offsets.
- `TH-102` to `TH-104` and `TH-107` (`unit/graph/ik3d-goal-weights-load.test.ts`): malformed,
  misplaced, unaddressed, no-solver refusals; 2D rigs unaffected.
- `TH-105`, `TH-106` and `TH-109` (`integration/ik3d-orient.test.ts`): `Engine` orientation with
  forward, reverse, random scrubs; weighted branched compromise; live `orient` writes held byte for
  byte against authored publication.
- 2D identity, sandbox: 1,840 solves hash to `7e514e48…` on `7ee6980` and this change. 3D two-bone:
  4,000 closed-form solves `22b3680e…`. 3D tree: 1,380 solves `7e3cf790…`. All equal.
- Nine mutations of step and rules all killed in sandbox. Sandbox TypeScript 5.8.3 reports no error
  outside base set. Reviewed, not trusted; `CI` on pull request head is evidence.
