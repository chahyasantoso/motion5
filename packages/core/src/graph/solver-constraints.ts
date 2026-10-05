import { unreachable } from "../lang/exhaustive";
import {
  authoredSpellings,
  AXIS_KEYS,
  AXIS_X_KEY,
  AXIS_Y_KEY,
  AXIS_Z_KEY,
  BEND_KEY,
  classifyJoint,
  JOINT_KEY,
  JOINT_KINDS,
  JOINT_ONLY_KEYS,
  JOINT_VOCABULARY_KEYS,
  MAX_ROTATION_KEY,
  MAX_SWING_KEY,
  MAX_TWIST_KEY,
  MIN_ROTATION_KEY,
  MIN_TWIST_KEY,
  type JointBoundKey,
  type JointVocabularyKey,
  classifyBend,
  classifyInfluence,
  classifyOrient,
  classifyInspect,
  type InfluenceAuthored,
  type OrientAuthored,
  classifyLimit,
  FLIP_KEY,
  INFLUENCE_KEY,
  ORIENT_KEY,
  INSPECT_KEY,
  LIMIT_KEYS,
  type AuthoredSpelling,
  type LimitKey,
  type SolverKey,
} from "../contract/solver-constraints";
import { diagnostic } from "../contract/diagnostics";
import { POLE_SLOT } from "../contract/solver-shape";
import type { PluginCapabilities } from "../ports/plugin-capabilities";
import type { RuleId } from "../contract/rule-id";
import type { Diagnostic } from "../contract/v5";
import { compareCodeUnits } from "./compare";
import type { GraphNode } from "./ir";

/**
 * The load rules of the solver's authored constraints: the six of constrained 2D solving (ADR-108),
 * the inspection switch's one (ADR-109), goal influence's two (ADR-110), the 3D pole's one
 * (ADR-118), the 3D joint's two, which reuse the 2D range rules for every angle bound (ADR-123),
 * and goal orientation's two (ADR-124).
 *
 * **Every spelling, because the solve reads the flattened bag.** A member's limits reach `ik`
 * through the member's flattened values, where a `minRotation` grouped under any plugin is the same
 * key (ADR-043). Each rule therefore reads every group's spelling through `authoredSpellings`,
 * never only `fk.values`: a rule narrower than the reader it guards passes the other spelling to the
 * runtime unvalidated, which is how a keyframed bound would become an animated constraint. Every
 * spelling is grouped, since an ungrouped entry is `keyframes-ungrouped-key` (ADR-121).
 *
 * **Limit keys are solver vocabulary.** A limit is read by the solve and by nothing else, so a
 * limit anywhere a solve cannot reach it is a field accepted and ignored (ADR-033 rule 6). It must
 * sit under a group that bound a `solver` slot, which is the scope `ik-weight-without-solver`
 * already reads.
 *
 * **Solver keys belong to the node that bound `root`.** `bend`, `flip` and `inspect` are read by
 * the solver composer of the node that bound `root`, under the group that bound it, and by
 * nothing else, so the rules read exactly those spellings through `solverSpellings`: `bend` and
 * `flip` by the 2D `ik` alone, and `inspect` by `ik` and `ik3d` alike through the one opt-in reader
 * in `ik-result.ts` (ADR-120). Whether a solver plugin claims a key at all is the registry's
 * question, so `bend` under `ik3d` is its `plugin-unknown-key` rather than a rule here. The first
 * revision read `bend` and `flip` under any group on any node, which refused a third-party plugin's
 * own `spring.values.bend` on a node that is no solver at all; phase 4's first draft repeated that
 * for `inspect`, and routing it through the same reader is what keeps the scope one decision.
 *
 * **Influence and orient belong to an addressed goal.** `influence` (ADR-110) and the 3D `orient`
 * (ADR-124) are member vocabulary read through the limit scope, and each weighs the goal its leaf is
 * addressed with, the first its position's pull and the second its orientation, so each is well
 * placed only on a member the solve addresses. Both are stated by one pair of rules over
 * `GOAL_WEIGHT_RULES` rather than once per key. Which members those are is `resolveSolvers`'s
 * answer, after goal resolution, handed in as a `GoalScope` rather than re-derived here: this module
 * would otherwise be a second owner of leafhood and goal addressing. On a node that bound no solver
 * anywhere it speaks only under a 3D member group (`declaresJoint`), whose vocabulary the contract
 * owns, so an `fk3d` goal weight on a bone no solve reads is refused by name. Under any other group
 * it keeps the narrowing `ik-weight-without-solver` makes: this pass holds no registry and cannot
 * tell a 2D `fk` goal weight from another plugin's own key on a node no solve reads.
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
  return binders.has(spelling.group);
}

/**
 * The spellings of one solver key that a solve reads, refusing the ones it reads from elsewhere.
 *
 * A solver key belongs to the node that bound `root`, under the group that bound it. On a
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
        `Solver "${node.id}" authors ${key} under ${spelling.group}, which did not bind its root; author it under ${[...roots].join(", ")}.`,
        [node.id],
      ),
    );
  }
  return spellings.filter((spelling) => reachesSolve(spelling, roots));
}

function limitWithoutSolver(node: GraphNode, key: string, spelling: AuthoredSpelling): Diagnostic {
  return diagnostic(
    "ik-limit-without-solver",
    `${node.id}.keyframes.${spelling.path}`,
    `Node "${node.id}" authors ${key} under ${spelling.group} without binding a solver there; no solve reads it.`,
    [node.id],
  );
}

function validateMemberLimits(
  node: GraphNode,
  diagnostics: Diagnostic[],
  capabilities: PluginCapabilities,
): void {
  const binders = slotBinders(node, "solver");
  const values: Partial<Record<LimitKey, unknown>> = {};
  const paths: Partial<Record<LimitKey, string>> = {};
  for (const key of LIMIT_KEYS) {
    for (const spelling of authoredSpellings(node.track.keyframes, key)) {
      const capability = capabilities.capabilityOf(spelling.group);
      if (capability === undefined) continue;
      if (!reachesSolve(spelling, binders)) {
        diagnostics.push(limitWithoutSolver(node, key, spelling));
        continue;
      }
      // Under a 3D joint group the range is a hinge's, classified with its joint by
      // `validateMemberJoint`, so it is judged once, by the owner that knows what reads it.
      if (capability.joint) continue;
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

/**
 * What a malformed bound is refused as, and the domain its message names: an axis component is the
 * joint's own vocabulary, `ik-joint-malformed`, and every angle bound is refused as the 2D range
 * keys are, `ik-limit-malformed`, because it is one more static degree in a domain.
 */
