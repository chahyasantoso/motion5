import {
  CONTRIBUTION_RULE_ID_PREFIX,
  KEYFRAME_RULE_IDS,
  contributionRuleId,
  type BaseRuleId,
  type ContributionRuleName,
  type KeyframeRuleId,
  type RuleId,
} from "./rule-id";

/**
 * How loudly a rule refuses.
 *
 * Fixed where the rule is defined and nowhere else. It was a constructor parameter with a default,
 * which made a rule's own answer a suggestion: a caller could overrule it by passing something else,
 * and overrode it silently by passing nothing, so every warning rule reported by such a caller
 * produced an error diagnostic that nothing noticed. See ADR-097 and issue #449.
 */
export type RuleSeverity = "error" | "warning";

/**
 * Whether a rule names ids in its payload.
 *
 * Two answers rather than three. `"sometimes"` had exactly two causes and neither survives
 * measurement: `observation-source` reported two different refusals under one id and is split, and
 * the three handle rules are minted on thrown error classes with no construction site at all.
 * Absence of a measurement is not a third answer.
 */
export type IdsOwnership = "none" | "always";

/** What a rule fixes about itself, once, where it is defined. */
export interface RuleFacts {
  readonly severity: RuleSeverity;
  readonly ids: IdsOwnership;
}

// The four combinations, named once rather than spelled out at every member. Each is `as const`, so
// a type-level lookup through the records below still reads a literal and `RuleIdOwning` can derive
// from it.
const ERROR_NO_IDS = { severity: "error", ids: "none" } as const;
const ERROR_WITH_IDS = { severity: "error", ids: "always" } as const;
const WARNING_NO_IDS = { severity: "warning", ids: "none" } as const;
const WARNING_WITH_IDS = { severity: "warning", ids: "always" } as const;

/**
 * What each rule of the base family fixes about itself.
 *
 * `satisfies Record<BaseRuleId, RuleFacts>` rather than an annotation, so the record keeps its
 * literal values and every derivation below reads them. The `satisfies` is the exhaustive read: a
 * rule added to `BASE_RULE_IDS` without an answer here fails `typecheck` at this record, which is the
 * argument `SCOPED_RULE_ID` in `./rule-id` already makes. `lang/exhaustive` is deliberately not
 * imported, because the contract layer does not read the domain layer for a totality it can state in
 * the type. See ADR-092 and ADR-099.
 *
 * Declaration order follows `BASE_RULE_IDS`, so a reader comparing the two reads them in the same
 * sequence. `RuleId` is not `keyof typeof` this record: `./rule-id` keeps owning which rules exist,
 * and deriving the union here would put the contributed family in a second hand-maintained list
 * beside the one it is derived from, which is what issue #283 refused.
 */
