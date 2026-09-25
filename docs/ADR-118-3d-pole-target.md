# ADR-118: 3D pole target

**Status:** Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 3,
2026-09-25, on `feat/500-phase-3` (pull request #505), above `main` at
`7bd3c3d022a1b9ce5f75ecc5b32c0ddcfbc6dbb4`, where the phase 2 pivot offsets of
[ADR-117](./ADR-117-3d-pivot-offsets.md) landed through #503. Accepted when #505 merges.

## Invariant

An internal `ik3d` solver may bind an optional `pole` requirement slot: a world-space point the
chain's elbow bends toward. When one is bound and it is off the line from the effective root pivot
to the goal, the bend plane is the plane through the pivot, the goal and the pole, and the elbow
lies on the pole's side of that line. When none is bound, or the bound pole lies on that line, the
bend plane is ADR-114's root-local +z rule with its +y fallback, byte for byte. The solve stays a
pure function of root, members, goal and pole, so a pole that animates reproduces every byte on a
reverse or random seek. A `pole` bound where no chain reads it is refused at load by exactly one
rule.

## Context

ADR-114 fixed the bend plane with no authored control: the normal is root-local +z with its
component along the root-to-goal direction removed, and root-local +y where that vanishes. That is
deterministic, but it is not a choice an author can make, and it has a singular line no continuous
rule can remove, so a rig whose goal sweeps through the root's local z axis flips its elbow there.
Every DCC tool answers the same question with a pole target, a point in the scene the knee or elbow
points at. ADR-114 withdrew an authored pole because it "would require a new graph input and
ownership vocabulary". Measured against the tree as it stands, it does not: a requirement slot is
already a graph input, delivered on a derived edge, declared per plugin and refused by name by the
registry under any plugin that does not declare it (ADR-044). The one question the existing
vocabulary does not answer is where a declared pole was bound, and that is the only new rule.

## Decision

`ik3d-analytic.ts` owns the pole. `Pole3d` is the closed union `unbound | point`, with a shared
frozen `UNBOUND_POLE3D`. `readPole3d` reads an absent slot as `unbound` and anything else through
`readFrame3d`, so a non-finite coordinate reads as zero exactly as a goal's does; `solveTwoBone3d`
takes the pole as an optional fifth argument that defaults to `UNBOUND_POLE3D` and re-reads a bound
one component by component through `readNumber`, as it re-reads every other direct input. Both
unions are read by `switch` statements that end in `unreachable` (ADR-092).

The bend normal has one owner, `bendNormalOf`, which returns the closed union `BendNormal3d =
authored-pole | default-pole | pole-on-line`. `unbound` is `default-pole`. A `point` computes
`normal = e1 x (pole - base)`, where `base` is the effective root pivot of ADR-117 and `e1` the unit
pivot-to-goal direction; its length is the pole's distance from the line, so the pole is
`pole-on-line` when that length is at most `BEND_LINE_TOLERANCE` (`1e-9`) of the pivot-to-pole
distance, and `authored-pole` carrying the unit normal otherwise. `bendBasis` reads the union
exhaustively: `authored-pole` takes its normal, and both `default-pole` and `pole-on-line` take
`defaultNormal`, the ADR-114 rule unchanged. `e2 = normal x e1` is then the pole's own side of the
line, so the triangle arm's positive branch bends toward the pole. `BEND_LINE_TOLERANCE` is the one
relative threshold both rules read, because both ask whether a reference direction has any component
off the line.

A pole is a position, so it joins the magnitude policy of ADR-111 and `ik-scale.ts`: a bound pole's
three coordinates are counted in the world-unit magnitude list and scaled with the rig when the rig
solves as its power-of-two image, and an unbound pole contributes nothing, which is what keeps every
unbound rig on its phase 2 bytes, huge ones included.

`ik3d.ts` declares the slot and reads it as `inputs[POLE_SLOT]`. `contract/solver-shape.ts` owns
`POLE_SLOT` and `declaresPole(plugin)`, the set of solver plugins that declare the slot, today
`ik3d` alone. The graph holds no plugin registry (ADR-044), so it cannot ask a plugin definition
which slots it declares; the set is stated beside the chain-shape table rather than as a field of
it, because which slots a solver reads is not a shape of the chain it solves, and `TH-47` holds it
equal to every plugin definition under `src/plugins`.

`graph/solver-constraints.ts` adds `ik-pole-without-chain`, registered in `rule-id.ts` and
`rule.ts`. For each plugin under which a node bound `pole`, it speaks only when that plugin declares
the slot and the same group bound no `root` on the same node. The solve that reads a pole is the
composer of the group whose `root` edge makes the node a solver, so such a pole bends nothing; the
shape an author reaches for by mistake is an `ik3d` group on the elbow member holding only the pole,
and it is refused by name, at `<node>.keyframes.<plugin>.requires.pole`, instead of loading and then
throwing from that group's composer on every tick. A pole under a plugin that declares none, `fk3d`
or the 2D `ik`, is the registry's `plugin-unknown-requirement` and never this rule as well: one
mistake, one rule.

## What is withdrawn

- ADR-114's withdrawal of an authored pole key is reversed rather than widened: the pole is a
  requirement slot, not a key, and the only vocabulary it needed is one load rule.
- Making `pole` a field of `SolverChainShape` is withdrawn. The chain-shape table answers which
  chains a solver solves; which slots it reads is a different question, and folding it in would give
  the table two owners' answers in one record.
- Reporting a pole under a non-declaring plugin as `ik-pole-without-chain` is withdrawn. The first
  cut did, which put two rules on one mistake and let the graph's rule pre-empt the registry's; the
  rule now reads `declaresPole` first.
- A pole-on-line diagnostic is withdrawn. Whether a pole is collinear is a runtime fact of animated
  positions, not an authored shape, so it falls back to the default rule deterministically instead,
  exactly as ADR-114's singular line falls back to +y.
- A pole expressed as a normal, or in root-local space, is withdrawn. An author places a point in
  the scene; a normal is what the default rule names only because a root-local axis cannot know the
  goal.
- A `flip` key beside the pole is withdrawn. The pole already names a side, so a flip would be a
  second way to state the same choice, and the planar case is covered by placing the pole on either
  side (`TH-46`).
- Deriving the pole set from plugin definitions at load is withdrawn for this phase: the graph has
  no registry to read them from, and giving it one is ADR-044's boundary, not a pole question. The
  set is pinned by a test instead, and a future plugin that declares `pole` joins it in the same
  change.

## Consequences

A 3D two-bone rig can now choose its elbow side and cross ADR-114's singular line without a flip. An
unbound rig publishes exactly the phase 2 bytes. No 2D source changes and no package export is
added, so `ik3d` stays internal. `ik3d-analytic.ts` is 18,090 bytes, `graph/solver-constraints.ts`
14,334, `contract/solver-shape.ts` 5,770 and `ik3d.ts` 3,967, all below the 30,000-byte
sister-document line.

The collinear threshold is a comparison of computed values, `|e1 x (pole - base)|` against `1e-9
|pole - base|`, so a pole placed within rounding of exactly `1e-9` of relative distance from the
line can classify either way depending on the rig's frame; neither side of that boundary is a
contract, and both sides are finite, deterministic and on the goal. What is a contract is that the
two arms either side of it are the authored plane and the default plane, and that a pole on the line
exactly is the default (`TH-43`).

## Evidence

- `TH-40` proves the reader and the direct caller's re-read: absent is `unbound`, non-finite
  coordinates read as zero.
- `TH-41` proves unbound byte identity, direct and through the plugin.
- `TH-42` closes 2,000 seeded offset rigs with arbitrary root orientation on the goal and puts the
  elbow in the pole plane on the pole's side.
- `TH-43` proves a pole on the line publishes the unbound bytes; `TH-44` a pole on the default side
  publishes the default pose.
- `TH-45` proves a huge pole solves as the scaled image and a far pole on a small rig stays finite.
- `TH-46` proves planar poles on either side equal 2D `solveTwoBone` with `flip` false and true.
- `TH-47` proves the load rule speaks for the elbow-member mistake and only there, that a pole under
  `fk3d` or 2D `ik` is `plugin-unknown-requirement` alone, and that the contract's pole set equals
  the plugin definitions that declare the slot.
- `TH-48` animates a pole through `Engine` and the DOM adapter: the elbow flips, both ends close on
  the goal, and seeking back reproduces every byte.
- `TH-49` proves the same through the whole `Engine` load a caller receives: each misplaced pole
  refuses the load under exactly one rule id.
- `TH-50` proves a solver that addresses its leaf through `targets` bends toward its pole on both
  sides.
- `TH-51` proves an unbound pole keeps ADR-114's projected root-local +z down to the `1e-9` line
  tolerance: goals leaning off the axis by `1e-4`, `1e-6` and `1e-8` bend the elbow to -x in their
  own plane, and only the line itself takes the +y fallback of `TH-18`.
- Sandbox mutation pass over 14 mutants (`tools/mutate/phase3-cp3.json` in the handover, run against
  the pole unit and 3D integration files): 12 killed. `unbound-counts-origin` survives as an
  equivalent mutant, since counting the origin adds zero to a maximum of magnitudes.
  `default-tolerance-shifted`, which moves ADR-114's default-rule threshold from `1e-9` to `1e-3`,
  survived that pass because no case placed a goal that close to the root-local z axis. `TH-51`
  now does, at relative leans of `1e-4`, `1e-6` and `1e-8`, and kills it
  (`tools/mutate/phase3-cp4.json`, next handover). A companion mutant that drops the threshold to
  `0` survives: the projected pole of a goal exactly on the axis is exactly zero, so the two
  thresholds differ only within rounding of the line, a boundary of the kind the Consequences
  already decline to make a contract for the authored pole.
- The sandbox byte-identity probe compared 290,000 seeded unbound, zero-offset and collinear-pole
  cases against the phase 2 tip and reported zero mismatches, collinear poles 50,000 of 50,000
  byte-identical. It ran against the source this ADR describes; the commits after it change tests
  and records only.
- `CI` run 36143222650 on `1c8b3ace8a586c39dc8c9f42e2670fcba427cf3d` refused three test lines of
  `ik3d-pole.test.ts` under `exactOptionalPropertyTypes` and no source, and timed `LF-16` out at the
  5,000 ms default with no offender; both are fixed in the commits that follow it. `CI` run
  36147490749 on `f8e2fc9e9767150bab67db9d1f2cae02ce29d463`, the head carrying those fixes, `TH-49`,
  `TH-50` and this record, is green on all seven jobs, `quality` among them with `typecheck`,
  `format:check` and the full suite. `TH-51` and this paragraph arrive after that run, so the run on
  the head that carries them is the evidence for them, named in the pull request body.
- The independent quality pass is recorded as a comment on #505 rather than here. Every result above
  other than `CI` is a sandbox measurement, reviewed rather than trusted.
