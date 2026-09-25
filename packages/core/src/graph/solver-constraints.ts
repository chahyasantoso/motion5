import { unreachable } from "../lang/exhaustive";
import {
  authoredSpellings,
  BEND_KEY,
  classifyBend,
  classifyInfluence,
  classifyInspect,
  classifyLimit,
  FLIP_KEY,
  INFLUENCE_KEY,
  INSPECT_KEY,
  LIMIT_KEYS,
  type AuthoredSpelling,
  type LimitKey,
  type SolverKey,
} from "../contract/solver-constraints";
import { diagnostic } from "../contract/diagnostics";
import { declaresPole, POLE_SLOT } from "../contract/solver-shape";
import type { Diagnostic } from "../contract/v5";
import type { GraphNode } from "./ir";

/**
 * The load rules of the solver's authored constraints: the six of constrained 2D solving (ADR-108),
 * the inspection switch's one (ADR-109), goal influence's two (ADR-110) and the 3D pole's one
 * (ADR-118).
 *
 * **Every spelling, because the solve reads the flat bag.** A member's limits reach `ik` through
 * the member's flattened values, where a flat `minRotation` and one grouped under any plugin are
 * the same key (ADR-043). Each rule therefore reads every spelling through `authoredSpellings`,
 * never only `fk.values`: a rule narrower than the reader it guards passes the other spelling to the
 * runtime unvalidated, which is how a keyframed bound would become an animated constraint.
 *
 * **Limit keys are solver vocabulary.** A limit is read by the solve and by nothing else, so a
 * limit anywhere a solve cannot reach it is a field accepted and ignored (ADR-033 rule 6). Grouped,
 * it must sit under a group that bound a `solver` slot, which is the scope `ik-weight-without-solver`
 * already reads; flat, the node must bind a solver somewhere. `fk` is the one core claimant, so a
 * second plugin claiming the name would already make the flat spelling ambiguous at the registry.
 *
 * **Solver keys belong to the node that bound `root`.** `bend`, `flip` and `inspect` are read by
 * the `ik` composer of the node that bound `root`, flat or under the group that bound it, and by
 * nothing else, so the rules read exactly those spellings through `solverSpellings`. The first
 * revision read `bend` and `flip` under any group on any node, which refused a third-party plugin's
 * own `spring.values.bend` on a node that is no solver at all; phase 4's first draft repeated that
 * for `inspect`, and routing it through the same reader is what keeps the scope one decision.
 *
 * **Influence belongs to an addressed goal.** `influence` is member vocabulary read through the
 * limit scope, and it weighs the goal its leaf is addressed with, so it is well placed only on a
 * member the solve addresses. Which members those are is `resolveSolvers`'s answer, after goal
 * resolution, handed in as a `GoalScope` rather than re-derived here: this module would otherwise
 * be a second owner of leafhood and goal addressing. It speaks only on a node that bound a solver
 * somewhere, the narrowing `ik-weight-without-solver` makes for the same reason: this pass holds no
 * registry and cannot tell an `fk` influence from another plugin's own key on a node no solve reads.
 *
 * **A pole belongs to the group that bound `root`.** `pole` is a requirement slot rather than a key,
 * and `contract/solver-shape.ts` owns which solver plugins declare it, so under any other plugin the
 * registry refuses it by name (`plugin-unknown-requirement`) and this pass stays silent rather than
 * refusing the same slot a second time under a second rule. What the registry cannot see is where a
 * declared pole was bound: the solve that reads it is the composer of the group whose `root` edge
 * makes the node a solver, so a pole under a pole-declaring group that bound no `root` on the same
 * node bends no chain. The shape an author reaches for by mistake is an `ik3d` group on the elbow
 * member holding only the pole, and it is refused by name as `ik-pole-without-chain` instead of
 * loading and then throwing from that group's composer on every tick.
 */

/** The plugins under which this node bound `slot`, read from its derived edges. */
function slotBinders(
  node: GraphNode,
  slot: "root" | "solver" | typeof POLE_SLOT,
): ReadonlySet<string> {
  return new Set(
    node.edges.flatMap((edge) => {
      const requirement = edge.role === "input" ? edge.requirement : undefined;
      return requirement?.slot === slot ? [requirement.plugin] : [];
    }),
  );
}

function reachesSolve(spelling: AuthoredSpelling, binders: ReadonlySet<string>): boolean {
  return spelling.group === undefined ? binders.size > 0 : binders.has(spelling.group);
}

/**
 * The spellings of one solver key that a solve reads, refusing the ones it reads from elsewhere.
 *
 * A solver key belongs to the node that bound `root`, flat or under the group that bound it. On a
 * node that bound no `root` the key is not solver vocabulary at all, it is some other plugin's own
 * key, so nothing is read and nothing is refused. On a solver node a spelling under any other group
 * still reaches the solve, because the solve reads the flattened bag (ADR-043), so it is refused as
 * `ik-solver-key-misgrouped` rather than steering the solve from a group that does not own it.
 */
