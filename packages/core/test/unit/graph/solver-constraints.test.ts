import { describe, expect, it } from "vitest";
import { buildGraphIR } from "../../../src/graph/ir";
import type {
  AuthoredKeyframe,
  AuthoredPluginRequires,
  AuthoredProperty,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";

type Keyframes = Readonly<Record<string, AuthoredKeyframe>>;

function project(
  member: TrackDefinition,
  solver: TrackDefinition = {
    id: "solve",
    keyframes: { ik: { values: {}, requires: { root: "root", target: "goal" } } },
  },
): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "constraints",
    motions: [
      {
        id: "walker",
        trigger: { type: "time" },
        tracks: [{ id: "root" }, { id: "goal" }, solver, member],
      },
    ],
  };
}

function codes(
  memberValues: Readonly<Record<string, AuthoredProperty>>,
  requires: AuthoredPluginRequires = { base: "root", solver: "solve" },
) {
  const result = buildGraphIR(
    project({
      id: "bone",
      keyframes: {
        fk: { values: memberValues, requires },
      },
    }),
  );
  return result.diagnostics;
}

describe("solver constraint graph rules", () => {
  it("CL-4 refuses malformed, empty, and unbound limits", () => {
    expect(codes({ minRotation: [{ p: 0, v: 0 }] }).map((d) => d.ruleId)).toContain(
      "ik-limit-malformed",
    );
    expect(codes({ minRotation: 40, maxRotation: -40 }).map((d) => d.ruleId)).toContain(
      "ik-limit-empty",
    );
    expect(codes({ minRotation: 0 }, { base: "root" }).map((d) => d.ruleId)).toContain(
      "ik-limit-without-solver",
    );
  });

  it("CL-5 refuses malformed and conflicting solver bend values", () => {
    const malformed = buildGraphIR(
      project(
        {
          id: "bone",
          keyframes: {
            fk: { values: { length: 10 }, requires: { base: "root", solver: "solve" } },
          },
        },
        {
          id: "solve",
          keyframes: {
            ik: { values: { bend: "side" }, requires: { root: "root", target: "goal" } },
          },
        },
      ),
    );
    expect(malformed.diagnostics.map((d) => d.ruleId)).toContain("ik-bend-malformed");
    const conflict = buildGraphIR(
      project(
        {
          id: "bone",
          keyframes: {
            fk: { values: { length: 10 }, requires: { base: "root", solver: "solve" } },
          },
        },
        {
          id: "solve",
          keyframes: {
            ik: {
              values: { bend: "positive", flip: true },
              requires: { root: "root", target: "goal" },
            },
          },
        },
      ),
    );
    expect(conflict.diagnostics.map((d) => d.ruleId)).toContain("ik-bend-conflicts-flip");
  });

  it("CL-6 accepts a finite range and either bend spelling alone", () => {
    expect(codes({ minRotation: -30, maxRotation: 30 }).map((d) => d.ruleId)).not.toContain(
      "ik-limit-malformed",
    );
    const accepted = buildGraphIR(
      project(
        {
          id: "bone",
          keyframes: {
            fk: { values: { length: 10 }, requires: { base: "root", solver: "solve" } },
          },
        },
        {
          id: "solve",
          keyframes: {
            ik: { values: { bend: "negative" }, requires: { root: "root", target: "goal" } },
          },
        },
      ),
    );
    expect(accepted.diagnostics.map((d) => d.ruleId)).not.toContain("ik-bend-malformed");
  });
});

