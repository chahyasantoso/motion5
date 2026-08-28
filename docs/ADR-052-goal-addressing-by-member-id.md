# ADR-052: Goals are addressed by member id, and the solve dispatches on derived shape

**Status:** Accepted, 2026-08-28

**Supersedes nothing.** Extends [ADR-051](./ADR-051-derived-solver-membership.md), which derived solver membership and delivered member state pre-composition. ADR-051 answered how a solver finds its bones. This record answers how a solver is told what to reach for, and which arithmetic answers once a chain is longer than two bones.

## Context

ADR-051 shipped one goal per solver, bound to a named `target` slot, and a load-time refusal of any derived member count other than two. Both were honest for a two-bone analytic solve and both stop being honest the moment a chain may branch or run long.

A chain with two leaves needs two goals. A named slot cannot express that: the publisher delivers a source's values as `collected[plugin][slot]`, so two bindings sharing one slot name overwrite each other and the last one authored is the only one that arrives, with no diagnostic. And a goal that derives no edge is invisible to `firstPendingEdge`, to the failed, blocked and pending classification, and to `orderGraph`, none of which needed a line changed for the first goal and all of which are load-bearing for the second.

A chain longer than two bones needs an iterative solve. The analytic closed form reads `members[0]` and `members[1]` off a depth-sorted flat list, which for a tree is simply the wrong pair.

The question this record closes is who owns each half of that, because the two halves live in layers that deliberately cannot see each other. `contract/` holds no plugin registry, and a plugin holds no graph.

## Decision

### The authored surface is one dict keyed by member id

A solver addresses its goals by naming the member each goal belongs to:

```js
{
  id: "spine-solve",
  keyframes: {
    ik: {
      requires: {
        root: "walk/spine",
        targets: { "walk/forearm-L": "walk/armL-target", "walk/forearm-R": "walk/armR-target" },
      },
    },
  },
}
```

Keyed by id rather than by position. An index can never be wrong: it silently means whatever the rig currently makes it mean, so inserting a bone or reordering two tracks keeps loading and pulls the wrong limb. A member id can be wrong, so it can be checked. That is the same argument that retired `reach` in favour of a named `root`, and it applies here without modification.

Object keys are unique, so two goals for one member are unrepresentable rather than diagnosed. What qualification leaves behind is narrower and real: `forearm` and `walk/forearm` are two authored keys that resolve to one node id, and that is what `ik-goal-duplicate` refuses.

### The bare `target` slot stays supported, and is not deprecated

`target` is exactly the degenerate case of the dict, so retiring it would re-author every existing rig to buy one spelling and would cost the two numbers that pin the closed form on the rig that already exists. Two spellings for one binding is an alias, which this project normally refuses, and it is accepted here on that trade. `ik-goal-conflict` refuses a solver that authored both, so there is never a question of which one won.

A bare `target` names no member, so it is joined onto the chain's one leaf. That is a guarantee only while a chain has exactly one leaf, which the arity cap used to provide for free. With the cap gone it is stated rather than implied: `ik-target-not-single-leaf` refuses the bare slot over a branching chain, naming both leaves, because a binding accepted and then applied to whichever member the derivation happened to order first is the shape rule 6 of [ADR-033](./ADR-033-no-manual-trigger-fallback.md) forbids.

### One authored section, one derived binding per goal

`readPluginBindings` expands the dict into one binding per member, at the derived slot identity `targets[<memberId>]`. That identity is never authored and never spelled by hand, and both spellings are refused as declared requirement slot names at registration, so there is no second, unreachable way to reach the same binding.

The grammar has exactly one owner, `contract/solver-slots.ts`, for the reason `keyframe-shape.ts` lives in the same layer: `graph/ir.ts` must read it with no plugin registry in reach, a solver plugin must read it identically, and both already depend on that layer. Two private copies of one syntax rule is how `readNumber` drifted between `fk` and `ik`.

The consequence worth stating plainly is what it preserves. Every binding, a goal included, still derives exactly one edge, so `J-5` holds verbatim and `graph/order.ts`, `graph/observation-state.ts`, `PatchRegistry`, `GraphBinding`'s transaction, `ProjectRuntime.#snapshot`, `engine.ts`'s compiled-track map, `Track`, every adapter and `packages/react` are all unchanged.

### Three layers answer three different questions about one goal

This is the split the record exists to protect, and each boundary is forced rather than chosen.

The contract layer owns spelling. Whether `targets` is a record, whether it is empty, whether a member key is well formed, and whether the goal names a non-empty source id are all answerable with no registry and no graph, and they are the four `keyframes-targets-*` rules.

The plugin registry owns whether a bound slot is declared at all. A record of named slots cannot express a family whose members the rig names rather than the plugin, so `PluginDefinition.claimsSlot` is the slot-side counterpart to `claimsKey`. It is a boolean predicate deliberately: a predicate returning a shape descriptor would make the registry a validation engine for a type system it does not have, and the interesting question about a goal slot is not its shape but whether the member it names exists, which is unanswerable from there.

