# ADR-108: Constrained 2D IK solving

**Status:** Proposed as issue [#349](https://github.com/chahyasantoso/motion5/issues/349) phase 3, 2026-09-23, against `main` after phase 2 merge ([PR #483](https://github.com/chahyasantoso/motion5/pull/483)). Accepted when its pull request merges.

## Invariant

A member may author a finite local angle range as `minRotation` and `maxRotation`, grouped under
the plugin that bound its `solver` slot (`fk.values.minRotation` in core) or flat on a node that binds
a solver, and a solver may author one static `bend` hint, grouped or flat. The graph owns load
refusals; the constraint module owns runtime interpretation; FABRIK owns constrained positions. Every
published limited rotation is inside its declared range, and unconstrained output remains byte
identical.

## Why

The old solver had no joint-limit contract. Clamping a finished closed-form pose would constrain an
answer that was solved without the limit, rather than solving the best pose available under the
limit. A constrained chain therefore takes FABRIK first, while an unconstrained two-member chain
keeps the exact closed form. The distinction is structural and visible in `ChainShape`.

## Decisions (taken, not asked)

**FK owns the authored member keys; IK reads them.** Limits are per-member local-frame metadata, so
they belong beside `length`, `rotation`, and `weight` under `fk.values`. FK composition does not read
them. `ik.values.bend` is a solver-level static string, with `positive` meaning exactly `flip: true`
and `negative` meaning exactly `flip: false`. Authoring both spellings is refused.

**`bend` names a geometric sign, not only a boolean.** `positive` turns the solved second joint toward
increasing local rotation: on the worked rig it publishes `+51.318` for the elbow, and `negative`, the
default branch, publishes `-51.318`. `CL-19` pins the sign itself, because an equivalence test between
`bend` and `flip` stays green if both are inverted together.

**Every spelling is validated, because the solve reads the flat bag.** A member's values reach `ik`
flattened (ADR-043), so a flat `minRotation` and a grouped one are the same key to the reader. The load
rules therefore read every spelling through `authoredSpellings`, flat and grouped, never only
`fk.values`. The first revision read the grouped spelling alone, so a keyframed flat bound loaded
cleanly and then animated the limit at runtime; `CL-24` to `CL-27` pin the widened rules.

**Limit keys are solver vocabulary.** A limit is read by the solve and by nothing else, so a limit the
solve cannot reach is a field accepted and ignored (ADR-033 rule 6). Grouped, it must sit under a group
that bound a `solver` slot, the same scope `ik-weight-without-solver` reads; flat, the node must bind a
solver somewhere. The first revision accepted `spring.values.minRotation` on a member whose solver was
bound under `fk` (old `CL-18`), and because the solve reads the flat bag, that limit silently
constrained the solve. It is now refused as `ik-limit-without-solver`.

**One contract owner.** `contract/solver-constraints.ts` owns names, static-value classification, the
finite degree domain, default bounds, and bend classification. `graph/solver-constraints.ts` owns the
five load rules. `plugins/ik-constraint.ts` owns runtime limit arithmetic and bend reading.

**Malformed runtime bounds are absent.** `SolveMember.limit` holds only the `range` variant, and an
absent limit means free, so no strategy branches on a third state. A malformed bound is ignored
independently. The other well-formed bound still applies, and the missing side defaults to `-180` or `180`; if neither bound is
well formed the runtime reads a free joint. An empty range at runtime is answered as `[min, min]` so
live value-tier writes remain total even when they bypass load validation.

**Constrained dispatch is first, after the no-goal refusal.** `ChainShape` chooses `constrained`
whenever any member carries a range. That arm uses FABRIK even for two members. The no-goal refusal is
read before it, so a limited chain with no goal gets the same message it always did (`CL-21`). The
unconstrained two-bone and tree routes are unchanged.

**Limits are enforced during FABRIK.** The outward pass places a segment, computes its local angle,
limits it, and re-places the tip along the limited direction.

**An out-of-range angle goes to the bound nearer on the circle.** The angle is wrapped into
`(-180, 180]` first, and an angle outside the range is answered by the bound with the smaller angular
distance, not the smaller numeric distance: for `[90, 170]`, `-170` is 20 degrees from `170` and 100
from `90`, so it limits to `170`, where a numeric clamp would swing the bone the long way round to
`90`. A tie takes `min`, so the answer never depends on evaluation order. `wrapRotation` returns an
angle already in range unchanged rather than re-deriving it, because `(x + 180) - 180` is not `x` in
floating point, and a one-ulp move would report a legal angle as moved (`CL-20`). A free joint's
`limitRotation` is the identity (`CL-23`). Zero-extent limited members use their base direction plus
the limited zero angle. Unlimited members retain their existing placement and
published-angle expressions.

**Quality names a limited miss.** `limited` carries `iterations`, `residual`, and frozen canonical
`atBound` member IDs. It is reported only when the residual exceeds tolerance and a limited member is
at a bound. Other quality kinds remain unchanged.

**Withdrawn: post-hoc closed-form clamping.** It can clamp the unconstrained pose into the range but
cannot find the best limited pose, so it was rejected instead of implemented. Also withdrawn is a
new solver compatibility flag: `bend` and `flip` conflict rather than silently selecting one.

## Found, and left to its own issue

The existing negative-length FK disagreement remains owned by [#482](https://github.com/chahyasantoso/motion5/issues/482), as recorded by ADR-107. This phase does not change that behavior.

## Evidence

`packages/core/test/unit/plugins/ik-constraint.test.ts` covers wrapping, limit arithmetic, constrained
dispatch, seeded constrained poses, quality, bend/flip equivalence and precedence, zero extent, and
runtime totality under `CL-1` through `CL-3`, `CL-7` through `CL-11`, and `CL-19` through `CL-23`.
`packages/core/test/unit/graph/solver-constraints.test.ts` covers each refusal and accepting direction
under `CL-4` through `CL-6`, `CL-12` through `CL-18`, and `CL-24` through `CL-27`, the last four being
the flat spellings. Both files are registered in `docs/acceptance-map.json`, and `CL-` is registered
by the evidence-id gate.

Sandbox measurements, taken with an esbuild vitest shim and without `tsc` or `gsap`, so they are
reviewed rather than trusted and the pull request's CI run is the evidence that counts:

- `CL-1` to `CL-27`: 27 of 27 pass.
- Full suite: 958 pass against 931 at `c03c6b19`, with an identical failure set, every member of which
  is blocked by the sandbox environment rather than by this change.
- 200,000 seeded unconstrained rigs publish byte-identical rotations to `c03c6b19`, under both the
  `flip` and the `bend` spellings of the branch.
- 50,000 seeded constrained rigs: 0 rotations outside their declared range, 0 non-finite values, and
  0 impure solves (a repeated solve of the same input is byte-identical).

## Consequences

Authors gain static per-member limits and an explicit bend spelling. Invalid authored values fail with
named diagnostics at load, while live writes remain total. Limited chains may miss their goals and now
explain that miss with `limited` quality. Unconstrained rigs retain the old closed-form and unlimited
FABRIK behavior. The runtime plugin surface still publishes rotations only.