const BASE_RULES = {
  "blocked-upstream": ERROR_WITH_IDS,
  "clock-consumer-failure": ERROR_WITH_IDS,
  "clock-tick-regression": ERROR_WITH_IDS,
  "composition-failure": ERROR_WITH_IDS,
  "composition-output-shape": ERROR_WITH_IDS,
  "diagnostic-sink-failure": ERROR_WITH_IDS,
  "flush-failure": ERROR_WITH_IDS,
  "free-tracks-shape": ERROR_NO_IDS,
  "graph-cycle": ERROR_WITH_IDS,
  "id-qualified-separator": ERROR_NO_IDS,
  "id-reserved-namespace": ERROR_NO_IDS,
  "id-shape": ERROR_NO_IDS,
  "ik-bend-conflicts-flip": ERROR_WITH_IDS,
  "ik-bend-malformed": ERROR_WITH_IDS,
  "ik-chain-unsupported": ERROR_WITH_IDS,
  "ik-goal-conflict": ERROR_WITH_IDS,
  "ik-goal-duplicate": ERROR_WITH_IDS,
  "ik-goal-not-leaf": ERROR_WITH_IDS,
  "ik-goal-unknown-member": ERROR_WITH_IDS,
  "ik-influence-malformed": ERROR_WITH_IDS,
  "ik-influence-without-goal": ERROR_WITH_IDS,
  "ik-inspect-malformed": ERROR_WITH_IDS,
  "ik-leaf-without-goal": ERROR_WITH_IDS,
  "ik-limit-empty": ERROR_WITH_IDS,
  "ik-limit-malformed": ERROR_WITH_IDS,
  "ik-limit-without-solver": ERROR_WITH_IDS,
  "ik-mode-ambiguous": ERROR_WITH_IDS,
  "ik-solved-rotation-dead": ERROR_WITH_IDS,
  "ik-solver-key-misgrouped": ERROR_WITH_IDS,
  "ik-solver-no-goal": ERROR_WITH_IDS,
  "ik-solver-no-members": ERROR_WITH_IDS,
  "ik-solver-no-root": ERROR_WITH_IDS,
  "ik-solver-unreachable-root": ERROR_WITH_IDS,
  "ik-target-not-single-leaf": ERROR_WITH_IDS,
  "ik-weight-without-solver": ERROR_WITH_IDS,
  "live-value-key": ERROR_NO_IDS,
  "motion-duplicate": ERROR_WITH_IDS,
  "motion-duplicate-id": ERROR_WITH_IDS,
  "motion-id": ERROR_NO_IDS,
  "motion-shape": ERROR_NO_IDS,
  "motion-tracks-shape": ERROR_NO_IDS,
  "motions-shape": ERROR_NO_IDS,
  "node-duplicate": ERROR_WITH_IDS,
  "observation-duplicate": ERROR_WITH_IDS,
  "observation-input-shape": ERROR_WITH_IDS,
  "observation-missing-upstream": ERROR_WITH_IDS,
  "observation-output-shape": ERROR_WITH_IDS,
  "observation-pending-reference": WARNING_WITH_IDS,
  "observation-projection-unsupported": ERROR_NO_IDS,
  "observation-role-unsupported": ERROR_NO_IDS,
  "observation-self-reference": ERROR_WITH_IDS,
  "observation-source": ERROR_WITH_IDS,
  "observation-source-shape": ERROR_NO_IDS,
  "observation-target-unsupported": ERROR_NO_IDS,
  "observation-unknown-source": ERROR_WITH_IDS,
  "observes-shape": ERROR_NO_IDS,
  "perspective-shape": ERROR_NO_IDS,
  "perspective-usage": WARNING_WITH_IDS,
  "plugin-ambiguous-key": ERROR_WITH_IDS,
  "plugin-contribution-cascade": ERROR_WITH_IDS,
  "plugin-contribution-ease-collision": ERROR_WITH_IDS,
  "plugin-contribution-failure": ERROR_WITH_IDS,
  "plugin-contribution-key-collision": ERROR_WITH_IDS,
  "plugin-contribution-output-collision": ERROR_WITH_IDS,
  "plugin-contribution-reserved-tween-var": ERROR_WITH_IDS,
  "plugin-contribution-shape": ERROR_WITH_IDS,
  "plugin-contribution-static-unsupported": ERROR_WITH_IDS,
  "plugin-contribution-tween-vars-conflict": ERROR_WITH_IDS,
  "plugin-contribution-unsupported-entry": ERROR_WITH_IDS,
  "plugin-duplicate-output": ERROR_WITH_IDS,
  "plugin-duplicate-serializer": ERROR_WITH_IDS,
  "plugin-requirement-dict-required": ERROR_WITH_IDS,
  "plugin-requirement-dict-unsupported": ERROR_WITH_IDS,
  "plugin-serializer-without-output": ERROR_WITH_IDS,
  "plugin-unknown-key": ERROR_WITH_IDS,
  "plugin-unknown-requirement": ERROR_WITH_IDS,
  "project-id": ERROR_NO_IDS,
  "project-release-failed": ERROR_NO_IDS,
  "project-shape": ERROR_NO_IDS,
  "project-templates-unsupported": ERROR_NO_IDS,
  "reentrant-flush-deferred": WARNING_WITH_IDS,
  "reentrant-flush-deferred-frame": WARNING_NO_IDS,
  "requirement-source": ERROR_WITH_IDS,
  "scheduler-failure": ERROR_WITH_IDS,
  "schema-v4-migration": ERROR_NO_IDS,
  "schema-version": ERROR_NO_IDS,
  "stale-motion-handle": ERROR_NO_IDS,
  "stale-track-handle": ERROR_NO_IDS,
  "track-duplicate-id": ERROR_WITH_IDS,
  "track-id": ERROR_NO_IDS,
  "track-shape": ERROR_NO_IDS,
  "trigger-driver-unavailable": ERROR_WITH_IDS,
  "trigger-scroll-source": ERROR_NO_IDS,
  "trigger-shape": ERROR_NO_IDS,
  "trigger-time-autoplay-unsupported": ERROR_NO_IDS,
  "trigger-time-duration": ERROR_NO_IDS,
  "trigger-time-repeat-shape": ERROR_NO_IDS,
  "trigger-time-yoyo-requires-repeat": ERROR_NO_IDS,
  "trigger-time-yoyo-shape": ERROR_NO_IDS,
  "value-batch-deferred": WARNING_WITH_IDS,
} as const satisfies Record<BaseRuleId, RuleFacts>;

