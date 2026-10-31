# ADR-110: Goal influence and conflict policy

**Status:** Accepted, 2026-09-24. Issue [#349](https://github.com/chahyasantoso/motion5/issues/349)
phase 5, squash-merged from [#486](https://github.com/chahyasantoso/motion5/pull/486) as `7e6f4edc`.
Phase 6 is [ADR-111](./ADR-111-stability-and-determinism.md).

**Superseded by [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md), 2026-10-29.** Identified tables and records with an explicit `PluginCatalog` are the one supported contract; the grouped machinery this record describes is deleted.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** **Load rules and scope**
passage saying flat spelling is in scope when node binds a solver no longer holds for authored input. Only
grouped `values.influence` reaches `resolveSolvers`; ungrouped spelling is `keyframes-ungrouped-key` → flat
branch unreachable from authored input.

**Extended by [ADR-124](./ADR-124-3d-goal-influence-and-end-effector-orientation.md), 2026-09-27.**
Influence read on addressed `fk3d` leaf too, same `readInfluence` + `branchPulls`; its two load rules now
stated with 3D `orient` rules over one `GOAL_WEIGHT_RULES` table, byte-identical messages.
`validateGoalInfluence` that **Evidence** names is now `validateGoalWeights`.

## Context

Branching IK solve can ask one shared member support several goals. Phase 4 made solve quality inspectable,
equal branch average still implicit policy: each branch one vote, without saying whether vote represented one
goal, a branch, or bone's FK blend weight. Goal's intent belongs inside solve, FK member weight belongs to
later composition of solved rotation with authored pose. Must not conflate.

Phase 4 rotation contract also has compatibility requirement. Adding intent must not make unweighted rig take
numerically equivalent but bit-different path. Caller not authoring influence must receive phase 4 rotations
exactly; caller authoring it needs rule total for every shared-member compromise, and inspection result
explaining which goals paid for remaining miss.

## Decision

Chain member may author `influence` as static finite number > 0. It is weight of goal addressed by that
member's leaf when branches disagree about shared member. Runtime default exactly `1`.

Shared member: pull of branch = mean influence of addressed leaves in branch's subtree. Compromise of branch
proposals = weighted mean `Σw·p/Σw`, `p` proposal point, `w` that branch's pull. Branch with no addressed leaf
contributes default pull, as unweighted solve did. Mean deliberate: branch's say = what its goals want, not
how many addressed leaves happen under it.

Compromise also measures witness: spread = greatest distance from settled point to any proposal. FABRIK
classifies `conflicted` when final residual outside tolerance and last inward pass left spread outside
tolerance. One function, `iterativeQuality` in `fabrik.ts`, owns naming for every FABRIK outcome in one order:
`limited` for miss with any joint at bound, then `converged` within tolerance, then `conflicted` for spread
strictly above `FABRIK_TOLERANCE`, then `stalled`, then `iteration-cap`. Spread exactly at tolerance is not
conflict — same strict bound residual judged by. Means branches still disagreed about shared member; does not
claim no pose exists, FABRIK not global solver. Result carries residual for every addressed leaf in canonical
member order → caller sees which goal paid for compromise while `quality.residual` stays worst of those.

Unweighted rig publishes phase 4 rotations bit for bit. Every influence at default → every pull exactly `1` →
weighted sums and divisor are old equal-average sums and count. Equal non-default influences produce equal
mean up to ordinary floating-point rounding. Lone goal's influence = its whole share → no effect on
single-goal chain. Normalisation, not field accepted and ignored: one proposal settles at itself because
`(w·p)/w` same point, implementation deliberately uses unit divisor for lone proposal to preserve phase 4
arithmetic exactly.

Both means taken relative to largest weight — unchanged in exact arithmetic, total in floating point. Every
admitted influence finite, but sum of admitted influences need not be: two leaves at `Number.MAX_VALUE`
overflow `Σv` to `Infinity` → compromise would settle shared member on `Infinity / Infinity` = `NaN`. Branch
pull therefore `max · (Σ(v / max) / n)` over addressed leaves under it, compromise weighs each proposal by
`w / max` over proposals it settles. Each ratio ≤ 1, largest exactly 1 → every sum finite, every divisor ≥ 1.
Every influence at default → scale `1`, both formulas old ones bit for bit.

Closed result union now nine kinds: `reached`, `too-far`, `too-near`, `coincident`, `converged`, `stalled`,
`iteration-cap`, `conflicted`, `limited`. Inspection adds frozen `residuals` beside existing fixed-shape
fields, `conflicted` kind carries same iterative `iterations` + `residual` fields as other FABRIK kinds.

## Ownership

Split by question, not by path that happens to call it:

- `packages/core/src/plugins/ik-goal.ts` owns `DEFAULT_INFLUENCE`, influence reader, branch pulls, weighted
  compromise, its spread witness, goal-influence policy.
- `packages/core/src/contract/solver-constraints.ts` owns `influence` key, finite-positive domain, authored
  static-versus-animated classification.
- `packages/core/src/graph/solver-constraints.ts` owns two load rules, their authored spelling and scope
  checks.
- `resolveSolvers` in `packages/core/src/graph/ir.ts` owns `GoalScope`, computes each member's goal reach after
  goal resolution; rule module does not re-derive leafhood or addressing.
- `packages/core/src/plugins/ik-result.ts` owns `SolveResult`, nine-kind `SolveQuality` union, inspection
  projection including copied and frozen `residuals` record.
- `packages/core/src/plugins/fk.ts` claims `influence` because author writes it on member, but FK never reads
  it. Solve reads through delivered member values; FK keeps composition and separate `weight` question.

## Load rules and scope

Rules: `ik-influence-malformed`, `ik-influence-without-goal`. Malformed influence = not static finite number
> 0, animated value included. Value in right domain still refused when placement gives no addressed goal a
meaning.

Load pass reads every authored spelling because runtime reads flattened values bag. Flat spelling in scope when
node binds solver somewhere. Grouped spelling in scope only under group that bound node's `solver` slot.
Spelling under group that did not bind `solver` first refused as `ik-influence-without-goal`; value not
classified, placement is first error. On node binding no solver at all pass does nothing: no registry to
distinguish FK's `influence` from another plugin's key → must not refuse bystander key.

`resolveSolvers` builds `GoalScope` once, after resolving each solve's goals. `addressed` = solve reaches goal
through that member's leaf, `unaddressed` = provably does not, `undecided` = goal resolution not safe to
classify. Broken chain, solver with no goal, both goal spellings, bare target over several leaves, missed or
duplicate dict goal, refused goal → members undecided. Member absent from scope also undecided. Undecided
members not reported as `ik-influence-without-goal`: existing diagnostic already owns that unresolved cause,
one cause never reported twice.

Member in several solves → `GoalScope` combines answers with precedence `undecided` over `addressed` over
`unaddressed`. Keeps unresolved chain from being spoken over, accepts placement when any resolved solve
actually reads it. Influence rule therefore about placement + reach, not duplicating goal derivation in
validator.

## Measurement that changed the design

Measurement of 20,000 rigs, taken while source drafted, showed iteration outcome could not classify goal
conflict. Multi-goal rigs with reachable-by-construction goals: 4,899 ended at iteration cap
(`FABRIK_MAX_ITERATIONS`, 64), 203 stalled, 4,898 converged. Random goals: 7,031 stalled, 2,865 reached cap.
Stall and cap describe FABRIK's progress, not whether branches disagree. Random-goal misses had
fifth-percentile branch spread 27 units → policy uses last-pass spread witness rather than guessing conflict
from stall or cap.

## Withdrawn

**Strict priorities withdrawn.** Priority would promise one goal met exactly, later goal receives only
remaining freedom. FABRIK has no null-space projection → strict priority either approximation with unowned
failure mode, or second solver. Weighted compromise states achievable policy instead.

**Influence dictionary on solver withdrawn.** Influence is goal's intent, authored on addressed leaf, not
solver-level setting needing second key-to-leaf mapping. Member key is one place author already names
goal-bearing bone.

**Summing influence withdrawn.** Sum gives branch more say merely because more addressed leaves under it. Mean
says what branch's goals want, preserves default pull `1` for unweighted rig.

**Classifying conflict from stall or cap withdrawn.** Measurement above shows neither witness of branch
disagreement. Classification reads last inward-pass spread instead.

## Evidence

`packages/core/test/unit/plugins/ik-goal-influence.test.ts` pins phase `GI-1` to `GI-12`: `GI-1` compromise
(equal weights reproduce old `sum / count` bit for bit, `-0` normalised, weighted mean, lone proposal weighed
`1`, spread), `GI-2` mean rather than summed branch pulls, `GI-3` influence domain and omission from member
record, `GI-4` symmetric unlimited two-branch rig moving toward goal whose influence rose while explicit equal
influences stay byte-identical to none, `GI-5` unweighted FABRIK rotations `Object.is`-identical to same rig
with influence stripped, `GI-6` per-leaf residuals in canonical order, one entry on closed form,
`quality.residual` their maximum, `GI-7` `conflicted` against reachable multi-goal rig, single-chain stall,
limited miss, `GI-8` opted-in inspection through engine with unchanged unopted patch, `GI-9`
`ik-influence-malformed` beside accepting direction in same rig, `GI-10` `ik-influence-without-goal` on
non-leaf and under group that did not bind solver, `GI-11` no second report over broken chain, leaf dict
missed, goal on non-leaf, `GI-12` bystander exemption, bare `target` placement, `fk` key claim. Quality pass
on pull request added `GI-13` (extreme finite influences `Number.MAX_VALUE` and `Number.MIN_VALUE` publish
finite rotations and residuals, equal extremes publish unweighted rotations exactly), `GI-14`
(`iterativeQuality` at exact tolerance boundaries, in precedence order), `GI-15` (branching miss with joint at
bound is `limited` not `conflicted`, through real solve), `GI-16` (`GoalScope` precedence over every ordered
pair of reaches). `IR-7`, `IN-1`, `IN-6`, `IN-9`, `N-7` updated for new result and inspection shape and new key.

Failing-first, by mutation in sandbox harness: weighing every proposal `1` fails `GI-1`, summing pulls fails
`GI-2`, dropping `conflicted` arm fails `GI-7`, dropping residual entries fails `GI-6`, dropping
`validateGoalInfluence` fails `GI-9`, dropping `influence` from `fk.keys` fails `GI-12`. Summing raw weights
again fails `GI-13`; judging spread with `>=` or against `0`, or naming `conflicted` before `limited`, fails
`GI-14` and `GI-15`; swapping any two `GoalScope` precedence ranks fails `GI-16`.

Corpus, 200,000 seeded rigs (arity 1 to 8, 1 to 4 leaves, offsets, limits, reachable and random goals, master
seed `0x3495e349`), phase 5 against phase 4 at `2d8ac606`: unweighted `solveChain` rotations
`Object.is`-identical on 200,000; unopted `ik` patch identical on 200,000; opted-in rotations identical on
200,000 with 0 inspection-shape violations (`residuals` keys exactly addressed leaves in canonical order,
`residual` their maximum); explicit influence `1` on every leaf identical to none on 200,000. Opted-in kinds
migrated only `stalled` to `conflicted` (5,446) and `iteration-cap` to `conflicted` (2,895), all multi-goal
rigs. Among multi-goal rigs `conflicted` 9.51% for reachable-by-construction goals, 16.06% for random goals.
Mean solve time moved 194.5 → 204.6 microseconds per rig in same process, generation included — directional,
not benchmark.

Influence = bias on each compromise, not guarantee about final pose. Raising one leaf's influence tenfold did
not increase that leaf's residual on 79.8% of 66,648 multi-goal rigs; of rigs where it did, most carried joint
limit (moves pose along bound rather than toward either goal), and on 1,847 multi-goal rigs with no limit it
rose by more than tolerance and 1% on 177. FABRIK's heuristic iteration — why `GI-4` asserts direction on
symmetric unlimited rig only, why nothing here promises monotonicity.

Corpus ran in sandbox esbuild bundle without `tsc`, reviewed rather than trusted. `CI` on published head of
pull request is authority, pull request links it.

## Issue #490 decision (2026-09-25)

Feasible tree may still settle at fixed point: inward centroid can lie inside parent reach circle, outward
projection then reproduces centroid. Minimal repro on issue stalls with `m0`'s tip at norm exactly 20, two
branch proposals averaging to point of norm `19.6133249073`, outward pass projecting that average back onto tip
it started from. Kind honest (`conflicted`); compromise rule what is weak.

**Compromise rule closed union owned here**, `CompromiseRule = "centroid" | "reach-circle"`, read by one
exhaustive `switch` in `compromise` ending in `unreachable` (ADR-092). `centroid` = historical rule and default
→ caller naming no rule settles exactly where always did. `reach-circle` = fixed six-step damped Gauss-Newton
fit seeded at that same centroid.

**Proposal closed union too.** `Pull` is `{ kind: "goal", point, weight }` or
`{ kind: "branch", point, weight, reach: { centre, radius } }`, `reachCircleOf` reads exhaustively, no reader
probes optional field. `goal` pull = addressed leaf's aim, only proposal a leaf receives (goal read only on
leaf); its reach circle is aim itself at radius `0`. `branch` pull = child's proposal about base's tip. FABRIK
builds both halves from one conversion: `point` = child's placed pivot un-offset through base's current
direction (`baseTipFromPivot`), `reach.centre` = child's current tip un-offset through same direction, at
`reach.radius` child's solve length. Circle exactly set of base tips keeping child's tip where inward pass left
it and length held, pivot offset included; `point` lies on it by construction.

Fit minimises `Σ (w_i / max w) · (|p − centre_i| − radius_i)²` over member's tip `p`. **Weights normalised by
largest pull, exactly as centroid normalises**: every relative weight in `(0, 1]`, largest `1`, normal
equations stay finite for pulls near `Number.MAX_VALUE`, scaling every influence by one factor changes neither
rule's answer. Lone pull settles on own proposal exactly, as under centroid. Centre coinciding with current
point takes positive x axis for Jacobian row. Damping (`1e-6`) and step count fixed → cost and answer fixed.
Singular system, non-finite step, or final objective not strictly improving centroid's → keeps centroid, so fit
never worse than its seed under own objective. Proposal spread still measured around centroid not fitted point →
`conflicted` keeps one witness whichever rule placed member.

**Selector** (`fabrik-select.ts`) runs authored seed with centroid rule first. Every non-`conflicted` result
returned as same object → every rig not conflicting before is bit-identical and pays nothing. Conflict pays for
three fixed alternatives, in order: opposite seed with centroid, authored seed with reach-circle, opposite seed
with reach-circle. One comparator `outranks` selects: `converged` outranks every miss (tier read by exhaustive
`switch` over FABRIK's five kinds), then strictly lower `quality.residual` wins, exact tie keeps earlier
candidate. Comparator total: tier read first → `NaN` residual never crosses tier, within tier ranks below every
number in either position, `Infinity` orders like any number. Finite FABRIK output never produces `NaN`
residual, `converged` cannot carry one because `NaN <= FABRIK_TOLERANCE` false; rule exists so answer cannot
depend on candidate order if that invariant ever broken. No restart metadata published (ADR-107),
`quality.iterations` = selected candidate's own count. Baseline is candidate → selected result never worse than
prior result under comparator.

**Measured** (sandbox, esbuild bundles of real modules, Node `v22.23.1`; reviewed, not trusted): envelope moves
190 → 3 conflicted tree-14 rigs, 200 → 61 tree-30 rigs, no regression, every non-conflicted baseline
`Object.is`-identical. Offset-exact reach circle measured against first implementation's circle (centred on
child's raw tip): agree bit for bit on every rig without pivot offset (every envelope rig), and on feasible
trees with pivot offsets (goals composed from one pose, 200 rigs per shape) exact circle converges 189 against
171 tree-6 rigs (two shared members, four leaves), 105 against 21 tree-14 rigs, 19 against 0 tree-30 rigs, 40
against 18 tree-14 rigs with large offsets — strictly improving 238 rigs, worsening none. On 2,000-rig
adversarial corpus (dominated by infeasible and limited rigs) circles differ on 100 rigs, 44 better, 38 worse
among misses, equal converged counts, neither regresses any rig against pre-#490 solve. `docs/BENCH-IK.md`
carries full numbers.

Four-candidate gate chosen instead of changing FABRIK's ordinary trajectory because it keeps bit identity for
every non-conflicted baseline by construction, not by measurement. Deliberately not promise every feasible tree
converges: 61 of 200 feasible tree-30 rigs, and every independently conflicting rig, remain `conflicted`,
residuals still useful inspection evidence.

**Withdrawn on the way.** Reach circle centred on child's raw tip (first implementation) withdrawn: ignores
child's pivot offset → circle fitted is not constraint FABRIK enforces; measurement above is why. Optional
`childTip` and `childLength` on `Pull` with fallback to centroid when either missing, withdrawn for closed
union: probe on optional fields = predicate chain ADR-092 forbids, fallback hid shape FABRIK never produces.
Ungated best-of, restarts alone, per-branch sequential passes withdrawn on issue for reasons recorded there.

**Evidence.** `FB-17` (issue's minimal repro converges through reach-circle candidate), `FB-18` (opposite-seed
reach-circle result published, loser not), `FB-19` (feasible tree with pivot offset converges through
offset-exact circle; red on raw-tip circle), `FB-20` (comparator's tiers, ties, `NaN`, `Infinity`) in
`packages/plugins/test/unit/fabrik-solve.test.ts`; `GI-17` (weighted objective, shared spread, weight-scale
invariance, both pull kinds, lone pull, keep-the-centroid guard) in `ik-goal-influence.test.ts`; `SD-20`
(no-regression, bit identity, permutation, repeat, interleave over seeded corpus) in `ik-stability.test.ts`;
`EN-5` (envelope quality counts, finite output) in `ik-envelope.test.ts`.

## Consequences

Authors state how much each addressed goal counts when branching solve must compromise, without changing
meaning of FK's per-member blend `weight`. Unweighted rigs retain phase 4 rotations bit for bit. Opted-in
inspection reports fixed quality shape plus frozen per-leaf `residuals`; unopted solver still publishes no
inspection value. Remaining disagreement named `conflicted` with residual record making trade-off visible, while
caller not told stronger unsupported claim that no pose exists.