Graph construction owns whether a goal resolves. Membership is derived from the `solver` edges the members authored, so `resolveSolvers` is the only owner that can answer whether a key names a member of this chain and whether that member is a leaf. It holds no plugin registry and needs none, because it keys on the syntactic slot names.

### The solve dispatches on derived shape, not on an authored mode

`solveChain` sends two members and one goal to the analytic `solveTwoBone`, and everything else to the iterative `solveFabrik`. Dispatch reads shape the loader already derived, so nothing new is authorable and no rig selects its own solver.

The two paths are deliberately not one. `IK-1` and `IK-3` pin exact rotations an iterative solve reaches only within a tolerance, and `flip` at arity two selects an exact branch rather than a basin, so a single solver would move published values for every rig that already solves. The DRY guarantee is therefore an equivalence assertion rather than a shared code path: `FB-2` holds FABRIK to the analytic numbers on ADR-051's worked rig, and `FB-9` holds the analytic path to itself with the dispatcher in front of it.

Tolerance and the iteration cap are module constants (`FABRIK_TOLERANCE`, `FABRIK_MAX_ITERATIONS`, `FABRIK_ARC_BISECTIONS`), exported so a test imports the tolerance rather than typing one beside every assertion. They are not authored values, because an interpolatable tolerance would make the operation count a function of the timeline and a determinism case could not be written at all: one rig at two progresses would take two different numbers of steps toward two different residuals.

Convergence metadata is not published. The reasoning is recorded under ADR-051 in [DECISIONS.md](./DECISIONS.md) and is unchanged here.

## Load-time diagnostics this record introduces

Deliberately not a table. Prettier reflows a markdown table's column padding on every unrelated edit, so a one-word change to one row rewrites every line of the block and the next reviewer reads whitespace instead of a rule.

Shape, in the contract layer, with no registry:

- `keyframes-targets-shape`, when `targets` is present but is not an object mapping member ids to source ids. An array lands here too. `keyframes-requires-source` cannot answer for this slot, because it refuses a record outright, which is what made the dict unauthorable before D0.
- `keyframes-targets-empty`, when `targets` is an empty object. Omitting the slot is already how a solver authors no goals through the dict, so an empty one would be a field accepted and then ignored.
- `keyframes-targets-member`, when a member key is empty, or contains `:`, `[` or `]`. The brackets are refused because an authored name containing them could forge the derived `targets[<memberId>]` slot identity, which is the same reservation argument the colon rule makes for internal keys.
- `keyframes-targets-source`, when the goal a member is mapped to is not a non-empty source id.

Topology, in graph construction, where the member set exists:

- `ik-goal-unknown-member`, when an authored key qualifies to no member of this solver's chain.
- `ik-goal-not-leaf`, when a goal is authored on a member another member hangs from. A goal is a thing a chain tip reaches for; an interior joint has no separate destination.
- `ik-leaf-without-goal`, when the dict was used at all and a leaf it never named is left with nothing to reach for. It does not fire for a bare `target`, which has no goal to be missing.
- `ik-goal-duplicate`, when two authored keys qualify to one member id.
- `ik-goal-conflict`, when one solver authors both `target` and `targets`.
- `ik-target-not-single-leaf`, when a solver binds the bare `target` slot over a chain with more than one leaf. The diagnostic names both leaves, because choosing between them is the author's decision and the dict is the spelling that makes it.

One existing rule widened rather than being added: `ik-mode-ambiguous` read the literal string `"target"`, so a member binding `solver` beside a goal dict of its own loaded clean, with one real input edge per goal, and had every one of them ignored. It reads the grammar now.

And one deleted. `ik-solver-unsupported-arity` refused every derived member count other than two. That was honest while the closed form was the only solve a rig could reach and false the moment the dispatcher landed, and a rule that refuses a shape the code solves is worse than no rule, so it is deleted rather than widened. The guarantee it was making silently is `ik-target-not-single-leaf`.

Goal derivation is skipped over a chain that already broke, for the reason `finalizeGraph` bails on reference errors before the rest of the derivation runs: over a chain that was never valid, leafhood reports about a shape the author did not author, and one cause would be reported twice.

## Alternatives rejected

