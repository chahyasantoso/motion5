import {
  BASE_RULE_IDS,
  CONTRIBUTION_RULE_IDS,
  KEYFRAME_RULE_IDS,
  type BaseRuleId,
  type ContributionRuleId,
  type KeyframeRuleId,
  type RuleId,
} from "./rule-id";

/**
 * Which rules own an `ids` payload, which is the one fact `Diagnostic.ids` is discriminated by.
 *
 * `ids` was `readonly string[] | undefined` for every rule alike, so a diagnostic could carry ids
 * its rule never names, and a reader had no way to tell a payload that was missing from a rule that
 * has none. The three groups below are derived from one record, so a rule added to the enumeration
 * fails `typecheck` here, at the one place its payload is answered, rather than inheriting whichever
 * group was written first.
 *
 * The groups are ownership rather than arity, which corrects ADR-097's plan against the measurement
 * that followed it. Arity is not checkable where a diagnostic is built: every `ids` in this tree
 * arrives through `Object.freeze([...])`, which widens a two-element literal to `readonly string[]`
 * before any type sees it, so a `readonly [string, string]` field would refuse the code that already
 * builds it correctly. Arity is not single-valued either: `observation-source` names one id at one
 * site and none at another, `plugin-unknown-key` names one at three sites and two at a fourth, and
 * `plugin-contribution-shape` names one at one site and two at another. Declaring a fixed arity
 * would have meant declaring the wrong one for three rules to keep the build green, which is the
 * per-rule lie one level down. Ownership is the part of the claim that is both true and enforced, so
 * it is the only part stated in the type. See ADR-097 and issue #449.
 */
export type IdsOwnership = "none" | "always" | "sometimes";

/**
 * Which ids each rule of the base family owns.
 *
 * `satisfies Record<BaseRuleId, IdsOwnership>` rather than an annotation, so the record keeps its
 * literal values and the groups below can be derived from it. The `satisfies` is the exhaustive
 * read: a record keyed by the union is as closed as a `switch` ending at `unreachable`, which is the
 * argument `SCOPED_RULE_ID` in `./rule-id` already makes, and a rule added to `BASE_RULE_IDS`
 * without an answer here fails `typecheck` at this record. `domain/exhaustive` is deliberately not
 * imported, because the contract layer does not read the domain layer for a totality it can state in
 * the type. See ADR-092.
 *
 * Declaration order follows `BASE_RULE_IDS`, so a reader comparing the two reads them in the same
 * sequence. Every keyframe rule and every contributed spelling of one owns no ids, which is stated
 * once in `IDLESS_RULE_IDS` below rather than repeated as 48 more entries here.
 *
 * `live-value-key`, `stale-motion-handle` and `stale-track-handle` answer `"sometimes"` because
 * nothing measures them: each is minted on an error class and none is ever assigned to a
 * `Diagnostic.ruleId`, so no construction site exists whose payload could be read. Absence of a
 * measurement cannot justify requiring a payload, and it cannot justify refusing one either.
 */
const BASE_IDS_OWNERSHIP = {
  "blocked-upstream": "always",
  "clock-consumer-failure": "always",
  "clock-tick-regression": "always",
  "composition-failure": "always",
  "composition-output-shape": "always",
  "diagnostic-sink-failure": "always",
  "flush-failure": "always",
  "free-tracks-shape": "none",
  "graph-cycle": "always",
  "id-qualified-separator": "none",
  "id-reserved-namespace": "none",
  "id-shape": "none",
  "ik-goal-conflict": "always",
  "ik-goal-duplicate": "always",
  "ik-goal-not-leaf": "always",
  "ik-goal-unknown-member": "always",
  "ik-leaf-without-goal": "always",
  "ik-mode-ambiguous": "always",
  "ik-solved-rotation-dead": "always",
  "ik-solver-no-goal": "always",
  "ik-solver-no-members": "always",
  "ik-solver-no-root": "always",
  "ik-solver-unreachable-root": "always",
  "ik-target-not-single-leaf": "always",
  "ik-weight-without-solver": "always",
  "live-value-key": "sometimes",
  "motion-duplicate": "always",
  "motion-duplicate-id": "always",
  "motion-id": "none",
  "motion-shape": "none",
  "motion-tracks-shape": "none",
  "motions-shape": "none",
  "node-duplicate": "always",
  "observation-duplicate": "always",
  "observation-input-shape": "always",
  "observation-missing-upstream": "always",
  "observation-output-shape": "always",
  "observation-pending-reference": "always",
  "observation-projection-unsupported": "none",
  "observation-role-unsupported": "none",
  "observation-self-reference": "always",
  "observation-source": "sometimes",
  "observation-target-unsupported": "none",
  "observation-unknown-source": "always",
  "observes-shape": "none",
  "perspective-shape": "none",
  "perspective-usage": "always",
  "plugin-ambiguous-key": "always",
  "plugin-contribution-cascade": "always",
  "plugin-contribution-ease-collision": "always",
  "plugin-contribution-failure": "always",
  "plugin-contribution-key-collision": "always",
  "plugin-contribution-output-collision": "always",
  "plugin-contribution-reserved-tween-var": "always",
  "plugin-contribution-shape": "always",
  "plugin-contribution-static-unsupported": "always",
  "plugin-contribution-tween-vars-conflict": "always",
  "plugin-contribution-unsupported-entry": "always",
  "plugin-duplicate-output": "always",
  "plugin-duplicate-serializer": "always",
  "plugin-requirement-dict-required": "always",
  "plugin-requirement-dict-unsupported": "always",
  "plugin-serializer-without-output": "always",
  "plugin-unknown-key": "always",
  "plugin-unknown-requirement": "always",
  "project-id": "none",
  "project-release-failed": "none",
  "project-shape": "none",
  "project-templates-unsupported": "none",
  "reentrant-flush-deferred": "always",
  "requirement-source": "always",
  "scheduler-failure": "always",
  "schema-v4-migration": "sometimes",
  "schema-version": "none",
  "stale-motion-handle": "sometimes",
  "stale-track-handle": "sometimes",
  "track-duplicate-id": "always",
  "track-id": "none",
  "track-shape": "none",
  "trigger-driver-unavailable": "always",
  "trigger-scroll-source": "none",
  "trigger-shape": "none",
  "trigger-time-autoplay-unsupported": "none",
  "trigger-time-duration": "none",
  "trigger-time-repeat-shape": "none",
  "trigger-time-yoyo-requires-repeat": "none",
  "trigger-time-yoyo-shape": "none",
  "value-batch-deferred": "always",
} as const satisfies Record<BaseRuleId, IdsOwnership>;

