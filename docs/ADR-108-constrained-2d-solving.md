# ADR-108: Constrained 2D IK solving

**Status:** Accepted, 2026-09-24. Issue [#349](https://github.com/chahyasantoso/motion5/issues/349)
phase 3, squash-merged from [#484](https://github.com/chahyasantoso/motion5/pull/484) as `0f75d101`.
Phase 4 is [ADR-109](./ADR-109-opt-in-solve-inspection.md).

**Extended by [ADR-123](./ADR-123-3d-joint-limits.md), 2026-09-27.** Range reader,
nearer-bound rule and `atBound` reused for 3D hinge and twist ranges through `readAngleRange`; under a
joint-declaring group (`fk3d`) `minRotation` and `maxRotation` are a hinge's range, classified with its
`joint`; under every other group they keep this record's meaning and rules.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** Invariant's flat
`minRotation`, `maxRotation` and `bend` spellings; **Every spelling is validated**, **Limit
keys are solver vocabulary** and **Solver keys belong to the node that bound `root`** passages;
Evidence sentence about flat spellings no longer describe authored input. Only grouped
spellings reach solver-spelling readers; ungrouped spellings are `keyframes-ungrouped-key` → flat
branches described there unreachable from authored input.
**Extended by [ADR-126][adr126],
2026-09-27** (issue #514): limited 2D FABRIK also enforces child limits during inward pass,
selects one opposite seed side only for a `limited` baseline, records `atBound` from enforced
angle, uses a progress-gated pass budget.

## Invariant

Member may author finite local angle range as `minRotation` and `maxRotation`, grouped under
plugin that bound its `solver` slot (`fk.values.minRotation` in core) or flat on node binding
a solver; solver may author one static `bend` hint, flat or under group that bound its
`root`. Graph owns load refusals; constraint module owns runtime interpretation; FABRIK owns
constrained positions. Every published limited rotation inside declared range; unconstrained output stays
byte identical.

## Why

Old solver had no joint-limit contract. Clamping finished closed-form pose constrains answer solved without limit -- not best pose available under it. Constrained chain therefore takes FABRIK first; unconstrained two-member chain keeps exact closed form. Distinction structural, visible in `ChainShape`.

## Decisions (taken, not asked)

**FK owns the authored member keys; IK reads them.** Limits are per-member local-frame metadata → belong beside `length`, `rotation`, `weight` under `fk.values`. FK composition does not read them. `ik.values.bend` solver-level static string: `positive` means exactly `flip: true`, `negative` exactly `flip: false`. Authoring both spellings refused.

**`bend` names a geometric sign, not only a boolean.** `positive` turns solved second joint toward increasing local rotation: on worked rig publishes `+51.318` for elbow; `negative`, default branch, publishes `-51.318`. `CL-19` pins sign itself: equivalence test between `bend` and `flip` stays green if both inverted together.

**Every spelling is validated, because the solve reads the flat bag.** Member's values reach `ik` flattened (ADR-043) → flat `minRotation` and grouped one same key to reader. Load rules read every spelling through `authoredSpellings`, flat and grouped, never only `fk.values`. First revision read grouped spelling alone → keyframed flat bound loaded cleanly, animated limit at runtime; `CL-24` to `CL-27` pin widened rules.

**Limit keys are solver vocabulary.** Limit read by solve and nothing else → limit solve cannot reach is field accepted and ignored (ADR-033 rule 6). Grouped: must sit under group that bound `solver` slot, same scope `ik-weight-without-solver` reads; flat: node must bind solver somewhere. First revision accepted `spring.values.minRotation` on member whose solver bound under `fk` (old `CL-18`); solve reads flat bag → that limit silently constrained solve. Now refused as `ik-limit-without-solver`.

**Solver keys belong to the node that bound `root`.** `bend` and `flip` read by solve of node that bound `root` → load rules read them on that node alone, flat or under group that bound `root`, same scope `reachesSolve` gives limits. First revision read `bend` under any group on any node → third-party plugin's own `spring.values.bend` on node that is no solver refused as `ik-bend-malformed`; `flip` under another group raised `ik-bend-conflicts-flip`. On node binding no `root` keys are not solver vocabulary → nothing read or refused there (`CL-28`). On solver node spelling under any other group still reaches solve through flat bag → refused as `ik-solver-key-misgrouped`, not steering solve from group that does not own it (`CL-29`); conflict rule compares only spellings solve owns (`CL-30`). Withdrawn: ignoring misgrouped spelling on solver node. Solve would read it anyway -- silent constraint `ik-limit-without-solver` already refuses for limits.

**One contract owner.** `contract/solver-constraints.ts` owns names, static-value classification, finite degree domain, default bounds, bend classification. `graph/solver-constraints.ts` owns six load rules. `plugins/ik-constraint.ts` owns runtime limit arithmetic and bend reading.

**Malformed runtime bounds are absent.** `SolveMember.limit` holds only `range` variant; absent limit means free → no strategy branches on third state. Malformed bound ignored independently; other well-formed bound still applies; missing side defaults to `-180` or `180`; neither well formed → runtime reads free joint. Empty range at runtime answered `[min, min]` → live value-tier writes stay total even bypassing load validation.

**Constrained dispatch is first, after the no-goal refusal.** `ChainShape` chooses `constrained` whenever any member carries range. That arm uses FABRIK even for two members. No-goal refusal read before it → limited chain with no goal gets same message as always (`CL-21`). Unconstrained two-bone and tree routes unchanged.

**Limits are enforced during FABRIK.** Outward pass places segment, computes local angle, limits it, re-places tip along limited direction. Inward pass also moves base with limited children to nearest legal angle while holding child direction → both ends preserve same range; [ADR-126][adr126] owns retry and progress-gated budget around these passes.

**An out-of-range angle goes to the bound nearer on the circle.** Angle wrapped into `(-180, 180]` first; outside range answered by bound with smaller angular distance, not smaller numeric distance: for `[90, 170]`, `-170` is 20 degrees from `170`, 100 from `90` → limits to `170`; numeric clamp would swing bone long way round to `90`. Tie takes `min` → answer never depends on evaluation order. `wrapRotation` returns angle already in range unchanged, not re-derived: `(x + 180) - 180` is not `x` in floating point; one-ulp move would report legal angle as moved (`CL-20`). Free joint's `limitRotation` is identity (`CL-23`). Zero-extent limited members use base direction plus limited zero angle. Unlimited members retain existing placement and published-angle expressions.

**Quality names a limited miss.** `limited` carries `iterations`, `residual`, frozen canonical `atBound` member IDs. Reported only when residual exceeds tolerance and limited member at bound. Other quality kinds unchanged.

**Withdrawn: post-hoc closed-form clamping.** Can clamp unconstrained pose into range but cannot find best limited pose → rejected, not implemented. Also withdrawn: new solver compatibility flag; `bend` and `flip` conflict rather than silently selecting one.

## Found, and left to its own issue

Negative-length FK disagreement recorded by ADR-107 unchanged by this phase; [#482](https://github.com/chahyasantoso/motion5/issues/482) later closed it by composing `fk` through `segmentExtent`, as ADR-107 now records.

## Evidence

`packages/plugins/test/unit/ik-constraint.test.ts` covers wrapping, limit arithmetic, constrained dispatch, seeded constrained poses, quality, bend/flip equivalence and precedence, zero extent, runtime totality under `CL-1` through `CL-3`, `CL-7` through `CL-11`, `CL-19` through `CL-23`.
`packages/core/test/unit/graph/solver-constraints.test.ts` covers each refusal and accepting direction under `CL-4` through `CL-6`, `CL-12` through `CL-18`, `CL-24` through `CL-30`: `CL-24` to `CL-27` flat spellings, `CL-28` to `CL-30` solver-key scope. Both files registered in `docs/acceptance-map.json`; `CL-` registered by evidence-id gate.

Sandbox measurements, esbuild vitest shim, no `tsc` or `gsap` → reviewed, not trusted; pull request's CI run is evidence that counts:

- `CL-1` to `CL-30`: 30 of 30 pass.
- Full suite: 958 pass against 931 at `c03c6b19`; identical failure set, every member blocked by sandbox environment, not this change.
- 200,000 seeded unconstrained rigs publish byte-identical rotations to `c03c6b19`, under both `flip` and `bend` spellings of branch.
- 50,000 seeded constrained rigs: 0 rotations outside declared range, 0 non-finite values, 0 impure solves (repeated solve of same input byte-identical).

## Consequences

Authors gain static per-member limits and explicit bend spelling. Invalid authored values fail with named diagnostics at load; live writes stay total. Limited chains may miss goals; now explain miss with `limited` quality. Unconstrained rigs retain old closed-form and unlimited FABRIK behavior. Runtime plugin surface still publishes rotations only by default; ADR-109 adds opt-in fixed-shape `inspection` projection without changing unopted patches.

[adr126]: ./ADR-126-limited-fabrik-seed-side-bidirectional-limits-and-pass-budget.md
