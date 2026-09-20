import { ruleSeverity, type OwnedIds } from "./rule";
import type { Diagnostic, DiagnosticOf } from "./v5";
import type { RuleId } from "./rule-id";

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
 * `ids` is the argument list the rule owns rather than an ordinary parameter, so the two fields are
 * correlated at the call site. An adapter naming `trigger-driver-unavailable` cannot omit its payload
 * and one naming `id-shape` cannot invent one. `contract/rule.ts` owns the derivation, and owns it
 * alone: `contract/diagnostic-ids.ts` held a second answer for four rules and is deleted.
 *
 * The return type is `DiagnosticOf<Rule>` rather than `Diagnostic`, and that is what retired
 * `asDiagnostic` and `DiagnosticFields` with it. Both existed to get a producer back out of a union
 * it could not narrow into, and each cost an assertion or a second interface to build against. With
 * `Diagnostic` flat and `ids` required, the object built below is assignable to the pinned shape on
 * its own, so there is nothing left to assert and nothing left for a caller to build against. Every
 * producer in the tree forwards here now, so no module hand-builds a frozen diagnostic and no
 * expression casts one.
 *
 * `severity` is not a parameter. It is read from the rule through `ruleSeverity`, so there is no
 * argument position in which a call site could name one, and no default for a caller to override by
 * passing nothing. The parameter's default used to be the literal `"error"`, which made a rule's own
 * answer a suggestion: every warning rule reported by a caller that passed nothing produced an error
 * diagnostic, and nothing noticed, because passing nothing is what almost every caller does. Deriving
 * the default fixed the silent half and left the loud half, so the parameter is deleted rather than
 * documented.
 *
 * Nineteen naming sites are converted with it, and every one of them named the severity its own rule
 * already fixes, so no diagnostic moves. Nineteen is what was converted rather than a proof that
 * nothing else named one: `typecheck` on the published commit is what closes that difference, and it
 * enumerates better than an inventory does.
 *
 * Deleting it also retires an argument-order trap. `graph/ir.ts`'s `diag` took its payload fourth
 * while this took `severity` fourth, so aliasing one to the other handed an array to a severity, and
 * a session published exactly that confusion. Both take the same arguments in the same order now, so
 * the mistake has no position left to happen in.
 *
 * Zero raw object literals remain. The last four were `cycleDiagnostic` in `graph/order.ts`,
 * `pendingReferenceDiagnostic` in `graph/references.ts`, and the node-failure and `blocked-upstream`
 * literals in `runtime/graph-publisher.ts`; each reached no constructor and each spelled a severity
 * of its own, and all four forward here now. So the paragraph above is true rather than four
 * literals short, which is what it was when it was written: no module hand-builds a frozen
 * diagnostic, no expression casts one, and no expression outside `contract/rule.ts` names a severity
 * at all. Every one of the four named the severity its own rule already fixes, so no diagnostic
 * moved. See ADR-097.
 */
export function diagnostic<Rule extends RuleId>(
  ruleId: Rule,
  path: string,
  message: string,
  ...carried: OwnedIds<Rule>
): DiagnosticOf<Rule> {
  // Widened before it is read, for the reason `CONTRIBUTION_RULES` in `./rule` widens its own derived
  // record: the list is still a parameter here, so no element of it is indexable until `Rule` is
  // instantiated.
  // Always an array, never an omission. `Diagnostic.ids` is required, so a rule that names no ids
  // carries a frozen empty one and the conditional spread that used to choose between a payload and
  // no member at all has nothing left to choose.
  const [carriedIds] = carried as unknown as readonly [(readonly string[])?];
  return Object.freeze({
    ruleId,
    path,
    message,
    severity: ruleSeverity(ruleId),
    ids: Object.freeze([...(carriedIds ?? [])]),
  });
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
