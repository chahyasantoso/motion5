import { describe, expect, it } from "vitest";
import type { Diagnostic, ReadyPatch } from "../../../src/contract/v5";
import { compareEdges, type GraphEdge } from "../../../src/graph/ir";
import {
  ABSENT,
  NOT_AFFECTED,
  PublishFailureError,
  blockedOutcome,
  blocksDownstream,
  composedOutcome,
  describePublishFailure,
  expectInputRecord,
  expectOutputRecord,
  expectRecord,
  failPublication,
  failedOutcome,
  firstBlockingSource,
  hasValue,
  outcomeOf,
  pendingOutcome,
  publishFailureRule,
  sourceValues,
  type NodeOutcome,
} from "../../../src/runtime/publisher-outcome";
import { closeUpstream, reachable } from "../../../src/runtime/publisher-reach";

/**
 * Issue #443, phase B step 9: one outcome per node, one resolution per source, one named failure.
 *
 * `GraphPublisher.flush` answered "what happened to node X" from three Sets and a Map, in an order
 * spelled as a disjunction at the top of a 200-line loop, and it answered "what does source Y
 * contribute" as `unknown` guarded by four copies of one type test that each threw a different error.
 *
 * Every claim here is an equivalence claim, deliberately: no message, rule id, patch field or
 * precedence moves, and the publisher's own suites are what prove that end to end. What this file adds
 * is the closedness those suites cannot see, because a fifth collection and a fourth term in a
 * disjunction are exactly as green as a fifth variant and a missing switch arm are red.
 */
const ARM = "hero/arm";
const HAND = "hero/hand";
const LEG = "hero/leg";

function diagnostic(path: string): Diagnostic {
  const entry: Diagnostic = Object.freeze({
    ruleId: "blocked-upstream",
    path,
    message: `about ${path}`,
    severity: "error",
    ids: Object.freeze([path]),
  });
  return entry;
}

function patchFor(values: unknown): ReadyPatch {
  const patch = {
    nodeId: ARM,
    revision: 1,
    values,
    sourceProgress: 0,
    sourceRevisions: {},
    status: "ready",
    diagnostics: [],
  };
  // Cast at one place, because the point of the `not-a-record` variant is a value the type says
  // cannot arrive and a host can still publish.
  // `sourceValues` takes the ready member now, so the fixture answers it rather than the union.
  return Object.freeze(patch) as unknown as ReadyPatch;
}

function composition(values: Readonly<Record<string, unknown>>) {
  return { values, sourceProgress: 0, sourceRevisions: {} };
}

function edge(sourceId: string, observerId: string): GraphEdge {
  return Object.freeze({
    sourceId,
    observerId,
    role: "input",
    label: sourceId,
  }) as unknown as GraphEdge;
}

