import { describe, expect, it } from "vitest";
import { diagnostic } from "../../src/contract/diagnostics";
import { RULES, type OwnedIds } from "../../src/contract/rule";
import type { RuleId } from "../../src/contract/rule-id";
import type { ProjectDefinition } from "../../src/contract/v5";
import { buildGraphIR, diag } from "../../src/graph/ir";
import { batchFor } from "../../src/runtime/report";

/**
 * Issue #449: a rule's severity and whether it names ids are facts the rule owns, fixed once where
 * the rule is defined rather than restated by whoever reports it.
 *
 * Three claims, each red before the registry lands and none of them a `typecheck` failure, because
 * `docs/GUARDRAILS.md` says a failed compile is not assertion-level failing-first evidence. Every
 * case here compiles against the shape it is replacing and fails on an assertion.
 *
 * The first two are about the constructor. `severity` arrives as a caller-supplied argument with a
 * default today, so a warning rule reported by a caller that passes nothing is an error diagnostic,
 * and nothing notices; and an idless rule produces an object with no `ids` member at all, so a
 * reader spelling `ids` and a reader spelling `ids ?? []` are two readers of one field.
 *
 * The third is the one rule whose two construction sites genuinely disagreed. `observation-source`
 * reported both the refusal of a source that is absent, empty or not a string, which has no authored
 * value to name, and the refusal of a present source that fails qualification, which names it. Two
 * refusals under one id is what made the old record answer `"sometimes"`, and a registry with two
 * answers has no slot for it. The split resolves it rather than typing around it, and the accepting
 * direction is asserted in the same case: the qualification refusal keeps the id and keeps its
 * payload, so this is green on both sides on purpose and is reported as such rather than counted.
 */

const observing = (source: string): ProjectDefinition => ({
  schemaVersion: 5,
  motions: [
    {
      id: "walker",
      trigger: { type: "manual" },
      tracks: [{ id: "arm", observes: [{ source }] }],
    },
  ],
});

/** Every rule the graph builder refuses one authored `observes` source under. */
function refusalsFor(source: string): readonly { readonly rule: string; readonly ids: unknown }[] {
  return buildGraphIR(observing(source)).diagnostics.map((entry) => ({
    rule: entry.ruleId as string,
    ids: entry.ids,
  }));
}

describe("a rule owns its severity", () => {
  it("reads the severity of a warning rule from the rule rather than from the caller", () => {
    const built = diagnostic("stop-missing-start", "motions[0].tracks[0].keyframes.x", "no p=0");

    expect(built.ruleId).toBe("stop-missing-start");
    expect(built.severity).toBe("warning");
  });

  it("reads the severity of an error rule from the same place", () => {
    const built = diagnostic("id-shape", "$.motions[0].id", "bad id");

    expect(built.severity).toBe("error");
  });
});

describe("a rule owns whether it names ids", () => {
  it("carries an empty payload for a rule that names none, rather than no member at all", () => {
    const built = diagnostic("id-shape", "$.motions[0].id", "bad id");

    expect(built.ids).toEqual([]);
    expect(Object.isFrozen(built.ids)).toBe(true);
  });
});

describe("an observation source is refused by two rules, because it is two refusals", () => {
  it("names the shape refusal separately, since an absent source has no id to carry", () => {
    const refused = refusalsFor("");

    expect(refused.length).toBeGreaterThan(0);
    expect(refused.map(({ rule }) => rule)).toContain("observation-source-shape");
    expect(refused.find(({ rule }) => rule === "observation-source-shape")?.ids).toEqual([]);
  });

  it("keeps the qualification refusal naming the source the author wrote", () => {
    const refused = refusalsFor("a/b/c");

    expect(refused.map(({ rule }) => rule)).toContain("observation-source");
    expect(refused.find(({ rule }) => rule === "observation-source")?.ids).toEqual(["a/b/c"]);
  });
});

/**
 * The invariant swept over the whole enumeration rather than sampled, which is affordable only now.
 *
 * Every construction path in the tree forwards to the one constructor as of the request that
 * collapsed the last four raw object literals, so `ids` being present and frozen is one claim about
 * one expression instead of a claim repeated per producer. It is asserted per rule anyway, because
 * the severity half is read from the record, and a rule whose answer drifted is named here rather
 * than found by whichever consumer notices first.
 *
 * `diagnostic` is reached with `ruleId` typed as the open `RuleId`, so `OwnedIds` resolves to its
 * optional case and one loop carries both ownership answers without a cast at the call. What that
 * does not prove is the refusal, which is why the negative cases live in
 * `ids-ownership-at-the-producer.test.ts` and are asked of the compiler instead. See ADR-097.
 */
