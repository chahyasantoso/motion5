import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { diagnostic } from "../../src/contract/diagnostics";
import { diag } from "../../src/graph/ir";
import { reportDiagnostic } from "../../src/runtime/report";
import type { RetainTrace } from "../../src/runtime/report";
import { code } from "../helpers/source-region";

/**
 * Issue #449: ownership of `ids` is enforced at the producer rather than asserted past it.
 *
 * `asDiagnostic` takes a `RuleId` and an `ids` that are independent of each other, so a call naming a
 * rule that owns no ids and passing a payload compiled, and produced a diagnostic the union calls
 * unrepresentable. The assertion itself cannot be removed, because TypeScript does not narrow a union
 * by a discriminant it knows only the type of. What can be removed is every call site reaching it
 * while naming its rule by a literal, and the five producers do that by taking their ids as the
 * argument list `contract/diagnostic-ids.ts` derives from the rule they were handed.
 *
 * No type can observe itself and this suite cannot run `tsc`, so the claim is read off the
 * declarations as text. That is the shape `RA-78` established for a subject with no run-time form: a
 * declaration is code, reading it typechecks on both sides of the change, and the case fails on an
 * assertion rather than on a compile. It is spelled once per declaration rather than once across the
 * five, because a span has no bound that belongs to it and a rename in one file would otherwise be
 * reported as a claim about another.
 *
 * The accepting direction is asserted in the same file, because a producer that refused every payload
 * would be green against the refusal alone. Those last two cases are green on both sides of this
 * change on purpose: nothing a diagnostic carries at run time moved, and saying so is the report
 * `docs/GUARDRAILS.md` asks for rather than a red count engineered by asserting less.
 */

const source = (relative: string): string =>
  code(fileURLToPath(new URL(`../../src/${relative}`, import.meta.url)));

/** Each producer that reaches the one assertion, and the declaration its derived list sits in. */
const PRODUCERS: readonly (readonly [path: string, declaration: string])[] = [
  ["contract/diagnostics.ts", "export function diagnostic<Rule extends RuleId>("],
  ["graph/ir.ts", "export function diag<Rule extends RuleId>("],
  ["runtime/report.ts", "export function reportDiagnostic<Rule extends RuleId>("],
  ["domain/plugins.ts", "function diagnostic<Rule extends RuleId>("],
  ["domain/keyframe-compiler.ts", "function diagnostic<Rule extends RuleId>("],
];

describe("a producer takes the ids its rule owns", () => {
  for (const [path, declaration] of PRODUCERS) {
    it(`derives the ids argument list from the rule id it was handed in ${path}`, () => {
      const text = source(path);

      // The scan asserts it found its own subject before it asserts anything about it. A read that
      // matched nothing answers "absent" for every spelling, which is green for the wrong reason.
      expect(text.length).toBeGreaterThan(0);
      expect(text.split(declaration)).toHaveLength(2);
      expect(text.split("...carried: OwnedIds<Rule>")).toHaveLength(2);
    });
  }

  it("reads the partition proof rather than trusting it", () => {
    const text = source("contract/diagnostic-ids.ts");

    expect(text.split("export type OwnedIds<Rule extends RuleId>")).toHaveLength(2);
    // `EveryRuleIdIsGrouped` failed the build only at its own declaration, so it was deletable with
    // nothing going red. Reading it here is what makes the type's half of the partition proof
    // load-bearing, and a rule reaching no group now fails at every producer instead of silently
    // taking the optional list.
    expect(text.split("[EveryRuleIdIsGrouped] extends [never]")).toHaveLength(2);
  });

  it("still carries the payload of a rule that owns one", () => {
    const built = diagnostic("track-duplicate-id", "$.motions[0]", "duplicate", "error", ["hero"]);

    expect(built.ruleId).toBe("track-duplicate-id");
    expect(built.ids).toEqual(["hero"]);
    expect(Object.isFrozen(built.ids)).toBe(true);
  });

  it("still carries no payload for a rule that owns none", () => {
    const built = diagnostic("id-shape", "$.motions[0].id", "bad id");

    expect(built.ruleId).toBe("id-shape");
    expect("ids" in built).toBe(false);
  });
});

/**
 * The compile-time half, and the compiler is the assertion rather than a case.
 *
 * The cases above read the declarations as text, which proves the spelling and proves nothing about
 * what TypeScript does with it. An edit that kept both searched substrings while widening `OwnedIds`
 * back to an optional list for every rule would leave every one of them green, and because every call
 * site in the tree passes an array, `typecheck` would not notice either: a green case is evidence only
 * of what it would fail without, and those cases would not fail without the refusal. So the refusal is
 * asked of the compiler directly. Each `@ts-expect-error` fails `typecheck` when the line below it
 * stops being an error, which turns that mutant into a build failure instead of a green suite.
 *
 * Neither function is called. They are exported so that neither is an unused local, and their whole
 * content is the two directions this change is about. Both are stated, because a producer that refused
 * every payload would satisfy the refusing half on its own. Only the three exported producers are
 * reachable from a test; the two private ones in `domain/` carry the same declaration and are covered
 * by the text cases above.
 */
export function refusedByTheCompiler(retain: RetainTrace): void {
  // @ts-expect-error `id-shape` owns no ids, so a payload is unrepresentable.
  diagnostic("id-shape", "$", "x", "error", ["unexpected"]);
  // @ts-expect-error `track-duplicate-id` always names ids, so omitting them is unrepresentable.
  diagnostic("track-duplicate-id", "$", "x", "error");
  // @ts-expect-error `track-id` owns no ids, so a payload is unrepresentable.
  diag("track-id", "$", "x", ["unexpected"]);
  // @ts-expect-error `motion-duplicate` always names ids, so omitting them is unrepresentable.
  diag("motion-duplicate", "$", "x");
  // @ts-expect-error `id-shape` owns no ids, so a payload is unrepresentable.
  reportDiagnostic(undefined, retain, "id-shape", "x", 0, ["unexpected"]);
  // @ts-expect-error `flush-failure` always names ids, so omitting them is unrepresentable.
  reportDiagnostic(undefined, retain, "flush-failure", "x", 0);
}

/**
 * The accepting direction, in the same file, so the refusals above cannot be green against a
 * producer that refuses everything.
 */
export function acceptedByTheCompiler(retain: RetainTrace): void {
  diagnostic("id-shape", "$", "x", "error");
  diagnostic("track-duplicate-id", "$", "x", "error", ["hero"]);
  diag("track-id", "$", "x");
  diag("motion-duplicate", "$", "x", ["hero"]);
  reportDiagnostic(undefined, retain, "flush-failure", "x", 0, ["hero"]);
}