/**
 * What each authored keyframe rule fixes about itself.
 *
 * Declaration order follows `KEYFRAME_RULE_IDS`, which follows the construction order in
 * `contract/validate-v5.ts`. Every member owns no ids, and the two `stop-missing-` rules are the
 * keyframe family's warnings.
 */
const KEYFRAME_RULES = {
  "keyframes-shape": ERROR_NO_IDS,
  "keyframes-reserved-separator": ERROR_NO_IDS,
  "keyframes-duplicate-key": ERROR_NO_IDS,
  "stop-position": ERROR_NO_IDS,
  "stop-position-range": ERROR_NO_IDS,
  "stop-position-order": ERROR_NO_IDS,
  "stop-position-duplicate": ERROR_NO_IDS,
  "stop-missing-start": WARNING_NO_IDS,
  "stop-missing-end": WARNING_NO_IDS,
  "property-stops-wrapper": ERROR_NO_IDS,
  "stops-shape": ERROR_NO_IDS,
  "keyframes-requires-dict-empty": ERROR_NO_IDS,
  "keyframes-requires-dict-key": ERROR_NO_IDS,
  "keyframes-requires-dict-source": ERROR_NO_IDS,
  "keyframes-requires-shape": ERROR_NO_IDS,
  "keyframes-requires-empty": ERROR_NO_IDS,
  "keyframes-requires-slot": ERROR_NO_IDS,
  "keyframes-targets-shape": ERROR_NO_IDS,
  "keyframes-requires-source": ERROR_NO_IDS,
  "keyframes-values-shape": ERROR_NO_IDS,
  "keyframes-values-empty": ERROR_NO_IDS,
  "keyframes-unknown-section": ERROR_NO_IDS,
  "keyframes-reserved-section": ERROR_NO_IDS,
  "keyframes-missing-values-section": ERROR_NO_IDS,
} as const satisfies Record<KeyframeRuleId, RuleFacts>;

type BaseRules = typeof BASE_RULES;
type KeyframeRules = typeof KEYFRAME_RULES;

/**
 * The contributed family's facts, derived from the keyframe record by key remapping.
 *
 * A contributed id is a spelling of a keyframe rule, so it inherits that rule's answers rather than
 * repeating them as 24 more entries. This is the same refusal `ContributionRuleId` already makes in
 * `./rule-id`, and it applies the one alias map that module owns.
 */
