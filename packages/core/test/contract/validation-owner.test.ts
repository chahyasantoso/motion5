import { describe, expect, it } from "vitest";
import type { Diagnostic, ProjectDefinition } from "../../src/contract/v5";
import { validateV5 } from "../../src/contract/validate-v5";
import { buildGraphIR } from "../../src/graph/ir";

interface AuthoredObservation {
  source: string;
  role?: "input" | "output";
}
interface AuthoredTrack {
  id: string;
  keyframes?: Record<string, Array<{ p: number; v: unknown }>>;
  observes?: AuthoredObservation[];
}
interface AuthoredProject {
  schemaVersion: 5;
  motions: Array<{ id: string; trigger: { type: "manual" }; tracks: AuthoredTrack[] }>;
}

function motion(tracks: AuthoredTrack[], id = "hero"): AuthoredProject {
  return { schemaVersion: 5, motions: [{ id, trigger: { type: "manual" }, tracks }] };
}

/**
 * Diagnostics compared as data, normalized only for the optional `ids` field. Nothing here
 * hardcodes an expected rule id or message: the point of P1-12 is that one owner produces
 * these, so the assertion is that both spellings of the same authored mistake are identical.
 */
function errors(diagnostics: readonly Diagnostic[]) {
  return diagnostics
    .filter(({ severity }) => severity === "error")
    .map(({ ruleId, path, message, ids }) => ({ ruleId, path, message, ids: [...(ids ?? [])] }));
}

function graphErrors(project: AuthoredProject) {
  return errors(buildGraphIR(project as unknown as ProjectDefinition).diagnostics);
}

function validatorErrors(project: AuthoredProject) {
  return errors(validateV5(project).diagnostics);
}

describe("one observation-validation owner (P1-12)", () => {
  it("accepts a track observing a sibling named after its own motion", () => {
    // `hero/arm` observes `hero/hero`. That is a sibling, not a self-reference. The validator
    // compares against the motion id, so it rejects a project the graph owner accepts.
    const project = motion([{ id: "hero" }, { id: "arm", observes: [{ source: "hero" }] }]);

    expect(graphErrors(project)).toEqual([]);
    expect(validatorErrors(project)).toEqual([]);
    expect(validateV5(project).valid).toBe(true);
  });

  it("reports an actual self-reference identically from both owners", () => {
    const project = motion([{ id: "arm", observes: [{ source: "arm" }] }]);

    const fromGraph = graphErrors(project);
    expect(fromGraph.map(({ ruleId }) => ruleId)).toEqual(["observation-self-reference"]);
    // The validator misses this rule entirely and only trips its recursive cycle check, so it
    // names the same mistake `observation-cycle` at a different path.
    expect(validatorErrors(project)).toEqual(fromGraph);
  });

  it("reports a cycle identically from both owners", () => {
    const project = motion([
      { id: "a", observes: [{ source: "b" }] },
      { id: "b", observes: [{ source: "a" }] },
    ]);

    const fromGraph = graphErrors(project);
    expect(fromGraph.map(({ ruleId }) => ruleId)).toEqual(["graph-cycle"]);
    // One cycle algorithm, one rule id, one path, one message. The recursive DFS in the
    // validator is a second answer to a question the ordering pass already answers, and it
    // cannot name the participating nodes.
    expect(validatorErrors(project)).toEqual(fromGraph);
  });

  it("spells edge identity the same way in both owners", () => {
    const project = motion([
      { id: "b" },
      { id: "arm", observes: [{ source: "b" }, { source: "b" }] },
    ]);

    const fromGraph = graphErrors(project);
    expect(fromGraph.map(({ ruleId }) => ruleId)).toEqual(["observation-duplicate"]);
    expect(validatorErrors(project)).toEqual(fromGraph);
  });

  it("keeps two observers of one source out of each other's duplicate check", () => {
    const project = motion([
      { id: "b" },
      { id: "arm", observes: [{ source: "b" }] },
      { id: "leg", observes: [{ source: "b" }] },
    ]);

    expect(graphErrors(project)).toEqual([]);
    expect(validatorErrors(project)).toEqual([]);
  });

  it("mints a frozen snapshot instead of returning the caller's object", () => {
    const project = motion([
      {
        id: "arm",
        keyframes: {
          opacity: [
            { p: 0, v: 0 },
            { p: 1, v: 1 },
          ],
        },
      },
    ]);

    const accepted = validateV5(project).value;
    expect(accepted).toBeDefined();
    expect(accepted).not.toBe(project);
    expect(Object.isFrozen(accepted)).toBe(true);
    expect(Object.isFrozen(accepted?.motions[0]?.tracks[0])).toBe(true);

    const stop = project.motions[0]?.tracks[0]?.keyframes?.opacity[1];
    expect(stop).toBeDefined();
    stop!.v = 999;

    // An authored leaf is the stops array itself since ADR-050, so the clone is one level shallower
    // than it was and the assertion reads the stop straight off the property.
    const authored = accepted?.motions[0]?.tracks[0]?.keyframes as
      | Record<string, ReadonlyArray<{ p: number; v: unknown }>>
      | undefined;
    expect(authored?.opacity?.[1]?.v).toBe(1);
  });
});