function malformedBound(key: JointBoundKey): Readonly<{ ruleId: RuleId; domain: string }> {
  switch (key) {
    case MAX_SWING_KEY:
      return { ruleId: "ik-limit-malformed", domain: "one static number in [0, 180]" };
    case AXIS_X_KEY:
    case AXIS_Y_KEY:
    case AXIS_Z_KEY:
      return { ruleId: "ik-joint-malformed", domain: "one static finite number" };
    case MIN_ROTATION_KEY:
    case MAX_ROTATION_KEY:
    case MIN_TWIST_KEY:
    case MAX_TWIST_KEY:
      return { ruleId: "ik-limit-malformed", domain: "one static number in [-180, 180]" };
    default:
      return unreachable(key);
  }
}

/**
 * The 3D joint rules (ADR-123): where a joint key may sit, and what the joint a member authored is.
 *
 * **Placement.** A 3D joint is read from the member's flattened values, so a joint key reaches the
 * 3D solve from any group on a node that is a 3D member, exactly as a 2D range key reaches `ik` from
 * any group (the module note's first rule). A joint-only key is therefore well placed only under a
 * joint-declaring group that bound the solver. Anywhere else on a 3D member, under another plugin's
 * group or under a joint group that bound nothing, it is refused as `ik-limit-without-solver`, the
 * 2D range keys' own placement rule, which `validateMemberLimits` already speaks for `minRotation`
 * and `maxRotation` there; the checkpoint draft read only joint groups and so let a third-party
 * `joint` steer the solve unvalidated while the load-time strategy read the member as free. On a
 * node that is no 3D member, `joint` and its bounds are common words and belong to whichever plugin
 * claims them, which is the registry's question (`plugin-unknown-key`), not this module's.
 *
 * **Classification.** Under a joint group that bound the solver, the group's spellings are
 * classified together by `classifyJoint`, because what a bound means depends on the kind beside it.
 */