function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("one flush answers one outcome per node", () => {
  it("answers not-affected for a node it holds nothing for, and stops the right readers", () => {
    const outcomes = new Map<string, NodeOutcome>([
      [ARM, composedOutcome(composition({ x: 1 }))],
      [HAND, failedOutcome(diagnostic(HAND))],
      [LEG, pendingOutcome(diagnostic(LEG))],
    ]);

    expect(outcomeOf(outcomes, "hero/absent")).toBe(NOT_AFFECTED);
    expect(blocksDownstream(NOT_AFFECTED)).toBe(false);
    expect(blocksDownstream(outcomeOf(outcomes, ARM))).toBe(false);
    // The three that stop a reader are the three the retired disjunction asked about, in the order
    // it asked them, and the precedence is now the same answer for all three.
    expect(blocksDownstream(outcomeOf(outcomes, HAND))).toBe(true);
    expect(blocksDownstream(outcomeOf(outcomes, LEG))).toBe(true);
    expect(blocksDownstream(blockedOutcome(HAND))).toBe(true);

    // Canonical edge order decides which blocking source a diagnostic names, never authored order.
    const edges = [edge(LEG, ARM), edge(HAND, ARM)];
    expect(firstBlockingSource(edges, compareEdges, (id) => outcomeOf(outcomes, id))).toBe(
      [...edges].sort(compareEdges)[0]?.sourceId,
    );
    expect(
      firstBlockingSource([edge(ARM, HAND)], compareEdges, (id) => outcomeOf(outcomes, id)),
    ).toBeUndefined();
  });

  it("resolves a source once, composition first and retained patch second", () => {
    const composed = composedOutcome(composition({ x: 1 }));
    // The precedence three call sites used to spell separately: a solver reading the patch where the
    // input phase read the composition would solve against last tick's goal in silence.
    expect(sourceValues(composed, patchFor({ x: 0 }))).toEqual({
      kind: "record",
      values: { x: 1 },
    });
    expect(sourceValues(NOT_AFFECTED, patchFor({ x: 0 }))).toEqual({
      kind: "record",
      values: { x: 0 },
    });
    expect(sourceValues(NOT_AFFECTED, undefined)).toBe(ABSENT);
    expect(sourceValues(failedOutcome(diagnostic(ARM)), patchFor({ x: 2 }))).toEqual({
      kind: "record",
      values: { x: 2 },
    });
    expect(sourceValues(NOT_AFFECTED, patchFor(5))).toEqual({ kind: "not-a-record", value: 5 });

    // Published is published, whatever the shape: only absence is pending, which is what the
    // retired conjunction over a memo and the registry said.
    expect(hasValue(sourceValues(NOT_AFFECTED, patchFor(5)))).toBe(true);
    expect(hasValue(sourceValues(composed, undefined))).toBe(true);
    expect(hasValue(ABSENT)).toBe(false);
  });

  it("names every failure it raises, byte for byte, under the rule id it published before", () => {
    const messages = new Map<string, string>();
    const rules = new Map<string, string>();
    for (const shape of [
      { kind: "missing-upstream", role: "input", sourceId: ARM },
      { kind: "missing-upstream", role: "output", sourceId: ARM },
      { kind: "input-shape", sourceId: ARM },
      { kind: "output-shape", sourceId: ARM },
      { kind: "solver-scope", nodeId: ARM },
      { kind: "member-interpolation", memberId: HAND },
      { kind: "goal-shape", nodeId: ARM, memberId: HAND, goalId: LEG },
    ] as const) {
      const failure = thrownBy(() => failPublication(shape));
      expect(failure).toBeInstanceOf(PublishFailureError);
      const error = failure as PublishFailureError;
      messages.set(
        `${shape.kind}:${String((shape as { role?: string }).role ?? "")}`,
        error.message,
      );
      rules.set(`${shape.kind}:${String((shape as { role?: string }).role ?? "")}`, error.name);
      expect(describePublishFailure(error.failure)).toBe(error.message);
      expect(publishFailureRule(error.failure)).toBe(error.name);
      expect(Object.isFrozen(error.failure)).toBe(true);
    }

    expect(messages.get("missing-upstream:input")).toBe(
      'Input observation source "hero/arm" has no published value.',
    );
    expect(messages.get("missing-upstream:output")).toBe(
      'Output observation source "hero/arm" has no published value.',
    );
    expect(messages.get("input-shape:")).toBe(
      'Input observation source "hero/arm" must be a record.',
    );
    expect(messages.get("output-shape:")).toBe(
      'Output observation source "hero/arm" must publish a renderer-neutral record.',
    );
    expect(messages.get("solver-scope:")).toBe(
      'Solver "hero/arm" has no root requirement to scope its members.',
    );
    expect(messages.get("member-interpolation:")).toBe(
      'Solver member "hero/hand" exposes no interpolated function.',
    );
    expect(messages.get("goal-shape:")).toBe(
      'Solver "hero/arm" member "hero/hand" goal "hero/leg" published no record.',
    );

    expect(rules.get("missing-upstream:input")).toBe("observation-missing-upstream");
    expect(rules.get("input-shape:")).toBe("observation-input-shape");
    expect(rules.get("output-shape:")).toBe("observation-output-shape");
    // The three that had no name of their own keep the one they published under, so this slice
    // changes no diagnostic a consumer can branch on.
    expect(rules.get("solver-scope:")).toBe("composition-failure");
    expect(rules.get("member-interpolation:")).toBe("composition-failure");
    expect(rules.get("goal-shape:")).toBe("composition-failure");
  });

  it("asks each reader for the failure its own call site owes", () => {
    expect(expectInputRecord(sourceValues(NOT_AFFECTED, patchFor({ x: 1 })), ARM)).toEqual({
      x: 1,
    });
    expect((thrownBy(() => expectInputRecord(ABSENT, ARM)) as Error).message).toBe(
      'Input observation source "hero/arm" has no published value.',
    );
    expect(
      (thrownBy(() => expectInputRecord(sourceValues(NOT_AFFECTED, patchFor(5)), ARM)) as Error)
        .message,
    ).toBe('Input observation source "hero/arm" must be a record.');
    expect((thrownBy(() => expectOutputRecord(ABSENT, ARM)) as Error).message).toBe(
      'Output observation source "hero/arm" has no published value.',
    );
    expect(
      (thrownBy(() => expectOutputRecord(sourceValues(NOT_AFFECTED, patchFor(5)), ARM)) as Error)
        .message,
    ).toBe('Output observation source "hero/arm" must publish a renderer-neutral record.');
    // The goal answers one message either way, because a plugin holding no graph cannot act on the
    // difference between an absent source and one that published something else.
    const goal = { kind: "goal-shape", nodeId: ARM, memberId: HAND, goalId: LEG } as const;
    expect((thrownBy(() => expectRecord(ABSENT, goal)) as Error).message).toBe(
      'Solver "hero/arm" member "hero/hand" goal "hero/leg" published no record.',
    );
    expect(
      (thrownBy(() => expectRecord(sourceValues(NOT_AFFECTED, patchFor(5)), goal)) as Error)
        .message,
    ).toBe('Solver "hero/arm" member "hero/hand" goal "hero/leg" published no record.');
  });

  it("walks the seeds it was given and the sources those still need", () => {
    const dependants = { [ARM]: [HAND], [HAND]: [LEG] };
    expect([...reachable(dependants, [ARM])]).toEqual([ARM, HAND, LEG]);
    // A node nothing reads answers an empty list rather than a missing key.
    expect([...reachable(dependants, [LEG])]).toEqual([LEG]);
    expect([...reachable(dependants, [])]).toEqual([]);

    const nodeById = {
      [LEG]: { edges: [edge(HAND, LEG)] },
      [HAND]: { edges: [edge(ARM, HAND)] },
      [ARM]: { edges: [] },
    };
    // An unpublished member is composed in this flush rather than reported pending by its reader,
    // and the walk is transitive, so a whole chain publishes once.
    expect([
      ...closeUpstream(
        new Set([LEG]),
        nodeById,
        () => false,
        () => true,
      ),
    ]).toEqual([LEG, HAND, ARM]);
    // A source that already published is not widened onto, and neither is a non-member.
    expect([
      ...closeUpstream(
        new Set([LEG]),
        nodeById,
        (id) => id === HAND,
        () => true,
      ),
    ]).toEqual([LEG]);
    expect([
      ...closeUpstream(
        new Set([LEG]),
        nodeById,
        () => false,
        () => false,
      ),
    ]).toEqual([LEG]);
  });
});
