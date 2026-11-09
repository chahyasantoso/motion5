import type { TypeIssue } from "@motion5/core/plugin-api";
import { unreachable } from "@motion5/core/plugin-api";
import type { GoalsError } from "./domain";

export function goalsIssue(error: GoalsError): TypeIssue {
  switch (error.kind) {
    case "table-shape":
      return { path: [], message: error.message };
    case "row-shape":
      return { path: [String(error.index)], message: "A goal row needs an id and a cells object." };
    case "row-id":
      return { path: [String(error.index), "id"], message: "A goal row id must be non-empty." };
    case "row-id-duplicate":
      return { path: [], message: `Goal row id '${error.id}' is duplicated.` };
    case "member-shape":
      return { path: [], message: `Goal row '${error.id}' needs a non-empty memberId.` };
    case "member-duplicate":
      return { path: [], message: `Two goal rows target member '${error.memberId}'.` };
    default:
      return unreachable(error);
  }
}
