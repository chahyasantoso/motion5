import { describe, expect, it } from "vitest";
import { bindGoals, parseGoals } from "../../../src/goals/domain";

const structure = () => {
  const parsed = parseGoals([{ id: "g", cells: { memberId: "leaf", x: 1, y: 2 } }]);
  if (!parsed.ok) throw new Error(JSON.stringify(parsed.errors));
  return parsed.value;
};

describe("goals domain", () => {
  it("binds exactly the committed row set", () => {
    const bound = bindGoals(structure(), [{ id: "g", cells: { memberId: "leaf", x: 3, y: 4 } }]);
    expect(bound.byMember.get("leaf")?.cells).toEqual({ memberId: "leaf", x: 3, y: 4 });
  });

  it("refuses an extra row", () => {
    expect(() =>
      bindGoals(structure(), [
        { id: "g", cells: { memberId: "leaf", x: 1, y: 2 } },
        { id: "extra", cells: { memberId: "other", x: 9, y: 9 } },
      ]),
    ).toThrow(/row set changed/);
  });

  it("refuses duplicate value row ids", () => {
    expect(() =>
      bindGoals(structure(), [
        { id: "g", cells: { memberId: "leaf", x: 1, y: 2 } },
        { id: "g", cells: { memberId: "leaf", x: 3, y: 4 } },
      ]),
    ).toThrow(/duplicated/);
  });
});
