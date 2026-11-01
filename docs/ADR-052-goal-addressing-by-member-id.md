# ADR-052: Goals are addressed by member id, and the solve dispatches on derived shape

**Status:** Accepted, 2026-08-28

**Supersedes nothing.** Extends [ADR-051](./ADR-051-derived-solver-membership.md), which derived solver
membership and delivered member state pre-composition. ADR-051 answered how solver finds bones. This record
answers how solver told what to reach for, and which arithmetic answers once chain longer than two bones.

## Context

ADR-051 shipped one goal per solver bound to named `target` slot, plus load-time refusal of any derived member
count other than two. Both honest for two-bone analytic solve, both stop being honest the moment chain may branch
or run long.

Chain with two leaves needs two goals. Named slot cannot express: publisher delivers source's values as
`collected[plugin][slot]` → two bindings sharing one slot name overwrite, last authored only one arrives, no
diagnostic. Goal deriving no edge invisible to `firstPendingEdge`, failed/blocked/pending classification,
`orderGraph` — none needed a line changed for first goal, all load-bearing for second.

Chain longer than two bones needs iterative solve. Analytic closed form reads `members[0]`, `members[1]` off
depth-sorted flat list — for tree simply wrong pair.

Question closed here: who owns each half, because halves live in layers deliberately unable to see each other.
`contract/` holds no plugin registry, plugin holds no graph.

## Decision

### The authored surface is one dict keyed by member id

Solver addresses goals by naming member each goal belongs to:

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

Keyed by id not position. Index can never be wrong: silently means whatever rig currently makes it mean →
inserting bone or reordering two tracks keeps loading, pulls wrong limb. Member id can be wrong → can be checked.
Same argument that retired `reach` for named `root`, applies here unmodified.

Object keys unique → two goals for one member unrepresentable rather than diagnosed. What qualification leaves
behind narrower and real: `forearm` and `walk/forearm` two authored keys resolving to one node id — what
`ik-goal-duplicate` refuses.

### The bare `target` slot stays supported, and is not deprecated

`target` = exactly degenerate case of dict → retiring re-authors every existing rig to buy one spelling, costs
two numbers pinning closed form on rig that exists. Two spellings for one binding = alias, project normally
refuses; accepted here on that trade. `ik-goal-conflict` refuses solver authoring both → never question which won.

Bare `target` names no member → joined onto chain's one leaf. Guarantee only while chain has exactly one leaf,
which arity cap provided free. Cap gone → stated not implied: `ik-target-not-single-leaf` refuses bare slot over
branching chain, names both leaves, because binding accepted then applied to whichever member derivation ordered
first = shape rule 6 of [ADR-033](./ADR-033-no-manual-trigger-fallback.md) forbids.

### One authored section, one derived binding per goal

`readPluginBindings` expands dict into one binding per member, derived slot identity `targets[<memberId>]`.
Identity never authored, never spelled by hand, both spellings refused as declared requirement slot names at
registration → no second unreachable way to reach same binding.

Grammar has exactly one owner, `contract/solver-slots.ts`, reason `keyframe-shape.ts` lives same layer:
`graph/ir.ts` must read with no plugin registry in reach, solver plugin must read identically, both already depend
on that layer. Two private copies of one syntax rule = how `readNumber` drifted between `fk` and `ik`.

Consequence worth stating plainly = what it preserves. Every binding, goal included, still derives exactly one
edge → `J-5` holds verbatim, `graph/order.ts`, `graph/observation-state.ts`, `PatchRegistry`, `GraphBinding`'s
transaction, `ProjectRuntime.#snapshot`, `engine.ts`'s compiled-track map, `Track`, every adapter,
`packages/react` all unchanged.

### Three layers answer three different questions about one goal

Split record exists to protect, each boundary forced not chosen.

Contract layer owns spelling. Whether `targets` is record, whether empty, whether member key well formed, whether
goal names non-empty source id — all answerable with no registry and no graph = four `keyframes-targets-*` rules.

Plugin registry owns whether bound slot declared at all. Record of named slots cannot express family whose
members rig names rather than plugin → `PluginDefinition.claimsSlot` = slot-side counterpart to `claimsKey`.
Boolean predicate deliberately: predicate returning shape descriptor makes registry validation engine for type
system it does not have; interesting question about goal slot not shape but whether named member exists —
unanswerable from there.

