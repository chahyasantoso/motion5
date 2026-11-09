import { describe, expect, it } from "vitest";
import { parseGoals } from "../../../../src/models/goals/domain";

describe("goals domain", () => {
  it("records each member's table index", () => {
    const parsed = parseGoals([
      { id: "g1", cells: { memberId: "first", x: 1, y: 2 } },
      { id: "g2", cells: { memberId: "second", x: 3, y: 4 } },
    ]);
    if (!parsed.ok) throw new Error(JSON.stringify(parsed.errors));
    expect(parsed.value.indexByMember.get("first")).toBe(0);
    expect(parsed.value.indexByMember.get("second")).toBe(1);
  });
});