describe("every rule reaches a diagnostic whose payload is present and frozen", () => {
  it("carries a frozen payload and the rule's own severity, for every rule", () => {
    // `Object.keys` answers `string[]`, and the assertion is confined to this one expression on the
    // precedent `CONTRIBUTION_RULES` sets in contract/rule.ts. `RULES` is annotated
    // `Record<RuleId, RuleFacts>`, so a key of it that is not a `RuleId` is not representable.
    const everyRule = Object.keys(RULES) as readonly RuleId[];

    expect(everyRule.length).toBeGreaterThan(100);

    for (const ruleId of everyRule) {
      const payload: readonly string[] = RULES[ruleId].ids === "always" ? ["arm"] : [];
      const built = diagnostic(ruleId, "$", "x", payload);

      expect(Array.isArray(built.ids)).toBe(true);
      expect(Object.isFrozen(built.ids)).toBe(true);
      expect(Object.isFrozen(built)).toBe(true);
      expect(built.severity).toBe(RULES[ruleId].severity);
    }
  });

  it("answers the same at every other producer a test can reach", () => {
    const staged = batchFor(1, { kind: "deferred-in-batch", seeds: ["arm"] });
    const flushed = batchFor(2, { kind: "deferred-in-flush", seeds: ["arm"], scheduled: true });
    const built = [
      diag("id-shape", "$", "no ids"),
      diag("observation-source", "$", "named", ["arm"]),
      ...staged.diagnostics,
      ...flushed.diagnostics,
      ...buildGraphIR(observing("")).diagnostics,
    ];

    // The scan asserts it found its own subjects before it asserts anything about them.
    expect(built.length).toBeGreaterThan(4);
    for (const entry of built) {
      expect(Array.isArray(entry.ids)).toBe(true);
      expect(Object.isFrozen(entry.ids)).toBe(true);
      expect(Object.isFrozen(entry)).toBe(true);
    }
  });

  it("agrees with the one constructor about which argument is which", () => {
    const built = diag("observation-source", "$.motions[0].tracks[0]", "named", ["arm"]);

    expect(built).toMatchObject({
      ruleId: "observation-source",
      path: "$.motions[0].tracks[0]",
      message: "named",
      ids: ["arm"],
      severity: "error",
    });
  });

  it("names the seeds a deferral deferred, so an always-naming rule says something", () => {
    const staged = batchFor(7, { kind: "deferred-in-batch", seeds: ["arm", "hand"] });
    const flushed = batchFor(8, { kind: "deferred-in-flush", seeds: ["arm"], scheduled: true });

    expect(staged.diagnostics[0]?.ids).toEqual(["arm", "hand"]);
    expect(staged.diagnostics[0]?.severity).toBe("warning");
    expect(flushed.diagnostics[0]?.ids).toEqual(["arm"]);
    expect(flushed.diagnostics[0]?.severity).toBe("warning");
  });
});

/**
 * Type identity, asserted rather than implied by a call's arity.
 *
 * The producer cases elsewhere prove that a payload is refused or required at a call site, which a
 * constructor with no payload parameter at all would also satisfy. The case below pins what
 * `OwnedIds` actually answers, in all three directions, so the ownership claim stops depending on
 * any call. An edit widening the derivation back to an optional list for every rule fails to
 * compile here rather than staying green against a tree whose call sites all pass an array.
 */
type Exact<Answer, Expected> = [Answer] extends [Expected]
  ? [Expected] extends [Answer]
    ? true
    : false
  : false;

describe("OwnedIds answers an exact argument list per ownership answer", () => {
  it("pins all three answers, so no call's arity is what the claim rests on", () => {
    const idless: Exact<OwnedIds<"id-shape">, []> = true;
    const named: Exact<OwnedIds<"track-duplicate-id">, [ids: readonly string[]]> = true;
    const open: Exact<OwnedIds<RuleId>, [ids?: readonly string[]]> = true;

    expect([idless, named, open]).toEqual([true, true, true]);
  });
});