Graph construction owns whether goal resolves. Membership derived from `solver` edges members authored →
`resolveSolvers` only owner able to answer whether key names member of this chain, whether that member is leaf.
Holds no plugin registry, needs none, keys on syntactic slot names.

### The solve dispatches on derived shape, not on an authored mode

`solveChain` sends two members + one goal to analytic `solveTwoBone`, everything else to iterative
`solveFabrik`. Dispatch reads shape loader already derived → nothing new authorable, no rig selects own solver.

Two paths deliberately not one. `IK-1`, `IK-3` pin exact rotations iterative solve reaches only within tolerance,
`flip` at arity two selects exact branch not basin → single solver moves published values for every rig already
solving. DRY guarantee therefore equivalence assertion not shared code path: `FB-2` holds FABRIK to analytic
numbers on ADR-051's worked rig, `FB-9` holds analytic path to itself with dispatcher in front.

Tolerance and iteration cap module constants (`FABRIK_TOLERANCE`, `FABRIK_ARC_BISECTIONS`, depth-scaled cap owned
by `fabrik-cap.ts`, see ADR-115), exported so test imports tolerance rather than typing one beside every
assertion. Not authored values: interpolatable tolerance makes operation count function of timeline, determinism
case unwritable at all — one rig at two progresses takes two different step counts toward two different residuals.

Convergence metadata not published. Reasoning recorded in
[ADR-051](./ADR-051-derived-solver-membership.md), unchanged here.

## Load-time diagnostics this record introduces

Deliberately not a table. Prettier reflows markdown table column padding on every unrelated edit → one-word
change to one row rewrites every line of block, next reviewer reads whitespace not rule.

Shape, in contract layer, no registry:

- `keyframes-targets-shape`, when `targets` present but not object mapping member ids to source ids. Array lands
  here too. `keyframes-requires-source` cannot answer for this slot, refuses record outright — what made dict
  unauthorable before D0.
- `keyframes-targets-empty`, when `targets` empty object. Omitting slot already how solver authors no goals
  through dict → empty one = field accepted then ignored.
- `keyframes-targets-member`, when member key empty, or contains `:`, `[`, `]`. Brackets refused because authored
  name containing them could forge derived `targets[<memberId>]` slot identity — same reservation argument colon
  rule makes for internal keys.
- `keyframes-targets-source`, when goal member mapped to is not non-empty source id.

Topology, in graph construction, where member set exists:

- `ik-goal-unknown-member`, when authored key qualifies to no member of this solver's chain.
- `ik-goal-not-leaf`, when goal authored on member another member hangs from. Goal = thing chain tip reaches for;
  interior joint has no separate destination.
- `ik-leaf-without-goal`, when dict used at all and leaf it never named left with nothing to reach for. Does not
  fire for bare `target` — no goal to be missing.
- `ik-goal-duplicate`, when two authored keys qualify to one member id.
- `ik-goal-conflict`, when one solver authors both `target` and `targets`.
- `ik-target-not-single-leaf`, when solver binds bare `target` over chain with more than one leaf. Names both
  leaves, because choosing between them is author's decision and dict is spelling that makes it.

One existing rule widened not added: `ik-mode-ambiguous` read literal `"target"` → member binding `solver` beside
goal dict of its own loaded clean, one real input edge per goal, every one ignored. Reads grammar now.

One deleted. `ik-solver-unsupported-arity` refused every derived member count but two. Honest while closed form
only solve rig could reach, false moment dispatcher landed; rule refusing shape code solves worse than no rule →
deleted not widened. Guarantee it made silently = `ik-target-not-single-leaf`.

Goal derivation skipped over chain already broke, reason `finalizeGraph` bails on reference errors before rest of
derivation: over chain never valid, leafhood reports shape author did not author, one cause reported twice.

## Alternatives rejected

1. **Positional goals `target0`..`targetN`, paired to leaf `i` in derived order.** Derived order = depth, then
   authored index, then qualified id. Reorder two tracks → pairing keeps loading, pulls wrong limb. Index cannot
   be wrong — exactly why it cannot be checked.
2. **Bracket-addressed authoring `targets[forearm]` typed by hand.** Two spellings where one dict does, author
   pays bracket pair for nothing. Bracket survives as derived identity — where it earns keep.
3. **One slot holding N sources.** Publisher's `collected[plugin][slot]` overwrites → last goal authored only one
   delivered, silently. Goal with no own edge invisible to ordering and pending classification.
4. **Plugin-side `keyValidator` over member ids.** `PluginDefinition` frozen plain record, no instance for
   validator to close over; member set derived from `solver` edges in layer holding no registry. Plugin cannot
   know member set at registration, registry cannot ask graph.
