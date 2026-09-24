# ADR-110: Goal influence and conflict policy

**Status:** Proposed as issue [#349](https://github.com/chahyasantoso/motion5/issues/349) phase 5,
2026-09-24, against `main` at `2d8ac606` (phase 4, PR #485, ADR-109). Accepted when its pull
request merges.

## Context

A branching IK solve can ask one shared member to support several goals. Phase 4 made the solve's
quality inspectable, but an equal branch average was still an implicit policy: it gave each branch
one vote without saying whether that vote represented one goal, a branch, or a bone's FK blend
weight. The goal's intent belongs inside the solve, while the FK member weight belongs to the later
composition of a solved rotation with an authored pose. They must not be conflated.

The phase 4 rotation contract also has a compatibility requirement. Adding intent must not make an
unweighted rig take a numerically equivalent but bit-different path. A caller that did not author
influence must receive the phase 4 rotations exactly, while a caller that does author it needs a
rule that is total for every shared-member compromise and an inspection result that explains which
goals paid for a remaining miss.

## Decision

A chain member may author `influence` as a static finite number greater than zero. It is the weight
of the goal addressed by that member's leaf when branches disagree about a shared member. The
runtime default is exactly `1`.

For a shared member, the pull of a branch is the mean influence of the addressed leaves in that
branch's subtree. The compromise of the branch proposals is the weighted mean `Σw·p/Σw`, where `p`
is a proposal point and `w` is that branch's pull. A branch with no addressed leaf contributes the
default pull, as the unweighted solve did. The mean is deliberate: a branch's say is what its goals
want, not how many addressed leaves happen to be under it.

The compromise also measures its witness: the spread is the greatest distance from the settled point
to any proposal. FABRIK classifies `conflicted` when the final residual is outside tolerance and the
last inward pass left a spread outside tolerance. One function, `iterativeQuality` in `fabrik.ts`,
owns that naming for every FABRIK outcome in one order: `limited` for a miss with any joint at a
bound, then `converged` within tolerance, then `conflicted` for a spread strictly above
`FABRIK_TOLERANCE`, then `stalled`, then `iteration-cap`. A spread exactly at tolerance is not a
conflict, which is the same strict bound the residual is judged by. This means that the branches
still disagreed about a shared member; it does not claim that no pose exists, because FABRIK is not
a global solver. The result carries a residual for every addressed leaf in canonical member order,
so a caller can see which goal paid for the compromise while `quality.residual` remains the worst of
those residuals.

An unweighted rig publishes the phase 4 rotations bit for bit. With every influence at its default,
every pull is exactly `1`, so the weighted sums and divisor are the old equal-average sums and
count. Equal non-default influences produce the equal mean up to ordinary floating-point rounding.
A lone goal's influence is its whole share, so it has no effect on a single-goal chain. That is
normalisation, not a field accepted and ignored: the one proposal settles at itself because
`(w·p)/w` is the same point, and the implementation deliberately uses a unit divisor for that
lone proposal to preserve the phase 4 arithmetic exactly.

Both means are taken relative to their largest weight, which leaves them unchanged in exact
arithmetic and keeps them total in floating point. Every admitted influence is finite, but a sum of
admitted influences need not be: two leaves at `Number.MAX_VALUE` overflow `Σv` to `Infinity`, and
the compromise would then settle the shared member on `Infinity / Infinity`, which is `NaN`. A
branch pull is therefore `max · (Σ(v / max) / n)` over the addressed leaves under it, and the
compromise weighs each proposal by `w / max` over the proposals it is settling. Each ratio is at
most `1` and the largest is exactly `1`, so every sum is finite and every divisor is at least `1`.
With every influence at its default the scale is `1` and both formulas are the old ones bit for
bit.

The closed result union now has nine kinds: `reached`, `too-far`, `too-near`, `coincident`,
`converged`, `stalled`, `iteration-cap`, `conflicted`, and `limited`. Inspection adds frozen
`residuals` beside its existing fixed-shape fields, and the `conflicted` kind carries the same
iterative `iterations` and `residual` fields as the other FABRIK kinds.

## Ownership

Ownership is split by question rather than by the path that happens to call it:

- `packages/core/src/plugins/ik-goal.ts` owns `DEFAULT_INFLUENCE`, the influence reader, branch
  pulls, the weighted compromise, its spread witness, and the goal-influence policy.
- `packages/core/src/contract/solver-constraints.ts` owns the `influence` key, its finite-positive
  domain, and authored static-versus-animated classification.
- `packages/core/src/graph/solver-constraints.ts` owns the two load rules and their authored
  spelling and scope checks.
- `resolveSolvers` in `packages/core/src/graph/ir.ts` owns `GoalScope` and computes each member's
  goal reach after goal resolution; the rule module does not re-derive leafhood or addressing.
- `packages/core/src/plugins/ik-result.ts` owns `SolveResult`, the nine-kind `SolveQuality` union,
  and the inspection projection, including the copied and frozen `residuals` record.
- `packages/core/src/plugins/fk.ts` claims `influence` because the author writes it on a member,
  but FK never reads it. The solve reads it through the delivered member values; FK continues to
  own composition and its separate `weight` question.

## Load rules and scope

The rules are `ik-influence-malformed` and `ik-influence-without-goal`. A malformed influence is
not a static finite number greater than zero, including an animated value. A value in the right
domain is still refused when its placement gives no addressed goal a meaning.

The load pass reads every authored spelling because the runtime reads the flattened values bag. A
flat spelling is in scope when the node binds a solver somewhere. A grouped spelling is in scope
only under the group that bound that node's `solver` slot. A spelling under a group that did not
bind `solver` is first refused as `ik-influence-without-goal`; its value is not classified, because
placement is the first error. On a node that bound no solver at all, the pass does nothing: it has
no registry with which to distinguish FK's `influence` from another plugin's key, so it must not
refuse a bystander key.

`resolveSolvers` builds `GoalScope` once, after it has resolved each solve's goals. `addressed`
means the solve reaches a goal through that member's leaf, `unaddressed` means it provably does
not, and `undecided` means goal resolution was not safe to classify. A broken chain, a solver with
no goal, both goal spellings, a bare target over several leaves, a missed or duplicate dict goal,
and a refused goal leave members undecided. A member absent from the scope is also undecided.
Undecided members are not reported as `ik-influence-without-goal`, because the existing diagnostic
already owns that unresolved cause and one cause must never be reported twice.

When a member belongs to several solves, `GoalScope` combines their answers with the precedence
`undecided` over `addressed` over `unaddressed`. This keeps an unresolved chain from being spoken
over and accepts a placement when any resolved solve actually reads it. The influence rule is
therefore about placement and reach, not about duplicating goal derivation in the validator.

## Measurement that changed the design

A measurement of 20,000 rigs, taken while the source was drafted, showed that iteration outcome
could not classify goal conflict. In multi-goal rigs with reachable-by-construction goals, 4,899
ended at the iteration cap (`FABRIK_MAX_ITERATIONS`, 64), 203 stalled, and 4,898 converged.
With random goals, 7,031 stalled and 2,865 reached the cap. Stall and
cap describe FABRIK's progress, not whether branches still disagree. Random-goal misses had a
fifth-percentile branch spread of 27 units, so the policy uses the last-pass spread witness rather
than guessing conflict from a stall or cap.

## Withdrawn

**Strict priorities are withdrawn.** A priority would promise that one goal is met exactly and a
later goal receives only the remaining freedom. FABRIK has no null-space projection, so strict
priority would either be an approximation with an unowned failure mode or a second solver. The
weighted compromise states the achievable policy instead.

**An influence dictionary on the solver is withdrawn.** Influence is the goal's intent, authored on
the addressed leaf, rather than a solver-level setting that would need a second key-to-leaf
mapping. The member key is the one place the author already names the goal-bearing bone.

**Summing influence is withdrawn.** A sum would give a branch more say merely because it contains
more addressed leaves. The mean says what that branch's goals want and preserves the default pull
of `1` for an unweighted rig.

**Classifying conflict from stall or cap is withdrawn.** The measurement above shows neither is a
witness of branch disagreement. The classification reads the last inward-pass spread instead.

## Evidence

`packages/core/test/unit/plugins/ik-goal-influence.test.ts` pins the phase as `GI-1` to `GI-12`:
`GI-1` the compromise (equal weights reproduce the old `sum / count` bit for bit, `-0` normalised,
weighted mean, lone proposal weighed `1`, spread), `GI-2` mean rather than summed branch pulls,
`GI-3` the influence domain and its omission from the member record, `GI-4` a symmetric unlimited
two-branch rig moving toward the goal whose influence rose while explicit equal influences stay
byte-identical to none, `GI-5` unweighted FABRIK rotations `Object.is`-identical to the same rig
with influence stripped, `GI-6` per-leaf residuals in canonical order with one entry on the closed
form and `quality.residual` their maximum, `GI-7` `conflicted` against a reachable multi-goal rig, a
single-chain stall and a limited miss, `GI-8` the opted-in inspection through the engine with an
unchanged unopted patch, `GI-9` `ik-influence-malformed` beside the accepting direction in the same
rig, `GI-10` `ik-influence-without-goal` on a non-leaf and under a group that did not bind the
solver, `GI-11` no second report over a broken chain, a leaf the dict missed or a goal on a
non-leaf, and `GI-12` the bystander exemption, bare `target` placement and the `fk` key claim. The
quality pass on the pull request added `GI-13` (extreme finite influences, `Number.MAX_VALUE` and
`Number.MIN_VALUE`, publish finite rotations and residuals, and equal extremes publish the
unweighted rotations exactly), `GI-14` (`iterativeQuality` at its exact tolerance boundaries and in
its precedence order), `GI-15` (a branching miss with a joint at its bound is `limited`, not
`conflicted`, through a real solve) and `GI-16` (the `GoalScope` precedence over every ordered pair
of reaches). `IR-7`, `IN-1`, `IN-6`, `IN-9` and `N-7` were updated for the new result and inspection
shape and the new key.

Failing-first, by mutation in the sandbox harness: weighing every proposal `1` fails `GI-1`,
summing pulls fails `GI-2`, dropping the `conflicted` arm fails `GI-7`, dropping residual entries
fails `GI-6`, dropping `validateGoalInfluence` fails `GI-9`, and dropping `influence` from
`fk.keys` fails `GI-12`. Summing raw weights again fails `GI-13`; judging spread with `>=` or
against `0`, or naming `conflicted` before `limited`, fails `GI-14` and `GI-15`; and swapping any
two `GoalScope` precedence ranks fails `GI-16`.

Corpus, 200,000 seeded rigs (arity 1 to 8, 1 to 4 leaves, offsets, limits, reachable and random
goals, master seed `0x3495e349`), phase 5 against phase 4 at `2d8ac606`: unweighted `solveChain`
rotations `Object.is`-identical on 200,000; the unopted `ik` patch identical on 200,000; opted-in
rotations identical on 200,000 with 0 inspection-shape violations (`residuals` keys are exactly the
addressed leaves in canonical order and `residual` is their maximum); explicit influence `1` on
every leaf identical to none on 200,000. Opted-in kinds migrated only `stalled` to `conflicted`
(5,446) and `iteration-cap` to `conflicted` (2,895), all on multi-goal rigs. Among multi-goal
rigs, `conflicted` was 9.51% for reachable-by-construction goals and 16.06% for random goals.
Mean solve time moved from 194.5 to 204.6 microseconds per rig in the same process, generation
included, which is directional rather than a benchmark.

Influence is a bias on each compromise, not a guarantee about the final pose. Raising one leaf's
influence tenfold did not increase that leaf's residual on 79.8% of 66,648 multi-goal rigs; of the
rigs where it did, most carried a joint limit, which moves the pose along its bound rather than
toward either goal, and on the 1,847 multi-goal rigs with no limit it rose by more than tolerance
and 1% on 177. That is FABRIK's heuristic iteration and it is why `GI-4` asserts direction on a
symmetric unlimited rig only and why nothing here promises monotonicity.

The corpus ran in a sandbox esbuild bundle without `tsc`, and it is reviewed rather than trusted.
`CI` on the published head of the pull request is the authority, and the pull request links it.

## Consequences

Authors can state how much each addressed goal should count when a branching solve must compromise,
without changing the meaning of FK's per-member blend `weight`. Unweighted rigs retain phase 4
rotations bit for bit. Opted-in inspection reports the fixed quality shape plus frozen per-leaf
`residuals`; an unopted solver still publishes no inspection value. A remaining disagreement is
named `conflicted` with the residual record that makes the trade-off visible, while a caller is not
told the stronger and unsupported claim that no pose exists.