function solverSpellings(
  node: GraphNode,
  key: SolverKey,
  roots: ReadonlySet<string>,
  diagnostics: Diagnostic[],
): readonly AuthoredSpelling[] {
  if (roots.size === 0) return [];
  const spellings = authoredSpellings(node.track.keyframes, key);
  for (const spelling of spellings) {
    if (reachesSolve(spelling, roots)) continue;
    diagnostics.push(
      diagnostic(
        "ik-solver-key-misgrouped",
        `${node.id}.keyframes.${spelling.path}`,
        `Solver "${node.id}" authors ${key} under ${spelling.group}, which did not bind its root; author it flat or under ${[...roots].join(", ")}.`,
        [node.id],
      ),
    );
  }
  return spellings.filter((spelling) => reachesSolve(spelling, roots));
}

function validateMemberLimits(node: GraphNode, diagnostics: Diagnostic[]): void {
  const binders = slotBinders(node, "solver");
  const values: Partial<Record<LimitKey, unknown>> = {};
  const paths: Partial<Record<LimitKey, string>> = {};
  for (const key of LIMIT_KEYS) {
    for (const spelling of authoredSpellings(node.track.keyframes, key)) {
      if (!reachesSolve(spelling, binders)) {
        const where = spelling.group === undefined ? "flat" : `under ${spelling.group}`;
        diagnostics.push(
          diagnostic(
            "ik-limit-without-solver",
            `${node.id}.keyframes.${spelling.path}`,
            `Node "${node.id}" authors ${key} ${where} without binding a solver there; no solve reads it.`,
            [node.id],
          ),
        );
        continue;
      }
      // `keyframes-duplicate-key` refuses a second spelling of one key, so the first is the one.
      if (Object.hasOwn(values, key)) continue;
      values[key] = spelling.value;
      paths[key] = spelling.path;
    }
  }
  const limit = classifyLimit(values);
  switch (limit.kind) {
    case "free":
    case "range":
      return;
    case "malformed":
      diagnostics.push(
        diagnostic(
          "ik-limit-malformed",
          `${node.id}.keyframes.${paths[limit.key] ?? limit.key}`,
          `Member "${node.id}" has a malformed ${limit.key}; use one static number in [-180, 180].`,
          [node.id],
        ),
      );
      return;
    case "empty":
      diagnostics.push(
        diagnostic(
          "ik-limit-empty",
          `${node.id}.keyframes.${paths.minRotation ?? paths.maxRotation ?? ""}`,
          `Member "${node.id}" has an empty angle limit range [${limit.min}, ${limit.max}].`,
          [node.id],
        ),
      );
      return;
    default:
      return unreachable(limit);
  }
}

function validateSolverInspect(
  node: GraphNode,
  roots: ReadonlySet<string>,
  diagnostics: Diagnostic[],
): void {
  for (const spelling of solverSpellings(node, INSPECT_KEY, roots, diagnostics)) {
    const inspect = classifyInspect(spelling.value);
    switch (inspect.kind) {
      case "valid":
        break;
      case "malformed":
        diagnostics.push(
          diagnostic(
            "ik-inspect-malformed",
            `${node.id}.keyframes.${spelling.path}`,
            `Solver "${node.id}" has a malformed inspect switch; use one static boolean.`,
            [node.id],
          ),
        );
        break;
      default:
        unreachable(inspect);
    }
  }
}

function validateSolverBend(
  node: GraphNode,
  roots: ReadonlySet<string>,
  diagnostics: Diagnostic[],
): void {
  const bends = solverSpellings(node, BEND_KEY, roots, diagnostics);
  const flips = solverSpellings(node, FLIP_KEY, roots, diagnostics);
  for (const spelling of bends) {
    const bend = classifyBend(spelling.value);
    switch (bend.kind) {
      case "absent":
      case "bend":
        break;
      case "malformed":
        diagnostics.push(
          diagnostic(
            "ik-bend-malformed",
            `${node.id}.keyframes.${spelling.path}`,
            `Solver "${node.id}" has a malformed bend hint; use "positive" or "negative".`,
            [node.id],
          ),
        );
        break;
      default:
        unreachable(bend);
    }
  }
  const [bend] = bends;
  if (bend !== undefined && flips.length > 0) {
    diagnostics.push(
      diagnostic(
        "ik-bend-conflicts-flip",
        `${node.id}.keyframes.${bend.path}`,
        `Solver "${node.id}" authors both "bend" and "flip"; use one bend spelling.`,
        [node.id],
      ),
    );
  }
}