5. **Reviving member's authored `rotation` as FABRIK seed.** Key dead at arity two where solve owns rotation
   outright → reading at arity three leaves one authored key live or dead depending how many bones neighbours
   have. Seed derived instead: constant-curvature arc — keeps FABRIK off colinear fixed point straight seed sits
   on.
6. **Authored `tolerance`, `maxIterations`.** Interpolatable value makes operation count function of timeline.
7. **Replacing closed form outright.** Rejected on evidence not caution: `IK-1`, `IK-3` pin exact numbers,
   iterative solve reaches goal within tolerance not exactly.

## Consequences, stated as costs

1. `targets` and anything matching derived spelling reserved requirement slot names no plugin may declare. One
   word out of namespace, reason colon is out of it.
2. Predicate-claimed slot carries no `description` → goal grammar documented in prose here and in
   [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md) where named slot documents itself.
3. Two spellings for one binding survive on purpose. Alias pull request template dislikes, accepted on trade above.
4. `rotations` grows with chain → `equalValues` deep-compares n-entry record per solver per tick.
5. One `flip` per solver applies to every limb of tree. Defined and documented rather than refused, same spirit as
   stagger under ADR-051.
6. FABRIK approximate → every assertion above arity two is tolerance imported from module not literal. Weaker
   evidence than two numbers pinning closed form — why closed form kept not absorbed.
7. **FABRIK cost claim withdrawn not carried.** Sequencing plan gated slice on benchmark evidence.
   `performance/graph-benchmark.mjs` traverses synthetic adjacency list, cannot observe solve;
   `performance/budgets.json` advisory and expired → no number in harness answers question. Estimate stated, left
   as estimate: iterative solve `O(members x iterations)` per solver per tick, once per chain not once per member,
   bounded by depth-scaled `fabrikIterationCap`. Renewing expiry on budget measuring something else = dishonest
   option → budget file deliberately left as is; solve-observing harness is own change on own evidence.

## Evidence

- **Slice D0** (`SL-1` … `SL-8`): `packages/core/test/unit/domain/plugin-slot-claim.test.ts`. Slot arity, grammar
  round trip and near misses, one binding + one edge per goal, four shape rules registry-free, both reserved
  spellings refused as declared slots.
- **Slice D1** (`MG-1` … `MG-11`): `packages/core/test/unit/graph/solver-goals.test.ts`. Chain derivation carrying
  `SolveMember.goal`, qualification of bare and qualified key to one member, one case per rule, determinism over
  twenty real permutations, `solves` reconstructed from `ObservationState` alone — proves no journal variant
  needed.
- **Slice D1** (`MG-12`, `MG-13`): `packages/core/test/integration/ik-multi-goal.test.ts`. ADR-051's worked rig
  re-expressed with `targets`, solving to same `40.168` and `-51.318`, seeding goal node alone re-solving chain.
- **Slice D2** (`FB-1` … `FB-8`): `packages/plugins/test/unit/fabrik-solve.test.ts`. Iterative solve as arithmetic,
  unwired: derived seed, closed-form equivalence, sub-base averaging, permutation determinism, two non-convergent
  exits.
- **Slice D3** (`FB-9`, `FB-13`, `FB-15`): `packages/plugins/test/unit/fabrik-dispatch.test.ts`. Analytic path
  byte-identical behind dispatcher, unpublished convergence record, bare-target join.
- **Slice D3** (`FB-10`, `FB-14`): `packages/core/test/unit/graph/arity-lift.test.ts`. Chains past and short of
  arity two loading, `ik-target-not-single-leaf`.
- **Slice D3** (`FB-11`, `FB-12`): `packages/core/test/integration/ik-fabrik-chain.test.ts`. Five-bone chain
  tracking animated goal with every segment length intact, two arms off one spine solved once.
- **Slice D4** (`FB-16`): `packages/plugins/test/unit/fabrik-arity-one.test.ts`. One-member chain points at goal.
  Behaviour deleted `members.length < 2` fallback answered with zeros; arity-lift case proved only such a chain
  loads.
- **Slice D4** (case 13): `packages/core/test/integration/phase7-walker-demo.test.ts`. Three-bone tail on walker
  rig reaching animated goal, beside assertion every FK bone and existing two-bone arm publish exactly what
  published before tail existed. Second solver in one project = regression surface unit fixtures cannot reach.