function validateMemberJoint(
  node: GraphNode,
  diagnostics: Diagnostic[],
  capabilities: PluginCapabilities,
): void {
  const binders = slotBinders(node, "solver");
  const member3d = [...binders].some((group) => capabilities.capabilityOf(group)?.joint === true);
  const bySolverGroup = new Map<string, Partial<Record<JointVocabularyKey, AuthoredSpelling>>>();
  for (const key of JOINT_VOCABULARY_KEYS) {
    for (const spelling of authoredSpellings(node.track.keyframes, key)) {
      const capability = capabilities.capabilityOf(spelling.group);
      if (capability === undefined) continue;
      const joint = capability.joint;
      if (joint && reachesSolve(spelling, binders)) {
        const group = bySolverGroup.get(spelling.group) ?? {};
        group[key] = spelling;
        bySolverGroup.set(spelling.group, group);
        continue;
      }
      // The 2D range keys' placement is `validateMemberLimits`'s, one rule for one mistake.
      if ((joint || member3d) && JOINT_ONLY_KEYS.includes(key))
        diagnostics.push(limitWithoutSolver(node, key, spelling));
    }
  }
  for (const [, spellings] of [...bySolverGroup].sort(([a], [b]) => compareCodeUnits(a, b))) {
    const values: Partial<Record<JointVocabularyKey, unknown>> = {};
    for (const key of JOINT_VOCABULARY_KEYS) {
      const spelling = spellings[key];
      if (spelling !== undefined) values[key] = spelling.value;
    }
    const at = (key: JointVocabularyKey): string =>
      `${node.id}.keyframes.${spellings[key]?.path ?? key}`;
    const joint = classifyJoint(values);
    switch (joint.kind) {
      case "valid":
        break;
      case "malformed-kind":
        diagnostics.push(
          diagnostic(
            "ik-joint-malformed",
            at(JOINT_KEY),
            `Member "${node.id}" has a malformed joint; use one static ${JOINT_KINDS.map((kind) => `"${kind}"`).join(", ")}.`,
            [node.id],
          ),
        );
        break;
      case "malformed": {
        const refusal = malformedBound(joint.key);
        diagnostics.push(
          diagnostic(
            refusal.ruleId,
            at(joint.key),
            `Member "${node.id}" has a malformed ${joint.key}; use ${refusal.domain}.`,
            [node.id],
          ),
        );
        break;
      }
      case "missing":
        diagnostics.push(
          diagnostic(
            "ik-joint-malformed",
            at(JOINT_KEY),
            `Member "${node.id}" declares joint "${joint.joint}" without ${joint.key}; a ${joint.joint} joint needs ${malformedBound(joint.key).domain}.`,
            [node.id],
          ),
        );
        break;
      case "zero-axis":
        diagnostics.push(
          diagnostic(
            "ik-joint-malformed",
            at(AXIS_KEYS.find((key) => spellings[key] !== undefined) ?? AXIS_Z_KEY),
            `Member "${node.id}" has a hinge axis with no direction; author a nonzero axisX, axisY or axisZ.`,
            [node.id],
          ),
        );
        break;
      case "unused":
        diagnostics.push(
          diagnostic(
            "ik-joint-key-unused",
            at(joint.key),
            `Member "${node.id}" authors ${joint.key}, which a ${joint.joint} joint does not read; declare the joint that reads it or remove it.`,
            [node.id],
          ),
        );
        break;
      case "empty":
        diagnostics.push(
          diagnostic(
            "ik-limit-empty",
            at(joint.key),
            `Member "${node.id}" has an empty angle limit range [${joint.min}, ${joint.max}].`,
            [node.id],
          ),
        );
        break;
      default:
        unreachable(joint);
    }
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
  capabilities: PluginCapabilities,
): void {
  for (const group of [...slotBinders(node, POLE_SLOT)].sort()) {
    // An undeclared pole is the registry's `plugin-unknown-requirement`, one rule for one mistake.
    if (capabilities.capabilityOf(group)?.pole !== true || roots.has(group)) continue;
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
  capabilities: PluginCapabilities,
): void {
  for (const node of nodes) {
    validateMemberLimits(node, diagnostics, capabilities);
    validateMemberJoint(node, diagnostics, capabilities);
    const roots = slotBinders(node, "root");
    validateSolverBend(node, roots, diagnostics);
    validateSolverInspect(node, roots, diagnostics);
    validateSolverPole(node, roots, diagnostics, capabilities);
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
 * no rule speaks over an unresolved chain, and `addressed` beats `unaddressed` because the
 * flattened bag reaches every solve the member is in, so one solve reading the influence is enough to place it.
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

/**
 * One weight a member authors on the goal its leaf is addressed with, as the goal-weight rules read
 * it: the key, its two rule ids, the phrase each refusal names it by, and its classifier.
 *
 * `influence` (ADR-110) and `orient` (ADR-124) are placed by one rule and classified by another,
 * and the placement question is the same for both: a goal weight is read only on a member the solve
 * addresses, from the spelling under the group that bound its solver. So the rules are stated once
 * over this record rather than once per key, and a key's own facts are the only thing each entry
 * says. `classify` answers the static-and-in-domain question through the contract's own classifier,
 * reduced to whether the spelling is valid, which is all the rule reads of it.
 */
interface GoalWeightRule {
  readonly key: typeof INFLUENCE_KEY | typeof ORIENT_KEY;
  readonly withoutGoal: RuleId;
  readonly malformed: RuleId;
  readonly purpose: string;
  readonly domain: string;
  readonly valid: (value: unknown) => boolean;
}

/**
 * Whether one classified goal weight is valid, the one exhaustive reading of the `valid | malformed`
 * shape `classifyInfluence` and `classifyOrient` share, so neither rule restates the switch.
 */
function isValidWeight(authored: InfluenceAuthored | OrientAuthored): boolean {
  switch (authored.kind) {
    case "valid":
      return true;
    case "malformed":
      return false;
    default:
      return unreachable(authored);
  }
}

const GOAL_WEIGHT_RULES: readonly GoalWeightRule[] = Object.freeze([
  {
    key: INFLUENCE_KEY,
    withoutGoal: "ik-influence-without-goal",
    malformed: "ik-influence-malformed",
    purpose: "weighs a goal",
    domain: "one static finite number greater than 0",
    valid: (value: unknown): boolean => isValidWeight(classifyInfluence(value)),
  },
  {
    key: ORIENT_KEY,
    withoutGoal: "ik-orient-without-goal",
    malformed: "ik-orient-malformed",
    purpose: "weighs a goal's orientation",
    domain: "one static finite number from 0 to 1",
    valid: (value: unknown): boolean => isValidWeight(classifyOrient(value)),
  },
]);

function weightWithoutGoal(
  node: GraphNode,
  rule: GoalWeightRule,
  spelling: AuthoredSpelling,
  why: string,
): Diagnostic {
  return diagnostic(
    rule.withoutGoal,
    `${node.id}.keyframes.${spelling.path}`,
    `Member "${node.id}" authors ${rule.key} ${why}; ${rule.key} ${rule.purpose} and belongs on an addressed chain leaf.`,
    [node.id],
  );
}

/**
 * One goal weight on one member: refused where no solve reads it, then classified.
 *
 * Placement first, as for every member rule here: a spelling under a group that did not bind the
 * member's solver never reaches the solve, and a placed value on a member no goal addresses is read
 * by nothing, so each is refused for where it is rather than classified. An `undecided` member is
 * classified but never placed, because its chain's own diagnostic already names the cause.
 */
function validateMemberGoalWeight(
  node: GraphNode,
  rule: GoalWeightRule,
  binders: ReadonlySet<string>,
  scope: GoalScope,
  diagnostics: Diagnostic[],
  capabilities: PluginCapabilities,
): void {
  let placed: AuthoredSpelling | undefined;
  for (const spelling of authoredSpellings(node.track.keyframes, rule.key)) {
    const capability = capabilities.capabilityOf(spelling.group);
    if (capability === undefined) continue;
    if (!reachesSolve(spelling, binders)) {
      // No registry here: on a node that bound no solver, only a 3D member group's key is known.
      if (binders.size === 0 && !capability.joint) continue;
      const why = `under ${spelling.group}, which did not bind its solver`;
      diagnostics.push(weightWithoutGoal(node, rule, spelling, why));
      continue;
    }
    // `keyframes-duplicate-key` refuses a second spelling of one key, so the first is the one.
    placed ??= spelling;
  }
  if (placed === undefined) return;
  const reach = scope.get(node.id) ?? "undecided";
  switch (reach) {
    case "unaddressed":
      diagnostics.push(weightWithoutGoal(node, rule, placed, "but no goal addresses it"));
      return;
    case "addressed":
    case "undecided":
      break;
    default:
      unreachable(reach);
  }
  if (rule.valid(placed.value)) return;
  diagnostics.push(
    diagnostic(
      rule.malformed,
      `${node.id}.keyframes.${placed.path}`,
      `Member "${node.id}" has a malformed ${rule.key}; use ${rule.domain}.`,
      [node.id],
    ),
  );
}

/**
 * The goal-weight rules, `influence` then `orient` on each member, run after `resolveSolvers` has
 * resolved every solve's goals into `scope`. A node that bound no solver anywhere is read only
 * under a 3D member group (`declaresJoint`); everywhere else it keeps the narrowing
 * `ik-weight-without-solver` makes, because this pass holds no registry and cannot tell a 2D goal
 * weight from another plugin's own key on a node no solve reads.
 */
export function validateGoalWeights(
  nodes: readonly GraphNode[],
  scope: GoalScope,
  diagnostics: Diagnostic[],
  capabilities: PluginCapabilities,
): void {
  for (const node of nodes) {
    const binders = slotBinders(node, "solver");
    for (const rule of GOAL_WEIGHT_RULES)
      validateMemberGoalWeight(node, rule, binders, scope, diagnostics, capabilities);
  }
}
