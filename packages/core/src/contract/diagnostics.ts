import type { OwnedIds } from "./diagnostic-ids";
import type { Diagnostic } from "./v5";
import type { RuleId } from "./rule-id";

/**
 * The fields a `Diagnostic` is built from, before its rule id and its ids are correlated.
 *
 * `Diagnostic` is discriminated by which rules own an `ids` payload, so a producer holding its rule
 * id as a `RuleId` variable cannot prove which variant it is building: the correlation is a fact
 * about the value, and a rule id known only by its type erases it. This is that intermediate shape,
 * and it is the input to the one expression allowed to close the gap.
 */
export interface DiagnosticFields {
  readonly ruleId: RuleId;
  readonly path: string;
  readonly message: string;
  readonly severity: Diagnostic["severity"];
  readonly ids?: readonly string[];
}

/**
 * States the correlation between a rule id and the ids it owns, and is the only expression that
 * does.
 *
 * Five producers build a diagnostic from a rule id they hold as data rather than as a literal, and
 * TypeScript cannot narrow a union by a discriminant it knows only the type of. Each of them would
 * otherwise carry an assertion of its own, which is five owners for one fact; they call this
 * instead. It asserts and copies nothing, so a frozen object stays the object its caller froze.
 *
 * What reaches it is checked, which is the half that used to be missing. Each of the five takes its
 * `ids` as `OwnedIds` of the rule id it was handed, so a caller naming a rule by a literal cannot
 * pass a payload the rule does not own nor omit one it always names. What is left for this assertion
 * is the case it was written for and nothing wider: a producer forwarding a rule id it knows only as
 * `RuleId`, which `contract/validate-v5.ts` does through `scopedRuleId` and `runtime/report.ts` does
 * through its private `frozenDiagnostic`.
 *
 * The assertion is safe by measurement rather than by construction, and `contract/diagnostic-ids.ts`
 * holds the measurement: every producer's call sites were read before the groups were written, and
 * the partition case in `rule-id.test.ts` refuses a rule the groups do not cover. A producer whose
 * rule id is already known to belong to one group needs none of this and is checked directly against
 * that variant, which is why `graph/order.ts` constructs its diagnostic from a literal and
 * `runtime/graph-publisher.ts` constructs one from an `IdentifiedRuleId` without reaching for this.
 * See ADR-097.
 */
export function asDiagnostic(fields: DiagnosticFields): Diagnostic {
  return fields as Diagnostic;
}

/**
 * The single constructor for a `Diagnostic`.
 *
 * `validate-v5.ts` owns the authored-schema rules, but rule ids are contractual (plan section 0.8)
 * and are also raised by injected adapters such as the trigger factory. Both build diagnostics
 * here so the frozen shape has exactly one owner.
 *
 * `ruleId` is `RuleId` rather than `string`, so the one constructor of a diagnostic cannot mint a
 * rule nothing enumerates, and an injected adapter reaching this with a rule of its own invention
 * fails `typecheck` at its own call site. `contract/rule-id.ts` owns the enumeration. See ADR-097.
 *
 * `ids` is the argument list the rule owns rather than an ordinary parameter, so the two fields the
 * union correlates are correlated at the call site too. An adapter naming `trigger-driver-unavailable`
 * cannot omit its payload and one naming `id-shape` cannot invent one. `contract/diagnostic-ids.ts`
 * owns the derivation.
 */
export function diagnostic<Rule extends RuleId>(
  ruleId: Rule,
  path: string,
  message: string,
  severity: Diagnostic["severity"] = "error",
  ...carried: OwnedIds<Rule>
): Diagnostic {
  // Widened before it is read, for the reason `baseRulesOwning` in `./diagnostic-ids` widens its own
  // filter: the list is still a parameter here, so no element of it is indexable until `Rule` is
  // instantiated. The default keeps every existing call byte-identical, including the ones that pass
  // nothing at all.
  const [ids = []] = carried as unknown as readonly [(readonly string[])?];
  return asDiagnostic(
    Object.freeze({
      ruleId,
      path,
      message,
      severity,
      ...(ids.length ? { ids: Object.freeze([...ids]) } : {}),
    }),
  );
}

/**
 * The single renderer for diagnostics inside a thrown message.
 *
 * Never hand-write `${ruleId} at ${path}: ${message}` anywhere else. Editors consume rule ids, so
 * their rendering must not drift between the validator, the Engine, and injected adapters.
 */
export function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}