1. **Positional goals, `target0` through `targetN`, paired to leaf `i` in derived order.** Derived order is depth, then authored index, then qualified id. Reorder two tracks and the pairing keeps loading and pulls the wrong limb. An index cannot be wrong, which is exactly why it cannot be checked.
2. **Bracket-addressed authoring, `targets[forearm]` typed by hand.** Two spellings where one dict does, and the author pays a bracket pair for nothing. The bracket survives as derived identity, which is where it earns its keep.
3. **One slot holding N sources.** The publisher's `collected[plugin][slot]` overwrites, so the last goal authored would be the only one delivered, silently. And a goal with no edge of its own is invisible to ordering and to pending classification.
4. **A plugin-side `keyValidator` over member ids.** `PluginDefinition` is a frozen plain record with no instance for a validator to close over, and the member set is derived from `solver` edges in a layer that holds no registry. A plugin cannot know the member set at registration and the registry cannot ask the graph.
5. **Reviving a member's authored `rotation` as the FABRIK seed.** That key is dead at arity two, where the solve owns rotation outright, so reading it at arity three would leave one authored key live or dead depending on how many bones its neighbours happen to have. The seed is derived instead: a constant-curvature arc, which is what keeps FABRIK off the colinear fixed point a straight seed sits on.
6. **Authored `tolerance` and `maxIterations`.** An interpolatable value would make the operation count a function of the timeline.
7. **Replacing the closed form outright.** Rejected on evidence rather than caution: `IK-1` and `IK-3` pin exact numbers, and an iterative solve reaches a goal within a tolerance rather than exactly.

## Consequences, stated as costs

1. `targets`, and anything matching the derived spelling, are reserved requirement slot names no plugin may declare. One word out of the namespace, for the reason the colon is out of it.
2. A predicate-claimed slot carries no `description`, so the goal grammar is documented in prose here and in [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md) where a named slot documents itself.
3. Two spellings for one binding survive on purpose. This is the alias the pull request template dislikes, accepted on the trade named above.
4. `rotations` grows with the chain, so `equalValues` deep-compares an n-entry record per solver per tick.
5. One `flip` per solver applies to every limb of a tree. Defined and documented rather than refused, in the same spirit as stagger under ADR-051.
6. FABRIK is approximate, so every assertion above arity two is a tolerance imported from the module rather than a literal. That is weaker evidence than the two numbers that pin the closed form, and it is why the closed form is kept rather than absorbed.
7. **The FABRIK cost claim is withdrawn rather than carried.** The sequencing plan gated this slice on benchmark evidence. `performance/graph-benchmark.mjs` traverses a synthetic adjacency list and cannot observe a solve, and `performance/budgets.json` is advisory and expired, so no number in the harness answers the question. The estimate is stated and left as an estimate: the iterative solve is `O(members x iterations)` per solver per tick, once per chain rather than once per member, bounded by `FABRIK_MAX_ITERATIONS`. Renewing an expiry on a budget that measures something else would be the dishonest option, so the budget file is deliberately left as it is and a solve-observing harness is its own change, on its own evidence.

## Evidence

- **Slice D0** (`SL-1` … `SL-8`): `packages/core/test/unit/domain/plugin-slot-claim.test.ts`. Slot arity, the grammar's round trip and its near misses, one binding and one edge per goal, the four shape rules registry-free, and both reserved spellings refused as declared slots.
- **Slice D1** (`MG-1` … `MG-11`): `packages/core/test/unit/graph/solver-goals.test.ts`. Chain derivation carrying `SolveMember.goal`, qualification of a bare and a qualified key to one member, one case per rule, determinism over twenty real permutations, and `solves` reconstructed from `ObservationState` alone, which is what proves no journal variant is needed.
- **Slice D1** (`MG-12`, `MG-13`): `packages/core/test/integration/ik-multi-goal.test.ts`. ADR-051's worked rig re-expressed with `targets`, solving to the same `40.168` and `-51.318`, and seeding the goal node alone re-solving the chain.
- **Slice D2** (`FB-1` … `FB-8`): `packages/core/test/unit/plugins/fabrik-solve.test.ts`. The iterative solve as arithmetic, unwired: the derived seed, the closed-form equivalence, sub-base averaging, permutation determinism, and the two non-convergent exits.
- **Slice D3** (`FB-9`, `FB-13`, `FB-15`): `packages/core/test/unit/plugins/fabrik-dispatch.test.ts`. The analytic path byte-identical behind the dispatcher, the unpublished convergence record, and the bare-target join.
- **Slice D3** (`FB-10`, `FB-14`): `packages/core/test/unit/graph/arity-lift.test.ts`. Chains past and short of arity two loading, and `ik-target-not-single-leaf`.
- **Slice D3** (`FB-11`, `FB-12`): `packages/core/test/integration/ik-fabrik-chain.test.ts`. A five-bone chain tracking an animated goal with every segment length intact, and two arms off one spine solved once.
- **Slice D4** (`FB-16`): `packages/core/test/unit/plugins/fabrik-arity-one.test.ts`. A one-member chain points at its goal. This is the behaviour the deleted `members.length < 2` fallback answered with zeros, and the arity-lift case proved only that such a chain loads.
- **Slice D4** (case 13): `packages/core/test/integration/phase7-walker-demo.test.ts`. A three-bone tail on the walker rig reaching an animated goal, beside the assertion that every FK bone and the existing two-bone arm publish exactly what they published before the tail existed. A second solver in one project is the regression surface the unit fixtures cannot reach.
