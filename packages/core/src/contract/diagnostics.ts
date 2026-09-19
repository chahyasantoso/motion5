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
 * The assertion is safe by measurement rather than by construction, and `contract/diagnostic-ids.ts`
 * holds the measurement: every producer's call sites were read before the groups were written, and
 * the partition case in `rule-id.test.ts` refuses a rule the groups do not cover. A diagnostic built
 * from a literal rule id needs none of this and is checked directly against its variant, which is
 * why `graph/order.ts` and `runtime/report.ts` construct theirs without reaching for it.
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
 */
export function diagnostic(
  ruleId: RuleId,
  path: string,
  message: string,
  severity: Diagnostic["severity"] = "error",
  ids: readonly string[] = [],
): Diagnostic {
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