type BaseIdsOwnership = typeof BASE_IDS_OWNERSHIP;

/** Every base rule whose answer is `Ownership`, as a union rather than as a filtered array. */
type BaseRuleIdOwning<Ownership extends IdsOwnership> = {
  readonly [Rule in BaseRuleId]: BaseIdsOwnership[Rule] extends Ownership ? Rule : never;
}[BaseRuleId];

/** A rule that names no ids. Its diagnostics declare `ids?: undefined`. */
export type IdlessRuleId = BaseRuleIdOwning<"none"> | KeyframeRuleId | ContributionRuleId;

/** A rule every construction site of which names ids. Its diagnostics require `ids`. */
export type IdentifiedRuleId = BaseRuleIdOwning<"always">;

/** A rule whose sites disagree, or that has none at all. Its diagnostics leave `ids` optional. */
export type OptionalIdsRuleId = BaseRuleIdOwning<"sometimes">;

/** A rule id in no group, which the three above leave unrepresentable. */
export type UngroupedRuleId = Exclude<RuleId, IdlessRuleId | IdentifiedRuleId | OptionalIdsRuleId>;

/**
 * The proof that the three groups partition `RuleId`, stated as a constraint rather than as a case.
 *
 * `UngroupedRuleId` is `never` while the partition holds, so the default argument satisfies the
 * constraint and this declaration compiles. A rule id reaching no group makes it a real union, the
 * default stops satisfying `extends never`, and this declaration is the build failure. The run-time
 * half is in `rule-id.test.ts`, because no type can observe the arrays below.
 */
export type EveryRuleIdIsGrouped<Ungrouped extends never = UngroupedRuleId> = Ungrouped;

/**
 * The base rules answering one ownership, as values.
 *
 * The assertion is the type guard a `filter` predicate cannot state: the comparison proves the
 * ownership at run time, and the compiler cannot carry that proof into the element type. It is
 * confined here, and the partition case in `rule-id.test.ts` reads the result rather than trusting
 * it.
 */
function baseRulesOwning<Ownership extends IdsOwnership>(
  ownership: Ownership,
): readonly BaseRuleIdOwning<Ownership>[] {
  return BASE_RULE_IDS.filter(
    (rule) => BASE_IDS_OWNERSHIP[rule] === ownership,
  ) as readonly BaseRuleIdOwning<Ownership>[];
}

/** Every rule that names no ids: base, authored keyframe and contributed keyframe alike. */
export const IDLESS_RULE_IDS: readonly IdlessRuleId[] = Object.freeze([
  ...baseRulesOwning("none"),
  ...KEYFRAME_RULE_IDS,
  ...CONTRIBUTION_RULE_IDS,
]);

/** Every rule that always names ids. */
export const IDENTIFIED_RULE_IDS: readonly IdentifiedRuleId[] = Object.freeze([
  ...baseRulesOwning("always"),
]);

/** Every rule that may name ids. */
export const OPTIONAL_IDS_RULE_IDS: readonly OptionalIdsRuleId[] = Object.freeze([
  ...baseRulesOwning("sometimes"),
]);
