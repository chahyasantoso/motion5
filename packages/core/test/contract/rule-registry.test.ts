import { describe, expect, it } from "vitest";
import { diagnostic } from "../../src/contract/diagnostics";
import type { ProjectDefinition } from "../../src/contract/v5";
import { buildGraphIR } from "../../src/graph/ir";

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