type ContributionRules = {
  readonly [Name in KeyframeRuleId as `${typeof CONTRIBUTION_RULE_ID_PREFIX}${ContributionRuleName<Name>}`]: KeyframeRules[Name];
};

// The cast is confined here for the reason `CONTRIBUTION_RULE_IDS` in `./rule-id` confines its own:
// `Object.fromEntries` answers an index signature, and a derived family needs exactly one expression
// that mints its members. The keys come from `contributionRuleId`, which is the expression the type
// above derives through, so the two cannot disagree about a spelling.
const CONTRIBUTION_RULES = Object.freeze(
  Object.fromEntries(
    KEYFRAME_RULE_IDS.map((name) => [contributionRuleId(name), KEYFRAME_RULES[name]]),
  ),
) as ContributionRules;

type AllRules = BaseRules & KeyframeRules & ContributionRules;

/**
 * Every rule's facts, as one record.
 *
 * Annotated by `RuleId` rather than being the source of it, so `./rule-id` keeps owning which rules
 * exist and this owns what each one is. A rule missing here fails `typecheck` at this annotation.
 */
export const RULES: Readonly<Record<RuleId, RuleFacts>> = Object.freeze({
  ...BASE_RULES,
  ...KEYFRAME_RULES,
  ...CONTRIBUTION_RULES,
});

/**
 * The severity a rule refuses at, and the only expression in the tree that answers the question.
 *
 * A diagnostic's `severity` is derived through this and through nothing else. The constructor in
 * `contract/diagnostics.ts` has no `severity` parameter, so there is no argument position in which a
 * call site could name one, and the claim this docblock used to withhold is true rather than
 * aspirational. Nineteen sites named one and are converted in the same request that deleted the
 * parameter; each named the severity its rule already fixes, so no diagnostic moved. That number is
 * what was converted rather than a total, and `typecheck` on the published commit is what closes the
 * difference. Nothing else spells a severity of its own any more: the four raw object literals in
 * `graph/order.ts`, `graph/references.ts` and `runtime/graph-publisher.ts` were the last of the
 * second ownership, and all four forward through the constructor now. So this is not merely the only
 * expression that answers the question, it is the only one that can.
 * See ADR-097 and issue #449.
 */
export function ruleSeverity(ruleId: RuleId): RuleSeverity {
  return RULES[ruleId].severity;
}

/** Every rule whose answer is `Ownership`, as a union rather than as a filtered array. */
export type RuleIdOwning<Ownership extends IdsOwnership> = {
  readonly [Rule in RuleId]: AllRules[Rule]["ids"] extends Ownership ? Rule : never;
}[RuleId];

/** A rule every construction site of which names ids. */
export type IdentifiedRuleId = RuleIdOwning<"always">;

/**
 * The `ids` argument list a producer takes, derived from the rule id it was handed.
 *
 * A rule that owns no ids takes no argument, a rule that always names them requires one, and a rule
 * id known only as `RuleId` leaves it optional. Each `extends` is guarded by a one-element tuple, and
 * the guard is load-bearing rather than a spelling: a naked conditional distributes over a union, so
 * `OwnedIds<RuleId>` would answer once per member and collapse to the union of both lists, which is
 * every existing caller broken rather than one boundary left open. Guarded, the open case answers
 * once and answers optional, which is what a producer forwarding a `RuleId` needs.
 *
 * With `IdsOwnership` down to two answers there is no `"sometimes"` list left to fall through to, so
 * the optional case is reached only by a rule id the compiler knows nothing more specific about. See
 * ADR-097 and issue #449.
 */
export type OwnedIds<Rule extends RuleId> = [Rule] extends [RuleIdOwning<"none">]
  ? []
  : [Rule] extends [RuleIdOwning<"always">]
    ? [ids: readonly string[]]
    : [ids?: readonly string[]];