describe("individual solver constraint refusals", () => {
  it("CL-12 rejects a malformed limit with its path and ids", () => {
    const diagnostics = codes({ minRotation: [{ p: 0, v: 1 }] });
    const found = diagnostics.find((d) => d.ruleId === "ik-limit-malformed");
    expect(found?.path).toBe("walker/bone.keyframes.fk.values.minRotation");
    expect(found?.ids).toEqual(["walker/bone"]);
  });

  it("CL-13 rejects an empty range", () => {
    expect(codes({ minRotation: 30, maxRotation: -30 }).map((d) => d.ruleId)).toContain(
      "ik-limit-empty",
    );
  });

  it("CL-14 rejects a limit outside the solver-bound FK group", () => {
    expect(codes({ minRotation: 0 }, { base: "root" }).map((d) => d.ruleId)).toContain(
      "ik-limit-without-solver",
    );
  });

  it("CL-15 rejects malformed bend values", () => {
    const result = buildGraphIR(
      project(
        {
          id: "bone",
          keyframes: {
            fk: { values: { length: 10 }, requires: { base: "root", solver: "solve" } },
          },
        },
        {
          id: "solve",
          keyframes: {
            ik: { values: { bend: "side" }, requires: { root: "root", target: "goal" } },
          },
        },
      ),
    );
    expect(result.diagnostics.map((d) => d.ruleId)).toContain("ik-bend-malformed");
  });

  it("CL-16 rejects bend and flip together", () => {
    const result = buildGraphIR(
      project(
        {
          id: "bone",
          keyframes: {
            fk: { values: { length: 10 }, requires: { base: "root", solver: "solve" } },
          },
        },
        {
          id: "solve",
          keyframes: {
            ik: {
              values: { bend: "positive", flip: false },
              requires: { root: "root", target: "goal" },
            },
          },
        },
      ),
    );
    expect(result.diagnostics.map((d) => d.ruleId)).toContain("ik-bend-conflicts-flip");
  });

  it("CL-17 accepts omitted bounds and a valid bend alone", () => {
    const result = buildGraphIR(
      project(
        {
          id: "bone",
          keyframes: {
            fk: { values: { minRotation: -5 }, requires: { base: "root", solver: "solve" } },
          },
        },
        {
          id: "solve",
          keyframes: {
            ik: { values: { bend: "negative" }, requires: { root: "root", target: "goal" } },
          },
        },
      ),
    );
    expect(
      result.diagnostics.filter((d) => d.ruleId.startsWith("ik-")).map((d) => d.ruleId),
    ).toEqual([]);
  });

  it("CL-18 refuses a limit under a group that bound no solver, since the solve reads it anyway", () => {
    const result = buildGraphIR(
      project({
        id: "bone",
        keyframes: {
          spring: { values: { minRotation: 5 } },
          fk: { values: { length: 10 }, requires: { base: "root", solver: "solve" } },
        },
      }),
    );
    const found = result.diagnostics.find((d) => d.ruleId === "ik-limit-without-solver");
    expect(found?.path).toBe("walker/bone.keyframes.spring.values.minRotation");
  });
});

describe("solver constraint rules read every authored spelling", () => {
  function flat(keyframes: Keyframes, solver?: TrackDefinition) {
    return buildGraphIR(project({ id: "bone", keyframes }, solver)).diagnostics;
  }
  const bound = { fk: { values: { length: 10 }, requires: { base: "root", solver: "solve" } } };

  it("CL-24 refuses a keyframed flat bound as malformed, so no limit animates at runtime", () => {
    const found = flat({
      ...bound,
      minRotation: [
        { p: 0, v: 20 },
        { p: 1, v: 30 },
      ],
    }).find((d) => d.ruleId === "ik-limit-malformed");
    expect(found?.path).toBe("walker/bone.keyframes.minRotation");
  });

  it("CL-25 classifies flat and grouped bounds as one pair", () => {
    const ids = (keyframes: Keyframes) => flat(keyframes).map((d) => d.ruleId);
    expect(
      ids({ ...bound, maxRotation: -40, fk: { ...bound.fk, values: { minRotation: 40 } } }),
    ).toContain("ik-limit-empty");
    expect(ids({ ...bound, maxRotation: 30 }).filter((id) => id.startsWith("ik-"))).toEqual([]);
  });

  it("CL-26 refuses a flat limit on a node that bound no solver", () => {
    const found = flat({
      minRotation: 10,
      fk: { values: { length: 10 }, requires: { base: "root" } },
    }).find((d) => d.ruleId === "ik-limit-without-solver");
    expect(found?.path).toBe("walker/bone.keyframes.minRotation");
  });

  it("CL-27 refuses a malformed flat bend and a flat bend beside a grouped flip", () => {
    const solver = (keyframes: Keyframes): TrackDefinition => ({
      id: "solve",
      keyframes,
    });
    const requires = { root: "root", target: "goal" };
    const malformed = flat(bound, solver({ bend: "side", ik: { values: {}, requires } }));
    expect(malformed.find((d) => d.ruleId === "ik-bend-malformed")?.path).toBe(
      "walker/solve.keyframes.bend",
    );
    const conflict = flat(
      bound,
      solver({ bend: "positive", ik: { values: { flip: true }, requires } }),
    );
    expect(conflict.map((d) => d.ruleId)).toContain("ik-bend-conflicts-flip");
  });
});