function validateSolverPole(
  node: GraphNode,
  roots: ReadonlySet<string>,
  diagnostics: Diagnostic[],
): void {
  for (const group of [...slotBinders(node, POLE_SLOT)].sort()) {
    // An undeclared pole is the registry's `plugin-unknown-requirement`, one rule for one mistake.
    if (!declaresPole(group) || roots.has(group)) continue;
    diagnostics.push(
      diagnostic(
        "ik-pole-without-chain",
        `${node.id}.keyframes.${group}.requires.${POLE_SLOT}`,
        `Node "${node.id}" binds pole under ${group} without binding root there; no chain solved there bends toward it.`,
        [node.id],
      ),
    );
  }
}

export function validateSolverConstraints(
  nodes: readonly GraphNode[],
  diagnostics: Diagnostic[],
): void {
  for (const node of nodes) {
    validateMemberLimits(node, diagnostics);
    const roots = slotBinders(node, "root");
    validateSolverBend(node, roots, diagnostics);
    validateSolverInspect(node, roots, diagnostics);
    validateSolverPole(node, roots, diagnostics);
  }
}

/**
 * Whether a solve reads one member's goal influence, decided by `resolveSolvers`.
 *
 * `addressed` is a leaf the solve reaches toward a goal with, `unaddressed` a member it provably
 * does not, and `undecided` a member of a chain whose goals could not be resolved (a broken chain,
 * no goal, both goal spellings, a bare target over several leaves, a leaf the dict missed, or a
 * refused goal). Undecided members are never refused as `ik-influence-without-goal`, because each of
 * those shapes already has its own diagnostic and one cause is not reported twice.
 */
export type GoalReach = "addressed" | "unaddressed" | "undecided";

/** Every solver member's goal reach, keyed by member id. A node absent from it is `undecided`. */
export type GoalScope = ReadonlyMap<string, GoalReach>;

/**
 * How strongly each reach wins when one member belongs to more than one solve. `undecided` wins so
 * no rule speaks over an unresolved chain, and `addressed` beats `unaddressed` because the flat bag
 * reaches every solve the member is in, so one solve reading the influence is enough to place it.
 */
const REACH_PRECEDENCE: Readonly<Record<GoalReach, number>> = Object.freeze({
  unaddressed: 0,
  addressed: 1,
  undecided: 2,
});

/** Records one solve's answer for one member, combining it with any earlier solve's answer. */
export function recordGoalReach(
  scope: Map<string, GoalReach>,
  memberId: string,
  reach: GoalReach,
): void {
  const previous = scope.get(memberId);
  if (previous === undefined || REACH_PRECEDENCE[reach] > REACH_PRECEDENCE[previous])
    scope.set(memberId, reach);
}

function influenceWithoutGoal(
  node: GraphNode,
  spelling: AuthoredSpelling,
  why: string,
): Diagnostic {
  return diagnostic(
    "ik-influence-without-goal",
    `${node.id}.keyframes.${spelling.path}`,
    `Member "${node.id}" authors influence ${why}; influence weighs a goal and belongs on an addressed chain leaf.`,
    [node.id],
  );
}

function validateMemberInfluence(
  node: GraphNode,
  scope: GoalScope,
  diagnostics: Diagnostic[],
): void {
  const binders = slotBinders(node, "solver");
  if (binders.size === 0) return;
  let placed: AuthoredSpelling | undefined;
  for (const spelling of authoredSpellings(node.track.keyframes, INFLUENCE_KEY)) {
    if (!reachesSolve(spelling, binders)) {
      const why = `under ${spelling.group}, which did not bind its solver`;
      diagnostics.push(influenceWithoutGoal(node, spelling, why));
      continue;
    }
    // `keyframes-duplicate-key` refuses a second spelling of one key, so the first is the one.
    placed ??= spelling;
  }
  if (placed === undefined) return;
  const reach = scope.get(node.id) ?? "undecided";
  switch (reach) {
    case "unaddressed":
      // Placement first: a value no solve reads is refused for where it is, not classified.
      diagnostics.push(influenceWithoutGoal(node, placed, "but no goal addresses it"));
      return;
    case "addressed":
    case "undecided":
      break;
    default:
      unreachable(reach);
  }
  const influence = classifyInfluence(placed.value);
  switch (influence.kind) {
    case "valid":
      return;
    case "malformed":
      diagnostics.push(
        diagnostic(
          "ik-influence-malformed",
          `${node.id}.keyframes.${placed.path}`,
          `Member "${node.id}" has a malformed influence; use one static finite number greater than 0.`,
          [node.id],
        ),
      );
      return;
    default:
      unreachable(influence);
  }
}

/** The influence rules, run after `resolveSolvers` has resolved every solve's goals into `scope`. */
export function validateGoalInfluence(
  nodes: readonly GraphNode[],
  scope: GoalScope,
  diagnostics: Diagnostic[],
): void {
  for (const node of nodes) validateMemberInfluence(node, scope, diagnostics);
}
