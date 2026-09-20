import { describe, expect, it } from "vitest";
import { diagnostic } from "../../../src/contract/diagnostics";
import { PatchRegistry, type Patch, type PublishInput } from "../../../src/runtime/patch-registry";

/**
 * A patch carries only the payload its status owns, which is what issue #450 asks for and what the
 * carry-forward in `PatchRegistry.publish` contradicts today.
 *
 * Every case below asks whether a member is present rather than what it holds, because that is the
 * one shape which typechecks on both sides of the deletion: `"values" in patch` compiles against
 * the flat interface and against the union replacing it, so these cases fail on an assertion rather
 * than on a compile. `docs/GUARDRAILS.md` names that shape and `RA-16` is its precedent, and it is
 * the reason this file declares no seam and casts nothing.
 *
 * The accepting direction is asserted in the same rig, because a registry publishing nothing at all
 * would be green against the refusals alone. So the ready case pins every member a ready patch does
 * own, and it is green on both sides on purpose.
 *
 * Issue #450's own acceptance criterion says this is no semantic change with every existing test
 * staying green, and it is wrong. These cases are where that is measured: a blocked publication
 * republishes the last good pose today, so deleting the field is a behaviour change rather than a
 * type refinement. The pose is not lost, it moved to `PatchRegistry.lastReady` in slice 1, and
 * `patch-last-ready.test.ts` owns it. See ADR-098.
 */
const NODE = "hero/arm";

const BLOCKED = [
  diagnostic("blocked-upstream", "hero/arm", "Upstream is blocked.", ["hero/shoulder"]),
];

const FAILED = [diagnostic("composition-failure", "hero/arm", "Composition failed.", ["hero/arm"])];

function open(): PatchRegistry {
  return new PatchRegistry();
}

function publish(registry: PatchRegistry, tick: number, input: PublishInput): Patch | undefined {
  registry.beginBatch(tick, [input.nodeId]);
  const patch = registry.publish(input);
  registry.closeBatch();
  return patch;
}

/**
 * The patch a case is about, or a failure naming the reason there is none.
 *
 * A suppressed publication answers `undefined`, and so does a listener that was never called, so a
 * case reading a member off `Patch | undefined` would pass its own precondition into the assertion
 * it is trying to make. This separates the two.
 */
function required(patch: Patch | undefined): Patch {
  if (patch === undefined) throw new Error("The registry refused a publication these cases need.");
  return patch;
}

describe("a patch carries only the payload its status owns", () => {
  it("gives a blocked patch no payload, rather than the last good pose", () => {
    const registry = open();
    publish(registry, 1, { nodeId: NODE, values: { x: 1 }, sourceProgress: 0.5, status: "ready" });
    const blocked = required(
      publish(registry, 2, {
        nodeId: NODE,
        sourceProgress: 0,
        status: "blocked",
        diagnostics: BLOCKED,
      }),
    );

    expect(blocked.status).toBe("blocked");
    expect("values" in blocked).toBe(false);
    expect("sourceProgress" in blocked).toBe(false);
    expect("sourceRevisions" in blocked).toBe(false);
    // What a blocked patch does own, asserted here so the case above cannot be satisfied by a
    // publication that dropped everything.
    expect("diagnostics" in blocked).toBe(true);
    expect(blocked.diagnostics).toHaveLength(1);
    expect(blocked.nodeId).toBe(NODE);
    expect(blocked.revision).toBe(2);
  });

  it("gives an errored patch no payload either", () => {
    const registry = open();
    publish(registry, 1, { nodeId: NODE, values: { x: 1 }, sourceProgress: 0.5, status: "ready" });
    const errored = required(
      publish(registry, 2, {
        nodeId: NODE,
        sourceProgress: 0,
        status: "error",
        diagnostics: FAILED,
      }),
    );

    expect(errored.status).toBe("error");
    // Written rather than inherited: neither non-ready status reaches this answer through the
    // other, which is the shape slice 1's retention cases already ship.
    expect("values" in errored).toBe(false);
    expect("sourceProgress" in errored).toBe(false);
    expect("sourceRevisions" in errored).toBe(false);
    expect(errored.diagnostics).toHaveLength(1);
  });

  it("gives a never-ready blocked patch no payload, so absence is not a pose", () => {
    const registry = open();
    const blocked = required(
      publish(registry, 1, {
        nodeId: NODE,
        sourceProgress: 0,
        status: "blocked",
        diagnostics: BLOCKED,
      }),
    );

    expect(blocked.status).toBe("blocked");
    // An empty record is a payload a reader would spend a narrowing on, so this case is about the
    // member rather than about what the carry-forward happened to find.
    expect("values" in blocked).toBe(false);
    expect("sourceProgress" in blocked).toBe(false);
    expect("sourceRevisions" in blocked).toBe(false);
  });

  it("gives a destroyed patch nothing beyond its identity and its status", () => {
    const registry = open();
    publish(registry, 1, { nodeId: NODE, values: { x: 1 }, sourceProgress: 0.5, status: "ready" });
    const seen: Patch[] = [];
    registry.subscribeNode(NODE, (patch) => seen.push(patch));

    registry.evict(NODE);

    const terminal = required(seen.at(-1));
    expect(terminal.status).toBe("destroyed");
    expect("values" in terminal).toBe(false);
    expect("sourceProgress" in terminal).toBe(false);
    expect("sourceRevisions" in terminal).toBe(false);
    // The four dead fields `#notifyTerminal` writes today, and the fourth is the one a blocked or
    // errored patch keeps: a node that will never publish again reports nothing to refuse under.
    expect("diagnostics" in terminal).toBe(false);
    expect(terminal.nodeId).toBe(NODE);
    expect(terminal.revision).toBe(2);
  });

  it("leaves every member a ready patch owns in place", () => {
    const registry = open();
    const ready = required(
      publish(registry, 1, {
        nodeId: NODE,
        values: { x: 1 },
        sourceProgress: 0.5,
        sourceRevisions: { "hero/shoulder": 3 },
        status: "ready",
      }),
    );

    expect(ready.status).toBe("ready");
    expect("values" in ready).toBe(true);
    expect("sourceProgress" in ready).toBe(true);
    expect("sourceRevisions" in ready).toBe(true);
    expect("diagnostics" in ready).toBe(true);
    expect(ready.values).toEqual({ x: 1 });
    expect(ready.sourceProgress).toBe(0.5);
    expect(ready.sourceRevisions).toEqual({ "hero/shoulder": 3 });
  });
});
