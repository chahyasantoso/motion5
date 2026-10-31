# ADR-118: 3D pole target

**Status:** Accepted, 2026-09-27, as part of the public 3D contract
([ADR-125](./ADR-125-public-3d-api.md)); landed through #505 (`main` at `154d271f`).
Proposed as issue [#500](https://github.com/chahyasantoso/motion5/issues/500) phase 3,
2026-09-25, on `feat/500-phase-3` (pull request #505), above `main` at
`7bd3c3d022a1b9ce5f75ecc5b32c0ddcfbc6dbb4`, where the phase 2 pivot offsets of
[ADR-117](./ADR-117-3d-pivot-offsets.md) landed through #503.

## Invariant

Internal `ik3d` solver may bind optional `pole` requirement slot: world-space point chain's elbow bends toward.
Bound + off line from effective root pivot to goal → bend plane = plane through pivot, goal, pole, elbow on pole's side
of line. None bound, or bound pole on that line → bend plane = ADR-114's root-local +z rule with +y fallback, byte for
byte. Solve stays pure function of root, members, goal, pole → animating pole reproduces every byte on reverse or
random seek. `pole` bound where no chain reads it refused at load by exactly one rule.

## Context

ADR-114 fixed bend plane with no authored control: normal root-local +z with component along root-to-goal direction
removed, root-local +y where that vanishes. Deterministic, not choice author can make, singular line no continuous rule
can remove → rig whose goal sweeps through root's local z axis flips elbow there. Every DCC tool answers same question
with pole target, scene point knee or elbow points at. ADR-114 withdrew authored pole because it "would require a new
graph input and ownership vocabulary". Measured against tree as stands, it does not: requirement slot already graph
input, delivered on derived edge, declared per plugin, refused by name by registry under plugin not declaring it
(ADR-044). One question existing vocabulary does not answer: where declared pole was bound — only new rule.

## Decision

`ik3d-analytic.ts` owns pole. `Pole3d` closed union `unbound | point`, shared frozen `UNBOUND_POLE3D`. `readPole3d`
reads absent slot as `unbound`, anything else through `readFrame3d` → non-finite coordinate reads as zero exactly as
goal's; `solveTwoBone3d` takes pole as optional fifth argument defaulting `UNBOUND_POLE3D`, re-reads bound one component
by component through `readNumber` as it re-reads every other direct input. Both unions read by `switch` ending in
`unreachable` (ADR-092).

Bend normal one owner, `bendNormalOf`, returning closed union `BendNormal3d = authored-pole | default-pole |
pole-on-line`. `unbound` = `default-pole`. `point` computes `normal = e1 x (pole - base)`, `base` = effective root
pivot of ADR-117, `e1` = unit pivot-to-goal direction; length = pole's distance from line → pole `pole-on-line` when
length at most `BEND_LINE_TOLERANCE` (`1e-9`) of pivot-to-pole distance, else `authored-pole` carrying unit normal.
`bendBasis` reads union exhaustively: `authored-pole` takes its normal, `default-pole` and `pole-on-line` take
`defaultNormal` — ADR-114 rule unchanged. `e2 = normal x e1` then pole's own side of line → triangle arm's positive
branch bends toward pole. `BEND_LINE_TOLERANCE` one relative threshold both rules read — both ask whether reference
direction has component off line.

Pole = position → joins magnitude policy of ADR-111 and `ik-scale.ts`: bound pole's three coordinates counted in
world-unit magnitude list, scaled with rig when rig solves as power-of-two image; unbound contributes nothing — keeps
every unbound rig on phase 2 bytes, huge included.

`ik3d.ts` declares slot, reads `inputs[POLE_SLOT]`. `contract/solver-shape.ts` owns `POLE_SLOT` + `declaresPole(plugin)`
— solver plugins declaring slot, today `ik3d` alone. Graph holds no plugin registry (ADR-044) → cannot ask plugin
definition which slots declared; set stated beside chain-shape table not as field of it — which slots solver reads not
shape of chain it solves — `TH-47` holds it equal to every plugin definition under `src/plugins`.

`graph/solver-constraints.ts` adds `ik-pole-without-chain`, registered in `rule-id.ts`, `rule.ts`. For each plugin under
which node bound `pole`, speaks only when that plugin declares slot and same group bound no `root` on same node. Solve
reading pole = composer of group whose `root` edge makes node solver → such pole bends nothing; shape author reaches for
by mistake = `ik3d` group on elbow member holding only pole, refused by name at
`<node>.keyframes.<plugin>.requires.pole` instead of loading then throwing from that group's composer every tick. Pole
under plugin declaring none — `fk3d`, 2D `ik` — registry's `plugin-unknown-requirement`, never this rule as well: one
mistake, one rule.

## What is withdrawn

- ADR-114's withdrawal of authored pole key reversed not widened: pole requirement slot not key, only vocabulary needed
  one load rule.
- Making `pole` field of `SolverChainShape` withdrawn. Chain-shape table answers which chains solver solves; which slots
  it reads different question — folding in gives table two owners' answers in one record.
- Reporting pole under non-declaring plugin as `ik-pole-without-chain` withdrawn. First cut did — two rules on one
  mistake, graph's rule pre-empting registry's; rule now reads `declaresPole` first.
- Pole-on-line diagnostic withdrawn. Collinearity runtime fact of animated positions not authored shape → falls back to
  default rule deterministically, exactly as ADR-114's singular line falls back to +y.
- Pole as normal or root-local space withdrawn. Author places scene point; normal is what default rule names only because
  root-local axis cannot know goal.
- `flip` key beside pole withdrawn. Pole already names side → flip second way stating same choice; planar case covered by
  placing pole either side (`TH-46`).
- Deriving pole set from plugin definitions at load withdrawn this phase: graph has no registry to read from, giving it
  one = ADR-044's boundary not pole question. Set pinned by test instead; future plugin declaring `pole` joins in same
  change.

## Consequences

3D two-bone rig chooses elbow side, crosses ADR-114's singular line without flip. Unbound rig publishes exactly phase 2
bytes. No 2D source changes, no package export added → `ik3d` stays internal. `ik3d-analytic.ts` 18,090 bytes,
`graph/solver-constraints.ts` 14,334, `contract/solver-shape.ts` 5,770, `ik3d.ts` 3,967 — all below 30,000-byte
sister-document line.

Collinear threshold comparison of computed values, `|e1 x (pole - base)|` against `1e-9
|pole - base|` → pole within
rounding of exactly `1e-9` relative distance from line can classify either way depending on rig's frame; neither side of
boundary contract, both sides finite, deterministic, on goal. Contract: two arms either side are authored plane and
default plane, pole on line exactly = default (`TH-43`).

## Evidence

- `TH-40` reader + direct caller's re-read: absent = `unbound`, non-finite coordinates read as zero.
- `TH-41` unbound byte identity, direct and through plugin.
- `TH-42` closes 2,000 seeded offset rigs with arbitrary root orientation on goal, elbow in pole plane on pole's side.
- `TH-43` pole on line publishes unbound bytes; `TH-44` pole on default side publishes default pose.
- `TH-45` huge pole solves as scaled image, far pole on small rig stays finite.
- `TH-46` planar poles either side equal 2D `solveTwoBone` with `flip` false and true.
- `TH-47` load rule speaks for elbow-member mistake and only there; pole under `fk3d` or 2D `ik` =
  `plugin-unknown-requirement` alone; contract's pole set equals plugin definitions declaring slot.
- `TH-48` animates pole through `Engine` + DOM adapter: elbow flips, both ends close on goal, seeking back reproduces
  every byte.
- `TH-49` same through whole `Engine` load caller receives: each misplaced pole refuses load under exactly one rule id.
- `TH-50` solver addressing leaf through `targets` bends toward pole on both sides.
- `TH-51` unbound pole keeps ADR-114's projected root-local +z down to `1e-9` line tolerance: goals leaning off axis by
  `1e-4`, `1e-6`, `1e-8` bend elbow to -x in own plane, only line itself takes `TH-18`'s +y fallback.
- Sandbox mutation pass over 14 mutants (`tools/mutate/phase3-cp3.json` in handover, against pole unit + 3D integration
  files): 12 killed. `unbound-counts-origin` survives as equivalent mutant — counting origin adds zero to maximum of
  magnitudes. `default-tolerance-shifted` (ADR-114's default-rule threshold `1e-9` → `1e-3`) survived that pass, no case
  placed goal that close to root-local z axis. `TH-51` now does, relative leans `1e-4`, `1e-6`, `1e-8`, kills it
  (`tools/mutate/phase3-cp4.json`, next handover). Companion mutant dropping threshold to `0` survives: projected pole of
  goal exactly on axis exactly zero → thresholds differ only within rounding of line, boundary kind Consequences already
  decline to make contract for authored pole.
- Sandbox byte-identity probe: 290,000 seeded unbound, zero-offset, collinear-pole cases against phase 2 tip, zero
  mismatches, collinear poles 50,000 of 50,000 byte-identical. Ran against source this ADR describes; commits after it
  change tests and records only.
- `CI` run 36143222650 on `1c8b3ace8a586c39dc8c9f42e2670fcba427cf3d` refused three test lines of `ik3d-pole.test.ts` under
  `exactOptionalPropertyTypes`, no source, timed `LF-16` out at 5,000 ms default with no offender; both fixed in commits
  following. `CI` run 36147490749 on `f8e2fc9e9767150bab67db9d1f2cae02ce29d463` — head carrying those fixes, `TH-49`,
  `TH-50`, this record — green on all seven jobs, `quality` among them with `typecheck`, `format:check`, full suite.
  `TH-51` and this paragraph arrive after that run → run on head carrying them is evidence, named in pull request body.
- Independent quality pass recorded as comment on #505 not here. Every result above other than `CI` sandbox measurement,
  reviewed not trusted.
